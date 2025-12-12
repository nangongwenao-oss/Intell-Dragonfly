import React, { useEffect, useState } from 'react';
import { AttackGraphData, Vulnerability } from '../types';
import { generateDefenses } from '../services/geminiService';
import { ShieldCheck, CheckCircle, FileText, AlertTriangle, Loader } from 'lucide-react';

interface DefenseToolkitProps {
  attackGraph: AttackGraphData | null;
}

const DefenseToolkit: React.FC<DefenseToolkitProps> = ({ attackGraph }) => {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all');

  useEffect(() => {
    const fetchMitigation = async () => {
        if (attackGraph) {
            setLoading(true);
            const data = await generateDefenses(attackGraph);
            setVulnerabilities(data);
            setLoading(false);
        }
    };
    fetchMitigation();
  }, [attackGraph]);

  if (!attackGraph) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 opacity-50">
              <ShieldCheck size={48} className="mb-4 text-[#00FF41]" />
              <p>NO ATTACK DATA DETECTED.</p>
              <p className="text-xs mt-2">PLEASE RUN ATTACK SURFACE SIMULATION FIRST.</p>
          </div>
      );
  }

  const filteredVulns = vulnerabilities.filter(v => filter === 'all' || v.severity === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
         <h2 className="text-lg font-bold text-white flex items-center gap-2">
             <ShieldCheck className="text-[#00FF41]" /> 
             DEFENSE MATRIX
         </h2>
         <div className="flex gap-1 bg-black/40 p-1 rounded">
             {['all', 'high', 'medium'].map((f) => (
                 <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`text-[10px] px-3 py-1 rounded uppercase ${filter === f ? 'bg-[#00FF41] text-black font-bold' : 'text-gray-400 hover:text-white'}`}
                 >
                     {f}
                 </button>
             ))}
         </div>
      </div>

      {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
               <Loader className="animate-spin text-[#00FF41] mb-2" />
               <span className="text-xs text-[#00FF41] animate-pulse">GENERATING MITIGATION PROTOCOLS...</span>
           </div>
      ) : (
          <div className="space-y-4 pb-20">
              {filteredVulns.map((vuln) => (
                  <div key={vuln.id} className="glass-panel p-4 rounded-lg border-l-4 border-l-[#00FF41] relative group transition-all hover:bg-white/5">
                      {vuln.severity === 'high' && (
                          <div className="absolute top-2 right-2 text-[#FF6B6B]">
                              <AlertTriangle size={16} />
                          </div>
                      )}
                      
                      <div className="mb-3">
                          <div className="text-[#00FF41] font-bold text-lg">{vuln.cveId}</div>
                          <div className="text-white text-sm font-bold">{vuln.name}</div>
                          <div className="text-gray-400 text-xs mt-1">{vuln.description}</div>
                      </div>

                      <div className="space-y-2 mb-4">
                          <div className="text-[10px] uppercase text-[#00FF41]/70 font-bold">Recommended Actions (AI)</div>
                          {vuln.mitigation.map((step, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-200">
                                  <CheckCircle size={12} className="mt-0.5 text-[#00FF41]" />
                                  <span>{step}</span>
                              </div>
                          ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex gap-2">
                              {vuln.compliance.map((comp, i) => (
                                  <span key={i} className="text-[9px] px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-500/30">
                                      {comp}
                                  </span>
                              ))}
                          </div>
                          <button className="flex items-center gap-1 text-[10px] bg-[#00FF41]/10 text-[#00FF41] px-3 py-1.5 rounded hover:bg-[#00FF41] hover:text-black transition-colors">
                              <FileText size={12} /> TICKET
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default DefenseToolkit;
