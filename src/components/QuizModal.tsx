import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Lightbulb, AlertTriangle, ArrowRight, RotateCcw, Mail, Award, Sparkles, Trophy } from 'lucide-react';
import { ExamSubject, ExamTrack, SAMPLE_PRACTICE_QUESTIONS, PracticeQuestion } from '../data/examsData';
import { EmailReportModal } from './EmailReportModal';

interface QuizModalProps {
  subject: ExamSubject | null;
  exam: ExamTrack | null;
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  subject,
  exam,
  onClose,
  onOpenSignUp,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [answersRecord, setAnswersRecord] = useState<Record<number, { selected: string; isCorrect: boolean }>>({});
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  if (!subject || !exam) return null;

  // Find questions for subject or search by domain keyword
  const matchedKey =
    Object.keys(SAMPLE_PRACTICE_QUESTIONS).find((key) =>
      subject.name.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(subject.name.toLowerCase())
    ) ||
    (subject.name.toLowerCase().includes('pharmac') ? 'Pharmacology' : null) ||
    (subject.name.toLowerCase().includes('anatom') ? 'Anatomy & Physiology' : null) ||
    (subject.name.toLowerCase().includes('safe') || subject.name.toLowerCase().includes('care') || subject.name.toLowerCase().includes('delegat') ? 'Safe & Effective Care Environment' : null) ||
    (subject.name.toLowerCase().includes('psych') || subject.name.toLowerCase().includes('mental') ? 'Psychosocial Integrity & Mental Health' : null) ||
    (subject.name.toLowerCase().includes('math') || subject.name.toLowerCase().includes('dosage') ? 'Mathematics & Dosage Fractions' : null) ||
    (subject.name.toLowerCase().includes('patho') ? 'Pathology & Pathophysiology' : null) ||
    (subject.name.toLowerCase().includes('medic') || subject.name.toLowerCase().includes('diagnos') ? 'Internal Medicine & Diagnostic Workups' : null) ||
    'Physiological Integrity & Complex Care';

  const questionsList: PracticeQuestion[] =
    SAMPLE_PRACTICE_QUESTIONS[matchedKey] || SAMPLE_PRACTICE_QUESTIONS['Pharmacology'];

  const currentQ = questionsList[questionIndex] || questionsList[0];

  const score = Object.values(answersRecord).filter((a) => a.isCorrect).length;
  const percentage = Math.round((score / Math.max(1, questionsList.length)) * 100);
  const isPassing = percentage >= 70;

  const handleSelectOption = (optId: string) => {
    if (submitted) return;
    const correct = optId === currentQ.correctOptionId;
    setSelectedOption(optId);
    setSubmitted(true);
    setAnswersRecord((prev) => ({
      ...prev,
      [questionIndex]: { selected: optId, isCorrect: correct }
    }));
  };

  const handleTryAgain = () => {
    setSelectedOption(null);
    setSubmitted(false);
    setAnswersRecord((prev) => {
      const copy = { ...prev };
      delete copy[questionIndex];
      return copy;
    });
  };

