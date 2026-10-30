import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, AlertCircle, Loader2, FileText, Sparkles, Eye } from 'lucide-react';
import { sendClinicalReportEmail, ScoreReportEmailPayload, generateScoreReportHtml } from '../services/resendService';

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: {
    examTrack: string;
    subjectTitle?: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    passProbability?: number;
    candidateName?: string;
    userEmail?: string | null;
  };
}

export const EmailReportModal: React.FC<EmailReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  const [email, setEmail] = useState<string>(reportData.userEmail || '');
  const [candidateName, setCandidateName] = useState<string>(reportData.candidateName || '');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid recipient email address.' });
      return;
    }

    setIsSending(true);
    setStatusMessage(null);

    const payload: ScoreReportEmailPayload = {
      email,
      candidateName: candidateName.trim() || 'Candidate',
      examTrack: reportData.examTrack,
      subjectTitle: reportData.subjectTitle || 'Clinical Diagnostic Review',
      score: reportData.score,
      totalQuestions: reportData.totalQuestions,
      percentage: reportData.percentage,
      passProbability: reportData.passProbability || Math.min(99, Math.round(reportData.percentage * 0.95 + 10)),
    };

    const res = await sendClinicalReportEmail(payload);
    setIsSending(false);

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: res.message || `Diagnostic score report sent to ${email}`,
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: res.message || 'Unable to deliver email via Resend. Check API key configuration.',
      });
    }
  };

  const previewHtml = generateScoreReportHtml({
    email: email || 'student@example.com',
    candidateName: candidateName || 'Candidate',
    examTrack: reportData.examTrack,
    subjectTitle: reportData.subjectTitle || 'Clinical Diagnostic Review',
    score: reportData.score,
    totalQuestions: reportData.totalQuestions,
    percentage: reportData.percentage,
    passProbability: reportData.passProbability,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-[#c4553a] flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#c4553a] bg-[#c4553a]/10 px-2 py-0.5 rounded-full">
                Resend Email Dispatch
              </span>
              <h3 className="text-lg font-bold text-stone-900 font-serif">
                Email Clinical Score Report
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch: Form vs HTML Email Preview */}
        <div className="flex items-center gap-2 mt-4 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'form' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Mail className="h-3.5 w-3.5" /> Dispatch Form
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preview' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Eye className="h-3.5 w-3.5" /> HTML Email Preview
          </button>
        </div>

        {/* Summary Pill */}
        <div className="mt-4 p-3.5 bg-stone-50 border border-stone-200/80 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <span className="text-stone-500 font-medium">Exam &amp; Subject: </span>
            <span className="font-bold text-stone-800">{reportData.examTrack}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-500">Score:</span>
            <span className="font-bold text-[#c4553a] bg-white px-2 py-0.5 rounded border border-stone-200">
              {reportData.score} / {reportData.totalQuestions} ({reportData.percentage}%)
            </span>
          </div>
        </div>

        {activeTab === 'form' ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Recipient Email Address <span className="text-[#c4553a]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. candidate@nursing.edu"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Candidate Name (Optional)
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Alex Morgan, BSN"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30"
              />
            </div>

            {/* Status message */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                )}
                <div className="leading-relaxed">{statusMessage.text}</div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-5 py-2.5 rounded-xl bg-[#c4553a] hover:bg-[#8b3a2f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-[#c4553a]/20 disabled:opacity-50 cursor-pointer transition-all"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Dispatching with Resend...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send Verified Report
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Live HTML Email Preview */
          <div className="mt-4 flex-1">
            <div className="text-[11px] text-stone-500 mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-500" /> Exact HTML layout delivered to student email:
            </div>
            <div className="border border-stone-200 rounded-xl overflow-hidden max-h-[380px] overflow-y-auto bg-stone-50 p-2">
              <iframe
                title="Email Preview"
                srcDoc={previewHtml}
                className="w-full h-[450px] border-0 rounded bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
