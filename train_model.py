import lightgbm as lgb
import pandas as pd
import numpy as np
import joblib

def generate_synthetic_dataset():
    np.random.seed(42)
    rows = []
    
    # Class 0: Gaming / VoIP (Small packet lengths, strict/low IAT, low volume)
    for _ in range(200):
        mean_pkt_len = np.random.uniform(50, 200)
        std_pkt_len = np.random.uniform(5, 30)
        mean_iat = np.random.uniform(0.005, 0.035)
        std_iat = np.random.uniform(0.001, 0.010)
        pkt_count = np.random.randint(30, 100)
        total_bytes = mean_pkt_len * pkt_count
        rows.append([mean_pkt_len, std_pkt_len, mean_iat, std_iat, total_bytes, pkt_count, 0])
        
    # Class 1: Video Streaming (Large bursty packets, variable/higher IAT, medium volume)
    for _ in range(200):
        mean_pkt_len = np.random.uniform(800, 1400)
        std_pkt_len = np.random.uniform(150, 400)
        mean_iat = np.random.uniform(0.05, 0.35)
        std_iat = np.random.uniform(0.01, 0.12)
        pkt_count = np.random.randint(300, 1500)
        total_bytes = mean_pkt_len * pkt_count
        rows.append([mean_pkt_len, std_pkt_len, mean_iat, std_iat, total_bytes, pkt_count, 1])
        
    # Class 2: Bulk Download (Max packet length, continuous throughput, high volume, low IAT)
    for _ in range(200):
        mean_pkt_len = np.random.uniform(1380, 1460)
        std_pkt_len = np.random.uniform(0, 15)
        mean_iat = np.random.uniform(0.0005, 0.005)
        std_iat = np.random.uniform(0.0001, 0.001)
        pkt_count = np.random.randint(2000, 8000)
        total_bytes = mean_pkt_len * pkt_count
        rows.append([mean_pkt_len, std_pkt_len, mean_iat, std_iat, total_bytes, pkt_count, 2])
        
    cols = ["mean_pkt_len", "std_pkt_len", "mean_iat", "std_iat", "total_bytes", "pkt_count", "label"]
    df = pd.DataFrame(rows, columns=cols)
    return df

def train_and_export():
    print("[+] Generating synthetic flow data...")
    df = generate_synthetic_dataset()
    
    X = df.drop(columns=["label"])
    y = df["label"]
    
    print("[+] Training LightGBM Model...")
    # Train LGBM model
    # We set min_child_samples=5 to accommodate small training set rules
    model = lgb.LGBMClassifier(
        n_estimators=50, 
        max_depth=5, 
        learning_rate=0.1, 
        min_child_samples=5,
        random_state=42
    )
    model.fit(X, y)
    
    # Save the model
    joblib.dump(model, "network_model.pkl")
    print("[+] Model successfully exported as 'network_model.pkl'")

if __name__ == "__main__":
    train_and_export()
