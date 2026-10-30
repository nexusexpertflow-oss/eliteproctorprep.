import React from 'react';
import { Route } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '1',
      kicker: 'Phase 1',
      title: 'Target Your Exam Blueprint',
      desc: 'Select your specific licensure track: NCLEX-RN, NCLEX-PN, ATI TEAS 7, or HESI A2, calibrated to the official 2026 test outline.',
      img: '/assets/images/hero_nursing_study.jpg',
      isEven: true,
    },
    {
      num: '2',
      kicker: 'Phase 2',
      title: 'Master Core Clinical Domains',
      desc: 'Focus high-yield study blocks on Pharmacology, Medical-Surgical Nursing, Prioritization & Delegation, and Pathophysiology.',
      img: '/assets/images/nursing_stethoscope_textbooks.jpg',
      isEven: false,
    },
    {
      num: '3',
      kicker: 'Phase 3',
      title: 'Simulate Real Test-Day EHRs',
      desc: 'Train with authentic Next Gen NCLEX unfolding cases, clinical vitals flowsheets, and multi-tier decision matrix questions.',
      img: '/assets/images/exam_clinical_prep.jpg',
      isEven: true,
    },
    {
      num: '4',
      kicker: 'Phase 4',
      title: 'Cement Clinical Judgement',
      desc: 'Every question provides in-depth faculty rationales, distractor elimination tips, and bedside clinical pearls so concepts stick.',
      img: '/assets/images/clinical_nurse_mentor.jpg',
      isEven: false,
    },
  ];

  return (
    <section className="np-section np-steps-section py-20 bg-[#f3ede4]/60">
      <div className="np-container">
        <div className="np-steps-header text-center mb-16">
          <p className="np-pill np-pill-sage inline-flex items-center gap-1.5">
            <Route className="h-3.5 w-3.5" /> Study Methodology
          </p>
          <h2 className="np-section-title text-3xl sm:text-4xl font-bold font-serif text-stone-900 mt-2">
            The Pathway to First-Attempt Licensure
          </h2>
          <p className="np-section-lede mx-auto text-stone-600 max-w-xl text-sm sm:text-base mt-2">
            A structured four-phase clinical learning architecture built to transform exam anxiety into confident diagnostic decision-making.
          </p>
        </div>

        <div className="np-steps-zigzag space-y-12 sm:space-y-16">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`np-step-row flex flex-col ${
                step.isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-8 lg:gap-16 relative`}
            >
              {/* Connector line for large screens */}
              <div className="np-step-connector hidden lg:block" aria-hidden="true"></div>

              {/* Step Photo */}
              <div className="np-step-photo-wrap relative w-full lg:w-1/2 flex justify-center">
                <div className="relative group overflow-hidden rounded-2xl shadow-xl border border-stone-200/80 bg-white">
                  <img
                    src={step.img}
                    alt={step.title}
                    width="500"
                    height="375"
                    loading="lazy"
                    className="np-step-photo w-full max-w-[460px] h-[260px] sm:h-[300px] object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <span className="np-step-badge absolute top-4 left-4 w-9 h-9 rounded-full bg-[#c4553a] text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {step.num}
                  </span>
                </div>
              </div>

              {/* Step Copy */}
              <div className="np-step-copy w-full lg:w-1/2 text-center lg:text-left">
                <div className="np-step-label flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <span className="np-step-watermark font-serif text-5xl font-bold text-[#c4553a]/15 select-none leading-none">
                    {step.num}
                  </span>
                  <span className="np-step-kicker text-xs font-bold uppercase tracking-wider text-[#c4553a]">
                    {step.kicker}
                  </span>
                </div>
                <h3 className="np-step-title text-2xl sm:text-3xl font-bold text-stone-900 mb-3 tracking-tight font-serif">
                  {step.title}
                </h3>
                <p className="np-step-desc text-stone-600 text-sm sm:text-base max-w-md mx-auto lg:mx-0 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
