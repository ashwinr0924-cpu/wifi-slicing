import numpy as np
from collections import defaultdict

def process_packets_to_features(packet_list):
    """
    Groups packets by their client IP (either src or dst that matches known client IPs),
    aggregates them as flows, and extracts statistical features for the ML model.

    Each packet in packet_list is a dict:
    {
        'timestamp': float,
        'src_ip': str,
        'dst_ip': str,
        'src_port': int,
        'dst_port': int,
        'proto': str,
        'length': int,
        'client_ip': str or None   # the client IP if either src or dst is a known client, else None
    }
    """
    # Group packets by client IP
    flows = defaultdict(list)
    for pkt in packet_list:
        client_ip = pkt['client_ip']
        if client_ip is None:
            # Skip packets not associated with any known client
            continue
        flows[client_ip].append((pkt['timestamp'], pkt['length']))

    features_dict = {}
    for client_ip, packets in flows.items():
        if len(packets) < 2:
            # We need at least two packets to compute inter-arrival times
            # Provide safe baseline values for single packet flows
            lengths = [p[1] for p in packets]
            features_dict[client_ip] = {
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

        iats = np.diff(sorted_timestamps)  # In seconds

        features_dict[client_ip] = {
            "mean_pkt_len": float(np.mean(sorted_lengths)),
            "std_pkt_len": float(np.std(sorted_lengths)) if len(sorted_lengths) > 1 else 0.0,
            "mean_iat": float(np.mean(iats)),
            "std_iat": float(np.std(iats)) if len(iats) > 1 else 0.0,
            "total_bytes": int(np.sum(sorted_lengths)),
            "pkt_count": len(sorted_lengths)
        }

    return features_dict