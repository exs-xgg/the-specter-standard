import React, { useState, useEffect } from 'react';
import { SectionTitle } from './Layout';
import { SavedQuote } from '../types';
import { Trash2, Share2, Quote, Copy } from 'lucide-react';

export const SavedQuotes: React.FC = () => {
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const loaded = localStorage.getItem('specter_saved_quotes');
    if (loaded) {
      try {
        setSavedQuotes(JSON.parse(loaded));
      } catch (e) {
        console.error("Failed to parse saved quotes", e);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    const updated = savedQuotes.filter(q => q.id !== id);
    setSavedQuotes(updated);
    localStorage.setItem('specter_saved_quotes', JSON.stringify(updated));
  };

  const handleShare = async (quote: SavedQuote) => {
    const text = `"${quote.text}" - Harvey Specter`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Specter Standard',
          text: text,
        });
      } catch (err) {
        // User cancelled or share failed
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
    <div className="w-full max-w-6xl flex flex-col items-center animate-fade-in-up">
      <SectionTitle title="The Vault" subtitle="Winning strategies on record" />

      {notification && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-6 py-3 text-sm font-bold uppercase tracking-widest sharp-shadow z-50">
          {notification}
        </div>
      )}

      {savedQuotes.length === 0 ? (
        <div className="text-center py-20 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <p className="font-serif text-3xl text-gray-300 italic mb-4">"Evidence is everything. You have none."</p>
          <p className="font-sans text-xs mt-4 uppercase tracking-[0.2em] font-bold text-gray-500">Start saving quotes to build your case.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-12">
          {savedQuotes.map((quote, idx) => (
            <div 
              key={quote.id} 
              className="bg-white border-2 border-black p-8 sharp-shadow-sm hover:sharp-shadow transition-all duration-300 flex flex-col justify-between group h-full min-h-[280px] relative"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="mb-6">
                <Quote className="w-8 h-8 text-gray-200 mb-4 fill-current transform group-hover:scale-110 transition-transform duration-500 origin-top-left" />
                <p className="font-serif text-xl leading-snug">
                  {quote.text}
                </p>
              </div>
              
              <div className="flex justify-between items-end border-t border-gray-100 pt-6 mt-auto">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {new Date(quote.savedAt).toLocaleDateString()}
                </span>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <button 
                    onClick={() => handleShare(quote)}
                    className="p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black"
                    title="Share Evidence"
                   >
                     {navigator.share ? <Share2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   </button>
                   <button 
                    onClick={() => handleDelete(quote.id)}
                    className="p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black"
                    title="Destroy Evidence"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};