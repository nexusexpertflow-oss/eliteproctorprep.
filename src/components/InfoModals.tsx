import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle, Mail, MessageSquare, BookOpen, Send } from 'lucide-react';

interface InfoModalProps {
  type: 'mcqs' | 'blogs' | 'about' | 'contact' | null;
  onClose: () => void;
  onOpenPlans: () => void;
}

export const InfoModals: React.FC<InfoModalProps> = ({ type, onClose, onOpenPlans }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  if (!type) return null;

  const handleDownload = (title: string) => {
    setDownloadSuccess(title);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[88vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div className="flex items-center gap-2.5">
            {type === 'mcqs' && <FileText className="h-5 w-5 text-[#c4553a]" />}
            {type === 'blogs' && <BookOpen className="h-5 w-5 text-[#2d5a4a]" />}
            {type === 'about' && <BookOpen className="h-5 w-5 text-[#c4553a]" />}
            {type === 'contact' && <MessageSquare className="h-5 w-5 text-[#c4553a]" />}
            <h3 className="text-xl font-bold text-stone-900 font-serif">
              {type === 'mcqs' && 'High-Yield MCQs & PDF Study Guides'}
              {type === 'blogs' && 'Nursing Board Articles & Study Guides'}
              {type === 'about' && 'About EliteProctorPrep'}
              {type === 'contact' && 'Contact Support & Inquiries'}
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

        {/* Content based on type */}
        {type === 'mcqs' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Download curated, board-style question banks and printable review summaries created by nurse educators.
            </p>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>Downloading <strong>{downloadSuccess}</strong> PDF sample...</span>
              </div>
            )}

            <div className="space-y-3">
              {[
                { title: 'NCLEX-RN Pharmacology Must-Know 100 Drugs', pages: '28 Pages · PDF', questions: '150 Practice MCQs' },
                { title: 'Next Generation NCLEX (NGN) Clinical Case Studies', pages: '34 Pages · PDF', questions: '6 Unfolding Scenarios' },
                { title: 'ATI TEAS 7 Math & Science Quick Reference Packet', pages: '22 Pages · PDF', questions: '120 Practice MCQs' },
                { title: 'HESI A2 Anatomy & Physiology High-Yield Review', pages: '30 Pages · PDF', questions: '180 Practice MCQs' },
                { title: 'NCLEX-PN Prioritization & Delegation Flash Pack', pages: '18 Pages · PDF', questions: '90 Practice MCQs' },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50/50 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-xs sm:text-sm text-stone-900">{doc.title}</h4>
                    <p className="text-[11px] text-stone-500 mt-0.5">{doc.pages} &bull; {doc.questions}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownload(doc.title)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-stone-200 hover:bg-[#c4553a] hover:text-white hover:border-[#c4553a] text-stone-700 transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPlans();
                }}
                className="text-xs text-[#c4553a] font-semibold hover:underline"
              >
                Want unrestricted access to all 300K+ questions? View All Plans &rarr;
              </button>
            </div>
          </div>
        )}

        {type === 'blogs' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-stone-600">
              Expert advice, exam blueprints, and clinical reasoning strategies from nursing professors.
            </p>

            <div className="space-y-3">
              {[
                {
                  title: 'How to Master the Next Gen NCLEX (NGN) Extended Drag-and-Drop',
                  date: 'Updated March 2026',
                  tag: 'NCLEX-RN',
                  read: '6 min read',
                },
                {
                  title: 'Top 10 Pharmacology Drug Classes Most Frequently Tested on NCLEX & ATI',
                  date: 'February 2026',
                  tag: 'Pharmacology',
                  read: '8 min read',
                },
                {
                  title: 'The TEAS 7 Math Breakdown: Formulas, Ratios & Metric Conversions',
                  date: 'January 2026',
                  tag: 'ATI TEAS 7',
                  read: '5 min read',
                },
                {
                  title: 'HESI A2 vs. ATI TEAS: Which Nursing Entrance Exam Are You Taking?',
                  date: 'January 2026',
                  tag: 'Entry Exams',
                  read: '7 min read',
                },
              ].map((article, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-200 hover:border-stone-300 bg-white shadow-sm space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="font-semibold text-[#c4553a]">{article.tag}</span>
                    <span>&bull;</span>
                    <span>{article.date}</span>
                    <span>&bull;</span>
                    <span>{article.read}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-stone-900 hover:text-[#c4553a] transition-colors cursor-pointer">
                    {article.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'about' && (
          <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <p>
              <strong>EliteProctorPrep</strong> is a premier nursing exam preparation platform purpose-built to help nursing students bridge the gap between classroom theory and real licensure success.
            </p>
            <p>
              Unlike generic multi-topic study portals, EliteProctorPrep delivers specialized test tracks for <strong>NCLEX-RN, NCLEX-PN, ATI (RN & LPN), HESI (RN & LPN), and ATI TEAS 7</strong>. Each track mirrors the exact blueprints and clinical case scoring of current U.S. board standards.
            </p>
            <div className="grid grid-cols-3 gap-3 py-3 text-center">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <p className="text-xl font-bold text-[#c4553a] font-serif">50,000+</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Students Guided</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <p className="text-xl font-bold text-[#2d5a4a] font-serif">98%</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Verified Pass Rate</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <p className="text-xl font-bold text-[#e8a838] font-serif">300K+</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Board Questions</p>
              </div>
            </div>
            <p>
              Every question is written and audited by practicing Registered Nurses and nursing educators with in-depth rationales explaining why the right choice is right, why the distractors are wrong, and how to apply the principle at the bedside.
            </p>
          </div>
        )}

        {type === 'contact' && (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-stone-600">
              Have questions about your exam track or subscription? Our student support team is available 24/7.
            </p>

            {contactSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-stone-900 text-base">Message Received!</h4>
                <p className="text-xs text-stone-500">
                  Our academic support team will reply to your email within 2 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jordan Smith"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@nursing.edu"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Exam / Inquiring About
                  </label>
                  <select className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30">
                    <option>General Support / Billing</option>
                    <option>NCLEX-RN Track</option>
                    <option>NCLEX-PN Track</option>
                    <option>ATI TEAS 7 Track</option>
                    <option>HESI A2 Track</option>
                    <option>ATI / HESI Nursing School Exit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your inquiry..."
                    className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#c4553a] hover:bg-[#8b3a2f] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" /> Send Message
                </button>
              </form>
            )}

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <a
                href="mailto:eliteproctorprep@gmail.com"
                className="flex items-center gap-1.5 text-stone-600 hover:text-[#c4553a] transition-colors font-medium"
              >
                <Mail className="h-3.5 w-3.5 text-[#c4553a]" />
                eliteproctorprep@gmail.com
              </a>
              <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded-full">Response: &lt; 2 hrs</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
