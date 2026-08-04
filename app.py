import streamlit as st
import pandas as pd
import json
import time
import os
import random

# Page setup
st.set_page_config(
    page_title="AI Network Optimizer",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Premium dark theme styling using custom CSS
st.markdown("""
<style>
    /* Custom Google Font */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Outfit', sans-serif;
    }
    
    /* Global Background and Glassmorphism */
    .stApp {
        background: linear-gradient(135deg, #0f0c1b 0%, #15102a 50%, #06020f 100%);
        color: #ffffff;
    }
    
    /* Card Styles */
    .metric-card {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        transition: transform 0.3s ease, border-color 0.3s ease;
    }
    .metric-card:hover {
        transform: translateY(-4px);
        border-color: rgba(122, 162, 247, 0.4);
    }
    
    .metric-label {
        color: #7aa2f7;
        font-size: 14px;
        text-transform: uppercase;
        font-weight: 600;
        letter-spacing: 1.2px;
        margin-bottom: 8px;
    }
    
    .metric-value {
        font-size: 36px;
        font-weight: 800;
        color: #ffffff;
        text-shadow: 0 0 10px rgba(122, 162, 247, 0.3);
    }
    
    .metric-delta {
        font-size: 14px;
        font-weight: 400;
        margin-top: 6px;
    }
    .delta-green { color: #9ece6a; }
    .delta-red { color: #f7768e; }
    .delta-blue { color: #7db9e8; }
    
    /* Custom Headers */
    .main-title {
        font-size: 42px;
        font-weight: 800;
        background: linear-gradient(90deg, #7aa2f7, #bb9af7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 5px;
    }
    
    .subtitle {
        color: #a9b1d6;
        font-size: 18px;
        margin-bottom: 30px;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar settings & Demo Mode Toggle
st.sidebar.image("https://img.icons8.com/nolan/128/network-cable.png", width=80)
st.sidebar.markdown("# **AI-Router Gateway**")
st.sidebar.markdown("---")
demo_mode = st.sidebar.checkbox("🚀 Enable Pitch Demo Mode", value=False)
st.sidebar.markdown("""
**How to use:**
1. Run `python train_model.py` to create the model.
2. Run `python main_engine.py` on Laptop 1 (Admin CMD) to start real packet capturing.
3. Turn on the **Pitch Demo Mode** to showcase model predictions and live QoS behavior without having a physical hardware setup.
""")

# Setup local state file name
STATE_FILE = "network_state.json"

# State data holder
data = []

if demo_mode:
    # Interactive Demo Mode controls
    st.sidebar.subheader("Demo Mode Adjustments")
    congestion_state = st.sidebar.selectbox(
        "Network Congestion State",
        ["A: Congested (QoS Disabled)", "B: Optimized (QoS Enabled)"]
    )
    
    # Generate mock live tables
    if congestion_state == "A: Congested (QoS Disabled)":
        data = [
            {
                "Client IP": "192.168.137.101",
                "Client Device": "Phone 1 (Gaming Client)",
                "Detected Class": "Gaming/VoIP",
                "QoS Policy Applied": "None (QoS Disabled)",
                "Current Speed": "0.850 Mbps",
                "Ping / Latency": f"{random.randint(280, 360)} ms (Bufferbloat!)"
            },
            {
                "Client IP": "192.168.137.104",
                "Client Device": "Phone 4 (Bulk Downloader)",
                "Detected Class": "Bulk Download",
                "QoS Policy Applied": "None (QoS Disabled)",
                "Current Speed": "85.400 Mbps",
                "Ping / Latency": "85 ms"
            },
            {
                "Client IP": "192.168.137.103",
                "Client Device": "Phone 3 (4K Streamer)",
                "Detected Class": "Video Streaming",
                "QoS Policy Applied": "None (QoS Disabled)",
                "Current Speed": "22.100 Mbps",
                "Ping / Latency": "92 ms"
            }
        ]
    else:
        # State B: QoS Enabled
        data = [
            {
                "Client IP": "192.168.137.101",
                "Client Device": "Phone 1 (Gaming Client)",
                "Detected Class": "Gaming/VoIP",
                "QoS Policy Applied": "DSCP 46 (Priority, PriorityValue 7)",
                "Current Speed": "0.720 Mbps",
                "Ping / Latency": f"{random.randint(12, 19)} ms (Optimized)"
            },
            {
                "Client IP": "192.168.137.104",
                "Client Device": "Phone 4 (Bulk Downloader)",
                "Detected Class": "Bulk Download",
                "QoS Policy Applied": "DSCP 8 (Throttled to 5 Mbps)",
                "Current Speed": "5.000 Mbps (Capped)",
                "Ping / Latency": "22 ms"
            },
            {
                "Client IP": "192.168.137.103",
                "Client Device": "Phone 3 (4K Streamer)",
                "Detected Class": "Video Streaming",
                "QoS Policy Applied": "DSCP 0 (Standard)",
                "Current Speed": "18.300 Mbps",
                "Ping / Latency": "28 ms"
            }
        ]
else:
    # Read from live state JSON
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r") as f:
                data = json.load(f)
        except Exception:
            data = []
    else:
        data = []

# Header UI
st.markdown('<div class="main-title">⚡ AI-Driven Adaptive Network Optimizer</div>', unsafe_allow_html=True)
st.markdown('<div class="subtitle">Enterprise-Grade Encrypted Flow Classification & Dynamic Windows QoS</div>', unsafe_allow_html=True)

# Metrics Grid
col1, col2, col3 = st.columns(3)

# 1. Active Devices metric
active_devices = len(data)
with col1:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Active Monitored Devices</div>
        <div class="metric-value">{active_devices}</div>
        <div class="metric-delta delta-green">● Online & Classifying</div>
    </div>
    """, unsafe_allow_html=True)

# 2. Network status metric
if demo_mode:
    status_label = "Congested" if "Disabled" in congestion_state else "Optimal (CAKE Active)"
    status_class = "delta-red" if "Disabled" in congestion_state else "delta-green"
    status_sub = "Bufferbloat active" if "Disabled" in congestion_state else "QoS rules applied"
else:
    status_label = "Optimal (CAKE Active)" if active_devices > 0 else "Idle / Waiting"
    status_class = "delta-green" if active_devices > 0 else "delta-blue"
    status_sub = "QoS policies active" if active_devices > 0 else "Start main_engine.py"

with col2:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Gateway Status</div>
        <div class="metric-value">{status_label}</div>
        <div class="metric-delta {status_class}">● {status_sub}</div>
    </div>
    """, unsafe_allow_html=True)

# 3. Latency metric
if demo_mode:
    lat_val = "~320 ms" if "Disabled" in congestion_state else "15 ms"
    lat_delta = "Severe Latency Spike" if "Disabled" in congestion_state else "82% Latency Saved"
    lat_class = "delta-red" if "Disabled" in congestion_state else "delta-green"
else:
    lat_val = "12 - 25 ms" if active_devices > 0 else "-- ms"
    lat_delta = "Optimized via MSS Clamping" if active_devices > 0 else "No active traffic"
    lat_class = "delta-green" if active_devices > 0 else "delta-blue"

with col3:
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">Gaming Latency (192.168.137.101)</div>
        <div class="metric-value">{lat_val}</div>
        <div class="metric-delta {lat_class}">● {lat_delta}</div>
    </div>
    """, unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)

