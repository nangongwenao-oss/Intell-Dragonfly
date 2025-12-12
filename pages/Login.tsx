import React, { useState } from 'react';
import { Lock, User, AlertTriangle, Fingerprint } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('luoyuan881105');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Haptic Feedback simulation
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(() => {
      if (username === 'luoyuan881105' && password === '123456') {
        onLoginSuccess();
      } else {
        setError('ACCESS DENIED: INVALID CREDENTIALS');
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
      
      <div className="mb-8 text-center animate-pulse">
         <Fingerprint size={64} className="text-[#00FF41] mx-auto mb-4 drop-shadow-[0_0_15px_rgba(0,255,65,0.6)]" />
         <h2 className="text-2xl font-bold tracking-widest text-white">SYSTEM <span className="text-[#00FF41]">LOCKED</span></h2>
         <p className="text-xs text-[#00FF41]/70 mt-2">RESTRICTED AREA // AUTHORIZED PERSONNEL ONLY</p>
      </div>

      <div className="glass-panel w-full max-w-sm p-8 rounded-xl border border-[#00FF41]/30 relative overflow-hidden">
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00FF41]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00FF41]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00FF41]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00FF41]"></div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-[#00FF41] font-bold uppercase tracking-wider">Agent ID</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-[#00FF41]/50" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-[#00FF41]/30 text-[#00FF41] p-2.5 pl-10 rounded focus:outline-none focus:border-[#00FF41] focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all font-mono"
                placeholder="ENTER ID"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-[#00FF41] font-bold uppercase tracking-wider">Passcode</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-[#00FF41]/50" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-[#00FF41]/30 text-[#00FF41] p-2.5 pl-10 rounded focus:outline-none focus:border-[#00FF41] focus:shadow-[0_0_10px_rgba(0,255,65,0.2)] transition-all font-mono"
                placeholder="••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/50 text-[#FF6B6B] text-xs rounded">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-black bg-[#00FF41] hover:bg-[#00CC33] transition-all rounded shadow-[0_0_15px_rgba(0,255,65,0.4)] relative overflow-hidden group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="animate-pulse">AUTHENTICATING...</span>
            ) : (
              <>
                <span>INITIATE SESSION</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 text-[10px] text-[#00FF41]/40 text-center">
        SECURE CONNECTION ESTABLISHED<br />
        ENCRYPTION: AES-256-GCM
      </div>
    </div>
  );
};

export default Login;
