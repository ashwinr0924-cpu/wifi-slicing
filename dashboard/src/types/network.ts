export type TrafficClass = 
  | 'Gaming'
  | 'VoIP'
  | 'Streaming'
  | 'Background Download'
  | 'Video Call'
  | 'Web Browsing';

export type QoSPriority = 'Highest' | 'High' | 'Medium' | 'Low' | 'Best Effort';

export type QoSStatus = 'Active' | 'Throttled' | 'Prioritized' | 'Normal' | 'Clamped';

export interface NetworkFlow {
  id: string;
  device: string;
  ip: string;
  srcPort: number;
  dstPort: number;
  protocol: 'TCP' | 'UDP';
  trafficType: TrafficClass;
  predictedClass: TrafficClass;
  confidence: number; // e.g. 0.985 for 98.5%
  currentSpeed: string;
  speedMbps: number;
  latency: number; // ms
  qosPriority: QoSPriority;
  dscp: string; // e.g. "DSCP 46"
  status: QoSStatus;
  packetCount: number;
  byteCount: number;
  pktSizeMean: number;
  pktSizeStd: number;
  iatMean: number; // ms
  iatStd: number; // ms
  burstCount: number;
  dirRatio: number;
}

export interface QoSPolicy {
  id: string;
  trafficType: TrafficClass;
  priority: QoSPriority;
  bandwidthAllocation: string;
  queue: string;
  dscpValue: string;
  status: 'Active' | 'Inactive' | 'Modified';
  tcFilterRule?: string;
  psRule?: string;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  role: string;
  type: 'Laptop' | 'Phone' | 'Desktop' | 'Tablet' | 'Router';
  ip: string;
  mac: string;
  signalStrength: number; // dBm e.g. -45
  currentSpeed: string;
  trafficType: TrafficClass;
  latency: number;
  qosPriority: QoSPriority;
  status: 'Online' | 'High Load' | 'Idle';
}

export interface AlertEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  category: 'High Latency' | 'QoS Policy Applied' | 'New Device' | 'RF Prediction' | 'Packet Spike' | 'TCP MSS Clamped';
}

export interface FeatureImportanceItem {
  feature: string;
  importance: number;
  label: string;
}

export interface ConfusionMatrixRow {
  actual: string;
  Gaming: number;
  VoIP: number;
  Streaming: number;
  Background: number;
  Browsing: number;
}

export interface ModelMetrics {
  accuracy: number;
  predictionTimeMs: number;
  treesCount: number;
  status: string;
  trainingDatasetLoaded: boolean;
  inferenceRunning: boolean;
  errorsCount: number;
  featureImportance: FeatureImportanceItem[];
  confusionMatrix: ConfusionMatrixRow[];
}

export interface HistoricalDataPoint {
  time: string;
  latencyRaw: number;
  latencyOptimized: number;
  bandwidthMbps: number;
  packetCount: number;
  cpuUsage: number;
  memoryUsage: number;
  gamingMbps: number;
  voipMbps: number;
  streamingMbps: number;
  downloadMbps: number;
  browsingMbps: number;
}
