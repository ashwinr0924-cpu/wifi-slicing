import React, { useState } from 'react';
import { QoSPolicy, TrafficClass, QoSPriority } from '../types/network';
import { 
  Sliders, 
  Terminal, 
  Play, 
  Pause, 
  Edit3, 
  Check, 
  X, 
  Plus, 
  ShieldAlert, 
  Layers, 
  Code,
  CheckCircle2,
  Copy,
  RefreshCw
} from 'lucide-react';

interface QoSProps {
  policies: QoSPolicy[];
  onTogglePolicy: (id: string) => void;
  onAddPolicy: (policy: QoSPolicy) => void;
}

export const QoSController: React.FC<QoSProps> = ({ policies, onTogglePolicy, onAddPolicy }) => {
  const [activeTab, setActiveTab] = useState<'table' | 'powershell' | 'tc'>('table');
  const [copiedScript, setCopiedScript] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New policy state
  const [newType, setNewType] = useState<TrafficClass>('Video Call');
  const [newPriority, setNewPriority] = useState<QoSPriority>('High');
  const [newBandwidth, setNewBandwidth] = useState('15 Mbps');
  const [newQueue, setNewQueue] = useState('Queue 1');
  const [newDscp, setNewDscp] = useState('DSCP 46');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created: QoSPolicy = {
      id: `qos-${Date.now()}`,
      trafficType: newType,
      priority: newPriority,
      bandwidthAllocation: newBandwidth,
      queue: newQueue,
      dscpValue: newDscp,
      status: 'Active',
      tcFilterRule: `tc class add dev wlan0 parent 1:1 classid 1:${newQueue === 'Queue 1' ? '10' : '20'} htb rate ${newBandwidth.replace(' ', '')} ceil 100mbit`,
      psRule: `New-NetQosPolicy -Name "${newType}-Custom" -IPDstAddr 192.168.137.x -DSCPAction ${newDscp.replace('DSCP ', '')} -ThrottleRateActionBitsPerSecond ${newBandwidth.replace(' ', '')}`,
    };
    onAddPolicy(created);
    setShowAddModal(false);
  };

  const psScript = `# PowerShell NetQoS Policy Enforcer (Windows Host)
Reset-QoSPolicies

# VoIP Policy (EF - DSCP 46)
New-NetQosPolicy -Name "VoIP-Priority" -IPDstAddr "192.168.137.10" -DSCPAction 46 -ThrottleRateActionBitsPerSecond 10MB

# Gaming Policy (EF - DSCP 46)
New-NetQosPolicy -Name "Gaming-Priority" -IPDstAddr "192.168.137.12" -DSCPAction 46 -ThrottleRateActionBitsPerSecond 20MB

# Streaming Policy (AF - DSCP 26)
New-NetQosPolicy -Name "Streaming-Medium" -IPDstAddr "192.168.137.15" -DSCPAction 26 -ThrottleRateActionBitsPerSecond 50MB

# Background Throttled Policy (CS1 - DSCP 8)
New-NetQosPolicy -Name "Background-Throttled" -IPDstAddr "192.168.137.18" -DSCPAction 8 -ThrottleRateActionBitsPerSecond 5MB`;

  const tcScript = `# Linux tc HTB Queue Discipline Controller
sudo tc qdisc del dev wlan0 root 2>/dev/null
sudo tc qdisc add dev wlan0 root handle 1: htb default 30
sudo tc class add dev wlan0 parent 1: classid 1:1 htb rate 100mbit

# Queue 1: VoIP & Gaming (Ultra Low Latency)
sudo tc class add dev wlan0 parent 1:1 classid 1:10 htb rate 30mbit ceil 100mbit prio 1

# Queue 2: Streaming & Browsing (Medium Throughput)
sudo tc class add dev wlan0 parent 1:1 classid 1:20 htb rate 50mbit ceil 100mbit prio 2

# Queue 3: Background Downloads (Throttled)
sudo tc class add dev wlan0 parent 1:1 classid 1:30 htb rate 5mbit ceil 30mbit prio 3`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="space-y-4">
      
      {/* Policy Table Header & Tab Switcher */}
      <div className="bg-white border border-gray-200 rounded shadow-xs p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Quality of Service (QoS) Dynamic Policy Controller
              </h2>
              <p className="text-xs text-slate-500">
                Configures DSCP IP header tagging and Hierarchical Token Bucket (HTB) rate limiting queues.
              </p>
            </div>
          </div>

          {/* Actions & Tab Select */}
          <div className="flex items-center space-x-2">
            <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setActiveTab('table')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'table' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Policy Table
              </button>
              <button
                onClick={() => setActiveTab('powershell')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'powershell' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PowerShell (Windows)
              </button>
              <button
                onClick={() => setActiveTab('tc')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'tc' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Linux tc HTB
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center space-x-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add QoS Rule</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Policy Table */}
        {activeTab === 'table' && (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="table-header">Traffic Type</th>
                  <th className="table-header">Priority</th>
                  <th className="table-header">Bandwidth Allocation</th>
                  <th className="table-header">Queue Class</th>
                  <th className="table-header">DSCP Value</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="table-cell font-bold text-slate-900">
                      {p.trafficType}
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                        p.priority === 'Highest' 
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : p.priority === 'High'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.priority === 'Medium'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {p.priority}
                      </span>
                    </td>
                    <td className="table-cell font-mono font-medium text-slate-800">
                      {p.bandwidthAllocation}
                    </td>
                    <td className="table-cell font-mono text-slate-600 text-[11px]">
                      {p.queue}
                    </td>
                    <td className="table-cell font-mono font-semibold text-slate-800">
                      <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                        {p.dscpValue}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                        p.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${p.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {p.status}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        onClick={() => onTogglePolicy(p.id)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                          p.status === 'Active'
                            ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        {p.status === 'Active' ? 'Pause Rule' : 'Activate Rule'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: PowerShell script view */}
        {activeTab === 'powershell' && (
          <div className="mt-3 relative bg-slate-900 rounded p-4 border border-slate-800 font-mono text-xs text-slate-200">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Code className="w-4 h-4 text-blue-400" />
                <span>Windows Native PowerShell Script (NetQosPolicy)</span>
              </span>
              <button 
                onClick={() => handleCopy(psScript)}
                className="hover:text-white bg-slate-800 px-2 py-1 rounded border border-slate-700 flex items-center space-x-1 text-[11px]"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedScript ? 'Copied!' : 'Copy Script'}</span>
              </button>
            </div>
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400">{psScript}</pre>
          </div>
        )}

        {/* Tab 3: Linux tc HTB view */}
        {activeTab === 'tc' && (
          <div className="mt-3 relative bg-slate-900 rounded p-4 border border-slate-800 font-mono text-xs text-slate-200">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Linux Traffic Control (tc HTB) Commands</span>
              </span>
              <button 
                onClick={() => handleCopy(tcScript)}
                className="hover:text-white bg-slate-800 px-2 py-1 rounded border border-slate-700 flex items-center space-x-1 text-[11px]"
              >
                <Copy className="w-3 h-3" />
                <span>{copiedScript ? 'Copied!' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="overflow-x-auto text-[11px] leading-relaxed text-cyan-400">{tcScript}</pre>
          </div>
        )}
      </div>

      {/* Add Policy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded border border-gray-300 shadow-xl max-w-md w-full p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Create New QoS Policy Rule</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Traffic Type</label>
                <select 
                  value={newType} 
                  onChange={(e) => setNewType(e.target.value as TrafficClass)}
                  className="w-full bg-white border border-gray-300 rounded p-1.5 text-slate-800"
                >
                  <option value="Gaming">Gaming</option>
                  <option value="VoIP">VoIP</option>
                  <option value="Streaming">Streaming</option>
                  <option value="Background Download">Background Download</option>
                  <option value="Video Call">Video Call</option>
                  <option value="Web Browsing">Web Browsing</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                <select 
                  value={newPriority} 
                  onChange={(e) => setNewPriority(e.target.value as QoSPriority)}
                  className="w-full bg-white border border-gray-300 rounded p-1.5 text-slate-800"
                >
                  <option value="Highest">Highest</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Best Effort">Best Effort</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bandwidth Limit / Cap</label>
                <input 
                  type="text" 
                  value={newBandwidth} 
                  onChange={(e) => setNewBandwidth(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded p-1.5 text-slate-800 font-mono"
                  placeholder="e.g. 25 Mbps"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Queue Class</label>
                  <input 
                    type="text" 
                    value={newQueue} 
                    onChange={(e) => setNewQueue(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-1.5 text-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">DSCP Tag</label>
                  <input 
                    type="text" 
                    value={newDscp} 
                    onChange={(e) => setNewDscp(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded p-1.5 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded border border-gray-300 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-2xs"
                >
                  Apply & Deploy Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
