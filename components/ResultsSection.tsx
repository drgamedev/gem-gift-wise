import React, { useEffect, useState } from 'react';
import type { Gift } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface ResultsSectionProps {
  gifts: Gift[];
  isLoading: boolean;
  error: string | null;
}

const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg className={`w-4 h-4 ${filled ? 'text-yellow-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const Rating = ({ value }: { value: number }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < Math.round(value)} />)}
    </div>
);

const GiftCard = ({ gift, index }: { gift: Gift; index: number }) => {
    // FIX: Specify the element type for the ref to match the div element it's applied to.
    const [ref, isInView] = useScrollAnimation<HTMLDivElement>();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const affiliateTag = 'drgamedev-20';
    const amazonUrl = `https://www.amazon.com/s?k=${encodeURIComponent(gift.amazonSearchQuery)}&tag=${affiliateTag}`;

    // Use a hash of the product name for a consistent but random image
    const hash = gift.productName.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const imageId = Math.abs(hash % 1000);
    const imageUrl = `https://picsum.photos/id/${imageId}/400/300`;

    return (
        <div 
            ref={ref}
            className={`transition-all duration-700 ${isInView ? 'opacity-100 transform-gpu translate-y-0 scale-100' : 'opacity-0 transform-gpu translate-y-8 scale-95'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="bg-brand-navy/50 border border-white/10 rounded-xl overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-2xl hover:shadow-brand-cyan/20 hover:border-brand-cyan/50 transform hover:-translate-y-2">
                <div className="relative aspect-w-16 aspect-h-9">
                     <img 
                        src={imageUrl} 
                        alt={gift.productName} 
                        onLoad={() => setIsImageLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${isImageLoaded ? 'blur-0 scale-100' : 'blur-md scale-110'}`}
                    />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-brand-white flex-grow">{gift.productName}</h3>
                    <p className="text-sm text-brand-white/70 mt-2 font-light">"{gift.reason}"</p>
                    <div className="flex justify-between items-center mt-4">
                        <p className="text-xl font-bold text-brand-cyan">${gift.estimatedPrice.toFixed(2)}</p>
                        <Rating value={gift.rating} />
                    </div>
                    <a
                        href={amazonUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 w-full text-center px-4 py-2 font-semibold text-black bg-brand-cyan rounded-lg transition-all duration-300 hover:bg-white group-hover:bg-white transform hover:scale-105"
                    >
                        Buy on Amazon
                    </a>
                </div>
            </div>
        </div>
    );
};

const SkeletonCard = () => (
    <div className="bg-brand-navy/50 border border-white/10 rounded-xl overflow-hidden animate-pulse">
        <div className="bg-white/10 aspect-w-16 aspect-h-9"></div>
        <div className="p-5">
            <div className="h-6 bg-white/10 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-5/6 mb-4"></div>
            <div className="flex justify-between items-center mt-4">
                <div className="h-8 bg-white/10 rounded w-1/4"></div>
                <div className="h-5 bg-white/10 rounded w-1/3"></div>
            </div>
            <div className="h-10 bg-white/10 rounded-lg mt-5 w-full"></div>
        </div>
    </div>
);

export default function ResultsSection({ gifts, isLoading, error }: ResultsSectionProps) {
    const hasResults = gifts.length > 0;
    
    if (isLoading) {
        return (
            <section className="py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-10">Finding amazing gifts...</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                </div>
            </section>
        );
    }
    
    if (error) {
        return (
             <section className="py-20 text-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-5xl mb-4" role="img" aria-label="sad face">😟</p>
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Oops! Something went wrong.</h2>
                    <p className="text-brand-white/80">{error}</p>
                </div>
            </section>
        )
    }

    if (!hasResults && !isLoading) {
         return (
             <section className="py-20 text-center">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <p className="text-5xl mb-4" role="img" aria-label="crystal ball">🔮</p>
                    <h2 className="text-2xl font-bold text-brand-white/90 mb-2">Your crystal ball is empty.</h2>
                    <p className="text-brand-white/70">Enter some details above to find the perfect gift!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Here's What We Found...</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {gifts.map((gift, index) => (
                        <GiftCard key={index} gift={gift} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}