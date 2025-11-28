import React, { useState, useEffect } from 'react';
import { generateHarveyQuote } from '../services/geminiService';
import { QuoteResponse, SavedQuote } from '../types';
import { SectionTitle, Loader } from './Layout';
import { RefreshCw, Bookmark, Check, Share2, Copy } from 'lucide-react';

export const QuoteGenerator: React.FC = () => {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchQuote = async (customTopic?: string) => {
    setLoading(true);
    setIsSaved(false);
    try {
      const result = await generateHarveyQuote(customTopic);
      setQuote(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = () => {
    if (!quote) return;
    
    const savedQuotes: SavedQuote[] = JSON.parse(localStorage.getItem('specter_saved_quotes') || '[]');
    
    // Simple check to avoid duplicates of the exact same text
    if (!savedQuotes.some(q => q.text === quote.text)) {
      const newSavedQuote: SavedQuote = {
        ...quote,
        id: crypto.randomUUID(),
        savedAt: Date.now()
      };
      
      localStorage.setItem('specter_saved_quotes', JSON.stringify([newSavedQuote, ...savedQuotes]));
      setIsSaved(true);
      showNotification("Evidence Filed");
    } else {
      setIsSaved(true);
      showNotification("Already in the Vault");
    }
  };

  const handleShare = async () => {
    if (!quote) return;
    const text = `"${quote.text}" - Harvey Specter`;
    
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
    <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in-up">
      <SectionTitle title="The Playbook" subtitle="Daily Wisdom from the best Closer in the city" />
      
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-widest sharp-shadow z-50 animate-fade-in">
          {notification}
        </div>
      )}

      <div className="w-full mb-10 flex flex-col md:flex-row gap-4 justify-center items-center">
        <input 
          type="text" 
          placeholder="Topic (e.g., Loyalty, Risk)..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="bg-transparent border-b-2 border-gray-300 focus:border-black outline-none px-4 py-2 font-serif text-xl w-full md:w-64 text-center md:text-left transition-colors placeholder:text-gray-300"
          onKeyDown={(e) => e.key === 'Enter' && fetchQuote(topic)}
        />
        <button 
          onClick={() => fetchQuote(topic)}
          className="bg-black text-white px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex items-center gap-2"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Generate Quote'}
        </button>
      </div>

      <div className="relative w-full p-8 md:p-20 border border-gray-200 bg-white sharp-shadow min-h-[300px] flex items-center justify-center">
        {loading ? (
          <Loader />
        ) : quote ? (
          <div className="text-center relative w-full">
            <span className="absolute -top-10 -left-4 md:-left-10 text-9xl text-gray-100 font-serif leading-none select-none">“</span>
            <p className="font-serif text-3xl md:text-5xl leading-tight text-black mb-10 relative z-10">
              {quote.text}
            </p>
            <div className="w-full h-px bg-gray-200 mb-6"></div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="font-bold text-sm tracking-widest uppercase">Harvey Specter</p>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Name Partner</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                   onClick={handleShare}
                   className="p-3 hover:bg-gray-100 rounded-full transition-colors group"
                   title="Share"
                >
                  {navigator.share ? <Share2 className="w-5 h-5 text-gray-400 group-hover:text-black" /> : <Copy className="w-5 h-5 text-gray-400 group-hover:text-black" />}
                </button>
                
                <button 
                   onClick={handleSave}
                   className={`p-3 rounded-full transition-all duration-300 group ${isSaved ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-400'}`}
                   title={isSaved ? "Saved" : "Save to Vault"}
                   disabled={isSaved}
                >
                  {isSaved ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5 group-hover:text-black" />}
                </button>

                <div className="w-px h-8 bg-gray-200 mx-2"></div>

                <button 
                   onClick={() => fetchQuote(topic)}
                   className="p-3 hover:bg-gray-100 rounded-full transition-colors group"
                   title="New Quote"
                >
                  <RefreshCw className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:rotate-180 transition-all duration-500" />
                </button>
              </div>
            </div>
          </div>
        ) : (
           <p className="text-gray-400 font-serif italic">Ready to close the deal?</p>
        )}
      </div>
    </div>
  );
};