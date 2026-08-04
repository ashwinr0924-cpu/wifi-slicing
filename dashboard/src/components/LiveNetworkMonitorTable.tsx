import React, { useState } from 'react';
import { NetworkFlow, TrafficClass, QoSStatus } from '../types/network';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Gamepad2, 
  PhoneCall, 
  Tv, 
  DownloadCloud, 
  Video, 
  Globe,
  CheckCircle,
  AlertTriangle,
  Flame,
  Info
} from 'lucide-react';

interface TableProps {
  flows: NetworkFlow[];
  onSelectFlow?: (flow: NetworkFlow) => void;
}

export const LiveNetworkMonitorTable: React.FC<TableProps> = ({ flows, onSelectFlow }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const getTrafficIcon = (tClass: TrafficClass) => {
    switch (tClass) {
      case 'Gaming': return <Gamepad2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'VoIP': return <PhoneCall className="w-3.5 h-3.5 text-cyan-600" />;
      case 'Streaming': return <Tv className="w-3.5 h-3.5 text-blue-600" />;
      case 'Background Download': return <DownloadCloud className="w-3.5 h-3.5 text-slate-500" />;
      case 'Video Call': return <Video className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Web Browsing': return <Globe className="w-3.5 h-3.5 text-amber-600" />;
      default: return <Globe className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: QoSStatus, dscp: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            Active ({dscp})
          </span>
        );
      case 'Throttled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            Throttled ({dscp})
          </span>
        );
      case 'Prioritized':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
            Prioritized
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Normal
          </span>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Highest':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold">Highest</span>;
      case 'High':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-mono text-[10px] font-semibold">High</span>;
      case 'Medium':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-mono text-[10px]">Medium</span>;
      case 'Low':
        return <span className="bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px]">Low</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px]">Best Effort</span>;
    }
  };

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = 
      flow.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.ip.includes(searchTerm) ||
      flow.trafficType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.predictedClass.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = filterClass === 'ALL' || flow.trafficType === filterClass;
    const matchesStatus = filterStatus === 'ALL' || flow.status === filterStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  return (
    <div className="bg-white border border-gray-200 rounded shadow-xs">
      {/* Header Bar */}
      <div className="px-4 py-3 border-b border-gray-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Live Network Flow Monitor</h3>
          <span className="bg-blue-100 text-blue-800 text-[10px] font-mono px-2 py-0.5 rounded font-semibold border border-blue-200">
            {filteredFlows.length} Active 5-Tuples
          </span>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Device, IP, Class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white border border-gray-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 w-48 sm:w-64"
            />
          </div>

          {/* Traffic Class Filter */}
          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-white border border-gray-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">All Traffic Classes</option>
              <option value="Gaming">Gaming</option>
              <option value="VoIP">VoIP</option>
              <option value="Streaming">Streaming</option>
              <option value="Background Download">Background Download</option>
              <option value="Video Call">Video Call</option>
              <option value="Web Browsing">Web Browsing</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="table-header">Device</th>
              <th className="table-header">IP Address</th>
              <th className="table-header">Traffic Type</th>
              <th className="table-header">Predicted Class</th>
              <th className="table-header">Confidence</th>
              <th className="table-header">Current Speed</th>
              <th className="table-header">Latency</th>
              <th className="table-header">QoS Priority</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredFlows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-xs text-slate-500">
                  No active network flows match your search query.
                </td>
              </tr>
            ) : (
              filteredFlows.map((flow) => (
                <tr 
                  key={flow.id} 
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => onSelectFlow && onSelectFlow(flow)}
                >
                  {/* Device */}
                  <td className="table-cell font-medium text-slate-900">
                    {flow.device}
                  </td>

                  {/* IP Address */}
                  <td className="table-cell font-mono text-slate-600 text-[11px]">
                    {flow.ip}:{flow.dstPort}
                    <span className="text-slate-400 text-[9px] ml-1 font-mono uppercase">({flow.protocol})</span>
                  </td>

                  {/* Traffic Type */}
                  <td className="table-cell">
                    <div className="flex items-center space-x-1.5">
                      {getTrafficIcon(flow.trafficType)}
                      <span className="font-medium text-slate-800">{flow.trafficType}</span>
                    </div>
                  </td>

                  {/* Predicted Class */}
                  <td className="table-cell">
                    <span className="font-mono text-slate-800 text-[11px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {flow.predictedClass}
                    </span>
                  </td>

                  {/* Confidence */}
                  <td className="table-cell font-mono">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full" 
                          style={{ width: `${flow.confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {(flow.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>

                  {/* Current Speed */}
                  <td className="table-cell font-mono font-medium text-slate-800">
                    {flow.currentSpeed}
                  </td>

                  {/* Latency */}
                  <td className="table-cell font-mono">
                    <span className={`font-semibold text-[11px] ${
                      flow.latency > 100 
                        ? 'text-red-600' 
                        : flow.latency > 30 
                        ? 'text-amber-600' 
                        : 'text-emerald-600'
                    }`}>
                      {flow.latency.toFixed(1)} ms
                    </span>
                  </td>

                  {/* QoS Priority */}
                  <td className="table-cell">
                    {getPriorityBadge(flow.qosPriority)}
                  </td>

                  {/* Status Badge */}
                  <td className="table-cell">
                    {getStatusBadge(flow.status, flow.dscp)}
                  </td>

                  {/* Action */}
                  <td className="table-cell text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFlow && onSelectFlow(flow);
                      }}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded text-[11px] font-medium inline-flex items-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Vector</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
