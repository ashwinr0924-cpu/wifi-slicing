import React from 'react';
import { HistoricalDataPoint } from '../types/network';
import { TRAFFIC_DISTRIBUTION } from '../services/mockData';
import { 
  BarChart3, 
  Activity, 
  TrendingUp, 
  Clock, 
  PieChart as PieIcon, 
  Cpu, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

interface AnalyticsProps {
  data: HistoricalDataPoint[];
}

export const TrafficAnalytics: React.FC<AnalyticsProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="bg-white border border-gray-200 rounded shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Real-Time Network Performance & Bufferbloat Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparative analysis showing un-optimized legacy bufferbloat vs AI-driven QoS prioritized latency.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded font-mono font-semibold">
            -82% Latency Reduction Under Heavy Load
          </span>
        </div>
      </div>

      {/* Grid Row 1: Bufferbloat Latency Chart & Traffic Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Latency Comparison (Raw vs Optimized) - 2 cols */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded shadow-xs p-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Bufferbloat Latency Protection (ms)
              </h3>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-xs"></span>
                <span className="text-slate-600">Legacy Un-optimized (350ms)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 bg-emerald-600 rounded-xs"></span>
                <span className="text-slate-900 font-bold">AI QoS Engine (14.2ms)</span>
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit=" ms" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF', fontSize: '12px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="latencyRaw" 
                  name="Un-optimized (Raw)" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="latencyOptimized" 
                  name="AI Optimized QoS" 
                  stroke="#22C55E" 
                  strokeWidth={2.5} 
                  dot={{ r: 3, fill: '#22C55E' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Distribution Donut Chart - 1 col */}
        <div className="bg-white border border-gray-200 rounded shadow-xs p-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Traffic Distribution
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">By Bandwidth Volume</span>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TRAFFIC_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {TRAFFIC_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val: any) => [`${val}%`, 'Volume Share']}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Donut Legend */}
          <div className="space-y-1 mt-2 text-[11px]">
            {TRAFFIC_DISTRIBUTION.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                </span>
                <span className="font-mono text-slate-800 font-semibold">{item.speed}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Grid Row 2: Bandwidth per Traffic Class & Gateway Hardware Load */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Bandwidth Breakdown Area Chart */}
        <div className="bg-white border border-gray-200 rounded shadow-xs p-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Bandwidth Throughput per Traffic Class (Mbps)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400 font-semibold">Aggregated 84.5 Mbps</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit=" M" />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF', fontSize: '12px' }} />
                <Area type="monotone" dataKey="downloadMbps" name="Background Downloads" stackId="1" stroke="#64748B" fill="#CBD5E1" />
                <Area type="monotone" dataKey="streamingMbps" name="Streaming" stackId="1" stroke="#2563EB" fill="#93C5FD" />
                <Area type="monotone" dataKey="browsingMbps" name="Web Browsing" stackId="1" stroke="#F59E0B" fill="#FDE68A" />
                <Area type="monotone" dataKey="gamingMbps" name="Gaming" stackId="1" stroke="#22C55E" fill="#86EFAC" />
                <Area type="monotone" dataKey="voipMbps" name="VoIP" stackId="1" stroke="#06B6D4" fill="#A5F3FC" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gateway Hardware Load (CPU & RAM) */}
        <div className="bg-white border border-gray-200 rounded shadow-xs p-4">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Gateway Edge Hardware Utilization (CPU & RAM)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Dual Core x86_64</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', color: '#FFF', fontSize: '12px' }} />
                <Line type="monotone" dataKey="cpuUsage" name="CPU Usage (%)" stroke="#2563EB" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="memoryUsage" name="RAM (MB)" stroke="#64748B" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
