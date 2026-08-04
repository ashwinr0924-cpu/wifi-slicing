import React, { useState } from 'react';
import { AlertEvent } from '../types/network';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  ShieldAlert, 
  Search, 
  Filter, 
  Trash2,
  Sliders,
  Cpu,
  Laptop
} from 'lucide-react';

interface AlertsProps {
  alerts: AlertEvent[];
  onClearAlerts: () => void;
}

export const AlertsPanel: React.FC<AlertsProps> = ({ alerts, onClearAlerts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'critical':
        return <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-blue-600 shrink-0" />;
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return <span className="bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">Critical</span>;
      case 'warning':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">Warning</span>;
      case 'success':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">Success</span>;
      default:
        return <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase">Info</span>;
    }
  };

  const filteredAlerts = alerts.filter(a => {
    const matchesSearch = 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSev = severityFilter === 'ALL' || a.severity === severityFilter;

    return matchesSearch && matchesSev;
  });

  return (
    <div className="bg-white border border-gray-200 rounded shadow-xs p-4 space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-3">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            Real-Time Network Events & Security Alerts
          </h2>
          <span className="bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded font-semibold border border-slate-200">
            {filteredAlerts.length} Events Logged
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search alert log..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white border border-gray-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 w-44"
            />
          </div>

          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-hidden"
          >
            <option value="ALL">All Severities</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
            <option value="info">Info</option>
          </select>

          {/* Clear button */}
          <button
            onClick={onClearAlerts}
            className="text-slate-500 hover:text-red-600 p-1.5 rounded hover:bg-slate-100 border border-gray-200"
            title="Clear All Logged Alerts"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Events Stream */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No events match your current filter criteria.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div 
              key={alert.id}
              className="p-3 rounded border border-gray-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start space-x-3 text-xs"
            >
              {getSeverityIcon(alert.severity)}

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{alert.title}</span>
                    <span className="bg-slate-200/70 text-slate-700 text-[10px] font-mono px-1.5 py-0.2 rounded border border-slate-300">
                      {alert.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(alert.severity)}
                    <span className="font-mono text-[10px] text-slate-400">{alert.timestamp}</span>
                  </div>
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
