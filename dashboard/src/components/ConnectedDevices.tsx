import React from 'react';
import { ConnectedDevice } from '../types/network';
import { 
  Laptop, 
  Smartphone, 
  Wifi, 
  Activity, 
  Clock, 
  ShieldCheck, 
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  Server
} from 'lucide-react';

interface DevicesProps {
  devices: ConnectedDevice[];
}

export const ConnectedDevices: React.FC<DevicesProps> = ({ devices }) => {
  const getSignalIcon = (dBm: number) => {
    if (dBm >= -45) {
      return <Wifi className="w-4 h-4 text-emerald-600" />;
    } else if (dBm >= -55) {
      return <Wifi className="w-4 h-4 text-blue-600" />;
    } else {
      return <Wifi className="w-4 h-4 text-amber-600" />;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Laptop': return <Laptop className="w-5 h-5 text-blue-600" />;
      case 'Phone': return <Smartphone className="w-5 h-5 text-indigo-600" />;
      default: return <Server className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Hardware Testbed & Connected Devices Ecosystem
            </h2>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded font-semibold border border-blue-200">
              5 Laptops + 5 Mobile Phones
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulated smart home environment orchestrating real-time encrypted traffic streams.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-50 px-3 py-1 rounded border border-gray-200 text-slate-700">
            <span className="font-semibold">Hotspot SSID: </span>
            <code className="text-blue-700 font-mono">AI_Gateway_AP</code>
          </div>
          <div className="bg-emerald-50 px-3 py-1 rounded border border-emerald-200 text-emerald-800 font-medium">
            10 / 10 Connected
          </div>
        </div>
      </div>

      {/* Grid of Device Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {devices.map((dev) => (
          <div 
            key={dev.id}
            className="bg-white border border-gray-200 rounded p-3 hover:border-blue-300 transition-all shadow-2xs space-y-2 flex flex-col justify-between"
          >
            {/* Top Card Info */}
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-slate-50 border border-gray-200 rounded">
                    {getDeviceIcon(dev.type)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                      {dev.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                      {dev.role}
                    </span>
                  </div>
                </div>
                {getSignalIcon(dev.signalStrength)}
              </div>

              {/* IP & MAC */}
              <div className="mt-2 pt-2 border-t border-gray-100 font-mono text-[10px] text-slate-500 space-y-0.5">
                <div className="flex justify-between">
                  <span>IP:</span>
                  <span className="text-slate-800 font-semibold">{dev.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span>MAC:</span>
                  <span className="text-slate-600">{dev.mac}</span>
                </div>
              </div>
            </div>

            {/* Metrics Footer */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100 bg-slate-50/50 p-2 rounded">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Traffic:</span>
                <span className="font-semibold text-slate-800">{dev.trafficType}</span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Current Speed:</span>
                <span className="font-mono font-bold text-blue-700">{dev.currentSpeed}</span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-500">Latency:</span>
                <span className={`font-mono font-semibold ${
                  dev.latency > 100 ? 'text-red-600' : 'text-emerald-600'
                }`}>
                  {dev.latency.toFixed(1)} ms
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px] pt-1">
                <span className="text-slate-400">Signal:</span>
                <span className="font-mono text-slate-600">{dev.signalStrength} dBm</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
