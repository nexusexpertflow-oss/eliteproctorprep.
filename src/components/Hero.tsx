import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Library, Star, ChevronsDown, ShieldCheck, Award } from 'lucide-react';

interface HeroProps {
  onStartNow: () => void;
  onExploreExams: () => void;
  onOpenDashboard?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartNow, onExploreExams, onOpenDashboard }) => {
  const [students, setStudents] = useState(0);
  const [passRate, setPassRate] = useState(0);
  const [questions, setQuestions] = useState(0);
  const [rating, setRating] = useState('0.0');
  const cardRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            const duration = 1800;
            const startTime = performance.now();

            const step = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);

              setStudents(Math.round(50000 * eased));
              setPassRate(Math.round(98 * eased));
              setQuestions(Math.round(300000 * eased));
              setRating((4.9 * eased).toFixed(1));

              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                setStudents(50000);
                setPassRate(98);
                setQuestions(300000);
                setRating('4.9');
              }
            };
            requestAnimationFrame(step);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className="np-hero relative overflow-hidden bg-[#07152b] text-white">
      {/* Dynamic Animated Ambient Mesh Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#c4553a]/25 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-[#0A66C2]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-[#e8a838]/15 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-radial from-transparent via-[#07152b]/80 to-[#07152b]"></div>
      </div>

      <div className="np-hero-inner relative z-10">
        <div className="np-hero-grid items-center">
          {/* Left Column: Copy & Actions */}
          <div className="home-reveal">
            <p className="np-hero-eyebrow inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-stone-200 mb-4">
              <span className="flex -space-x-1.5 overflow-hidden" aria-hidden="true">
                <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 ring-2 ring-white/50 text-[9px] font-bold text-stone-900 flex items-center justify-center">
                  RN
                </span>
                <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 ring-2 ring-white/50 text-[9px] font-bold text-white flex items-center justify-center">
                  BSN
                </span>
                <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 ring-2 ring-white/50 text-[9px] font-bold text-white flex items-center justify-center">
                  LPN
                </span>
              </span>
              <span>Trusted by 50,000+ nursing candidates nationwide</span>
            </p>

            <p className="np-hero-brand font-serif tracking-widest text-xs uppercase text-[#e8a838] font-bold mb-2">
              EliteProctorPrep
            </p>

            <h1 className="np-hero-title text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif text-white leading-tight">
              Master Your Nursing Boards<br />
              <em className="text-[#e8a838] font-normal italic">With Clinical Precision</em>
            </h1>

            <p className="np-hero-lede text-stone-300 text-base sm:text-lg max-w-xl my-5 leading-relaxed">
              Board-vetted practice question banks, authentic Next Gen NCLEX case studies, and diagnostic scoring algorithms designed specifically for clinical reasoning and first-attempt licensure success.
            </p>

            <div className="np-hero-actions flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={onStartNow}
                className="px-6 py-3.5 rounded-xl bg-[#c4553a] hover:bg-[#8b3a2f] text-white font-semibold text-sm transition-all shadow-xl shadow-[#c4553a]/30 hover:shadow-[#c4553a]/50 flex items-center gap-2 cursor-pointer"
              >
                Start Free Diagnostic
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onExploreExams}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Library className="h-4 w-4 text-[#e8a838]" />
                Explore Exam Tracks
              </button>
            </div>

            <div className="np-hero-trust flex flex-wrap items-center gap-4 text-xs text-stone-300 mt-6 pt-4 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#e8a838]" /> Full Sample Questions Included
              </span>
              <span className="text-white/30 hidden sm:inline">&bull;</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> 100% Pass Guarantee
              </span>
              <span className="text-white/30 hidden sm:inline">&bull;</span>
              <span>24/7 Nurse Educator Support</span>
            </div>
          </div>

          {/* Right Column: Hero Graphic & Readiness Card */}
          <div className="np-hero-stats-column home-reveal relative flex flex-col items-center">
            {/* Custom High-Fidelity Generated Photo */}
            <div className="relative group mb-6">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#e8a838] to-[#c4553a] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <img
                src="/assets/images/hero_nursing_study.jpg"
                alt="Healthcare student studying at desk with medical textbooks and stethoscope"
                width="280"
                height="210"
                loading="eager"
                className="relative rounded-2xl shadow-2xl object-cover w-[260px] sm:w-[300px] h-[190px] sm:h-[220px] border border-white/20"
              />
            </div>

            {/* Readiness Card */}
            <div
              className="np-readiness-card w-full max-w-md bg-white border border-stone-200/90 p-6 rounded-2xl shadow-2xl text-stone-900"
              id="readiness-card"
              ref={cardRef}
            >
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#c4553a]">
                    Real-Time Readiness Metrics
                  </p>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
                    Live Validated
                  </span>
                </div>
                <h2 className="text-xl font-bold text-stone-900 font-serif mb-4 tracking-tight">
                  Predictive Board Pass Analytics
                </h2>

                <div className="np-readiness-grid grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 shadow-xs">
                    <p className="text-xl sm:text-2xl font-extrabold text-[#c4553a] font-serif">
                      <span className="counter tabular-nums">{students.toLocaleString()}</span>+
                    </p>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">Nurses Trained</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 shadow-xs">
                    <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-serif">
                      <span className="counter tabular-nums">{passRate}</span>%
                    </p>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">Verified Pass Rate</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 shadow-xs">
                    <p className="text-xl sm:text-2xl font-extrabold text-amber-700 font-serif">
                      <span className="counter tabular-nums">{questions.toLocaleString()}</span>+
                    </p>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">Clinical Items</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 shadow-xs">
                    <p className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif flex items-center gap-1.5">
                      <span className="counter-decimal tabular-nums">{rating}</span>
                      <Star className="np-star h-4 w-4 fill-amber-500 text-amber-500" />
                    </p>
                    <p className="text-xs text-stone-600 font-medium mt-0.5">Student Rating</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-200 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium border border-stone-200/90 shadow-2xs">
                    NCLEX-RN &bull; PN
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium border border-stone-200/90 shadow-2xs">
                    Next Gen NGN
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium border border-stone-200/90 shadow-2xs">
                    ATI Comprehensive
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium border border-stone-200/90 shadow-2xs">
                    HESI A2 &bull; Exit
                  </span>
                </div>

                {onOpenDashboard && (
                  <button
                    type="button"
                    onClick={onOpenDashboard}
                    className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#06152d] to-[#0d2a54] hover:from-[#0d2a54] hover:to-[#06152d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <span>Open Live Candidate Dashboard & Analytics</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#e8a838] group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Cue down */}
        <button
          type="button"
          onClick={onExploreExams}
          className="np-scroll-cue cursor-pointer bg-transparent border-0 mt-8 mx-auto flex items-center justify-center gap-1.5 text-stone-200 hover:text-white transition-colors text-xs font-bold tracking-wider uppercase"
        >
          <span>Explore curriculum</span>
          <ChevronsDown className="h-4 w-4 animate-bounce text-amber-400" />
        </button>
      </div>
    </section>
  );
};
