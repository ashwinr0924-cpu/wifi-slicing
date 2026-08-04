import numpy as np
from collections import defaultdict

def process_packets_to_features(packet_list):
    """
    Groups packets by their source IP and direction, aggregates them as flows,
    and extracts statistical features for the ML model.
    
    Each packet in packet_list is a dict:
    {
        'timestamp': float,
        'src_ip': str,
        'dst_ip': str,
        'src_port': int,
        'dst_port': int,
        'proto': str,
        'length': int
    }
    """
    # Group packets by IP flow direction
    # We group by src_ip to identify which device is sending/receiving
    flows = defaultdict(list)
    for pkt in packet_list:
        flow_key = pkt['src_ip']
        flows[flow_key].append((pkt['timestamp'], pkt['length']))
    
    features_dict = {}
    for device_ip, packets in flows.items():
        if len(packets) < 2:
            # We need at least two packets to compute inter-arrival times
            # Provide safe baseline values for single packet flows
            lengths = [p[1] for p in packets]
            features_dict[device_ip] = {
                "mean_pkt_len": float(np.mean(lengths)),
                "std_pkt_len": 0.0,
                "mean_iat": 1.0,  # Default fallback
                "std_iat": 0.0,
                "total_bytes": int(sum(lengths)),
                "pkt_count": len(lengths)
            }
            continue
            
        timestamps, lengths = zip(*packets)
        # Sort by timestamp to calculate correct inter-arrival times
        sorted_indices = np.argsort(timestamps)
        sorted_timestamps = np.array(timestamps)[sorted_indices]
        sorted_lengths = np.array(lengths)[sorted_indices]
        
        iats = np.diff(sorted_timestamps) # In seconds
        
        features_dict[device_ip] = {
            "mean_pkt_len": float(np.mean(sorted_lengths)),
            "std_pkt_len": float(np.std(sorted_lengths)) if len(sorted_lengths) > 1 else 0.0,
            "mean_iat": float(np.mean(iats)),
            "std_iat": float(np.std(iats)) if len(iats) > 1 else 0.0,
            "total_bytes": int(sum(sorted_lengths)),
            "pkt_count": len(sorted_lengths)
        }
        
    return features_dict
