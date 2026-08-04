import pydivert
import threading
import sys

class MSSClamper:
    def __init__(self, gaming_ip, clamp_value=1300):
        self.gaming_ip = gaming_ip
        self.clamp_value = clamp_value
        self.running = False
        self.thread = None

    def start(self):
        """
        Starts the MSS Clamping loop in a background thread.
        Requires Administrator privileges.
        """
        self.running = True
        self.thread = threading.Thread(target=self._clamp_loop, daemon=True)
        self.thread.start()
        print(f"[MSS Clamper] Started clamping TCP MSS to {self.clamp_value} bytes for {self.gaming_ip}")

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join(timeout=1.0)
            print("[MSS Clamper] Stopped MSS Clamping.")

    def _clamp_loop(self):
        # Filter: Intercept outbound TCP SYN packets targeting the gaming client
        # or inbound TCP SYN packets destined for the gaming client.
        # We capture SYN packets to modify the negotiated MSS during handshake.
        filter_rule = f"ip.DstAddr == {self.gaming_ip} and tcp.Syn"
        
        try:
            with pydivert.Divert(filter_rule) as diverter:
                for packet in diverter:
                    if not self.running:
                        break
                    
                    try:
                        # Parse options and look for MSS (option kind 2)
                        new_options = []
                        mss_found = False
                        
                        for opt in packet.tcp.options:
                            kind = getattr(opt, "kind", None)
                            name = getattr(opt, "name", None)
                            
                            if name == "MSS" or kind == 2:
                                # Modify value in place or create new
                                mss_found = True
                                try:
                                    # Write 1300 as integer value
                                    opt.value = self.clamp_value
                                    new_options.append(opt)
                                except Exception:
                                    # Fallback: filter it out if modification fails
                                    pass
                            else:
                                new_options.append(opt)
                        
                        # If no MSS option was present, we can append one
                        # but usually SYN packets always carry it.
                        packet.tcp.options = new_options
                        packet.recalculate_checksums()
                        diverter.send(packet)
                    except Exception as err:
                        # Fallback: always send the packet back to prevent dropping connection
                        try:
                            diverter.send(packet)
                        except Exception:
                            pass
                        continue
        except Exception as e:
            print(f"[MSS Clamper Error] WinDivert/PyDivert failed (Verify Administrator rights): {e}", file=sys.stderr)
            self.running = False

if __name__ == "__main__":
    # Test script standalone
    import time
    target_ip = "192.168.137.101"
    if len(sys.argv) > 1:
        target_ip = sys.argv[1]
    
    clamper = MSSClamper(target_ip)
    clamper.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        clamper.stop()
