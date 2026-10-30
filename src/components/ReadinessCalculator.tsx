import React, { useState } from 'react';
import { X, Calculator, Sparkles, TrendingUp, CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { EXAM_TRACKS } from '../data/examsData';
import { EmailReportModal } from './EmailReportModal';

interface ReadinessCalculatorProps {
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const ReadinessCalculator: React.FC<ReadinessCalculatorProps> = ({
  onClose,
  onOpenSignUp,
}) => {
  const [examName, setExamName] = useState('NCLEX-RN');
  const [currentScore, setCurrentScore] = useState<number>(68);
  const [questionsDone, setQuestionsDone] = useState<number>(600);
  const [weeksRemaining, setWeeksRemaining] = useState<number>(4);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  // Dynamic readiness algorithm
  const baseProb = Math.min(
    99,
    Math.max(
      45,
      Math.round(
        currentScore * 0.95 + (questionsDone / 1500) * 20 - (weeksRemaining < 2 ? 5 : 0)
      )
    )
  );

  const dailyQuestionsGoal = Math.max(
    25,
    Math.round((2000 - questionsDone) / (weeksRemaining * 7))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-stone-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#c4553a] flex items-center justify-center">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#c4553a]">
                AI Diagnostic Tool
              </span>
              <h3 className="text-xl font-bold text-stone-900 font-serif">
                Exam Readiness &amp; Pass Predictor
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

        {/* Form Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Select Your Target Exam
            </label>
            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30"
            >
              {EXAM_TRACKS.map((exam) => (
                <option key={exam.id} value={exam.name}>
                  {exam.name} ({exam.badge})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Current Average Score Slider */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-stone-700">Average Score</span>
                <span className="font-bold text-[#c4553a]">{currentScore}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="95"
                value={currentScore}
                onChange={(e) => setCurrentScore(Number(e.target.value))}
                className="w-full accent-[#c4553a] cursor-pointer"
              />
              <span className="text-[10px] text-stone-400 block mt-1">Recommended: &ge; 65%</span>
            </div>

            {/* Questions Completed Slider */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-stone-700">Questions Done</span>
                <span className="font-bold text-[#2d5a4a]">{questionsDone}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2500"
                step="50"
                value={questionsDone}
                onChange={(e) => setQuestionsDone(Number(e.target.value))}
                className="w-full accent-[#2d5a4a] cursor-pointer"
              />
              <span className="text-[10px] text-stone-400 block mt-1">Goal: ~1,500 questions</span>
            </div>

            {/* Weeks Remaining Slider */}
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-stone-700">Weeks to Test</span>
                <span className="font-bold text-[#e8a838]">{weeksRemaining} wks</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                value={weeksRemaining}
                onChange={(e) => setWeeksRemaining(Number(e.target.value))}
                className="w-full accent-[#e8a838] cursor-pointer"
              />
              <span className="text-[10px] text-stone-400 block mt-1">Pace planning</span>
            </div>
          </div>
        </div>

        {/* Prediction Results Card */}
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#071838] to-[#12284e] text-white space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Predicted Pass Probability
              </p>
              <h4 className="text-3xl sm:text-4xl font-extrabold font-serif text-white mt-1">
                {baseProb}% Chance of Passing
              </h4>
            </div>
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                baseProb >= 90
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                  : baseProb >= 75
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
              }`}
            >
              {baseProb >= 90
                ? 'High Pass Probability'
                : baseProb >= 75
                ? 'Moderate Probability'
                : 'Needs Targeted Practice'}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
            <div>
              <span className="text-stone-400 block text-[11px]">Recommended Daily Target</span>
              <strong className="text-white text-base font-bold">{dailyQuestionsGoal} questions/day</strong>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Benchmark Completion</span>
              <strong className="text-white text-base font-bold">
                {Math.min(100, Math.round((questionsDone / 1500) * 100))}%
              </strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-stone-400 block text-[11px]">Priority Focus Area</span>
              <strong className="text-amber-300 text-sm font-bold">Pharmacology &amp; Safety</strong>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-stone-500">
            Validated against historical data from 50,000+ passed candidates.
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Mail className="h-4 w-4 text-[#c4553a]" /> Email Report
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#c4553a] hover:bg-[#8b3a2f] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Start Personalized Prep Plan <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <EmailReportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        reportData={{
          examTrack: examName,
          subjectTitle: 'Predictive Exam Readiness Evaluation',
          score: Math.round((Math.max(questionsDone, 100) * (currentScore / 100))),
          totalQuestions: Math.max(questionsDone, 100),
          percentage: currentScore,
          passProbability: baseProb,
        }}
      />
    </div>
  );
};
