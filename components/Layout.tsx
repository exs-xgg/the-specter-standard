import React from 'react';
import { ViewState } from '../types';
import { Briefcase, MessageSquareQuote, ArrowLeft } from 'lucide-react';

interface NavButtonProps {
  label: string;
  isActive?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const NavButton: React.FC<NavButtonProps> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`
      relative group flex items-center justify-center gap-3 px-8 py-4 text-sm tracking-widest uppercase font-bold transition-all duration-300 border-2
      ${isActive 
        ? 'bg-black text-white border-black sharp-shadow' 
        : 'bg-transparent text-black border-black hover:bg-black hover:text-white hover:sharp-shadow-sm'}
    `}
  >
    {icon}
    {label}
  </button>
);

export const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 md:p-12 max-w-7xl mx-auto">
    {children}
  </div>
);

export const Header: React.FC<{ 
  currentView: ViewState, 
  onNavigate: (view: ViewState) => void 
}> = ({ currentView, onNavigate }) => (
  <header className="fixed top-0 left-0 w-full p-6 md:p-10 flex justify-between items-center z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
    <div 
      className="font-serif text-2xl md:text-3xl font-bold tracking-tighter cursor-pointer select-none"
      onClick={() => onNavigate(ViewState.HOME)}
    >
      THE<span className="text-gray-400 mx-1">/</span>SPECTER<span className="text-gray-400 mx-1">/</span>STANDARD
    </div>
    
    {currentView !== ViewState.HOME && (
       <button 
         onClick={() => onNavigate(ViewState.HOME)}
         className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:underline"
       >
         <ArrowLeft className="w-4 h-4" />
         Return to Lobby
       </button>
    )}
  </header>
);

export const SectionTitle: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="mb-12 text-center">
    <h2 className="font-serif text-5xl md:text-7xl font-bold mb-4 text-black leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="font-sans text-gray-500 uppercase tracking-widest text-sm font-bold">
        {subtitle}
      </p>
    )}
    <div className="w-24 h-1 bg-black mx-auto mt-8"></div>
  </div>
);

export const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
    <div className="w-16 h-16 border-4 border-black border-t-transparent animate-spin rounded-full"></div>
    <p className="font-serif italic text-lg text-gray-400">Consulting the name partner...</p>
  </div>
);