  const handleNext = () => {
    if (questionIndex + 1 < questionsList.length) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      // Completed all questions in the diagnostic drill
      saveQuizAttempt();
      setIsCompleted(true);
    }
  };

  const saveQuizAttempt = () => {
    try {
      const attempt = {
        id: `quiz_${Date.now()}`,
        title: `${subject.name} Diagnostic Drill`,
        date: 'Just now',
        score: `${percentage}%`,
        questions: `${questionsList.length} items`,
        time: '4 mins',
        status: isPassing ? 'Standard Met (Pass Ready)' : 'Review Recommended',
        statusColor: isPassing ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200',
        subject: subject,
      };

      const existingHistoryStr = localStorage.getItem('epp_quiz_history');
      const existingHistory = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
      localStorage.setItem('epp_quiz_history', JSON.stringify([attempt, ...existingHistory.slice(0, 19)]));

      // Update question counts in local state
      const totalAnswered = parseInt(localStorage.getItem('epp_questions_answered') || '842', 10) + questionsList.length;
      const todayTotal = parseInt(localStorage.getItem('epp_today_questions') || '38', 10) + questionsList.length;
      localStorage.setItem('epp_questions_answered', totalAnswered.toString());
      localStorage.setItem('epp_today_questions', todayTotal.toString());
    } catch (err) {
      console.warn('Could not save quiz attempt to localStorage:', err);
    }
  };

  const handleRestartQuiz = () => {
    setQuestionIndex(0);
    setSelectedOption(null);
    setSubmitted(false);
    setAnswersRecord({});
    setIsCompleted(false);
  };

  const isCorrect = selectedOption === currentQ.correctOptionId;

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
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            {subject.image && (
              <img
                src={subject.image}
                alt={subject.name}
                width="48"
                height="48"
                className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 shadow-sm"
              />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c4553a] bg-[#c4553a]/10 px-2.5 py-0.5 rounded-full">
                  {exam.name}
                </span>
                <span className="text-xs text-stone-500 font-medium truncate max-w-[200px] sm:max-w-xs">{subject.name}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
                {isCompleted ? 'Diagnostic Assessment Complete' : `Practice Question (${questionIndex + 1} of ${Math.max(questionsList.length, 1)})`}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* COMPLETED SUMMARY SCREEN */}
        {isCompleted ? (
          <div className="mt-6 space-y-6 animate-in fade-in">
            <div className={`p-6 rounded-2xl text-center border ${
              isPassing ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-sm bg-white">
                <Trophy className={`h-8 w-8 ${isPassing ? 'text-emerald-600' : 'text-amber-500'}`} />
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                isPassing ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {isPassing ? 'Passing Standard Met' : 'Remediation Priority'}
              </span>
              <h4 className="text-3xl font-black font-serif text-stone-900 mt-2">
                {score} / {questionsList.length} ({percentage}%)
              </h4>
              <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                {isPassing
                  ? `Strong diagnostic performance on ${subject.name}. Your estimated board pass likelihood is ${Math.min(99, percentage + 8)}%.`
                  : `Targeted review recommended in pharmacology and prioritization cues for ${subject.name}.`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-center">
                <span className="text-stone-400 block text-[11px] uppercase">Attempt Saved</span>
                <strong className="text-stone-800">Synced to Study Hub</strong>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-center">
                <span className="text-stone-400 block text-[11px] uppercase">Recommended Mode</span>
                <strong className="text-[#c4553a]">Full CAT Exam (85 Qs)</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleRestartQuiz}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" /> Retake Diagnostic
              </button>

              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-amber-300/80 hover:bg-amber-50 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Mail className="h-4 w-4 text-[#c4553a]" /> Email Score Report
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSignUp();
                }}
                className="flex-1 w-full sm:w-auto px-5 py-2.5 bg-[#c4553a] hover:bg-[#8b3a2f] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <span>Unlock 300,000+ Questions</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Clinical Scenario Box */}
            <div className="mt-5 p-4 rounded-2xl bg-[#faf7f2] border border-stone-200/70 text-stone-800 text-sm leading-relaxed">
              <p className="font-semibold text-stone-900 mb-1 flex items-center gap-1.5 text-xs text-stone-500 uppercase tracking-wider">
                Clinical Vignette
              </p>
              <p>{currentQ.scenario}</p>
            </div>

            {/* Question Stem */}
            <div className="mt-4 text-base font-semibold text-stone-900">
              {currentQ.question}
            </div>

            {/* Options */}
            <div className="mt-5 space-y-2.5">
              {currentQ.options.map((opt) => {
                const isThisSelected = selectedOption === opt.id;
                const isThisCorrect = opt.id === currentQ.correctOptionId;

                let btnStyle = 'border-stone-200 bg-white hover:border-stone-300 text-stone-800';
                if (submitted) {
                  if (isThisCorrect) {
                    btnStyle = 'border-[#2d5a4a] bg-[#2d5a4a]/10 text-[#1e3d32] font-semibold';
                  } else if (isThisSelected && !isCorrect) {
                    btnStyle = 'border-[#c4553a] bg-[#c4553a]/10 text-[#8b3a2f]';
                  } else {
                    btnStyle = 'border-stone-100 bg-stone-50 text-stone-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={submitted}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        submitted && isThisCorrect
                          ? 'bg-[#2d5a4a] text-white'
                          : submitted && isThisSelected
                          ? 'bg-[#c4553a] text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {opt.id}
                    </span>
                    <span className="flex-1 text-sm leading-normal">{opt.text}</span>
                    {submitted && isThisCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-[#2d5a4a] shrink-0" />
                    )}
                    {submitted && isThisSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-[#c4553a] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Rationale & Feedback Display */}
            {submitted && (
              <div className="mt-6 space-y-4 animate-in fade-in duration-300">
                {/* Status Banner */}
                <div
                  className={`p-3.5 rounded-xl flex items-center gap-2 text-sm font-semibold ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span>Correct! Great clinical reasoning.</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                      <span>Incorrect. Option {currentQ.correctOptionId} is the correct answer.</span>
                    </>
                  )}
                </div>

                {/* Expert Rationale Card */}
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-stone-800 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase tracking-wider">
                    <Lightbulb className="h-4 w-4 text-[#e8a838]" />
                    Expert Rationale
                  </div>
                  <p className="leading-relaxed">{currentQ.rationale}</p>

                  {currentQ.whyWrong && (
                    <div className="pt-2 border-t border-amber-200/50">
                      <span className="font-semibold text-amber-950">Why others get this wrong: </span>
                      <span>{currentQ.whyWrong}</span>
                    </div>
                  )}

                  {currentQ.clinicalPearl && (
                    <div className="pt-2 border-t border-amber-200/50 flex items-start gap-1.5 text-[#2d5a4a] font-medium">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-[#2d5a4a]" />
                      <span>
                        <strong>Clinical Pearl: </strong>
                        {currentQ.clinicalPearl}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress indicator */}
                <div className="p-3 bg-stone-100/90 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-stone-700 font-medium">
                  <div>
                    <span>Diagnostic Progress: </span>
                    <span className="font-bold text-[#c4553a]">
                      {score} of {questionIndex + 1} Correct
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(true)}
                    className="px-3 py-1.5 bg-white border border-stone-200 hover:border-stone-300 text-stone-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Mail className="h-3.5 w-3.5 text-[#c4553a]" /> Email Score Report
                  </button>
                </div>

                {/* Actions: Next Question or Unlock Full QBank */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleTryAgain}
                    className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Try this question again
                  </button>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(true)}
                      className="hidden sm:flex px-3.5 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Mail className="h-4 w-4 text-[#c4553a]" /> Email Report
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-[#2d5a4a] hover:bg-[#1e3d32] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                    >
                      {questionIndex + 1 < questionsList.length ? (
                        <>Next Question <ArrowRight className="h-4 w-4" /></>
                      ) : (
                        <>View Assessment Summary <ArrowRight className="h-4 w-4" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <EmailReportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        reportData={{
          examTrack: exam.name,
          subjectTitle: subject.name,
          score: score,
          totalQuestions: questionsList.length,
          percentage: percentage,
        }}
      />
    </div>
  );
};
