import React, { useState } from 'react';
import { TargetConfig } from '../types';
import { Target, Server, Globe, Cpu, Play } from 'lucide-react';

interface TargetConfigProps {
  config: TargetConfig;
  onSave: (config: TargetConfig) => void;
}

const COMMON_STACKS = ['Nginx', 'Apache', 'Spring Boot', 'Kubernetes', 'Docker', 'React', 'PHP', 'MySQL', 'Redis', 'AWS'];

const TargetConfigPage: React.FC<TargetConfigProps> = ({ config, onSave }) => {
  const [domain, setDomain] = useState(config.domain);
  const [ipRange, setIpRange] = useState(config.ipRange);
  const [selectedStack, setSelectedStack] = useState<string[]>(config.techStack);
  const [mode, setMode] = useState<'passive' | 'deep'>(config.mode);

  const toggleStack = (tech: string) => {
    if (selectedStack.includes(tech)) {
      setSelectedStack(selectedStack.filter(t => t !== tech));
    } else {
      setSelectedStack([...selectedStack, tech]);
    }
  };

  const handleSave = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    onSave({
      domain,
      ipRange,
      techStack: selectedStack,
      mode
    });
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center gap-2 mb-6">
        <Target className="text-[#00FF41]" size={24} />
        <h2 className="text-xl font-bold text-white tracking-wider">TARGET ACQUISITION</h2>
      </div>

      <div className="glass-panel p-6 rounded-lg space-y-6">
        {/* Domain Input */}
        <div className="space-y-2">
          <label className="text-xs text-[#00FF41] uppercase font-bold flex items-center gap-2">
            <Globe size={14} /> Target Domain
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="w-full bg-black/40 border border-[#00FF41]/30 text-white p-3 rounded focus:border-[#00FF41] outline-none font-mono placeholder-gray-600"
            placeholder="e.g., target-corp.com"
          />
        </div>

        {/* IP Range */}
        <div className="space-y-2">
          <label className="text-xs text-[#00FF41] uppercase font-bold flex items-center gap-2">
            <Server size={14} /> IP Scope / CIDR
          </label>
          <input
            type="text"
            value={ipRange}
            onChange={(e) => setIpRange(e.target.value)}
            className="w-full bg-black/40 border border-[#00FF41]/30 text-white p-3 rounded focus:border-[#00FF41] outline-none font-mono placeholder-gray-600"
            placeholder="e.g., 192.168.1.0/24"
          />
        </div>

        {/* Tech Stack Tags */}
        <div className="space-y-3">
          <label className="text-xs text-[#00FF41] uppercase font-bold flex items-center gap-2">
            <Cpu size={14} /> Detected Technologies
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_STACKS.map(tech => (
              <button
                key={tech}
                onClick={() => toggleStack(tech)}
                className={`px-3 py-1.5 text-xs font-mono border rounded transition-all ${
                  selectedStack.includes(tech)
                    ? 'bg-[#00FF41] text-black border-[#00FF41] font-bold shadow-[0_0_10px_rgba(0,255,65,0.4)]'
                    : 'bg-transparent text-[#00FF41] border-[#00FF41]/30 hover:border-[#00FF41]'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Scan Mode */}
        <div className="space-y-3 pt-2 border-t border-[#00FF41]/20">
          <label className="text-xs text-[#00FF41] uppercase font-bold">Reconnaissance Mode</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('passive')}
              className={`p-3 rounded border text-center text-xs transition-all ${
                mode === 'passive'
                  ? 'bg-[#00FF41]/20 border-[#00FF41] text-white shadow-[inset_0_0_10px_rgba(0,255,65,0.2)]'
                  : 'border-transparent bg-black/20 text-gray-400'
              }`}
            >
              PASSIVE SCOUT
              <div className="text-[9px] opacity-60 mt-1">OSINT & Public Records</div>
            </button>
            <button
              onClick={() => setMode('deep')}
              className={`p-3 rounded border text-center text-xs transition-all ${
                mode === 'deep'
                  ? 'bg-[#FF6B6B]/20 border-[#FF6B6B] text-white shadow-[inset_0_0_10px_rgba(255,107,107,0.2)]'
                  : 'border-transparent bg-black/20 text-gray-400'
              }`}
            >
              DEEP PENETRATION
              <div className="text-[9px] opacity-60 mt-1">Active Port Scan & Fuzzing</div>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 left-0 w-full px-4 z-30">
        <button
          onClick={handleSave}
          className="w-full glass-panel bg-[#00FF41]/10 border-[#00FF41] text-[#00FF41] py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#00FF41] hover:text-black transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,65,0.2)]"
        >
          <Play size={18} fill="currentColor" />
          Initialize Analysis
        </button>
      </div>
    </div>
  );
};

export default TargetConfigPage;
