import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FilePlus, 
  History, 
  Settings, 
  Wheat, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'billing' | 'history' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'billing' | 'history' | 'settings') => void;
  onNewBill: () => void;
  businessName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onNewBill,
  businessName
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'డ్యాష్‌బోర్డ్', icon: LayoutDashboard },
    { id: 'billing', label: 'కొత్త బిల్లు', icon: FilePlus },
    { id: 'history', label: 'బిల్లుల చరిత్ర', icon: History },
    { id: 'settings', label: 'సెట్టింగ్‌లు', icon: Settings },
  ] as const;

  const handleTabClick = (id: typeof activeTab) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="bg-amber-500 text-slate-950 p-2 rounded-xl flex items-center justify-center font-bold shadow-sm">
              <Wheat className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg leading-tight tracking-wide text-amber-400">
                {businessName || 'రైస్ మిల్లు బిల్లింగ్'}
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">వరి మిల్లింగ్ & రశీదుల నిర్వాహకం</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Action */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => {
                onNewBill();
                setActiveTab('billing');
              }}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>+ కొత్త బిల్లు</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                onNewBill();
                setActiveTab('billing');
              }}
              className="bg-emerald-600 text-white p-2 rounded-xl"
              title="కొత్త బిల్లు"
            >
              <PlusCircle className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-base font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 z-40 px-2 py-1.5 flex justify-around items-center text-xs">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center py-1 px-3 rounded-xl ${
                isActive ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-400'
              }`}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              <span className="text-[11px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
