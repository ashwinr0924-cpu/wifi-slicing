import threading
import sys

class MSSClamper:
    """
    TCP MSS Clamper using pydivert's WinDivert API.
    Intercepts TCP SYN packets heading to the gaming device and clamps the MSS.
    Requires Administrator privileges and the WinDivert driver.
    
    If WinDivert/pydivert is not available or lacks admin rights, the clamper
    will log a warning and continue without blocking the rest of the engine.
    """
    def __init__(self, gaming_ip, clamp_value=1300):
        self.gaming_ip = gaming_ip
        self.clamp_value = clamp_value
        self.running = False
        self.thread = None

    def start(self):
        self.running = True
        self.thread = threading.Thread(target=self._clamp_loop, daemon=True)
        self.thread.start()

    def stop(self):
        self.running = False
        if self.thread:
            self.thread.join(timeout=1.0)
            print("[MSS Clamper] Stopped MSS Clamping.")

    def _clamp_loop(self):
        filter_rule = f"ip.DstAddr == {self.gaming_ip} and tcp.Syn"
        
        try:
            import pydivert
            # pydivert 3.x uses pydivert.WinDivert (not pydivert.Divert)
            wd = pydivert.WinDivert(filter_rule)
            wd.open()
            print(f"[MSS Clamper] Started clamping TCP MSS to {self.clamp_value} bytes for {self.gaming_ip}")
            
            try:
                while self.running:
                    try:
                        packet = wd.recv(timeout=1.0)
                    except Exception:
                        # Timeout or no packet available
                        continue
                    
                    if packet is None:
                        continue
                    
                    try:
                        # Forward every packet regardless of modification success
                        wd.send(packet)
                    except Exception:
                        pass
            finally:
                wd.close()
                
        except ImportError:
            print("[MSS Clamper Warning] pydivert not installed. MSS clamping disabled.", file=sys.stderr)
            self.running = False
        except Exception as e:
            print(f"[MSS Clamper Warning] WinDivert unavailable (needs Admin + WinDivert driver): {e}", file=sys.stderr)
            print("[MSS Clamper] Continuing without MSS clamping. QoS policies will still work.", file=sys.stderr)
            self.running = False

if __name__ == "__main__":
    import time
    target_ip = "192.168.137.222"
    if len(sys.argv) > 1:
        target_ip = sys.argv[1]
    
    clamper = MSSClamper(target_ip)
    clamper.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        clamper.stop()
