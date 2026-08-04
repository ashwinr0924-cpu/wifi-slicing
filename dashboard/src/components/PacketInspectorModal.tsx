import React from 'react';
import { NetworkFlow } from '../types/network';
import { X, Cpu, Layers, Activity, FileText, CheckCircle2 } from 'lucide-react';

interface ModalProps {
  flow: NetworkFlow | null;
  onClose: () => void;
}

export const PacketInspectorModal: React.FC<ModalProps> = ({ flow, onClose }) => {
  if (!flow) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded border border-gray-300 shadow-xl max-w-xl w-full p-4 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              5-Tuple Flow Vector Inspector
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Flow Details */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 border border-gray-200 rounded p-2.5 space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Device & Host IP</span>
            <p className="font-bold text-slate-900">{flow.device}</p>
            <p className="font-mono text-blue-700">{flow.ip}:{flow.srcPort}</p>
          </div>

          <div className="bg-slate-50 border border-gray-200 rounded p-2.5 space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Predicted Class & Confidence</span>
            <p className="font-bold text-slate-900">{flow.predictedClass}</p>
            <p className="font-mono text-emerald-700 font-semibold">{(flow.confidence * 100).toFixed(1)}% Confidence</p>
          </div>
        </div>

        {/* Feature Vector Table */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Extracted Feature Vector (2-Second Window)
          </span>
          <div className="bg-slate-900 text-slate-200 font-mono text-[11px] rounded p-3 space-y-1.5 border border-slate-800 overflow-x-auto">
            <div className="flex justify-between text-slate-400 border-b border-slate-800 pb-1 text-[10px]">
              <span>FEATURE NAME</span>
              <span>COMPUTED VALUE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">pkt_count:</span>
              <span className="text-white font-bold">{flow.packetCount} packets</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">byte_count:</span>
              <span className="text-white font-bold">{flow.byteCount.toLocaleString()} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">pkt_size_mean:</span>
              <span className="text-white">{flow.pktSizeMean.toFixed(1)} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">pkt_size_std:</span>
              <span className="text-white">{flow.pktSizeStd.toFixed(1)} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">iat_mean:</span>
              <span className="text-emerald-400 font-bold">{flow.iatMean.toFixed(1)} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">iat_std:</span>
              <span className="text-white">{flow.iatStd.toFixed(1)} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">burst_count (&lt;5ms):</span>
              <span className="text-amber-400 font-bold">{flow.burstCount} bursts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400">dir_ratio (uplink/downlink):</span>
              <span className="text-white">{flow.dirRatio.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Assigned QoS Rule */}
        <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5 text-xs text-emerald-900 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Assigned QoS Policy: {flow.qosPriority} Priority ({flow.dscp})</span>
          </div>
          <p className="text-[11px] text-emerald-800">
            Flow automatically routed to queue class <code className="font-mono font-bold">1:10</code> with maximum allocated latency budget of 15ms.
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 text-white font-semibold text-xs hover:bg-slate-900"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
