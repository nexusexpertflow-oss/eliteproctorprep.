import React from 'react';
import { Activity, Calculator, Pill, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface InteractiveToolsBannerProps {
  onOpenNgnSimulator: () => void;
  onOpenReadinessCalculator: () => void;
  onOpenPharmaDrill: () => void;
  onOpenGuarantee: () => void;
}

export const InteractiveToolsBanner: React.FC<InteractiveToolsBannerProps> = ({
  onOpenNgnSimulator,
  onOpenReadinessCalculator,
  onOpenPharmaDrill,
  onOpenGuarantee,
}) => {
  const tools = [
    {
      title: 'Next Gen NCLEX (NGN) Simulator',
      badge: 'Interactive EHR',
      desc: 'Experience unfolding 6-step case studies with real electronic charts, vital signs, and lab profiles.',
      icon: Activity,
      color: 'text-[#c4553a]',
      bg: 'bg-rose-50/80 hover:bg-rose-50',
      border: 'border-rose-100 hover:border-[#c4553a]/40',
      action: onOpenNgnSimulator,
      buttonText: 'Launch NGN Case',
    },
    {
      title: 'Pass Readiness Predictor',
      badge: 'AI Diagnostic',
      desc: 'Calculate your exact statistical chance of passing based on questions completed and score latency.',
      icon: Calculator,
      color: 'text-[#2d5a4a]',
      bg: 'bg-emerald-50/80 hover:bg-emerald-50',
      border: 'border-emerald-100 hover:border-[#2d5a4a]/40',
      action: onOpenReadinessCalculator,
      buttonText: 'Calculate Score',
    },
    {
      title: 'High-Yield Pharmacology Drill',
      badge: 'Top 50 Drugs',
      desc: 'Master toxic lab ranges, critical black-box warnings, and emergency antidotes with flashcards.',
      icon: Pill,
      color: 'text-[#e8a838]',
      bg: 'bg-amber-50/80 hover:bg-amber-50',
      border: 'border-amber-100 hover:border-[#e8a838]/50',
      action: onOpenPharmaDrill,
      buttonText: 'Practice Meds',
    },
    {
      title: '100% Pass Guarantee',
      badge: 'Risk Free',
      desc: 'Score 65%+ on 80% of our test bank and pass your board exam on your first attempt, or get a full refund.',
      icon: ShieldCheck,
      color: 'text-[#071838]',
      bg: 'bg-blue-50/80 hover:bg-blue-50',
      border: 'border-blue-100 hover:border-blue-200',
      action: onOpenGuarantee,
      buttonText: 'View Guarantee',
    },
  ];

  return (
    <section className="py-14 bg-gradient-to-b from-[#faf7f2] to-[#f3ede4]/50 border-y border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c4553a] mb-1">
              <Sparkles className="h-3.5 w-3.5" /> High-Yield Clinical Tools
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
              Master Exam Day with Interactive Simulations
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md">
            Click any tool below to launch interactive test modes designed to sharpen your clinical decision-making.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tools.map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <div
                key={idx}
                onClick={tool.action}
                className={`p-5 rounded-2xl border ${tool.border} ${tool.bg} shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:shadow-md hover:-translate-y-0.5`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center ${tool.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-stone-600 border border-stone-200/60 shadow-2xs">
                      {tool.badge}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-stone-900 mb-1.5 group-hover:text-[#c4553a] transition-colors">
                    {tool.title}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed mb-4">
                    {tool.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/50 flex items-center justify-between text-xs font-semibold text-stone-800 group-hover:text-[#c4553a] transition-colors">
                  <span>{tool.buttonText}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
