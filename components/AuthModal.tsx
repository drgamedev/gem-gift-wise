import React, { useState, useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here.
    // For this demo, we'll just close the modal.
    console.log("Form submitted");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in-up animation-duration-300" role="dialog" aria-modal="true" onClick={onClose}>
      <div 
        className="bg-brand-white dark:bg-brand-navy border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl shadow-brand-cyan/20 w-full max-w-md m-4 transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="p-8 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-brand-navy/50 dark:text-brand-white/50 hover:bg-black/10 dark:hover:bg-white/10 transition-colors" aria-label="Close">
            <CloseIcon />
          </button>
          
          <div className="flex mb-6 border-b border-black/10 dark:border-white/10">
            <button onClick={() => setIsSignUp(false)} className={`flex-1 py-3 text-lg font-semibold transition-colors ${!isSignUp ? 'text-brand-cyan border-b-2 border-brand-cyan' : 'text-brand-navy/60 dark:text-brand-white/60 hover:text-brand-navy dark:hover:text-brand-white'}`}>
              Sign In
            </button>
            <button onClick={() => setIsSignUp(true)} className={`flex-1 py-3 text-lg font-semibold transition-colors ${isSignUp ? 'text-brand-cyan border-b-2 border-brand-cyan' : 'text-brand-navy/60 dark:text-brand-white/60 hover:text-brand-navy dark:hover:text-brand-white'}`}>
              Sign Up
            </button>
          </div>

          <h2 className="text-2xl font-bold text-center text-brand-navy dark:text-brand-white mb-2">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-center text-brand-navy/70 dark:text-brand-white/70 mb-6">
            {isSignUp ? 'Get your own gift-finding workspace.' : 'Sign in to access your collections.'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <input type="text" placeholder="Full Name" required className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/20 rounded-lg px-4 py-3 text-brand-navy dark:text-brand-white placeholder-brand-navy/50 dark:placeholder-white/50 focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan outline-none transition-all" />
            )}
            <input type="email" placeholder="Email Address" required className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/20 rounded-lg px-4 py-3 text-brand-navy dark:text-brand-white placeholder-brand-navy/50 dark:placeholder-white/50 focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan outline-none transition-all" />
            <input type="password" placeholder="Password" required className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/20 rounded-lg px-4 py-3 text-brand-navy dark:text-brand-white placeholder-brand-navy/50 dark:placeholder-white/50 focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan outline-none transition-all" />

            <button type="submit" className="w-full mt-2 px-8 py-3 text-lg font-bold text-black bg-brand-cyan rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-brand-cyan/30 transform hover:scale-105">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}