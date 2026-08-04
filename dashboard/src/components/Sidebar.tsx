import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Cpu, 
  Sliders, 
  Laptop, 
  BarChart3, 
  Bell, 
  Settings,
  ShieldAlert,
  Layers,
  ArrowRight
} from 'lucide-react';

export type TabType = 
  | 'dashboard' 
  | 'traffic' 
  | 'rf-model' 
  | 'qos' 
  | 'devices' 
  | 'analytics' 
  | 'alerts' 
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  alertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, alertsCount }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'traffic', label: 'Live Traffic', icon: Activity, badge: '38 flows' },
    { id: 'rf-model', label: 'Random Forest Model', icon: Cpu, badge: '96.4%' },
    { id: 'qos', label: 'QoS Controller', icon: Sliders, badge: 'Active' },
    { id: 'devices', label: 'Connected Devices', icon: Laptop, badge: '10' },
    { id: 'analytics', label: 'Traffic Analytics', icon: BarChart3 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: alertsCount > 0 ? `${alertsCount}` : undefined, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-3.5rem)] flex flex-col justify-between select-none">
      <div className="py-4">
        <div className="px-4 mb-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Navigation Menu
          </span>
        </div>
        
        <nav className="space-y-0.5 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                    item.badgeColor || (isActive ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Gateway Summary Box */}
      <div className="p-3 m-3 bg-slate-50 rounded border border-gray-200">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-700">Gateway Engine</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
        </div>
        <div className="space-y-1 text-[11px] font-mono text-slate-500">
          <div className="flex justify-between">
            <span>Sniffer Mode:</span>
            <span className="text-slate-800 font-semibold">Npcap / Scapy</span>
          </div>
          <div className="flex justify-between">
            <span>QoS Driver:</span>
            <span className="text-slate-800 font-semibold">NetQosPolicy</span>
          </div>
          <div className="flex justify-between">
            <span>MSS Clamping:</span>
            <span className="text-emerald-700 font-semibold">1300 Bytes</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-[10px] text-blue-600 font-medium">
          <span>Hackathon Testbed</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </aside>
  );
};
