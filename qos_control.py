import subprocess
import re

def clean_policy_name(name):
    # PowerShell names cannot contain dots or special characters, replace dots with underscores
    return re.sub(r'[^a-zA-Z0-9_]', '_', name)

def reset_qos_policies():
    """
    Clears all network optimizer NetQoS policies.
    Requires Administrator privileges.
    """
    script = 'Get-NetQosPolicy | Where-Object { $_.Name -like "AGY_*" } | Remove-NetQosPolicy -Confirm:$false'
    try:
        subprocess.run(["powershell", "-Command", script], capture_output=True, check=True)
        print("[QoS Controller] Cleared all previously set optimizer policies.")
    except Exception as e:
        print(f"[QoS Controller Warning] Failed to reset NetQoS policies (Verify Administrator privileges): {e}")

def enforce_qos_policy(device_ip, traffic_class):
    """
    Enforces priority or bandwidth limits on a device IP based on prediction.
    traffic_class: 0 = Gaming/VoIP, 1 = Video Streaming, 2 = Bulk Download
    """
    safe_ip = clean_policy_name(device_ip)
    
    # 1. Clean up existing policy for this device first to prevent duplicates
    cleanup_cmd = f'Remove-NetQosPolicy -Name "AGY_QoS_{safe_ip}" -Confirm:$false -ErrorAction SilentlyContinue'
    
    # 2. Build the new policy command
    if traffic_class == 0:  # Gaming / VoIP
        # DSCP 46 (Expedited Forwarding), high priority (7)
        new_policy_cmd = (
            f'New-NetQosPolicy -Name "AGY_QoS_{safe_ip}" '
            f'-IPDstPrefixMatchCondition "{device_ip}/32" '
            f'-DSCPAction 46 -PriorityValue 7 -ErrorAction SilentlyContinue'
        )
        print(f"[QoS Controller] Prioritizing {device_ip} (Class: Gaming/VoIP, DSCP 46, Priority 7)")
    
    elif traffic_class == 2:  # Bulk Download
        # Throttle bandwidth to 5 Mbps (5242880 bits/sec), DSCP 8 (Background)
        new_policy_cmd = (
            f'New-NetQosPolicy -Name "AGY_QoS_{safe_ip}" '
            f'-IPDstPrefixMatchCondition "{device_ip}/32" '
            f'-DSCPAction 8 -ThrottleRateActionBitsPerSecond 5242880 -ErrorAction SilentlyContinue'
        )
        print(f"[QoS Controller] Throttling {device_ip} (Class: Bulk Download, Max 5 Mbps, DSCP 8)")
        
    else:  # Video Streaming or others (Normal QoS)
        # Normal priority, no throttling, CS0 (DSCP 0) or CS3 (DSCP 24)
        new_policy_cmd = (
            f'New-NetQosPolicy -Name "AGY_QoS_{safe_ip}" '
            f'-IPDstPrefixMatchCondition "{device_ip}/32" '
            f'-DSCPAction 0 -ErrorAction SilentlyContinue'
        )
        print(f"[QoS Controller] Resetting {device_ip} to Standard Policy (Class: Streaming/Normal, DSCP 0)")

    # Execute inside PowerShell
    powershell_script = f"{cleanup_cmd}; {new_policy_cmd}"
    try:
        res = subprocess.run(["powershell", "-Command", powershell_script], capture_output=True, text=True)
        if res.returncode != 0:
            print(f"[QoS Controller Error] PowerShell failed: {res.stderr.strip()}")
    except Exception as e:
        print(f"[QoS Controller Exception] Failed to execute command: {e}")
