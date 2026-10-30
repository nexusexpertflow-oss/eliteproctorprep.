import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Award,
  CheckCircle2,
  Mail,
  Send,
  Sparkles,
  PhoneCall,
  Activity,
  FileText,
  Calculator,
  Pill,
  LayoutDashboard,
  Shield,
} from 'lucide-react';

interface FooterProps {
  onOpenPlans: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
  onOpenMcqs: () => void;
  onOpenBlog: () => void;
  onOpenNgnSimulator: () => void;
  onOpenReadinessCalculator: () => void;
  onOpenPharmaDrill: () => void;
  onOpenLegal: (type: 'terms' | 'privacy' | 'guarantee') => void;
  onOpenDashboard?: () => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPlans,
  onOpenAbout,
  onOpenContact,
  onOpenSignIn,
  onOpenSignUp,
  onOpenMcqs,
  onOpenBlog,
  onOpenNgnSimulator,
  onOpenReadinessCalculator,
  onOpenPharmaDrill,
  onOpenLegal,
  onOpenDashboard,
  onOpenAdmin,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

  return (
    <footer className="bg-[#040c1a] text-white border-t border-white/10 mt-auto">
      {/* Top Value Banner / Newsletter Bar */}
      <div className="border-b border-white/10 bg-[#07152b] py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center lg:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#c4553a]/20 border border-[#c4553a]/40 flex items-center justify-center text-[#c4553a] shrink-0 hidden sm:flex">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Get Weekly High-Yield NCLEX Questions &amp; Mnemonics
              </h4>
              <p className="text-xs sm:text-sm text-stone-300">
                Join 50,000+ nursing candidates receiving our weekly board breakdown directly in their inbox.
              </p>
            </div>
          </div>

          {/* Subscription Form */}
          <div className="w-full lg:w-auto">
            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-4 py-2.5 rounded-xl">
                <CheckCircle2 className="h-4 w-4" />
                <span>You&apos;re subscribed! Welcome to the EliteProctorPrep study circle.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2 max-w-md w-full">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your student email..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-white placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c4553a] focus:bg-white/15 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#c4553a] hover:bg-[#8b3a2f] text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Send className="h-3.5 w-3.5" /> Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main 5-Column Grid */}
      <div className="max-w-7xl mx-auto py-14 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 shrink-0 cursor-pointer group"
              aria-label="EliteProctorPrep Home"
            >
              {/* Clean white badge that matches the official EliteProctorPrep header logo */}
              <div className="bg-white/95 hover:bg-white px-2.5 py-1 rounded-xl shadow-sm border border-amber-300/40 transition-all flex items-center gap-2">
                <img
                  src="/assets/favicon.png"
                  alt="EliteProctorPrep"
                  className="h-7 w-7 rounded-lg object-contain shrink-0"
                  width="28"
                  height="28"
                />
                <span className="font-bold text-[#071838] text-sm sm:text-base tracking-tight font-serif">
                  Elite<span className="text-[#c4553a]">Proctor</span>Prep
                </span>
              </div>
            </a>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              The premier nursing licensure and entrance exam preparation platform. Built specifically for how nurses learn: authentic case studies, high-yield rationales, and predictive test readiness.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 max-w-sm">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-stone-300">
                <ShieldCheck className="h-4 w-4 text-[#2d5a4a] shrink-0" />
                <span>NCSBN NGN Aligned</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-stone-300">
                <Award className="h-4 w-4 text-[#e8a838] shrink-0" />
                <span>98% Verified Pass Rate</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-stone-300">
                <Lock className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 text-[11px] text-stone-300">
                <CheckCircle2 className="h-4 w-4 text-[#c4553a] shrink-0" />
                <span>100% Pass Guarantee</span>
              </div>
            </div>
          </div>

          {/* Column 2: Exam Test Banks */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#e8a838] mb-4">
              Exam Test Banks
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <a
                  href="#exams"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  NCLEX-RN® QBank
                </a>
              </li>
              <li>
                <a
                  href="#exams"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  NCLEX-PN® QBank
                </a>
              </li>
              <li>
                <a
                  href="#exams"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  ATI® TEAS 7 Entrance Prep
                </a>
              </li>
              <li>
                <a
                  href="#exams"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  HESI® A2 Admission Test
                </a>
              </li>
              <li>
                <a
                  href="#exams"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  ATI® LPN &amp; RN Care Modules
                </a>
              </li>
              <li>
                <a
                  href="#exams"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  HESI® Exit Exam Simulator
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Interactive Study Tools */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#e8a838] mb-4">
              Interactive Tools
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-300">
              {onOpenDashboard && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenDashboard}
                    className="flex items-center gap-1.5 hover:text-white transition-colors text-left cursor-pointer font-semibold text-emerald-400"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Candidate Study Dashboard</span>
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={onOpenNgnSimulator}
                  className="flex items-center gap-1.5 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <Activity className="h-3.5 w-3.5 text-[#c4553a]" />
                  <span>NGN Case Study Simulator</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenReadinessCalculator}
                  className="flex items-center gap-1.5 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <Calculator className="h-3.5 w-3.5 text-[#2d5a4a]" />
                  <span>Pass Readiness Calculator</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPharmaDrill}
                  className="flex items-center gap-1.5 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <Pill className="h-3.5 w-3.5 text-[#e8a838]" />
                  <span>Pharmacology &amp; Antidotes</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenMcqs}
                  className="flex items-center gap-1.5 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-stone-300" />
                  <span>Downloadable PDF MCQs</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenBlog}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Clinical Reasoning Guides
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenPlans}
                  className="hover:text-white transition-colors text-left cursor-pointer font-medium text-[#c4553a]"
                >
                  Subscription Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Student Support & Guarantee */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#e8a838] mb-4">
              Support &amp; Community
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('guarantee')}
                  className="hover:text-white transition-colors text-left cursor-pointer font-medium text-emerald-400"
                >
                  100% Pass Guarantee Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  About Our Nurse Faculty
                </button>
              </li>
              <li>
                <a
                  href="mailto:eliteproctorprep@gmail.com"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-stone-200"
                >
                  <Mail className="h-3 w-3 text-[#e8a838]" />
                  <span>eliteproctorprep@gmail.com</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Contact Academic Support
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/447843982513?text=Hi%20EliteProctorPrep%2C%20I%20need%20help%20with%3A%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <PhoneCall className="h-3 w-3 text-[#25D366]" />
                  <span>24/7 WhatsApp Hotline</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Privacy &amp; Data Security
                </button>
              </li>
              {onOpenAdmin && (
                <li className="pt-1.5 border-t border-white/10">
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="hover:text-amber-300 transition-colors text-left cursor-pointer flex items-center gap-1.5 text-stone-400 text-[11px]"
                  >
                    <Shield className="h-3 w-3 text-amber-400" />
                    <span>Faculty &amp; Staff Access</span>
                  </button>
                </li>
              )}
            </ul>

            {/* Operational Status */}
            <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2 text-[11px] text-stone-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All QBank Systems Live</span>
            </div>
          </div>
        </div>

        {/* Social Network Circles */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-400 font-medium">Connect with us:</span>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:scale-110 transition-transform"
              aria-label="Instagram"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            {/* TikTok */}
            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:scale-110 transition-transform"
              aria-label="TikTok"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#000000">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="https://youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF0000] hover:scale-110 transition-transform"
              aria-label="YouTube"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="white">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A66C2] hover:scale-110 transition-transform"
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400">
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Use
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={() => onOpenLegal('guarantee')}
              className="hover:text-white transition-colors cursor-pointer text-emerald-400"
            >
              Pass Guarantee
            </button>
            <span>&bull;</span>
            <button
              type="button"
              onClick={onOpenContact}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Support Center
            </button>
          </div>
        </div>

        {/* Legal Disclaimer & Trademark Notice */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
          <p className="text-[11px] text-stone-500 leading-relaxed text-center sm:text-left">
            <strong>Trademark &amp; Regulatory Disclaimer:</strong> NCLEX-RN® and NCLEX-PN® are registered trademarks of the National Council of State Boards of Nursing, Inc. (NCSBN®). ATI® and TEAS® are registered trademarks of Assessment Technologies Institute, LLC. HESI® is a registered trademark of Elsevier Inc. EliteProctorPrep is an independent educational test preparation service and is not affiliated with, sponsored by, or endorsed by the NCSBN, ATI, or Elsevier.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
            <p>&copy; 2026 EliteProctorPrep &bull; All rights reserved.</p>
            <p>Designed for Healthcare &amp; Nursing Excellence.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
