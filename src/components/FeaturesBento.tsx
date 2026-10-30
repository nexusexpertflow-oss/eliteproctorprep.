import React from 'react';
import { Sparkles, Brain, Activity, BookOpen, BarChart3, AlertTriangle, Layers } from 'lucide-react';

export const FeaturesBento: React.FC = () => {
  return (
    <section id="features" className="np-section np-features-section py-20 bg-[#faf7f2]">
      <div className="np-container">
        <div className="np-steps-header text-center mb-16">
          <p className="np-pill np-pill-honey inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Platform Capabilities
          </p>
          <h2 className="np-section-title text-3xl sm:text-4xl font-bold font-serif text-stone-900 mt-2">
            Engineered for Board Mastery
          </h2>
          <p className="np-section-lede mx-auto text-stone-600 max-w-xl text-sm sm:text-base mt-2">
            Everything you need to master clinical reasoning, pass on your first attempt, and excel at the bedside.
          </p>
        </div>

        <div className="np-features-bento grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Pathophysiology Rationales */}
          <article className="np-feature-card home-feature-card np-feature-span-1 bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-[#c4553a]/30 transition-all flex flex-col group">
            <div className="np-feature-img-wrap relative h-48 overflow-hidden bg-stone-100">
              <img
                src="/assets/images/nursing_stethoscope_textbooks.jpg"
                alt="Pathophysiology-Driven Rationales"
                width="400"
                height="176"
                loading="lazy"
                className="np-feature-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="np-feature-img-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-900 flex items-center gap-1.5 shadow-sm">
                <Brain className="h-3.5 w-3.5 text-[#c4553a]" /> Clinical Reasoning
              </div>
            </div>
            <div className="np-feature-body p-6 flex-1 flex flex-col justify-center">
              <h3 className="np-feature-title text-xl font-bold text-stone-900 mb-2 font-serif">
                Pathophysiology Rationales
              </h3>
              <p className="np-feature-desc text-stone-600 text-xs sm:text-sm leading-relaxed">
                Understand the underlying clinical mechanism behind every answer rather than memorizing isolated test questions.
              </p>
            </div>
          </article>

          {/* Card 2: Continuous Mastery Analytics */}
          <article className="np-feature-card home-feature-card np-feature-span-1 bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-[#c4553a]/30 transition-all flex flex-col group">
            <div className="np-feature-img-wrap relative h-48 overflow-hidden bg-stone-100">
              <img
                src="/assets/images/exam_clinical_prep.jpg"
                alt="Real-Time Mastery Analytics"
                width="400"
                height="176"
                loading="lazy"
                className="np-feature-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="np-feature-img-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-900 flex items-center gap-1.5 shadow-sm">
                <BarChart3 className="h-3.5 w-3.5 text-[#2d5a4a]" /> Diagnostic Scoring
              </div>
            </div>
            <div className="np-feature-body p-6 flex-1 flex flex-col justify-center">
              <h3 className="np-feature-title text-xl font-bold text-stone-900 mb-2 font-serif">
                Real-Time Mastery Analytics
              </h3>
              <p className="np-feature-desc text-stone-600 text-xs sm:text-sm leading-relaxed">
                Track retention across clinical categories, identify pharmacology gaps, and benchmark progress against peer cohorts.
              </p>
            </div>
          </article>

          {/* Card 3: 300K+ Board-Vetted Questions */}
          <article className="np-feature-card home-feature-card np-feature-span-1 bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-[#c4553a]/30 transition-all flex flex-col group">
            <div className="np-feature-img-wrap relative h-48 overflow-hidden bg-stone-100">
              <img
                src="/assets/images/hero_nursing_study.jpg"
                alt="300K+ Clinical Items"
                width="400"
                height="224"
                loading="lazy"
                className="np-feature-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="np-feature-img-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-900 flex items-center gap-1.5 shadow-sm">
                <BookOpen className="h-3.5 w-3.5 text-[#e8a838]" /> Faculty Vetted
              </div>
            </div>
            <div className="np-feature-body p-6 flex-1 flex flex-col justify-center">
              <h3 className="np-feature-title text-xl font-bold text-stone-900 mb-2 font-serif">
                300,000+ Clinical Questions
              </h3>
              <p className="np-feature-desc text-stone-600 text-xs sm:text-sm leading-relaxed">
                Curated and continually audited by practicing Registered Nurses and Master’s-prepared nurse educators across every test blueprint.
              </p>
            </div>
          </article>

          {/* Card 4: Predicted Pass Score */}
          <article className="np-feature-card home-feature-card np-feature-span-1 bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-[#c4553a]/30 transition-all flex flex-col group">
            <div className="np-feature-img-wrap relative h-48 overflow-hidden bg-stone-100">
              <img
                src="/assets/images/clinical_nurse_mentor.jpg"
                alt="Predicted Pass Score"
                width="400"
                height="176"
                loading="lazy"
                className="np-feature-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="np-feature-img-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-900 flex items-center gap-1.5 shadow-sm">
                <Activity className="h-3.5 w-3.5 text-emerald-600" /> Statistical Accuracy
              </div>
            </div>
            <div className="np-feature-body p-6 flex-1 flex flex-col justify-center">
              <h3 className="np-feature-title text-xl font-bold text-stone-900 mb-2 font-serif">
                AI Pass Likelihood Engine
              </h3>
              <p className="np-feature-desc text-stone-600 text-xs sm:text-sm leading-relaxed">
                Know with mathematical clarity when you are exam-ready based on historical score correlation from 50,000+ passed students.
              </p>
            </div>
          </article>

          {/* Card 5: Distractor Breakdown */}
          <article className="np-feature-card home-feature-card np-feature-span-1 bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-[#c4553a]/30 transition-all flex flex-col group">
            <div className="np-feature-img-wrap relative h-48 overflow-hidden bg-stone-100">
              <img
                src="/assets/images/exam_clinical_prep.jpg"
                alt="Distractor Breakdown"
                width="400"
                height="176"
                loading="lazy"
                className="np-feature-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="np-feature-img-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-900 flex items-center gap-1.5 shadow-sm">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Test-Maker Logic
              </div>
            </div>
            <div className="np-feature-body p-6 flex-1 flex flex-col justify-center">
              <h3 className="np-feature-title text-xl font-bold text-stone-900 mb-2 font-serif">
                Distractor Elimination Logic
              </h3>
              <p className="np-feature-desc text-stone-600 text-xs sm:text-sm leading-relaxed">
                Decode test-writer psychology by learning exactly why seductive wrong answers are traps and how to avoid them.
              </p>
            </div>
          </article>

          {/* Card 6: Next Gen NCLEX Simulations */}
          <article className="np-feature-card home-feature-card np-feature-span-1 bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-[#c4553a]/30 transition-all flex flex-col group">
            <div className="np-feature-img-wrap relative h-48 overflow-hidden bg-stone-100">
              <img
                src="/assets/images/cta_nursing_graduate.jpg"
                alt="Next Gen NCLEX Simulations"
                width="400"
                height="176"
                loading="lazy"
                className="np-feature-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="np-feature-img-overlay absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-semibold text-stone-900 flex items-center gap-1.5 shadow-sm">
                <Layers className="h-3.5 w-3.5 text-blue-500" /> NGN Software Mirror
              </div>
            </div>
            <div className="np-feature-body p-6 flex-1 flex flex-col justify-center">
              <h3 className="np-feature-title text-xl font-bold text-stone-900 mb-2 font-serif">
                Full-Length Board Simulations
              </h3>
              <p className="np-feature-desc text-stone-600 text-xs sm:text-sm leading-relaxed">
                Timed, computerized adaptive exams that replicate the interface, pacing, and stress of the official testing center.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
