import React, { useState } from 'react';
import { TargetConfig, AttackGraphData } from '../types';
import { generateAttackSurface } from '../services/geminiService';
import { Zap, Activity, AlertOctagon, Share2, PlayCircle, Loader } from 'lucide-react';

interface AttackSurfaceProps {
  config: TargetConfig;
  data: AttackGraphData | null;
  onGenerate: (data: AttackGraphData) => void;
}

const AttackSurface: React.FC<AttackSurfaceProps> = ({ config, data, onGenerate }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    if (navigator.vibrate) navigator.vibrate(50);
    
    // Call Gemini Service
    const result = await generateAttackSurface(config.domain, config.techStack);
    
    setLoading(false);
    onGenerate(result);
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
  };

  // Helper to draw the graph
  const renderGraph = () => {
    if (!data) return null;

    // Normalize coordinates to SVG viewbox 0 0 300 500
    // Assuming data.nodes x is -100 to 100, y is 0 to 500.
    // SVG center x is 150.
    const getNodePos = (node: any) => ({
      x: node.x + 150, 
      y: node.y
    });

    return (
      <svg className="w-full h-[500px] overflow-visible" viewBox="0 0 300 500">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="20" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#00FF41" opacity="0.6" />
          </marker>
        </defs>

        {/* Links */}
        {data.links.map((link, i) => {
          const sourceNode = data.nodes.find(n => n.id === link.source);
          const targetNode = data.nodes.find(n => n.id === link.target);
          if (!sourceNode || !targetNode) return null;
          
          const start = getNodePos(sourceNode);
          const end = getNodePos(targetNode);

          return (
            <g key={i}>
              <path 
                d={`M${start.x},${start.y} C${start.x},${(start.y+end.y)/2} ${end.x},${(start.y+end.y)/2} ${end.x},${end.y}`}
                fill="none" 
                stroke="#00FF41" 
                strokeWidth="1.5" 
                strokeOpacity="0.4"
                markerEnd="url(#arrowhead)"
                className="animate-[pulse_2s_infinite]"
              />
              <text x={(start.x+end.x)/2} y={(start.y+end.y)/2} fill="#00FF41" fontSize="8" opacity="0.7" textAnchor="middle">
                  {link.method}
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {data.nodes.map((node) => {
            const pos = getNodePos(node);
            const isCritical = node.type === 'vuln' && node.riskScore > 7;
            const color = isCritical ? '#FF6B6B' : '#00FF41';
            
            return (
              <g key={node.id} className="cursor-pointer group">
                <circle 
                  cx={pos.x} 
                  cy={pos.y} 
                  r="6" 
                  fill="#051A1A" 
                  stroke={color} 
                  strokeWidth="2"
                  className={isCritical ? 'animate-pulse' : ''}
                />
                {/* Glow effect for hover */}
                <circle cx={pos.x} cy={pos.y} r="12" fill={color} opacity="0" className="group-hover:opacity-20 transition-opacity" />
                
                <text x={pos.x + 10} y={pos.y + 4} fill={color} fontSize="10" fontWeight="bold" className="drop-shadow-md">
                   {node.label}
                </text>
                <text x={pos.x + 10} y={pos.y + 14} fill={color} fontSize="7" opacity="0.7">
                   RISK: {node.riskScore}/10
                </text>
              </g>
            )
        })}
      </svg>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header Status */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Activity className="text-[#00FF41] animate-pulse" size={18} />
          <span className="text-xs font-bold text-[#00FF41]">AIGC ENGINE: {loading ? 'PROCESSING...' : 'ONLINE'}</span>
        </div>
        <div className="text-[10px] text-gray-400">
           {config.domain || 'NO TARGET'}
        </div>
      </div>

      {/* Main Graph Area */}
      <div className="flex-1 glass-panel rounded-lg relative overflow-hidden flex items-center justify-center min-h-[400px]">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 opacity-10" 
             style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {loading ? (
            <div className="flex flex-col items-center justify-center z-10">
                <Loader className="animate-spin text-[#00FF41] mb-4" size={48} />
                <div className="text-[#00FF41] font-mono text-sm typewriter">SIMULATING THREAT MODEL...</div>
                <div className="text-[#00FF41]/50 text-xs mt-2">Correlating vulnerabilities...</div>
            </div>
        ) : !data ? (
            <div className="z-10 text-center">
                <button 
                  onClick={handleGenerate}
                  className="w-24 h-24 rounded-full border-2 border-[#00FF41] flex items-center justify-center bg-[#00FF41]/10 hover:bg-[#00FF41]/20 hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,255,65,0.3)] group"
                >
                    <PlayCircle size={40} className="text-[#00FF41] group-hover:drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]" />
                </button>
                <p className="mt-4 text-[#00FF41] text-sm tracking-widest">START SIMULATION</p>
            </div>
        ) : (
            <div className="w-full h-full p-4 overflow-auto z-10 relative">
               {renderGraph()}
            </div>
        )}
      </div>

      {/* Metrics Cards */}
      {data && !loading && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="glass-panel p-3 rounded flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-400 uppercase">Total Risk</span>
            <span className={`text-xl font-bold ${data.totalRiskScore > 70 ? 'text-[#FF6B6B]' : 'text-[#00FF41]'}`}>
              {data.totalRiskScore}
            </span>
          </div>
          <div className="glass-panel p-3 rounded flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-400 uppercase">Paths</span>
            <div className="flex items-center gap-1">
               <Share2 size={12} className="text-[#00FF41]" />
               <span className="text-xl font-bold text-white">{data.pathCount}</span>
            </div>
          </div>
          <div className="glass-panel p-3 rounded flex flex-col items-center justify-center border-red-500/30 bg-red-900/10">
            <span className="text-[10px] text-red-400 uppercase">Crit CVE</span>
            <div className="flex items-center gap-1">
               <AlertOctagon size={12} className="text-[#FF6B6B]" />
               <span className="text-[10px] font-bold text-[#FF6B6B] truncate w-full text-center">{data.criticalCve}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttackSurface;
