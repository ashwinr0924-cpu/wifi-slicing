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
            self.thread.join(timeout=1.0)

    def _sniff_loop(self):
        # We try pyshark first as requested, and fallback to scapy if needed
        try:
            import pyshark
            print(f"[Sniffer] Attempting to start PyShark on interface: {self.interface}")
            capture = pyshark.LiveCapture(interface=self.interface, bpf_filter='ip')
            
            for packet in capture.sniff_continuously():
                if not self.running:
                    break
                try:
                    # Extract fields safely
                    protocol = packet.transport_layer if hasattr(packet, 'transport_layer') else 'OTHER'
                    src_ip = packet.ip.src
                    dst_ip = packet.ip.dst
                    pkt_len = int(packet.length)
                    timestamp = float(packet.sniff_timestamp)
                    
                    # Optional port extraction
                    src_port = 0
                    dst_port = 0
                    if protocol == 'TCP' and hasattr(packet, 'tcp'):
                        src_port = int(packet.tcp.srcport)
                        dst_port = int(packet.tcp.dstport)
                    elif protocol == 'UDP' and hasattr(packet, 'udp'):
                        src_port = int(packet.udp.srcport)
                        dst_port = int(packet.udp.dstport)

                    pkt_data = {
                        'timestamp': timestamp,
                        'src_ip': src_ip,
                        'dst_ip': dst_ip,
                        'src_port': src_port,
                        'dst_port': dst_port,
                        'proto': protocol,
                        'length': pkt_len
                    }
                    self.packet_queue.put(pkt_data)
                except AttributeError:
                    continue
                except Exception as e:
                    print(f"[Sniffer Error] {e}", file=sys.stderr)
                    continue

        except Exception as py_err:
            print(f"[Sniffer Warning] PyShark initialization failed: {py_err}")
            print("[Sniffer] Falling back to Scapy for raw packet sniffing...")
            self._sniff_with_scapy()

    def _sniff_with_scapy(self):
        try:
            from scapy.all import sniff, IP, TCP, UDP
            
            # Scapy packet callback
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
                        
                    pkt_data = {
                        'timestamp': float(pkt.time),
                        'src_ip': pkt[IP].src,
                        'dst_ip': pkt[IP].dst,
                        'src_port': sport,
                        'dst_port': dport,
                        'proto': proto_name,
                        'length': len(pkt)
                    }
                    self.packet_queue.put(pkt_data)

            # Map common interface names to Scapy compatible interface names if needed
            # For Windows, Scapy uses the interface description or GUID.
            # Passing self.interface directly is standard.
            sniff(iface=self.interface, prn=prn, store=0, filter="ip")
            
        except Exception as scapy_err:
            print(f"[Sniffer Fatal] Scapy sniffer failed: {scapy_err}", file=sys.stderr)
            print("[Sniffer] Sniffer thread is stopping.", file=sys.stderr)
            self.running = False
