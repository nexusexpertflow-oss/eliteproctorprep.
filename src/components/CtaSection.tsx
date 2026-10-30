import React from 'react';
import { Flame, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';

interface CtaSectionProps {
  onGetStarted: () => void;
}

export const CtaSection: React.FC<CtaSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="np-cta-section relative overflow-hidden py-28 text-center bg-[#07152b]">
      {/* Background Photography with Custom Generated Asset */}
      <div className="np-cta-bg absolute inset-0 z-0" aria-hidden="true">
        <img
          src="/assets/images/cta_nursing_graduate.jpg"
          alt="Healthcare graduate celebrating diploma in warm golden hour light"
          width="1920"
          height="800"
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Measured Scrim Overlay for WCAG AA readability */}
      <div
        className="np-cta-overlay absolute inset-0 bg-gradient-to-t from-[#07152b] via-[#07152b]/80 to-[#07152b]/60 backdrop-blur-[2px] z-10"
        aria-hidden="true"
      ></div>

      <div className="np-container np-cta-wrap relative z-20 max-w-3xl mx-auto px-4">
        <div className="np-cta-inner space-y-6">
          <p className="np-cta-eyebrow inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#e8a838] bg-black/50 border border-[#e8a838]/40 px-3.5 py-1.5 rounded-full shadow-lg">
            <Flame className="h-3.5 w-3.5 inline text-[#e8a838]" />
            Premier Nursing Board Preparation
          </p>

          <h2 className="np-cta-title text-3xl sm:text-5xl font-bold text-white tracking-tight font-serif leading-tight">
            Your Nursing Career Begins With Preparation
          </h2>

          <p className="np-cta-lede text-stone-200 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Join over 50,000 successful candidates who passed their boards on their very first attempt with EliteProctorPrep.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onGetStarted}
              className="np-cta-btn inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#c4553a] hover:bg-[#8b3a2f] text-white font-semibold text-base transition-all shadow-xl shadow-[#c4553a]/40 hover:shadow-[#c4553a]/60 hover:scale-102 cursor-pointer"
            >
              Begin Free Diagnostic Assessment
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="np-cta-fine flex flex-wrap items-center justify-center gap-5 text-xs text-stone-300 pt-4">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> Free Sample Questions Included
            </span>
            <span className="text-stone-400">&bull;</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#e8a838]" /> 100% Pass or Money-Back Guarantee
            </span>
            <span className="text-stone-400">&bull;</span>
            <span>24/7 Clinical Faculty Support</span>
          </div>
        </div>
      </div>
    </section>
  );
};
