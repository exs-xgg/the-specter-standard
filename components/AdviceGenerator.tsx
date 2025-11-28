import React, { useState } from 'react';
import { generateHarveyAdvice } from '../services/geminiService';
import { AdviceResponse } from '../types';
import { SectionTitle, Loader } from './Layout';
import { Send, Shield, Zap, Share2, Copy } from 'lucide-react';

export const AdviceGenerator: React.FC = () => {
  const [situation, setSituation] = useState('');
  const [advice, setAdvice] = useState<AdviceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleGetAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) return;
    
    setLoading(true);
    try {
      const result = await generateHarveyAdvice(situation);
      setAdvice(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!advice) return;
    const text = `"${advice.advice}"\n\nStrategy: ${advice.strategy}\n- Harvey Specter`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Specter Standard',
          text: text,
        });
      } catch (err) {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      showNotification("Copied to clipboard");
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <SectionTitle title="Strategic Counsel" subtitle="What would Harvey do?" />

      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-widest sharp-shadow z-50 animate-fade-in">
          {notification}
        </div>
      )}

      <form onSubmit={handleGetAdvice} className="w-full mb-16 relative group">
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          placeholder="Describe your situation. Be brief. I haven't got all day."
          className="w-full bg-white border-2 border-black p-6 font-serif text-xl md:text-2xl placeholder:text-gray-300 outline-none focus:sharp-shadow transition-all duration-300 min-h-[150px] resize-none"
          disabled={loading}
        />
        <div className="absolute bottom-4 right-4">
           <button 
            type="submit"
            disabled={loading || !situation.trim()}
            className="bg-black text-white px-6 py-3 text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-all"
           >
             {loading ? 'Analysing...' : 'Get Advice'}
             {!loading && <Send className="w-3 h-3" />}
           </button>
        </div>
      </form>

      {loading && <Loader />}

      {!loading && advice && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
           <div className="bg-black text-white p-10 sharp-shadow flex flex-col justify-between min-h-[300px] relative group">
              <div>
                <div className="flex items-center justify-between mb-6 text-gray-400">
                   <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-widest">The Move</span>
                   </div>
                   <button 
                      onClick={handleShare}
                      className="p-2 hover:text-white text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Share Strategy"
                   >
                     {navigator.share ? <Share2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                   </button>
                </div>
                <p className="font-serif text-2xl md:text-3xl leading-relaxed">
                  "{advice.advice}"
                </p>
              </div>
              <div className="w-12 h-1 bg-white mt-8"></div>
           </div>

           <div className="bg-white border-2 border-black p-10 sharp-shadow-sm flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex items-center gap-3 mb-6 text-gray-500">
                   <Shield className="w-5 h-5" />
                   <span className="text-xs font-bold uppercase tracking-widest">The Strategy</span>
                </div>
                <p className="font-sans text-lg text-gray-800 leading-relaxed font-light">
                  {advice.strategy}
                </p>
              </div>
              <p className="text-right text-xs font-bold uppercase tracking-widest mt-8">
                Confidential
              </p>
           </div>
        </div>
      )}
    </div>
  );
};