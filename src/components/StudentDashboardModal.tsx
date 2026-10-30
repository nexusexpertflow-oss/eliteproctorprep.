import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  Flame,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Activity,
  Calculator,
  Pill,
  FileText,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Target,
  BarChart2,
  ShieldCheck,
  UserCheck,
  LogOut,
  Play,
  Check,
  ClipboardList,
  Mail,
  Shield
} from 'lucide-react';
import { EXAM_TRACKS, ExamSubject, ExamTrack } from '../data/examsData';
import { EmailReportModal } from './EmailReportModal';

interface StudentDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string | null;
  candidateName?: string | null;
  initialExamTrack?: string | null;
  candidatePlan?: {
    id: string;
    name: string;
    price: string;
    exam: string;
    period: string;
    purchasedAt: string;
    receiptId: string;
  } | null;
  onSignOut: () => void;
  onOpenNgnSimulator: () => void;
  onOpenReadinessCalculator: () => void;
  onOpenPharmaDrill: () => void;
  onOpenMcqs: () => void;
  onStartPracticeQuiz: (subject: ExamSubject, exam: ExamTrack) => void;
  onOpenPlans: () => void;
  onOpenAdmin?: () => void;
}

export const StudentDashboardModal: React.FC<StudentDashboardModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  candidateName,
  initialExamTrack,
  candidatePlan,
  onSignOut,
  onOpenNgnSimulator,
  onOpenReadinessCalculator,
  onOpenPharmaDrill,
  onOpenMcqs,
  onStartPracticeQuiz,
  onOpenPlans,
  onOpenAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'domains' | 'history' | 'schedule'>('overview');
  const [copiedSchedule, setCopiedSchedule] = useState(false);
  const [scheduleDuration, setScheduleDuration] = useState<'30' | '60' | '90'>('60');
  const [studyHoursPerDay, setStudyHoursPerDay] = useState<'1' | '2' | '4'>('2');
  
  // Map initial exam track if provided
  const getMappedExamId = (trackName?: string | null): string => {
    if (!trackName) return 'nclex-rn';
    const lower = trackName.toLowerCase();
    if (lower.includes('pn')) return 'nclex-pn';
    if (lower.includes('step-1') || lower.includes('step 1')) return 'usmle-step-1';
    if (lower.includes('step-2') || lower.includes('step 2')) return 'usmle-step-2';
    if (lower.includes('teas')) return 'ati-teas';
    if (lower.includes('hesi')) return 'hesi-a2';
    return 'nclex-rn';
  };

  const [selectedExamId, setSelectedExamId] = useState<string>(
    getMappedExamId(initialExamTrack)
  );
  
  // Interactive Simulation State
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('epp_questions_answered');
      return saved ? parseInt(saved, 10) : 842;
    } catch {
      return 842;
    }
  });
  const [todayQuestions, setTodayQuestions] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('epp_today_questions');
      return saved ? parseInt(saved, 10) : 38;
    } catch {
      return 38;
    }
  });
  const [dailyGoal] = useState(60);
  const [streakDays, setStreakDays] = useState(14);
  const [customDaysUntilExam, setCustomDaysUntilExam] = useState(32);
  const [showEmailReportModal, setShowEmailReportModal] = useState(false);

  if (!isOpen) return null;

  const currentExam = EXAM_TRACKS.find((e) => e.code === selectedExamId || e.id === selectedExamId) || EXAM_TRACKS[0];

  // Calculate live pass probability based on questions & accuracy
  const passProbability = Math.min(99, Math.round(72 + (questionsAnswered / 3500) * 26));

  const domains = [
    {
      name: 'Safe & Effective Care: Management of Care',
      mastery: 84,
      questions: 280,
      status: 'Mastered',
      color: 'bg-emerald-500',
      tag: 'Strength',
    },
    {
      name: 'Pharmacological & Parenteral Therapies',
      mastery: 62,
      questions: 195,
      status: 'Needs Focus',
      color: 'bg-amber-500',
      tag: 'Priority Review',
    },
    {
      name: 'Physiological Adaptation & Complex Care',
      mastery: 78,
      questions: 210,
      status: 'Proficient',
      color: 'bg-blue-500',
      tag: 'On Track',
    },
    {
      name: 'Reduction of Risk Potential & Labs',
      mastery: 81,
      questions: 175,
      status: 'Mastered',
      color: 'bg-emerald-500',
      tag: 'Strength',
    },
    {
      name: 'Psychosocial Integrity & Coping',
      mastery: 88,
      questions: 110,
      status: 'Mastered',
      color: 'bg-emerald-500',
      tag: 'Strength',
    },
    {
      name: 'Maternal, Newborn & Pediatric Health',
      mastery: 71,
      questions: 140,
      status: 'Proficient',
      color: 'bg-blue-500',
      tag: 'Review Scheduled',
    },
  ];

  const recentSessions = [
    {
      id: 'cat-4',
      title: 'Full Computer-Adaptive Mock Test (CAT #4)',
      date: 'Today at 2:15 PM',
      score: '79%',
      questions: '85 questions',
      time: '1h 12m',
      status: 'Passing Standard Met',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      subject: currentExam.subjects[0],
    },
    {
      id: 'pharma-2',
      title: 'High-Yield Cardiac & Anticoagulant Drill',
      date: 'Yesterday at 6:40 PM',
      score: '88%',
      questions: '25 flashcards',
      time: '18 min',
      status: 'High Mastery',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      subject: currentExam.subjects[1] || currentExam.subjects[0],
    },
    {
      id: 'ngn-1',
      title: 'NGN Clinical Case: Acute Heart Failure Exacerbation',
      date: '2 days ago',
      score: '5/6 (83%)',
      questions: '6-step clinical unfolding',
      time: '24 min',
      status: 'Clinical Judgment Level 3',
      statusColor: 'text-blue-700 bg-blue-50 border-blue-200',
      subject: currentExam.subjects[0],
    },
    {
      id: 'prioritize-1',
      title: 'Prioritization & Emergency Delegation Sprint',
      date: '4 days ago',
      score: '72%',
      questions: '40 questions',
      time: '35 min',
      status: 'Borderline Passing',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
      subject: currentExam.subjects[2] || currentExam.subjects[0],
    },
  ];

  const storedHistory = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('epp_quiz_history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, [isOpen]);

  const allRecentSessions = [...storedHistory, ...recentSessions];

  const handleSimulatePractice = () => {
    setQuestionsAnswered((prev) => {
      const next = prev + 10;
      try {
        localStorage.setItem('epp_questions_answered', next.toString());
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
    setTodayQuestions((prev) => {
      const next = Math.min(dailyGoal, prev + 10);
      try {
        localStorage.setItem('epp_today_questions', next.toString());
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const handleStartExamTrackQuiz = () => {
    if (currentExam.subjects.length > 0) {
      onClose();
      onStartPracticeQuiz(currentExam.subjects[0], currentExam);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Student Learning Dashboard"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#faf7f2] rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Header with User Info and Target Exam Selector */}
        <div className="bg-[#06152d] text-white p-4 sm:p-6 border-b border-white/10 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c4553a] to-[#8b3a2f] flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white/20">
                {candidateName
                  ? candidateName.charAt(0).toUpperCase()
                  : userEmail
                  ? userEmail.charAt(0).toUpperCase()
                  : 'N'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                    {candidateName || 'Candidate Portal'}
                  </h3>
                  {candidatePlan ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center gap-1 shadow-xs">
                      ★ PRO: {candidatePlan.name}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                      <UserCheck className="h-3 w-3" /> Diagnostic Free Trial
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <p className="text-xs text-stone-300">
                    {userEmail || 'candidate@eliteproctorprep.com'} &bull;{' '}
                    <span className="text-[#e8a838] font-medium">NCSBN Blueprint 2025/2026</span>
                  </p>
                  {!candidatePlan && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenPlans();
                      }}
                      className="text-[10px] bg-[#c4553a] hover:bg-[#8b3a2f] text-white font-bold px-2 py-0.5 rounded transition-colors cursor-pointer"
                    >
                      Unlock All 30k+ Questions →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Target Exam Track Switcher & Close */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-xl p-1 border border-white/10">
                <span className="text-[11px] font-semibold text-stone-300 pl-2 pr-1 hidden md:inline">
                  Exam Track:
                </span>
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value as any)}
                  className="bg-[#071838] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-[#e8a838] cursor-pointer"
                >
                  <option value="nclex-rn">NCLEX-RN (2025/2026 Test Plan)</option>
                  <option value="nclex-pn">NCLEX-PN (Practical Nursing)</option>
                  <option value="usmle-step-1">USMLE Step 1 (Basic Clinical Sciences)</option>
                  <option value="usmle-step-2">USMLE Step 2 CK (Clinical Knowledge)</option>
                  <option value="ati-teas">ATI Comprehensive Predictor</option>
                  <option value="hesi-a2">HESI Exit & A2 Exam</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => setShowEmailReportModal(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 transition-colors cursor-pointer"
                title="Send verified progress report via Resend email"
              >
                <Mail className="h-3.5 w-3.5 text-amber-300" />
                <span>Email Report</span>
              </button>



              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close dashboard"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-white/10">
            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Readiness Index
                </span>
                <span className="text-xl font-black text-emerald-400 font-serif">
                  {passProbability}%
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Questions Done
                </span>
                <span className="text-xl font-black text-amber-400 font-serif">
                  {questionsAnswered} <span className="text-xs font-normal text-stone-400">/ 3,500</span>
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Target className="h-4 w-4" />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Study Streak
                </span>
                <span className="text-xl font-black text-[#e8a838] font-serif flex items-center gap-1">
                  {streakDays} <span className="text-xs font-normal text-stone-400">Days</span>
                  <Flame className="h-4 w-4 text-orange-400 fill-orange-400 inline" />
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-300 flex items-center justify-center">
                <Flame className="h-4 w-4" />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                  Countdown to Boards
                </span>
                <span className="text-xl font-black text-sky-400 font-serif">
                  {customDaysUntilExam} <span className="text-xs font-normal text-stone-400">Days</span>
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto text-xs font-semibold scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                activeTab === 'overview'
                  ? 'bg-[#c4553a] text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Overview & Diagnostic KPIs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('domains')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                activeTab === 'domains'
                  ? 'bg-[#c4553a] text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Clinical Domain Mastery ({domains.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                activeTab === 'history'
                  ? 'bg-[#c4553a] text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Mock Exams & History
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schedule')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                activeTab === 'schedule'
                  ? 'bg-[#c4553a] text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Study Plan & Milestones
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Top Action Launchpad */}
              <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h4 className="font-serif font-bold text-base text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-[#e8a838]" /> High-Yield Clinical Tools Launchpad
                    </h4>
                    <p className="text-xs text-stone-500">
                      All four clinical simulators and diagnostics are active for your candidate profile.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSimulatePractice}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1 cursor-pointer"
                      title="Simulate answering 10 questions to test live reactivity"
                    >
                      <RotateCcw className="h-3 w-3" /> Simulate +10 Questions
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* NGN Simulator */}
                  <div
                    onClick={() => {
                      onClose();
                      onOpenNgnSimulator();
                    }}
                    className="p-3.5 rounded-xl border border-rose-200/90 bg-rose-50/70 hover:bg-rose-100/70 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-[#c4553a] flex items-center justify-center">
                          <Activity className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-[#c4553a] uppercase tracking-wider">
                          EHR Live
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-stone-900 group-hover:text-[#c4553a] transition-colors">
                        NGN Case Simulator
                      </h5>
                      <p className="text-[11px] text-stone-600 line-clamp-2 mt-1">
                        Unfolding 6-step clinical case with nurses notes, labs, and MAR.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px] font-semibold text-[#c4553a]">
                      <span>Launch Case</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Pass Readiness Predictor */}
                  <div
                    onClick={() => {
                      onClose();
                      onOpenReadinessCalculator();
                    }}
                    className="p-3.5 rounded-xl border border-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100/70 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-[#2d5a4a] flex items-center justify-center">
                          <Calculator className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-[#2d5a4a] uppercase tracking-wider">
                          Predictor
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-stone-900 group-hover:text-[#2d5a4a] transition-colors">
                        Pass Readiness Score
                      </h5>
                      <p className="text-[11px] text-stone-600 line-clamp-2 mt-1">
                        Calculate exact statistical likelihood based on question count and accuracy.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[11px] font-semibold text-[#2d5a4a]">
                      <span>Open Calculator</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Pharmacology Drill */}
                  <div
                    onClick={() => {
                      onClose();
                      onOpenPharmaDrill();
                    }}
                    className="p-3.5 rounded-xl border border-amber-200/90 bg-amber-50/70 hover:bg-amber-100/70 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-xs text-[#e8a838] flex items-center justify-center">
                          <Pill className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                          Top 50 Meds
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-stone-900 group-hover:text-amber-800 transition-colors">
                        Pharma Recall Drill
                      </h5>
                      <p className="text-[11px] text-stone-600 line-clamp-2 mt-1">
                        Critical black box warnings, lab ranges, and emergency antidotes.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] font-semibold text-amber-800">
                      <span>Start Med Drill</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Start Practice QBank Test */}
                  <div
                    onClick={handleStartExamTrackQuiz}
                    className="p-3.5 rounded-xl border border-[#06152d]/20 bg-[#06152d]/5 hover:bg-[#06152d]/10 cursor-pointer transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-[#06152d] shadow-xs text-white flex items-center justify-center">
                          <Play className="h-4 w-4 text-[#e8a838]" />
                        </div>
                        <span className="text-[10px] font-bold text-[#06152d] uppercase tracking-wider">
                          Live QBank
                        </span>
                      </div>
                      <h5 className="font-bold text-xs text-stone-900 group-hover:text-[#06152d] transition-colors">
                        Start Adaptive Quiz
                      </h5>
                      <p className="text-[11px] text-stone-600 line-clamp-2 mt-1">
                        Test yourself on {currentExam.name} with in-depth rationales.
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-semibold text-[#06152d]">
                      <span>Launch Test Mode</span>
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress & Diagnostic Charts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Daily Goal & Streak Progress */}
                <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Today's Target
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {todayQuestions} / {dailyGoal} Questions
                      </span>
                    </div>

                    <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden mb-3">
                      <div
                        className="bg-gradient-to-r from-[#e8a838] to-[#c4553a] h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (todayQuestions / dailyGoal) * 100)}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-stone-600 mb-4">
                      {dailyGoal - todayQuestions > 0 ? (
                        <>You have <strong className="text-stone-900">{dailyGoal - todayQuestions} questions</strong> left to hit today's retention target.</>
                      ) : (
                        <span className="text-emerald-700 font-semibold">
                          Daily goal reached! Keep going or review missed rationales.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-stone-600">
                      <Clock className="h-3.5 w-3.5 text-stone-400" />
                      <span>Avg. Pace: <strong>58s / item</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTodayQuestions((prev) => Math.min(dailyGoal + 20, prev + 5))}
                      className="text-xs font-bold text-[#c4553a] hover:underline cursor-pointer"
                    >
                      +5 Quick Drill
                    </button>
                  </div>
                </div>

                {/* Computer-Adaptive (CAT) Percentile Gauge */}
                <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        CAT Benchmarking
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        88th Percentile
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs font-medium text-stone-600">
                        <span>Above Passing Standard</span>
                        <span className="font-bold text-stone-900">+1.42 Logits</span>
                      </div>
                      <div className="relative w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                        {/* Threshold mark */}
                        <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-stone-400 z-10" title="Passing Line"></div>
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: '84%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-stone-400">
                        <span>Below Standard</span>
                        <span>Passing Line</span>
                        <span>Well Above</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 pt-2 border-t border-stone-200/80">
                    Calculated using Item Response Theory (IRT) calibrated against NCSBN passing standards.
                  </p>
                </div>

                {/* Quick High-Yield Resources */}
                <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Study Resources
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Included
                      </span>
                    </div>
                    <h5 className="font-bold text-xs text-stone-900 mb-2 font-serif">
                      Offline Practice & Guides
                    </h5>

                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenMcqs();
                        }}
                        className="w-full text-left p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/70 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-xs font-medium text-stone-800 flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5 text-[#c4553a]" /> 1,200+ High-Yield MCQs PDF
                        </span>
                        <ChevronRight className="h-3 w-3 text-stone-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenPharmaDrill();
                        }}
                        className="w-full text-left p-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/70 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-xs font-medium text-stone-800 flex items-center gap-1.5">
                          <Pill className="h-3.5 w-3.5 text-amber-600" /> Lab Values & Antidotes Card
                        </span>
                        <ChevronRight className="h-3 w-3 text-stone-400" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenPlans}
                    className="mt-3 text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer pt-2 border-t border-stone-200/80"
                  >
                    <span>Manage Subscription / Upgrade</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOMAIN MASTERY */}
          {activeTab === 'domains' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base">
                    NCSBN / Board Test Plan Breakdown ({selectedExamId.toUpperCase()})
                  </h4>
                  <p className="text-xs text-stone-500">
                    Track your category-level confidence and focus study time where it matters most.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPharmaDrill();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#c4553a] text-white text-xs font-semibold hover:bg-[#8b3a2f] transition-colors cursor-pointer self-start sm:self-center flex items-center gap-1"
                >
                  <Target className="h-3.5 w-3.5" /> Practice Weakest Domain
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {domains.map((dom, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs hover:border-stone-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h5 className="font-bold text-xs text-stone-900 leading-snug">
                        {dom.name}
                      </h5>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          dom.status === 'Mastered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : dom.status === 'Needs Focus'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {dom.status}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-stone-600">
                        <span>Accuracy: <strong className="text-stone-900">{dom.mastery}%</strong></span>
                        <span>{dom.questions} items tested</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${dom.color} transition-all duration-500`}
                          style={{ width: `${dom.mastery}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                      <span className="text-stone-500">Blueprint weight: ~14-20%</span>
                      <button
                        type="button"
                        onClick={handleStartExamTrackQuiz}
                        className="text-[#c4553a] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        Start Drill <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MOCK EXAMS & HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-base">
                    Simulated Test History & Review Log
                  </h4>
                  <p className="text-xs text-stone-500">
                    Review past attempts, inspect full rationales, and retest questions you flagged or missed.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartExamTrackQuiz}
                  className="px-3.5 py-1.5 rounded-xl bg-[#06152d] text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer self-start sm:self-center flex items-center gap-1.5"
                >
                  <Play className="h-3.5 w-3.5 text-[#e8a838]" /> Launch New Mock Test
                </button>
              </div>

              <div className="space-y-3">
                {allRecentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                          {session.date}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${session.statusColor}`}>
                          {session.status}
                        </span>
                      </div>
                      <h5 className="font-bold text-sm text-stone-900">
                        {session.title}
                      </h5>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {session.questions} &bull; Time Spent: {session.time} &bull; Score: <strong className="text-stone-900">{session.score}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onStartPracticeQuiz(session.subject || currentExam.subjects[0], currentExam);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Review Rationales
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SCHEDULE & MILESTONES */}
          {activeTab === 'schedule' && (
            <div className="space-y-5">
              {/* Adaptive Study Roadmap Generator Header */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c4553a] bg-[#c4553a]/10 px-2.5 py-0.5 rounded-full">
                      Adaptive Study Plan Generator
                    </span>
                    <h4 className="font-serif font-bold text-stone-900 text-base mt-1">
                      Personalized {selectedExamId.toUpperCase()} Roadmap
                    </h4>
                    <p className="text-xs text-stone-500">
                      Configure your exam timeline and daily study bandwidth to generate your phased milestone syllabus.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const roadmapText = `EliteProctorPrep Personalized Study Syllabus for ${selectedExamId.toUpperCase()}:\nTimeline: ${scheduleDuration} Days | Commitment: ${studyHoursPerDay} hrs/day (~${parseInt(studyHoursPerDay) * 35} Qs/day)\nPhase 1: Diagnostic Assessment & Fluids/Electrolytes/ABGs\nPhase 2: High-Alert Pharmacology & Emergency Antidotes\nPhase 3: Next-Gen NCLEX (NGN) Bow-Tie & Clinical Case Studies\nPhase 4: Full-Length Timed Computer-Adaptive (CAT) Mock Exams`;
                        navigator.clipboard?.writeText(roadmapText);
                        setCopiedSchedule(true);
                        setTimeout(() => setCopiedSchedule(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      {copiedSchedule ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <ClipboardList className="h-3.5 w-3.5" />}
                      <span>{copiedSchedule ? 'Copied!' : 'Copy Syllabus'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      Print Syllabus
                    </button>
                  </div>
                </div>

                {/* Timeline & Bandwidth Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Target Exam Timeline
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '30', label: '30-Day Sprint', sub: 'Accelerated' },
                        { id: '60', label: '60-Day Standard', sub: 'Recommended' },
                        { id: '90', label: '90-Day Deep', sub: 'Comprehensive' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setScheduleDuration(item.id as any)}
                          className={`p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                            scheduleDuration === item.id
                              ? 'border-[#c4553a] bg-[#fffdf9] font-bold text-[#c4553a] shadow-xs ring-1 ring-[#c4553a]'
                              : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <div className="font-bold">{item.label}</div>
                          <div className="text-[10px] text-stone-400 mt-0.5">{item.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                      Daily Study Commitment
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: '1', label: '1 Hr / Day', qs: '~35 Qs' },
                        { id: '2', label: '2 Hrs / Day', qs: '~70 Qs' },
                        { id: '4', label: '4+ Hrs / Day', qs: '~130 Qs' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setStudyHoursPerDay(item.id as any)}
                          className={`p-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                            studyHoursPerDay === item.id
                              ? 'border-[#c4553a] bg-[#fffdf9] font-bold text-[#c4553a] shadow-xs ring-1 ring-[#c4553a]'
                              : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                          }`}
                        >
                          <div className="font-bold">{item.label}</div>
                          <div className="text-[10px] text-stone-400 mt-0.5">{item.qs}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic 4-Phase Roadmap Syllabus */}
              <div className="space-y-3">
                {[
                  {
                    phase: 'Phase 1',
                    weeks: scheduleDuration === '30' ? 'Days 1–7' : scheduleDuration === '60' ? 'Weeks 1–2' : 'Weeks 1–3',
                    title: 'Diagnostic Baseline & Core Pathophysiological Systems',
                    topics: [
                      'Fluids & Electrolytes, Acid-Base Imbalances (ABG interpretation)',
                      'Safe & Effective Care: Management of Care, Prioritization & Delegation',
                      'Take Initial 85-question diagnostic baseline test to identify domain deficits',
                    ],
                    targetPace: `${parseInt(studyHoursPerDay) * 35} practice items / day`,
                    status: 'In Progress (Active Phase)',
                    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                  },
                  {
                    phase: 'Phase 2',
                    weeks: scheduleDuration === '30' ? 'Days 8–15' : scheduleDuration === '60' ? 'Weeks 3–4' : 'Weeks 4–6',
                    title: 'High-Alert Pharmacology & Emergency Nursing Interventions',
                    topics: [
                      'Top 100 NCLEX medications: Anticoagulants, Cardiac Inotropes, Insulins, Psychotropics',
                      'Antidotes, therapeutic drug monitoring ranges, and Black Box Warnings',
                      'Dosage calculations, pediatric weight-based dosing & IV drip rates',
                    ],
                    targetPace: '20 pharma flashcards + 45 QBank clinical rationales daily',
                    status: 'Upcoming Milestone',
                    badgeColor: 'bg-stone-100 text-stone-600 border-stone-200',
                  },
                  {
                    phase: 'Phase 3',
                    weeks: scheduleDuration === '30' ? 'Days 16–23' : scheduleDuration === '60' ? 'Weeks 5–6' : 'Weeks 7–9',
                    title: 'Next Generation NCLEX (NGN) Clinical Judgment Mastery',
                    topics: [
                      '6-step Unfolding Clinical Case Studies (Recognize cues through Evaluate outcomes)',
                      'Bow-Tie items: selecting condition, actions, and monitoring parameters',
                      'Matrix / Grid decision tables with +/- scoring rule mastery',
                    ],
                    targetPace: '3 complete NGN clinical cases daily + rationale review',
                    status: 'Upcoming Milestone',
                    badgeColor: 'bg-stone-100 text-stone-600 border-stone-200',
                  },
                  {
                    phase: 'Phase 4',
                    weeks: scheduleDuration === '30' ? 'Days 24–30' : scheduleDuration === '60' ? 'Weeks 7–8' : 'Weeks 10–12',
                    title: 'Computer-Adaptive Testing (CAT) & Final Exam Conditioning',
                    topics: [
                      'Simulate timed 85–150 item CAT mock exams under authentic test center conditions',
                      'Review missed question logs and high-yield summary cheat sheets',
                      'Target >75% consistency to activate the 100% Pass or Money-Back Guarantee',
                    ],
                    targetPace: 'Full-length CAT simulation every 48 hours + mental stamina pacing',
                    status: 'Final Readiness Peak',
                    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
                  },
                ].map((ph, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-xs transition-shadow space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#c4553a] bg-[#c4553a]/10 px-2.5 py-0.5 rounded-full">
                          {ph.phase}: {ph.weeks}
                        </span>
                        <h5 className="font-bold text-sm text-stone-900">{ph.title}</h5>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${ph.badgeColor}`}>
                        {ph.status}
                      </span>
                    </div>

                    <ul className="space-y-1 text-xs text-stone-600 pl-4 list-disc marker:text-[#c4553a]">
                      {ph.topics.map((t, i) => (
                        <li key={i} className="leading-relaxed">{t}</li>
                      ))}
                    </ul>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                      <span>Daily Target: <strong className="text-stone-800">{ph.targetPace}</strong></span>
                      <button
                        type="button"
                        onClick={handleStartExamTrackQuiz}
                        className="text-[#c4553a] font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        Launch Practice Batch <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Weekly study calendar tracker */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-serif font-bold text-stone-900 text-sm">
                    This Week's Completed Study Milestones
                  </h5>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    14-Day Streak Active 🔥
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div
                      key={day}
                      className={`p-2.5 rounded-xl border ${
                        i < 4
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : i === 4
                          ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-[#e8a838]/40'
                          : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase block">{day}</span>
                      <span className="text-sm font-black my-1 block">
                        {i < 4 ? '✓ 60' : i === 4 ? `${todayQuestions}` : '-'}
                      </span>
                      <span className="text-[9px] font-medium block">
                        {i < 4 ? 'Completed' : i === 4 ? 'In Progress' : 'Planned'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-stone-100 p-4 border-t border-stone-200/90 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSignOut}
              className="text-stone-600 hover:text-red-700 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </button>
            <span className="text-stone-300">&bull;</span>
            <span className="text-stone-500">
              Session state saved locally to browser
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartExamTrackQuiz}
              className="px-4 py-2 rounded-xl bg-[#c4553a] hover:bg-[#8b3a2f] text-white font-semibold text-xs shadow-md shadow-[#c4553a]/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" /> Practice Next Batch
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white hover:bg-stone-200 text-stone-800 font-medium text-xs border border-stone-300 transition-colors cursor-pointer"
            >
              Close Hub
            </button>
          </div>
        </div>
      </div>

      <EmailReportModal
        isOpen={showEmailReportModal}
        onClose={() => setShowEmailReportModal(false)}
        reportData={{
          examTrack: currentExam.name,
          subjectTitle: `${currentExam.badge} Comprehensive Progress`,
          score: Math.round((questionsAnswered * 0.78)),
          totalQuestions: questionsAnswered,
          percentage: 78,
          passProbability: passProbability,
          candidateName: candidateName || undefined,
          userEmail: userEmail || undefined,
        }}
      />
    </div>
  );
};
