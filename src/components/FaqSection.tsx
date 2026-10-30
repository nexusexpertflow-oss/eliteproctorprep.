import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Sparkles, MessageCircle, CheckCircle, Mail } from 'lucide-react';

interface FaqSectionProps {
  onOpenContact?: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenContact }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does EliteProctorPrep mirror the 2026 Next Generation NCLEX (NGN)?',
      a: 'Our test bank is built specifically around the NCSBN Clinical Judgment Measurement Model (NCJMM). You will encounter all new NGN item types including unfolding 6-part clinical case studies, extended multiple-response, drag-and-drop cloze tables, matrix grids, and highlight-in-text questions with authentic EHR tabs (Vitals, Lab Results, and Nurse Notes).',
    },
    {
      q: 'What is your 100% Pass Guarantee and how does it work?',
      a: 'If you complete at least 80% of your targeted exam test bank with an average practice score of 65% or higher and do not pass your official NCLEX, ATI, or HESI exam on your first attempt, we will refund 100% of your subscription fee or grant you free extended access until you pass. No hassle, no fine print.',
    },
    {
      q: 'Are the rationales written by real nursing professors and educators?',
      a: 'Yes. Every question is crafted and peer-reviewed by practicing Registered Nurses, Master’s-prepared nurse educators, and clinical specialists. Rationales don’t just state the correct answer—they break down the pathophysiology, explain why every distractor is incorrect, and provide high-yield "Clinical Pearls" for bedside practice.',
    },
    {
      q: 'Can I study on my phone, iPad, or laptop simultaneously?',
      a: 'Absolutely. EliteProctorPrep is fully cloud-synced and responsive across smartphones, tablets, and desktop computers. Your question history, notes, test streaks, and predicted readiness score update instantly across all your devices.',
    },
    {
      q: 'Can I switch my exam track if I transition from school exit exams to NCLEX?',
      a: 'Yes! Nursing students often take TEAS to enter school, HESI/ATI during their semesters, and NCLEX upon graduation. You can easily switch your active exam track or upgrade to a comprehensive bundle directly in your student settings without losing your previous study history.',
    },
    {
      q: 'How does the Predicted Pass Score determine when I am exam-ready?',
      a: 'Our adaptive readiness algorithm compares your accuracy, response latency, and subject-specific mastery against our dataset of over 50,000 nursing students who passed their official board exams. When your predicted pass likelihood reaches 92%+, you have a statistically validated probability of passing on test day.',
    },
    {
      q: 'What is included in the Free Trial?',
      a: 'The Free Trial gives you immediate access to sample practice questions across every core nursing subject (Pharmacology, Med-Surg, Fundamentals, Maternal Newborn, Anatomy, etc.), complete with full rationales and distractor breakdowns. No credit card is required to begin.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#f3ede4]/70 border-t border-stone-200/80 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-14">
          <p className="np-pill np-pill-sage inline-flex items-center gap-1.5 mb-2">
            <HelpCircle className="h-3.5 w-3.5" /> Frequently Asked Questions
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight font-serif mt-2">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
            Everything you need to know about preparing with EliteProctorPrep and passing your nursing board exams.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/70 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-stone-900 text-sm sm:text-base">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#c4553a] text-white rotate-180'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#fffdf9]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* High-Visibility Nurse Advisor Support Card */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/90 shadow-xl shadow-stone-900/5 relative overflow-hidden">
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2d5a4a] via-[#c4553a] to-[#e8a838]" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#2d5a4a] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <MessageCircle className="h-6 w-6 text-[#2d5a4a]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  24/7 Clinical Advisors On-Call
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 leading-snug">
                  Still have questions about your exam prep?
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-xl leading-relaxed">
                  Connect directly with our US Registered Nurse academic advisors. We will help you assess your readiness, choose the right exam track, and customize a study plan for first-attempt licensure.
                </p>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-[11px] text-stone-500 font-medium">
                  <span className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle className="h-3.5 w-3.5" /> Average response: Under 5 mins
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#c4553a]" /> 100% Free Consultation
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
              <a
                href="https://wa.me/447843982513?text=Hi%20EliteProctorPrep%2C%20I%20have%20a%20question%20about%20the%20prep%20program"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4 fill-white" />
                <span>Chat with an Advisor</span>
              </a>
              {onOpenContact && (
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="w-full sm:w-auto px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-stone-200"
                >
                  <Mail className="h-4 w-4 text-stone-600" />
                  <span>Send Inquiry</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
