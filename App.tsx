import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ResultsSection from './components/ResultsSection';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { findGifts } from './services/geminiService';
import type { Gift, SearchParams } from './types';
import { GiftWiseError } from './types';

export default function App() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spotlightStyle, setSpotlightStyle] = useState({});
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setSpotlightStyle({
        background: `radial-gradient(600px at ${e.clientX}px ${e.clientY}px, rgba(10, 182, 188, 0.1), transparent 80%)`
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleFindGifts = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setGifts([]);
    
    // Smooth scroll to results section
    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const result = await findGifts(params);
      setGifts(result);
    } catch (err) {
      if (err instanceof GiftWiseError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-300" 
        style={spotlightStyle}
      />
      <div className="relative z-10">
        <Header onSignInClick={() => setIsAuthModalOpen(true)} />
        <main>
          <Hero onFindGifts={handleFindGifts} isLoading={isLoading} />
          <div ref={resultsRef}>
            <ResultsSection gifts={gifts} isLoading={isLoading} error={error} />
          </div>
        </main>
        <Footer />
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}