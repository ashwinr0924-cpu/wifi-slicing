import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Pause, 
  Play, 
  Terminal, 
  Download,
  Flame,
  Zap,
  RotateCcw
} from 'lucide-react';

interface NavbarProps {
  isLive: boolean;
  onToggleLive: () => void;
  onTriggerStressTest: () => void;
  onResetBenchmark: () => void;
  onExportCsv: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  isLive, 
  onToggleLive, 
  onTriggerStressTest,
  onResetBenchmark,
  onExportCsv
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between h-14">
          
          {/* Left: Logo & Project Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-blue-600 text-white font-semibold text-sm shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  AI-Driven Adaptive Network Optimizer
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-1.5 py-0.5 rounded border border-blue-200 font-semibold">
                  CIH'26 HACKATHON
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Real-Time ML Encrypted Traffic Classifier & Dynamic QoS Gateway
              </p>
            </div>
          </div>

          {/* Center: Live Clock & Gateway Status */}
          <div className="hidden md:flex items-center space-x-3 text-xs">
            
            {/* Live Clock */}
            <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1 rounded border border-gray-200 text-slate-600 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{timeStr || '2026-08-04 20:07:12 UTC'}</span>
            </div>

            {/* Gateway Status Badge */}
            <div className="flex items-center space-x-2 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 text-emerald-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-[11px]">Gateway: Active (PowerShell/tc)</span>
              <span className="text-[10px] bg-emerald-200/60 text-emerald-900 px-1 rounded font-mono uppercase">Optimized</span>
            </div>

            {/* Pause / Play Telemetry */}
            <button
              onClick={onToggleLive}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border font-medium text-xs transition-colors ${
                isLive 
                  ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isLive ? 'Live Streaming' : 'Paused'}</span>
            </button>
          </div>

          {/* Right: Quick Action Controls */}
          <div className="flex items-center space-x-2">
            
            {/* Export CSV Report */}
            <button
              onClick={onExportCsv}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold px-2.5 py-1 rounded flex items-center space-x-1 transition-colors"
              title="Download 5-Tuple Flow Telemetry Report (CSV)"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Terminal IP */}
            <div className="hidden lg:flex items-center space-x-1 text-[11px] font-mono text-slate-500 bg-slate-50 border border-gray-200 px-2 py-1 rounded">
              <Terminal className="w-3.5 h-3.5 text-blue-600" />
              <span>wlan0: 192.168.137.1</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2 border-l border-gray-200 pl-3">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs border border-slate-700">
                NE
              </div>
            </div>

          </div>

        </div>

        {/* Demo Pitch Shortcut Bar */}
        <div className="bg-slate-900 text-slate-200 px-4 py-1.5 -mx-4 sm:-mx-6 lg:-mx-8 flex flex-wrap items-center justify-between text-xs font-mono border-t border-slate-800 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
              ⚡ Live Demo Pitch Controls:
            </span>
            <span className="text-slate-400 hidden lg:inline">Simulate realistic network events for hackathon judges</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onTriggerStressTest}
              className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-sans font-bold px-2.5 py-0.5 rounded flex items-center space-x-1 transition-colors shadow-2xs"
            >
              <Flame className="w-3 h-3" />
              <span>Simulate Steam Download Stress Spike</span>
            </button>

            <button
              onClick={onResetBenchmark}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-sans px-2 py-0.5 rounded flex items-center space-x-1 border border-slate-700"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Flow Telemetry</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
