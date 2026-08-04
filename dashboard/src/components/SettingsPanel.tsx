import React, { useState } from 'react';
import { 
  Settings, 
  Terminal, 
  Cpu, 
  Wifi, 
  Sliders, 
  Save, 
  RefreshCw,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const [iface, setIface] = useState('wlan0 (Windows Mobile Hotspot AP)');
  const [windowSec, setWindowSec] = useState('2.0');
  const [nTrees, setNTrees] = useState('100');
  const [maxDepth, setMaxDepth] = useState('8');
  const [mssClamp, setMssClamp] = useState('1300');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded shadow-xs p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-slate-700" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Gateway Architecture & ML Engine Configuration
          </h2>
        </div>
        {saved && (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings Saved & Reloaded!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Section 1: Sniffer & Packet Capture Interface */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 text-[11px]">
            <Wifi className="w-3.5 h-3.5 text-blue-600" />
            <span>1. Network Interface & Packet Sniffer Driver</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sniffer Interface</label>
              <select
                value={iface}
                onChange={(e) => setIface(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded p-2 text-slate-800 font-mono"
              >
                <option value="wlan0 (Windows Mobile Hotspot AP)">wlan0 (Windows Mobile Hotspot AP)</option>
                <option value="eth0 (Embedded Linux Router Gateway)">eth0 (Embedded Linux Router Gateway)</option>
                <option value="Npcap Loopback Adapter">Npcap Loopback Adapter</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Selected interface for raw 5-tuple flow packet extraction.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sliding Feature Window (Seconds)</label>
              <input
                type="text"
                value={windowSec}
                onChange={(e) => setWindowSec(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded p-2 text-slate-800 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Duration to aggregate packet count, mean packet size, and IAT vector.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Random Forest ML Hyperparameters */}
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>2. Random Forest Model Hyperparameters (Scikit-Learn)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Number of Decision Trees (n_estimators)</label>
              <input
                type="number"
                value={nTrees}
                onChange={(e) => setNTrees(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded p-2 text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Maximum Tree Depth (max_depth)</label>
              <input
                type="number"
                value={maxDepth}
                onChange={(e) => setMaxDepth(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded p-2 text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confidence Threshold (%)</label>
              <input
                type="text"
                defaultValue="85.0"
                className="w-full bg-white border border-gray-300 rounded p-2 text-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: QoS Enforcer & Bufferbloat Prevention */}
        <div className="space-y-3 pt-3 border-t border-gray-200">
          <h3 className="font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 text-[11px]">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>3. QoS Driver & Bufferbloat Prevention</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">TCP MSS Clamping Value (Bytes)</label>
              <input
                type="text"
                value={mssClamp}
                onChange={(e) => setMssClamp(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded p-2 text-slate-800 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Clamps TCP SYN packets to 1300 bytes to prevent serialization delays on gaming queues.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">TLS Ground-Truth Labeling Mode</label>
              <div className="bg-slate-50 border border-gray-200 rounded p-2 text-slate-700 font-mono">
                TLS 1.3 SNI Mining (Client Hello Domain Parsing)
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded text-xs flex items-center space-x-1.5 shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Apply Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
