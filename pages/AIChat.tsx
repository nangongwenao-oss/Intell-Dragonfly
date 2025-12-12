import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { chatWithExpert } from '../services/geminiService';
import { Send, Bot, User, Terminal } from 'lucide-react';

const SUGGESTIONS = [
  "Explain the critical path in the graph",
  "How do I patch CVE-2021-44228?",
  "What is the risk of exposed RDP?"
];

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      role: 'model',
      text: "INTELL_DRAGONFLY SECURITY EXPERT ONLINE. AWAITING QUERY.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    if (navigator.vibrate) navigator.vibrate(20);

    // Prepare history for API
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    const responseText = await chatWithExpert(text, history);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 p-2 border-b border-[#00FF41]/20">
         <Bot className="text-[#00FF41]" />
         <span className="text-sm font-bold tracking-wider">SECURE CHANNEL // ENCRYPTED</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#00FF41] text-black' : 'bg-[#051A1A] border border-[#00FF41] text-[#00FF41]'}`}>
               {msg.role === 'user' ? <User size={16} /> : <Terminal size={16} />}
            </div>
            <div className={`p-3 rounded-lg max-w-[80%] text-xs font-mono leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-[#00FF41]/20 text-white rounded-tr-none' 
                : 'bg-black/40 border border-[#00FF41]/20 text-[#00FF41] rounded-tl-none shadow-[0_0_10px_rgba(0,0,0,0.5)]'
            }`}>
               {/* Basic formatting for technical terms */}
               {msg.text.split(/(\bCVE-\d{4}-\d{4,}\b|\bT\d{4}\b)/g).map((part, i) => 
                 part.match(/^(CVE-|T\d{4})/) ? <span key={i} className="bg-[#00FF41]/20 px-1 rounded font-bold text-white border border-[#00FF41]/40 mx-0.5">{part}</span> : part
               )}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex gap-3">
               <div className="w-8 h-8 border border-[#00FF41] rounded flex items-center justify-center bg-[#051A1A]">
                   <Terminal size={16} className="text-[#00FF41]" />
               </div>
               <div className="p-3 bg-black/40 border border-[#00FF41]/20 rounded-lg rounded-tl-none">
                   <span className="text-[#00FF41] animate-pulse">ANALYZING...</span>
               </div>
           </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-4 space-y-3">
         {/* Quick Suggestions */}
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
             {SUGGESTIONS.map(s => (
                 <button 
                    key={s} 
                    onClick={() => handleSend(s)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full border border-[#00FF41]/30 bg-[#00FF41]/5 text-[#00FF41] text-[10px] hover:bg-[#00FF41]/20 transition-colors"
                 >
                     {s}
                 </button>
             ))}
         </div>

         <div className="relative">
             <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query knowledge base..."
                className="w-full bg-black/60 border border-[#00FF41]/50 text-white pl-4 pr-12 py-3 rounded-lg focus:outline-none focus:shadow-[0_0_15px_rgba(0,255,65,0.2)] font-mono text-sm"
             />
             <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 p-1.5 bg-[#00FF41] text-black rounded hover:bg-[#00CC33] disabled:opacity-50 transition-colors"
             >
                 <Send size={16} />
             </button>
         </div>
      </div>
    </div>
  );
};

export default AIChat;
