import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

export default function Footer() {
  const [ref, isInView] = useScrollAnimation();

  return (
    <footer ref={ref} className={`border-t border-black/10 dark:border-white/10 mt-20 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-sm text-brand-navy/50 dark:text-brand-white/50">
          <p className="mb-4">
            As an Amazon Associate, we earn from qualifying purchases. All product links are affiliate links.
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-brand-cyan transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-cyan transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-cyan transition-colors">Contact Us</a>
          </div>
          <p>&copy; {new Date().getFullYear()} GiftWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}