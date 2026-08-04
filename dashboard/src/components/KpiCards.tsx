import React from 'react';
import { 
  Laptop, 
  Activity, 
  ArrowUpRight, 
  Wifi, 
  Clock, 
  Cpu, 
  Zap, 
  HardDrive, 
  CheckCircle2, 
  TrendingDown,
  Layers
} from 'lucide-react';

interface KpiCardsProps {
  metrics: {
    activeDevices: number;
    activeFlows: number;
    packetsPerSec: number;
    bandwidthMbps: number;
    avgLatencyMs: number;
    modelAccuracy: number;
    predictionSpeedMs: number;
    cpuUsage: number;
    memoryMb: number;
    gatewayHealth: string;
  };
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
  const kpiData = [
    {
      title: 'Active Devices',
      value: `${metrics.activeDevices}`,
      subtext: '5 Laptops + 5 Mobile Phones',
      icon: Laptop,
      color: 'text-blue-600',
      badge: '10 Online',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Active Flows',
      value: `${metrics.activeFlows}`,
      subtext: '5-tuple monitored sessions',
      icon: Activity,
      color: 'text-indigo-600',
      badge: '+4 last min',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      title: 'Packets/sec',
      value: metrics.packetsPerSec.toLocaleString(),
      subtext: 'Npcap sliding window (2s)',
      icon: ArrowUpRight,
      color: 'text-emerald-600',
      badge: '14.8k pps',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Bandwidth Usage',
      value: `${metrics.bandwidthMbps.toFixed(1)} Mbps`,
      subtext: 'Total aggregate throughput',
      icon: Wifi,
      color: 'text-blue-600',
      badge: 'Peak 100M',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Average Latency',
      value: `${metrics.avgLatencyMs.toFixed(1)} ms`,
      subtext: '-82% Bufferbloat reduction',
      icon: Clock,
      color: 'text-emerald-600',
      badge: '14.2ms vs 350ms',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Model Accuracy',
      value: `${metrics.modelAccuracy}%`,
      subtext: 'Random Forest (100 Trees)',
      icon: Zap,
      color: 'text-blue-600',
      badge: 'Scikit-Learn',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Prediction Speed',
      value: `${metrics.predictionSpeedMs} ms`,
      subtext: 'Real-time edge inference',
      icon: Cpu,
      color: 'text-amber-600',
      badge: '< 5ms target',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'CPU Usage',
      value: `${metrics.cpuUsage.toFixed(1)}%`,
      subtext: 'Gateway router load',
      icon: Cpu,
      color: 'text-slate-600',
      badge: 'Normal',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      title: 'Memory Usage',
      value: `${metrics.memoryMb} MB`,
      subtext: 'Local state & flow cache',
      icon: HardDrive,
      color: 'text-slate-600',
      badge: '412 / 8192 MB',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      title: 'Gateway Health',
      value: metrics.gatewayHealth,
      subtext: 'PowerShell / tc HTB Active',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      badge: '100% Operational',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {kpiData.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div 
            key={idx} 
            className="bg-white border border-gray-200 rounded p-3 hover:border-gray-300 transition-colors shadow-2xs"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 truncate">{item.title}</span>
              <Icon className={`w-4 h-4 ${item.color} shrink-0`} />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold text-slate-900 tracking-tight">{item.value}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px]">
              <span className="text-slate-400 truncate max-w-[110px]">{item.subtext}</span>
              <span className={`px-1.5 py-0.2 rounded border font-mono ${item.badgeColor}`}>
                {item.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
