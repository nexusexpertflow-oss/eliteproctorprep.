import React from 'react';
import { X, ShieldCheck, FileCheck, Lock } from 'lucide-react';

interface LegalModalsProps {
  type: 'terms' | 'privacy' | 'guarantee' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
          <div className="flex items-center gap-2">
            {type === 'guarantee' && <ShieldCheck className="h-5 w-5 text-[#2d5a4a]" />}
            {type === 'terms' && <FileCheck className="h-5 w-5 text-[#c4553a]" />}
            {type === 'privacy' && <Lock className="h-5 w-5 text-[#071838]" />}
            <h3 className="text-xl font-bold text-stone-900 font-serif">
              {type === 'guarantee' && '100% Pass or Money-Back Guarantee Policy'}
              {type === 'terms' && 'Terms of Service & Student Agreement'}
              {type === 'privacy' && 'Privacy Policy & Student Data Protection'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
          {type === 'guarantee' && (
            <>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 font-medium">
                We stand behind our question banks and expert rationales. If you prepare diligently with EliteProctorPrep and do not pass your official exam, you receive a full refund or free extended access.
              </div>
              <h4 className="font-bold text-stone-900 text-base">Eligibility Requirements:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                <li>Subscribe to any 90-Day or 180-Day plan prior to taking your exam.</li>
                <li>Complete at least 80% of unique questions in your target test bank.</li>
                <li>Achieve an overall cumulative practice score of 65% or higher.</li>
                <li>Take your official exam within 30 days of subscription expiration.</li>
              </ul>
              <h4 className="font-bold text-stone-900 text-base">How to Claim:</h4>
              <p>
                Simply submit your official Candidate Performance Report (CPR) or official test score transcript to <a href="mailto:eliteproctorprep@gmail.com" className="text-[#c4553a] underline font-semibold">eliteproctorprep@gmail.com</a> within 30 days of receiving your exam results. We will process your choice of a 100% refund or an immediate free account extension within 2 business days.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                <strong>Last Updated: January 2026</strong>. By accessing or using EliteProctorPrep (&quot;the Platform&quot;), you agree to be bound by these Terms of Service.
              </p>
              <h4 className="font-bold text-stone-900">1. Educational Purpose Only</h4>
              <p>
                The materials, questions, rationales, and case studies on EliteProctorPrep are designed solely for educational test preparation and clinical knowledge reinforcement. They do not constitute formal medical or nursing licensure certifications.
              </p>
              <h4 className="font-bold text-stone-900">2. Intellectual Property &amp; Non-Sharing</h4>
              <p>
                All test items, clinical diagrams, rationales, and simulation workflows are proprietary intellectual property of EliteProctorPrep. Accounts are single-user only; sharing credentials or distributing copyrighted question materials is strictly prohibited.
              </p>
              <h4 className="font-bold text-stone-900">3. Subscription &amp; Cancellation</h4>
              <p>
                Access is granted immediately upon payment for the duration chosen (30, 90, or 180 days). You may cancel renewal at any time directly through your account dashboard.
              </p>
            </>
          )}

          {type === 'privacy' && (
            <>
              <p>
                <strong>Last Updated: January 2026</strong>. At EliteProctorPrep, student privacy and integrity are paramount.
              </p>
              <h4 className="font-bold text-stone-900">1. Information We Collect</h4>
              <p>
                We collect your email address, name, and question response history solely to track test progress, calculate predicted pass readiness, and tailor clinical reviews to your specific weak areas.
              </p>
              <h4 className="font-bold text-stone-900">2. Zero Sale of Student Data</h4>
              <p>
                We do not sell, rent, or monetize personal student data or test performance metrics to third-party advertisers or recruitment agencies.
              </p>
              <h4 className="font-bold text-stone-900">3. Security Encryption</h4>
              <p>
                All account sessions, passwords, and billing information are secured using industry-standard TLS 1.3 / 256-bit SSL encryption.
              </p>
            </>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
