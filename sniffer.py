import os
import sys
import time
import queue
import threading

class PacketSniffer:
    def __init__(self, interface, packet_queue):
        self.interface = interface
        self.packet_queue = packet_queue
        self.running = False
        self.thread = None

    def start(self):
        self.running = True
        self.thread = threading.Thread(target=self._sniff_loop, daemon=True)
        self.thread.start()

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join(timeout=2.0)

    def _sniff_loop(self):
        """
        Attempts to sniff packets using multiple backends in order:
        1. PyShark (requires tshark/Npcap)
        2. Scapy Layer 3 (works without Npcap on Windows)
        3. Windows socket-based raw capture (pure Python fallback)
        """
        # Setup asyncio event loop for this background thread (required for PyShark)
        try:
            import asyncio
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        except Exception as e:
            print(f"[Sniffer] Warning: Failed to set asyncio event loop: {e}")

        # Try PyShark first
        try:
            import pyshark
            print(f"[Sniffer] Attempting PyShark on interface: {self.interface}")
            capture = pyshark.LiveCapture(interface=self.interface, bpf_filter='ip')
            
            for packet in capture.sniff_continuously():
                if not self.running:
                    break
                try:
                    protocol = packet.transport_layer if hasattr(packet, 'transport_layer') else 'OTHER'
                    src_ip = packet.ip.src
                    dst_ip = packet.ip.dst
                    pkt_len = int(packet.length)
                    timestamp = float(packet.sniff_timestamp)
                    
                    src_port = 0
                    dst_port = 0
                    if protocol == 'TCP' and hasattr(packet, 'tcp'):
                        src_port = int(packet.tcp.srcport)
                        dst_port = int(packet.tcp.dstport)
                    elif protocol == 'UDP' and hasattr(packet, 'udp'):
                        src_port = int(packet.udp.srcport)
                        dst_port = int(packet.udp.dstport)

                    self.packet_queue.put({
                        'timestamp': timestamp,
                        'src_ip': src_ip,
                        'dst_ip': dst_ip,
                        'src_port': src_port,
                        'dst_port': dst_port,
                        'proto': protocol,
                        'length': pkt_len
                    })
                except AttributeError:
                    continue
            return  # If PyShark works, don't try other backends

        except Exception as py_err:
            print(f"[Sniffer] PyShark unavailable: {py_err}")

        # Try Scapy with L3 socket (works without Npcap on Windows)
        try:
            print("[Sniffer] Falling back to Scapy L3 socket sniffer...")
            self._sniff_with_scapy_l3()
            return
        except Exception as scapy_err:
            print(f"[Sniffer] Scapy L3 failed: {scapy_err}")
        
        # Final fallback: raw Windows socket
        try:
            print("[Sniffer] Falling back to raw Windows socket sniffer...")
            self._sniff_with_raw_socket()
        except Exception as raw_err:
            print(f"[Sniffer Fatal] All sniffer backends failed: {raw_err}", file=sys.stderr)
            self.running = False

    def _sniff_with_scapy_l3(self):
        """Sniff using Scapy's L3 raw socket (no Npcap/WinPcap required)."""
        from scapy.all import conf, IP, TCP, UDP, sniff
        
        # Use conf.L3socket directly (which is L3WinSocket on Windows)
        L3socket = conf.L3socket
        print(f"[Sniffer] Scapy L3 sniffer active. Listening for IP traffic...")
        
        def prn(pkt):
            if not self.running:
                return
            if IP in pkt:
                proto_name = "OTHER"
                sport = 0
                dport = 0
                if TCP in pkt:
                    proto_name = "TCP"
                    sport = pkt[TCP].sport
                    dport = pkt[TCP].dport
                elif UDP in pkt:
                    proto_name = "UDP"
                    sport = pkt[UDP].sport
                    dport = pkt[UDP].dport

                self.packet_queue.put({
                    'timestamp': float(pkt.time),
                    'src_ip': pkt[IP].src,
                    'dst_ip': pkt[IP].dst,
                    'src_port': sport,
                    'dst_port': dport,
                    'proto': proto_name,
                    'length': len(pkt)
                })

        # We call sniff with L3socket to force Layer 3 raw sockets on Windows
        sniff(iface=self.interface, prn=prn, store=0, filter="ip", L3socket=L3socket)

    def _sniff_with_raw_socket(self):
        """Pure Python raw socket sniffer for Windows (no third-party drivers needed)."""
        import socket
        import struct
        
        # Get the hotspot IP (usually 192.168.137.1)
        host = socket.gethostbyname(socket.gethostname())
        # Try to find the 192.168.137.x address
        try:
            for info in socket.getaddrinfo(socket.gethostname(), None):
                ip = info[4][0]
                if ip.startswith("192.168.137"):
                    host = ip
                    break
        except Exception:
            pass
        
        print(f"[Sniffer] Raw socket bound to {host}")
        
        # Create raw socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_IP)
        sock.bind((host, 0))
        # Include IP headers
        sock.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)
        # Enable promiscuous mode
        try:
            sock.ioctl(socket.SIO_RCVALL, socket.RCVALL_ON)
        except Exception:
            pass
        
        sock.settimeout(1.0)
        
        try:
            while self.running:
                try:
                    raw_data, addr = sock.recvfrom(65535)
                except socket.timeout:
                    continue
                except Exception:
                    continue
                
                if len(raw_data) < 20:
                    continue
                
                # Parse IP header
                ip_header = raw_data[:20]
                iph = struct.unpack('!BBHHHBBH4s4s', ip_header)
                
                ihl = (iph[0] & 0xF) * 4  # IP header length
                total_length = iph[2]
                protocol = iph[6]
                src_ip = socket.inet_ntoa(iph[8])
                dst_ip = socket.inet_ntoa(iph[9])
                
                proto_name = "OTHER"
                sport = 0
                dport = 0
                
                if protocol == 6 and len(raw_data) >= ihl + 4:  # TCP
                    proto_name = "TCP"
                    sport = struct.unpack('!H', raw_data[ihl:ihl+2])[0]
                    dport = struct.unpack('!H', raw_data[ihl+2:ihl+4])[0]
                elif protocol == 17 and len(raw_data) >= ihl + 4:  # UDP
                    proto_name = "UDP"
                    sport = struct.unpack('!H', raw_data[ihl:ihl+2])[0]
                    dport = struct.unpack('!H', raw_data[ihl+2:ihl+4])[0]
                
                self.packet_queue.put({
                    'timestamp': time.time(),
                    'src_ip': src_ip,
                    'dst_ip': dst_ip,
                    'src_port': sport,
                    'dst_port': dport,
                    'proto': proto_name,
                    'length': total_length
                })
        finally:
            try:
                sock.ioctl(socket.SIO_RCVALL, socket.RCVALL_OFF)
            except Exception:
                pass
            sock.close()