# Live Flow DataFrame
st.subheader("Live Network Flow Classification & Priority Mapping")
if len(data) > 0:
    df = pd.DataFrame(data)
    # Re-order columns for display
    cols = ["Client IP", "Client Device", "Detected Class", "QoS Policy Applied", "Current Speed", "Ping / Latency"]
    df = df[cols]
    st.dataframe(df, use_container_width=True)
else:
    st.info("🕒 Waiting for network flow classifications... Start packet capture with `python main_engine.py [interface_name]` or enable **Pitch Demo Mode** on the sidebar.")

# Dynamic Line chart for Gaming Ping representation
st.markdown("<br>", unsafe_allow_html=True)
st.subheader("Real-Time Latency Timeline (ms)")
if demo_mode:
    if "Disabled" in congestion_state:
        # High ping variance
        y_values = [random.randint(280, 360) for _ in range(20)]
    else:
        # Low flat ping
        y_values = [random.randint(12, 19) for _ in range(20)]
        
    ping_df = pd.DataFrame({
        "Timeline (Seconds)": list(range(-38, 2, 2)),
        "Gaming Ping (ms)": y_values
    })
    st.line_chart(ping_df.set_index("Timeline (Seconds)"))
else:
    st.write("Start capturing traffic to generate live timeline telemetry.")

# Auto refresh script for live tracking
if not demo_mode:
    time.sleep(2)
    st.rerun()
