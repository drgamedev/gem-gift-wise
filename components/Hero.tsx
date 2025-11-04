
import React, { useState } from 'react';
import type { SearchParams } from '../types';
import { INTERESTS, OCCASIONS, EXAMPLE_CHIPS } from '../constants';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface HeroProps {
  onFindGifts: (params: SearchParams) => void;
  isLoading: boolean;
}

const InterestChip = ({ interest, isSelected, onToggle }: { interest: string; isSelected: boolean; onToggle: () => void; }) => (
  <button
    onClick={onToggle}
    className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-300 ${
      isSelected
        ? 'bg-brand-cyan text-black border-brand-cyan'
        : 'bg-white/10 border-white/20 text-brand-white hover:bg-white/20 hover:border-white/40'
    }`}
  >
    {interest}
  </button>
);


export default function Hero({ onFindGifts, isLoading }: HeroProps) {
  const [recipient, setRecipient] = useState('');
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [budget, setBudget] = useState<[number, number]>([10, 200]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  const [ref, isInView] = useScrollAnimation();

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFindGifts({ recipient, occasion, budget, interests: selectedInterests });
  };
  
  const handleExampleChipClick = (example: string) => {
      setRecipient(example);
  }

  return (
    <section ref={ref} className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48 text-center overflow-hidden">
        <div className={`transition-all duration-1000 ${isInView ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-lg translate-y-10'}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-brand-white leading-tight">
                Can’t Think of a Gift? <br /> Let AI Read Their Mind <span role="img" aria-label="gift">🎁</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-brand-white/80">
                Describe who it’s for — AI finds the gifts that make them say "how did you know?"
            </p>
        </div>
        
        <form onSubmit={handleSubmit} className={`mt-12 max-w-4xl mx-auto bg-black/20 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl shadow-brand-cyan/10 transition-all duration-1000 delay-200 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                 <div className="space-y-6">
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Who is this gift for? (e.g., my girlfriend)"
                        required
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-brand-white placeholder-white/50 focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan outline-none transition-all"
                    />
                    <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-brand-white focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan outline-none transition-all appearance-none"
                        style={{ background: 'url(\'data:image/svg+xml;charset=UTF-8,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23F6F6F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"%3e%3cpolyline points="6 9 12 15 18 9"%3e%3c/polyline%3e%3c/svg%3e\') no-repeat right 1rem center/1.2em', backgroundBlendMode: 'darken', backgroundColor: 'rgba(255,255,255,0.05)' }}
                        >
                        {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                </div>
                <div className="space-y-4">
                     <div>
                        <label className="block text-left text-brand-white/80 mb-2">Budget: ${budget[0]} - ${budget[1]}</label>
                        <input
                            type="range"
                            min="10"
                            max="500"
                            value={budget[1]}
                            onChange={(e) => setBudget([budget[0], parseInt(e.target.value)])}
                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer range-lg accent-brand-cyan"
                        />
                    </div>
                    <div>
                        <p className="text-left text-brand-white/80 mb-2">Interests:</p>
                        <div className="flex flex-wrap gap-2">
                            {INTERESTS.map(interest => (
                                <InterestChip 
                                    key={interest} 
                                    interest={interest} 
                                    isSelected={selectedInterests.includes(interest)} 
                                    onToggle={() => handleInterestToggle(interest)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="mt-8 w-full md:w-auto inline-block px-12 py-4 text-lg font-bold text-black bg-brand-cyan rounded-full transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-brand-cyan/40 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
            >
                {isLoading ? 'Thinking...' : '✨ Find the Perfect Gift'}
            </button>
        </form>

        <div className={`mt-8 transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-sm text-brand-white/60 mb-2">Or try an example:</p>
            <div className="flex flex-wrap justify-center gap-2">
                {EXAMPLE_CHIPS.map((example, i) => (
                    <button key={i} onClick={() => handleExampleChipClick(example)} className="px-3 py-1.5 text-xs bg-white/10 border border-transparent rounded-full text-brand-white/80 hover:bg-white/20 hover:border-white/20 transition-all">
                        {example}
                    </button>
                ))}
            </div>
        </div>
    </section>
  );
}
