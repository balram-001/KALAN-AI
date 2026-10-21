import React from 'react';
import { LayoutDashboard, AlertCircle, CheckCircle2, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Conflicts', icon: AlertCircle },
    { name: 'Resolution Log', icon: CheckCircle2 },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shrink-0">
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-200">
            <span className="text-lg font-bold">⚡</span>
          </div>
          <div>
            <h1 className="font-semibold text-slate-900 leading-tight">CRM Handoff Monitor</h1>
            <span className="text-xs text-slate-400 font-medium">HubSpot ↔ Salesforce</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};