import React, { useState } from 'react';
import Layout from './components/Layout';
import { AppRoute, TargetConfig, AttackGraphData, Vulnerability } from './types';
import Login from './pages/Login';
import TargetConfigPage from './pages/TargetConfig';
import AttackSurface from './pages/AttackSurface';
import DefenseToolkit from './pages/DefenseToolkit';
import AIChat from './pages/AIChat';

// Initial Mock State
const INITIAL_TARGET: TargetConfig = {
  domain: '',
  ipRange: '',
  techStack: [],
  mode: 'passive'
};

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.LOGIN);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Shared Data State
  const [targetConfig, setTargetConfig] = useState<TargetConfig>(INITIAL_TARGET);
  const [attackGraph, setAttackGraph] = useState<AttackGraphData | null>(null);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setRoute(AppRoute.CONFIG);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRoute(AppRoute.LOGIN);
    setTargetConfig(INITIAL_TARGET);
    setAttackGraph(null);
  };

  const renderPage = () => {
    switch (route) {
      case AppRoute.LOGIN:
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case AppRoute.CONFIG:
        return (
          <TargetConfigPage 
            config={targetConfig} 
            onSave={(cfg) => {
              setTargetConfig(cfg);
              setRoute(AppRoute.ATTACK_SURFACE);
            }} 
          />
        );
      case AppRoute.ATTACK_SURFACE:
        return (
          <AttackSurface 
            config={targetConfig}
            data={attackGraph}
            onGenerate={setAttackGraph}
          />
        );
      case AppRoute.DEFENSE:
        return <DefenseToolkit attackGraph={attackGraph} />;
      case AppRoute.CHAT:
        return <AIChat />;
      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <Layout 
      currentRoute={route} 
      onNavigate={(r) => {
        if (isAuthenticated) setRoute(r);
      }}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
