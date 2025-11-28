import React, { useState } from 'react';
import { ViewState } from './types';
import { Container, Header, NavButton } from './components/Layout';
import { QuoteGenerator } from './components/QuoteGenerator';
import { AdviceGenerator } from './components/AdviceGenerator';
import { SavedQuotes } from './components/SavedQuotes';
import { Quote, Briefcase, Archive } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);

  const renderContent = () => {
    switch (view) {
      case ViewState.QUOTES:
        return <QuoteGenerator />;
      case ViewState.ADVICE:
        return <AdviceGenerator />;
      case ViewState.SAVED:
        return <SavedQuotes />;
      case ViewState.HOME:
      default:
        return (
          <div className="flex flex-col items-center justify-center gap-12 text-center animate-fade-in w-full">
            <div className="mb-4">
               <h1 className="font-serif text-6xl md:text-9xl font-bold mb-6 tracking-tighter">
                WINNING
               </h1>
               <p className="font-sans text-sm md:text-base tracking-[0.3em] uppercase font-bold text-gray-500">
                 is the only option
               </p>
            </div>
            
            <div className="w-16 h-1 bg-black mb-4"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl px-4">
              <NavButton 
                label="The Playbook" 
                onClick={() => setView(ViewState.QUOTES)}
                icon={<Quote className="w-4 h-4" />}
              />
              <NavButton 
                label="Consultation" 
                onClick={() => setView(ViewState.ADVICE)}
                icon={<Briefcase className="w-4 h-4" />}
              />
              <NavButton 
                label="The Vault" 
                onClick={() => setView(ViewState.SAVED)}
                icon={<Archive className="w-4 h-4" />}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Header currentView={view} onNavigate={setView} />
      <Container>
        {renderContent()}
      </Container>
      
      {/* Decorative background element - subtle grid */}
      <div 
        className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.03]"
        style={{
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
        }}
      ></div>
    </>
  );
};

export default App;