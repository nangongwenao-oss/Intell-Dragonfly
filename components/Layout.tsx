import React from 'react';
import { AppRoute } from '../types';
import MatrixRain from './MatrixRain';
import { LayoutDashboard, ShieldAlert, Zap, MessageSquare, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRoute, onNavigate, onLogout }) => {
  const isLogin = currentRoute === AppRoute.LOGIN;

  const NavItem = ({ route, icon: Icon, label }: { route: AppRoute, icon: any, label: string }) => {
    const active = currentRoute === route;
    return (
      <button
        onClick={() => onNavigate(route)}
        className={`flex flex-col items-center justify-center p-2 w-full transition-all duration-300 ${
          active ? 'text-[#00FF41] bg-[#00FF41]/10 border-t-2 border-[#00FF41]' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        <Icon size={20} className={active ? 'drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]' : ''} />
        <span className="text-[10px] mt-1 font-bold uppercase tracking-wider">{label}</span>
      </button>
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col bg-[#051A1A]">
      <MatrixRain />
      
      {/* Header (Hidden on Login) */}
      {!isLogin && (
        <header className="glass-panel z-20 flex justify-between items-center px-4 py-3 sticky top-0">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse"></div>
             <h1 className="text-xl font-bold tracking-widest text-white">INTELL_<span className="text-[#00FF41]">DRAGONFLY</span></h1>
          </div>
          <button onClick={onLogout} className="text-[#FF6B6B] hover:text-red-400">
            <LogOut size={18} />
          </button>
        </header>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 pb-24">
        {children}
      </main>

      {/* Bottom Navigation (Hidden on Login) */}
      {!isLogin && (
        <nav className="fixed bottom-0 left-0 w-full glass-panel z-50 flex justify-between items-center backdrop-blur-xl border-t border-[#00FF41]/30">
          <NavItem route={AppRoute.CONFIG} icon={LayoutDashboard} label="Target" />
          <NavItem route={AppRoute.ATTACK_SURFACE} icon={Zap} label="Attack" />
          <NavItem route={AppRoute.DEFENSE} icon={ShieldAlert} label="Defense" />
          <NavItem route={AppRoute.CHAT} icon={MessageSquare} label="AI Expert" />
        </nav>
      )}
    </div>
  );
};

export default Layout;
