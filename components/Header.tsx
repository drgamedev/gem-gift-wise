
import React, { useState } from 'react';
import useHeaderScroll from '../hooks/useHeaderScroll';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);

export default function Header() {
  const { isVisible, isScrolled } = useHeaderScroll();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const navLinks = ['Home', 'Collections', 'Pricing', 'About'];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'bg-black/50 backdrop-blur-lg shadow-2xl shadow-brand-cyan/10' : ''}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl font-bold text-brand-white">
              <span role="img" aria-label="gift">🎁</span> GiftWise
            </a>
          </div>
          <nav className="hidden md:flex md:space-x-8">
            {navLinks.map((link) => (
              <a key={link} href="#" className="text-brand-white hover:text-brand-cyan transition-colors duration-200">{link}</a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full text-brand-white hover:text-brand-cyan hover:bg-white/10 transition-all">
                {isDarkMode ? <SunIcon/> : <MoonIcon/>}
            </button>
            <button className="hidden md:block px-4 py-2 text-sm font-medium text-brand-white bg-transparent border border-brand-white rounded-full hover:bg-brand-cyan hover:border-brand-cyan transition-all duration-300">
              Sign In
            </button>
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-brand-white hover:text-brand-cyan focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-cyan">
                    <MenuIcon />
                </button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
          <div className="md:hidden bg-black/80 backdrop-blur-lg">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navLinks.map(link => (
                      <a key={link} href="#" className="block px-3 py-2 rounded-md text-base font-medium text-brand-white hover:text-brand-cyan hover:bg-white/10">{link}</a>
                  ))}
                  <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-brand-white hover:text-brand-cyan hover:bg-white/10">Sign In</a>
              </div>
          </div>
      )}
    </header>
  );
}
