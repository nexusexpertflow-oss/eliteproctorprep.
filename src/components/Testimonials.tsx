import React, { useState, useEffect, useRef } from 'react';
import { MessageCircleHeart, Star, ChevronLeft, ChevronRight, CheckCircle2, Award } from 'lucide-react';
import { TESTIMONIALS } from '../data/examsData';

export const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHoveredRef.current) {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const current = TESTIMONIALS[currentIndex];

  const getInitialsGradient = (index: number) => {
    const gradients = [
      'from-[#0c1a2e] to-[#1e3a63] text-amber-300',
      'from-[#2d5a4a] to-[#1b382d] text-emerald-200',
      'from-[#c4553a] to-[#8d3520] text-amber-100',
      'from-[#1e293b] to-[#334155] text-sky-200',
      'from-[#581c87] to-[#3b0764] text-purple-200',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#f3ede4]/40 via-[#f8f5ee] to-[#fffdf9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#e8a838]/15 text-[#946200] border border-[#e8a838]/30">
            <MessageCircleHeart className="h-3.5 w-3.5 text-[#e8a838]" /> Verified Graduate Outcomes
          </p>
          <div className="flex items-center justify-center gap-1 my-3 text-[#e8a838]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
            <span className="font-bold text-[#0c1a2e] ml-1.5 text-sm">4.9 / 5.0</span>
            <span className="text-sm text-stone-500">· 2,400+ Verified Licensure Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c1a2e] tracking-tight">
            Real Candidates. Real Clinical Board Results.
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
            Discover how candidates conquered testing anxiety, mastered Next Gen unfolding clinical judgment, and passed with EliteProctorPrep.
          </p>
        </div>

        {/* Testimonial Stage Carousel */}
        <div
          className="relative max-w-3xl mx-auto"
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-xl shadow-stone-200/50 min-h-[300px] flex items-center">
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Testimonial Content */}
            <div className="w-full px-4 sm:px-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Avatar Initials Badge */}
              <div className="shrink-0 flex flex-col items-center">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br ${getInitialsGradient(current.index)} flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-stone-100`}>
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-wider font-mono">
                    {current.initials}
                  </span>
                </div>
                <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Verified Pass
                </div>
              </div>

              {/* Copy */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-[#e8a838] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="text-xs font-semibold text-stone-500 ml-2 uppercase tracking-wider">
                    {current.specialty}
                  </span>
                </div>
                <blockquote className="text-stone-800 text-base sm:text-lg italic font-serif leading-relaxed mb-4">
                  {current.quote}
                </blockquote>
                <div>
                  <p className="font-extrabold text-[#0c1a2e] text-base flex items-center justify-center sm:justify-start gap-1.5">
                    <Award className="h-4 w-4 text-[#c4553a]" />
                    {current.name}
                  </p>
                  <p
                    className="text-xs sm:text-sm text-[#c4553a] font-medium mt-0.5"
                    dangerouslySetInnerHTML={{ __html: current.credential }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Student Selector Buttons Tablist */}
          <div
            className="flex items-center justify-center gap-2.5 mt-6"
            role="tablist"
            aria-label="Choose a student testimonial"
          >
            {TESTIMONIALS.map((item, idx) => (
              <button
                key={item.index}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center font-mono ${
                  currentIndex === idx
                    ? 'bg-[#c4553a] text-white scale-110 shadow-md shadow-[#c4553a]/30 ring-2 ring-[#c4553a]/20'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                }`}
                aria-label={item.name}
              >
                {item.initials}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
