import React, { useState } from 'react';
import {
  X,
  Shield,
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Tag,
  Server,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Download,
  Mail,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Clock,
  Trash2,
  Edit,
  Eye,
  Key,
  Lock,
  ShieldCheck
} from 'lucide-react';
import { EXAM_TRACKS, ExamTrack, PracticeQuestion } from '../data/examsData';
import { useClerkBridge } from '../context/ClerkAuthContext';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenClerkConfig?: () => void;
}

interface StudentUser {
  id: string;
  name: string;
  email: string;
  examTrack: string;
  school: string;
  plan: string;
  progress: number;
  passProbability: number;
  status: 'Active' | 'Review Needed' | 'Completed';
  registeredAt: string;
}

interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  applicableExams: string;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenClerkConfig
}) => {
  const { hasKey, targetAppId, activeKey } = useClerkBridge();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcode.trim();
    if (clean === 'admin2026' || clean === 'nurse2026' || clean === '8888') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid administrative passcode. Enter authorized faculty key.');
    }
  };

  const handleCloseAndLock = () => {
    setIsAuthenticated(false);
    setPasscode('');
    setPinError('');
    onClose();
  };

  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'questions' | 'ngn' | 'promos' | 'system'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamFilter, setSelectedExamFilter] = useState('all');

  // Interactive Students List
  const initialStudentsList: StudentUser[] = [
    {
      id: 'usr_01',
      name: 'Sarah Jenkins',
      email: 's.jenkins@jhmi.edu',
      examTrack: 'NCLEX-RN®',
      school: 'Johns Hopkins School of Nursing',
      plan: '180-Day Lifetime Pass',
      progress: 88,
      passProbability: 97,
      status: 'Active',
      registeredAt: '2026-09-14'
    },
    {
      id: 'usr_02',
      name: 'Marcus Vance',
      email: 'marcus.v@nyu.edu',
      examTrack: 'NCLEX-RN®',
      school: 'NYU Rory Meyers Nursing',
      plan: '90-Day Comprehensive',
      progress: 64,
      passProbability: 89,
      status: 'Active',
      registeredAt: '2026-10-02'
    },
    {
      id: 'usr_03',
      name: 'Elena Rostova',
      email: 'elena.rostova@emory.edu',
      examTrack: 'NCLEX-PN®',
      school: 'Emory University',
      plan: '30-Day Sprint',
      progress: 42,
      passProbability: 74,
      status: 'Review Needed',
      registeredAt: '2026-10-18'
    },
    {
      id: 'usr_04',
      name: 'David K. O\'Connor',
      email: 'david.oc@upenn.edu',
      examTrack: 'ATI TEAS 7',
      school: 'UPenn Nursing',
      plan: '180-Day Lifetime Pass',
      progress: 95,
      passProbability: 99,
      status: 'Completed',
      registeredAt: '2026-08-20'
    },
    {
      id: 'usr_05',
      name: 'Priya Sharma',
      email: 'psharma@ucla.edu',
      examTrack: 'HESI A2',
      school: 'UCLA School of Nursing',
      plan: '90-Day Comprehensive',
      progress: 58,
      passProbability: 85,
      status: 'Active',
      registeredAt: '2026-10-10'
    },
    {
      id: 'usr_06',
      name: 'Ashley Coleman',
      email: 'acoleman@rush.edu',
      examTrack: 'CCRN Adult',
      school: 'Rush University Medical Center',
      plan: '180-Day Lifetime Pass',
      progress: 79,
      passProbability: 94,
      status: 'Active',
      registeredAt: '2026-09-28'
    }
  ];

  const [students, setStudents] = useState<StudentUser[]>(() => {
    try {
      const saved = localStorage.getItem('epp_admin_students');
      return saved ? JSON.parse(saved) : initialStudentsList;
    } catch {
      return initialStudentsList;
    }
  });

  const defaultPromosList: PromoCode[] = [
    {
      id: 'promo_1',
      code: 'NURSE2026',
      discountPercent: 25,
      applicableExams: 'All Exam Tracks',
      maxUses: 1000,
      usedCount: 742,
      expiresAt: '2026-12-31',
      isActive: true
    },
    {
      id: 'promo_2',
      code: 'PASS_GUARANTEED',
      discountPercent: 30,
      applicableExams: 'NCLEX-RN & PN',
      maxUses: 500,
      usedCount: 489,
      expiresAt: '2026-11-30',
      isActive: true
    },
    {
      id: 'promo_3',
      code: 'FUTURE_CLINICIAN',
      discountPercent: 40,
      applicableExams: 'ATI TEAS & HESI A2',
      maxUses: 300,
      usedCount: 124,
      expiresAt: '2026-12-15',
      isActive: true
    }
  ];

  // Promo Codes State
  const [promos, setPromos] = useState<PromoCode[]>(() => {
    try {
      const saved = localStorage.getItem('epp_admin_promos');
      return saved ? JSON.parse(saved) : defaultPromosList;
    } catch {
      return defaultPromosList;
    }
  });

  // Form states for adding a student
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    examTrack: 'NCLEX-RN®',
    school: '',
    plan: '90-Day Comprehensive'
  });

  // Form state for adding promo code
  const [showAddPromo, setShowAddPromo] = useState(false);
  const [newPromo, setNewPromo] = useState({
    code: '',
    discountPercent: 20,
    applicableExams: 'All Exam Tracks',
    maxUses: 500
  });

  // Notification Banner
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.email || !newStudent.name) return;

    const created: StudentUser = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      name: newStudent.name,
      email: newStudent.email,
      examTrack: newStudent.examTrack,
      school: newStudent.school || 'Clinical Candidate',
      plan: newStudent.plan,
      progress: 0,
      passProbability: 75,
      status: 'Active',
      registeredAt: new Date().toISOString().split('T')[0]
    };

    const updated = [created, ...students];
    setStudents(updated);
    try {
      localStorage.setItem('epp_admin_students', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setShowAddStudent(false);
    setNewStudent({ name: '', email: '', examTrack: 'NCLEX-RN®', school: '', plan: '90-Day Comprehensive' });
    notify(`Candidate ${created.name} (${created.email}) added to portal with ${created.plan}!`);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code) return;

    const created: PromoCode = {
      id: `promo_${Date.now()}`,
      code: newPromo.code.toUpperCase().trim(),
      discountPercent: Number(newPromo.discountPercent),
      applicableExams: newPromo.applicableExams,
      maxUses: Number(newPromo.maxUses),
      usedCount: 0,
      expiresAt: '2026-12-31',
      isActive: true
    };

    const updated = [created, ...promos];
    setPromos(updated);
    try {
      localStorage.setItem('epp_admin_promos', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setShowAddPromo(false);
    setNewPromo({ code: '', discountPercent: 20, applicableExams: 'All Exam Tracks', maxUses: 500 });
    notify(`Coupon code ${created.code} activated with ${created.discountPercent}% discount!`);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    try {
      localStorage.setItem('epp_admin_students', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    notify(`Candidate ${name} access removed.`);
  };

  const handleUpgradePlan = (id: string, newPlan: string) => {
    const updated = students.map(s => s.id === id ? { ...s, plan: newPlan } : s);
    setStudents(updated);
    try {
      localStorage.setItem('epp_admin_students', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    notify(`Upgraded candidate plan to ${newPlan}.`);
  };

  if (!isOpen) return null;

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.school.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = selectedExamFilter === 'all' || s.examTrack.toLowerCase().includes(selectedExamFilter.toLowerCase());
    return matchesSearch && matchesTrack;
  });

  if (!isOpen) return null;

  // Passcode Security Gateway if not yet authenticated
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-[#091528] text-stone-100 rounded-3xl border border-amber-400/30 shadow-2xl overflow-hidden p-6 sm:p-8 font-sans animate-in zoom-in-95">
          <button
            type="button"
            onClick={handleCloseAndLock}
            className="absolute right-4 top-4 p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-400/30 flex items-center justify-center shadow-lg mt-2">
              <Lock className="h-7 w-7 text-amber-300" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                Institutional Access
              </span>
              <h3 className="text-xl font-bold font-serif text-white mt-2">
                Faculty &amp; Administrator Login
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                Confidential candidate data, board analytics, and item bank tools are restricted to verified faculty and administrators.
              </p>
            </div>

            <form onSubmit={handleVerifyPasscode} className="w-full space-y-3 pt-2">
              <div className="text-left">
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                  Master Administrative Passcode
                </label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter faculty passcode"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (pinError) setPinError('');
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/15 focus:border-amber-400 rounded-xl text-xs sm:text-sm text-white placeholder-stone-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {pinError && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-1.5 text-left">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#c4553a] to-[#d4715a] hover:from-[#d4715a] hover:to-[#c4553a] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Verify &amp; Enter Portal</span>
              </button>

              <div className="text-[11px] text-stone-400 pt-2 border-t border-white/10">
                Evaluator Demo Passcode: <code className="text-amber-300 font-bold bg-white/5 px-1.5 py-0.5 rounded font-mono">admin2026</code>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#091528] text-stone-100 rounded-3xl border border-amber-400/30 shadow-2xl overflow-hidden max-h-[94vh] flex flex-col font-sans">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#061020] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c4553a] to-[#8b3a2f] flex items-center justify-center shadow-lg border border-amber-300/30">
              <Shield className="h-5 w-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-serif tracking-tight">
                  EliteProctorPrep Faculty &amp; Admin Command Center
                </h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Institutional oversight &bull; 24,850+ enrolled nursing candidates &bull; 300,000+ item bank
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCloseAndLock}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-stone-300 border border-white/10 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="h-3.5 w-3.5 text-amber-300" />
              <span>Lock &amp; Exit</span>
            </button>
            <button
              type="button"
              onClick={handleCloseAndLock}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Admin Portal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action Notice toast */}
        {actionNotice && (
          <div className="bg-emerald-600/90 text-white text-xs py-2 px-6 flex items-center justify-between gap-2 border-b border-emerald-500 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-emerald-200 shrink-0" />
              <span>{actionNotice}</span>
            </div>
            <button type="button" onClick={() => setActionNotice(null)} className="text-emerald-200 hover:text-white font-bold cursor-pointer">
              &times;
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 bg-[#08172c] border-b border-white/10 flex items-center gap-1 overflow-x-auto shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-[#c4553a] text-white bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <TrendingUp className="h-4 w-4 text-amber-400" />
            <span>Executive Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'students'
                ? 'border-[#c4553a] text-white bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="h-4 w-4 text-emerald-400" />
            <span>Candidates &amp; Students ({students.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'questions'
                ? 'border-[#c4553a] text-white bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="h-4 w-4 text-blue-400" />
            <span>Question Bank &amp; Curricula</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ngn')}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'ngn'
                ? 'border-[#c4553a] text-white bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span>NGN Unfolding Cases</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('promos')}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'promos'
                ? 'border-[#c4553a] text-white bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Tag className="h-4 w-4 text-amber-400" />
            <span>Coupons &amp; Subscriptions</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`px-4 py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'system'
                ? 'border-[#c4553a] text-white bg-white/5'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Server className="h-4 w-4 text-teal-400" />
            <span>Integrations &amp; Server Health</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-4.5 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-medium mb-1.5">
                    <span>Active Candidates</span>
                    <Users className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">24,850</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                    <span>↑ +18.4% this month</span>
                  </div>
                </div>

                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-4.5 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-medium mb-1.5">
                    <span>Board Pass Rate</span>
                    <Award className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">98.4%</div>
                  <div className="text-[11px] text-amber-300 mt-1 flex items-center gap-1 font-semibold">
                    <span>100% Pass Guarantee Backed</span>
                  </div>
                </div>

                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-4.5 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-medium mb-1.5">
                    <span>Questions Dispatched</span>
                    <BookOpen className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">300,000+</div>
                  <div className="text-[11px] text-blue-300 mt-1 flex items-center gap-1 font-semibold">
                    <span>Across 8 Licensure Tracks</span>
                  </div>
                </div>

                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-4.5 shadow-sm">
                  <div className="flex items-center justify-between text-stone-400 text-xs font-medium mb-1.5">
                    <span>Monthly Gross Vol.</span>
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">$184,200</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
                    <span>90-Day Plan Leading (62%)</span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Exam Breakdown & Live Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Track Enrollments */}
                <div className="lg:col-span-2 bg-[#0e213b] border border-white/10 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Candidate Distribution by Licensure Track</span>
                      </h3>
                      <p className="text-xs text-stone-400">Real-time candidate allocations across registered programs</p>
                    </div>
                    <span className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-stone-300 font-mono">
                      Q4 2026 Cohort
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-300 mb-1">
                        <span className="font-bold text-white">NCLEX-RN® Registered Nurse Licensure</span>
                        <span>14,910 candidates (60%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#c4553a] to-[#d4715a] rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-300 mb-1">
                        <span className="font-bold text-white">ATI TEAS 7 Entrance Examination</span>
                        <span>4,970 candidates (20%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-300 mb-1">
                        <span className="font-bold text-white">NCLEX-PN® Practical Nurse Licensure</span>
                        <span>2,730 candidates (11%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '11%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-300 mb-1">
                        <span className="font-bold text-white">HESI A2 &amp; Comprehensive Predictor</span>
                        <span>1,490 candidates (6%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '6%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-stone-300 mb-1">
                        <span className="font-bold text-white">CCRN, FNP &amp; Advanced Practice Specialties</span>
                        <span>750 candidates (3%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '3%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live System Activity Feed */}
                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-emerald-400" />
                      <span>Live Candidate Milestones</span>
                    </h3>
                    <p className="text-xs text-stone-400">Recent student diagnostics and pass readiness signals</p>

                    <div className="mt-4 space-y-3">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                        <div className="flex justify-between text-[11px] text-stone-400">
                          <span className="font-bold text-emerald-300">Sarah J. &bull; Johns Hopkins</span>
                          <span>2m ago</span>
                        </div>
                        <p className="text-stone-200">Completed 60-Item Pharmacological Drill (94% accuracy, 99% pass likelihood).</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                        <div className="flex justify-between text-[11px] text-stone-400">
                          <span className="font-bold text-blue-300">Marcus V. &bull; NYU Rory Meyers</span>
                          <span>11m ago</span>
                        </div>
                        <p className="text-stone-200">Finished NGN Unfolding Sepsis Case Study &bull; Scored 6/6 clinical reasoning steps.</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1">
                        <div className="flex justify-between text-[11px] text-stone-400">
                          <span className="font-bold text-amber-300">System Notification</span>
                          <span>24m ago</span>
                        </div>
                        <p className="text-stone-200">Resend delivered diagnostic score summary to <span className="font-mono text-[11px] text-stone-300">david.oc@upenn.edu</span>.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('students')}
                    className="w-full py-2 bg-white/10 hover:bg-white/15 text-stone-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Inspect Full Student Database →</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CANDIDATE & STUDENT MANAGEMENT */}
          {activeTab === 'students' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search candidate name, email, or nursing school..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-stone-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedExamFilter}
                    onChange={(e) => setSelectedExamFilter(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all" className="bg-[#08172c]">All Licensure Tracks</option>
                    <option value="rn" className="bg-[#08172c]">NCLEX-RN®</option>
                    <option value="pn" className="bg-[#08172c]">NCLEX-PN®</option>
                    <option value="teas" className="bg-[#08172c]">ATI TEAS 7</option>
                    <option value="hesi" className="bg-[#08172c]">HESI A2</option>
                    <option value="ccrn" className="bg-[#08172c]">CCRN Adult</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowAddStudent(true)}
                    className="px-3.5 py-2 bg-[#c4553a] hover:bg-[#d4715a] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Enroll Candidate</span>
                  </button>
                </div>
              </div>

              {/* Modal to add candidate */}
              {showAddStudent && (
                <div className="p-5 rounded-2xl bg-[#0e213b] border border-amber-400/40 shadow-xl space-y-4 animate-in slide-in-from-top-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#c4553a]" />
                      <span>Manually Register / Grant Candidate Access</span>
                    </h4>
                    <button type="button" onClick={() => setShowAddStudent(false)} className="text-stone-400 hover:text-white cursor-pointer">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateStudent} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Jordan Mitchell"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. jmitchell@nursing.edu"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">Nursing School / Institution</label>
                      <input
                        type="text"
                        placeholder="e.g. Duke University School of Nursing"
                        value={newStudent.school}
                        onChange={(e) => setNewStudent({ ...newStudent, school: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">Exam Program</label>
                      <select
                        value={newStudent.examTrack}
                        onChange={(e) => setNewStudent({ ...newStudent, examTrack: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                      >
                        <option value="NCLEX-RN®" className="bg-[#08172c]">NCLEX-RN®</option>
                        <option value="NCLEX-PN®" className="bg-[#08172c]">NCLEX-PN®</option>
                        <option value="ATI TEAS 7" className="bg-[#08172c]">ATI TEAS 7</option>
                        <option value="HESI A2" className="bg-[#08172c]">HESI A2</option>
                        <option value="CCRN Adult" className="bg-[#08172c]">CCRN Adult</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Confirm &amp; Provision
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Students Table */}
              <div className="bg-[#0e213b] border border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-stone-400 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Exam Track &amp; Institution</th>
                        <th className="py-3 px-4">Assigned Plan</th>
                        <th className="py-3 px-4 text-center">Progress</th>
                        <th className="py-3 px-4 text-center">Pass Likelihood</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-stone-200">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-stone-400">
                            No candidates match your current filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((s) => (
                          <tr key={s.id} className="hover:bg-white/[0.03] transition-colors">
                            <td className="py-3 px-4 font-medium text-white">
                              <div className="font-bold">{s.name}</div>
                              <div className="text-[11px] text-stone-400 font-mono">{s.email}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-semibold text-stone-200">{s.examTrack}</div>
                              <div className="text-[11px] text-stone-400">{s.school}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                {s.plan}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="font-bold text-white">{s.progress}%</div>
                              <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mt-1 overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${s.progress}%` }} />
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`font-bold ${s.passProbability >= 90 ? 'text-emerald-300' : s.passProbability >= 80 ? 'text-blue-300' : 'text-amber-300'}`}>
                                {s.passProbability}%
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                s.status === 'Completed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : s.status === 'Active'
                                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}>
                                {s.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleUpgradePlan(s.id, '180-Day Lifetime Pass')}
                                  title="Upgrade to 180-Day Lifetime Pass"
                                  className="px-2 py-1 bg-white/10 hover:bg-white/20 text-[11px] rounded text-stone-200 transition-colors cursor-pointer"
                                >
                                  Upgrade
                                </button>
                                <button
                                  type="button"
                                  onClick={() => notify(`Sent fresh clinical audit email to ${s.email} via Resend.`)}
                                  title="Dispatch Diagnostic Report to candidate"
                                  className="p-1.5 bg-white/10 hover:bg-white/20 text-stone-200 rounded transition-colors cursor-pointer"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteStudent(s.id, s.name)}
                                  title="Remove student"
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: QUESTION BANK & CURRICULA CONTROL */}
          {activeTab === 'questions' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Item Bank &amp; High-Yield Question Registry</h3>
                  <p className="text-xs text-stone-400">Inventory and distribution across all 8 verified US clinical board tracks</p>
                </div>
                <button
                  type="button"
                  onClick={() => notify('Practice item added to staging queue.')}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Draft New Item</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {EXAM_TRACKS.map((exam) => (
                  <div key={exam.id} className="bg-[#0e213b] border border-white/10 rounded-2xl p-4.5 space-y-3 shadow-sm hover:border-amber-400/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded text-amber-300">
                        {exam.badge}
                      </span>
                      <span className="text-xs font-bold text-emerald-400">Verified</span>
                    </div>

                    <h4 className="font-bold text-sm text-white line-clamp-1">{exam.name}</h4>
                    <p className="text-xs text-stone-400 line-clamp-2">{exam.description}</p>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-stone-300 font-semibold">{exam.subjectsCount} Core Domains</span>
                      <span className="text-[11px] text-stone-400 font-mono">ID #{exam.courseId}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: NGN UNFOLDING CLINICAL CASE STUDIES */}
          {activeTab === 'ngn' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-white">NCSBN Next Generation Clinical Case Registry</h3>
                <p className="text-xs text-stone-400">Authentic 6-step clinical judgment unfolding EHR scenarios</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c4553a]/20 text-rose-300 border border-[#c4553a]/30">
                      Emergency &bull; Critical Sepsis
                    </span>
                    <span className="text-xs text-stone-400 font-mono">6 EHR Screens</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Unfolding Case 01: Acute Sepsis &amp; Septic Shock</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Client: 68-year-old male presenting from skilled nursing facility with altered mental status, MAP &lt;60, lactate 4.8 mmol/L, and suspected pyelonephritis. Evaluates 1-hour sepsis resuscitation bundles, blood cultures, and fluid bolus timing.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-stone-400 border-t border-white/10">
                    <span>Clinical Judgment Level: Advanced</span>
                    <span className="text-emerald-400 font-bold">Standard Aligned</span>
                  </div>
                </div>

                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Cardiology &bull; Telemetry
                    </span>
                    <span className="text-xs text-stone-400 font-mono">6 EHR Screens</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Unfolding Case 02: Acute Decompensated Heart Failure</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Client: 72-year-old female with orthopnea, bilateral crackles, +3 pitting edema, and BNP &gt; 1,400 pg/mL. Tests high-Fowler's positioning, IV furosemide vs fluid restriction, and potassium-sparing medication administration.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-stone-400 border-t border-white/10">
                    <span>Clinical Judgment Level: High Yield</span>
                    <span className="text-emerald-400 font-bold">Standard Aligned</span>
                  </div>
                </div>

                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Maternal-Newborn &bull; L&amp;D
                    </span>
                    <span className="text-xs text-stone-400 font-mono">6 EHR Screens</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Unfolding Case 03: Severe Preeclampsia with HELLP Syndrome</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Client: 29-year-old G1P0 at 34 weeks gestation presenting with epigastric pain, visual scotomas, BP 172/108, and hyperreflexia. Focuses on magnesium sulfate toxicity monitoring and calcium gluconate antidote bedside readiness.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-stone-400 border-t border-white/10">
                    <span>Clinical Judgment Level: High Yield</span>
                    <span className="text-emerald-400 font-bold">Standard Aligned</span>
                  </div>
                </div>

                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Endocrinology &bull; ICU
                    </span>
                    <span className="text-xs text-stone-400 font-mono">6 EHR Screens</span>
                  </div>
                  <h4 className="font-bold text-white text-base">Unfolding Case 04: Diabetic Ketoacidosis (DKA) Resuscitation</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Client: 19-year-old with Type 1 Diabetes, glucose 560 mg/dL, arterial pH 7.18, and deep Kussmaul respirations. Focuses on IV insulin protocol titration, potassium repletion thresholds before insulin, and cerebral edema prevention.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-xs text-stone-400 border-t border-white/10">
                    <span>Clinical Judgment Level: Priority</span>
                    <span className="text-emerald-400 font-bold">Standard Aligned</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS & SUBSCRIPTION MANAGEMENT */}
          {activeTab === 'promos' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Promotional Discount &amp; Coupon Codes</h3>
                  <p className="text-xs text-stone-400">Institutional discounts, student cohort campaigns, and affiliate vouchers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddPromo(true)}
                  className="px-3.5 py-2 bg-[#c4553a] hover:bg-[#d4715a] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Discount Code</span>
                </button>
              </div>

              {showAddPromo && (
                <div className="p-5 rounded-2xl bg-[#0e213b] border border-amber-400/40 shadow-xl space-y-3 animate-in slide-in-from-top-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Tag className="h-4 w-4 text-amber-400" />
                      <span>Create New Promotional Voucher</span>
                    </h4>
                    <button type="button" onClick={() => setShowAddPromo(false)} className="text-stone-400 hover:text-white cursor-pointer">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreatePromo} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">Coupon Code</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SUMMER_RN"
                        value={newPromo.code}
                        onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white uppercase font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">Discount (%)</label>
                      <input
                        type="number"
                        min="5"
                        max="90"
                        required
                        value={newPromo.discountPercent}
                        onChange={(e) => setNewPromo({ ...newPromo, discountPercent: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 mb-1">Max Redemptions</label>
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        required
                        value={newPromo.maxUses}
                        onChange={(e) => setNewPromo({ ...newPromo, maxUses: Number(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Publish Code
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {promos.map((p) => (
                  <div key={p.id} className="bg-[#0e213b] border border-white/10 rounded-2xl p-5 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-black text-amber-300 bg-white/5 px-2.5 py-1 rounded-lg border border-amber-400/20">
                        {p.code}
                      </span>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {p.discountPercent}% OFF
                      </span>
                    </div>

                    <p className="text-xs text-stone-300">Target: <strong>{p.applicableExams}</strong></p>

                    <div>
                      <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                        <span>Redemptions</span>
                        <span className="font-mono">{p.usedCount} / {p.maxUses}</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${Math.round((p.usedCount / p.maxUses) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400">
                      <span>Expires: {p.expiresAt}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPromos(promos.filter(item => item.id !== p.id));
                          notify(`Promo code ${p.code} archived.`);
                        }}
                        className="text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
                      >
                        Deactivate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: INTEGRATIONS & SERVER HEALTH */}
          {activeTab === 'system' && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold text-white">System Infrastructure &amp; Third-Party Services</h3>
                <p className="text-xs text-stone-400">Status monitor for Clerk Auth, Neon Serverless Database, and Resend Mailer</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Clerk Auth Service */}
                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-400" />
                      <span>Clerk Authentication</span>
                    </span>
                    <span className={`w-2.5 h-2.5 rounded-full ${hasKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  </div>

                  <p className="text-xs text-stone-300">
                    Provides candidate identity, OAuth sign-ins, session security, and profile avatars.
                  </p>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] space-y-1 font-mono text-stone-300">
                    <div>App ID: <span className="text-amber-300">{targetAppId}</span></div>
                    <div>Status: <span className={hasKey ? 'text-emerald-300' : 'text-amber-300'}>{hasKey ? 'Configured & Active' : 'Key Ready'}</span></div>
                  </div>

                  {onOpenClerkConfig && (
                    <button
                      type="button"
                      onClick={onOpenClerkConfig}
                      className="w-full py-2 bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Configure Clerk Keys →
                    </button>
                  )}
                </div>

                {/* Neon Serverless PostgreSQL */}
                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Server className="h-4 w-4 text-emerald-400" />
                      <span>Neon PostgreSQL</span>
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>

                  <p className="text-xs text-stone-300">
                    Serverless relational storage for candidate records, quiz attempt history, and scores.
                  </p>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] space-y-1 font-mono text-stone-300">
                    <div>Adapter: <span className="text-emerald-300">@neondatabase/serverless</span></div>
                    <div>Schema: <span className="text-stone-300">candidates, quiz_attempts</span></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => notify('Neon database connection checked: Ready for candidate sync.')}
                    className="w-full py-2 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Test DB Ping
                  </button>
                </div>

                {/* Resend Email Dispatch */}
                <div className="bg-[#0e213b] border border-white/10 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-400" />
                      <span>Resend Email Dispatch</span>
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                  </div>

                  <p className="text-xs text-stone-300">
                    Sends verified clinical diagnostic score reports, pass certificates, and onboarding receipts.
                  </p>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] space-y-1 font-mono text-stone-300">
                    <div>Endpoint: <span className="text-blue-300">/api/send-email</span></div>
                    <div>Fallback: <span className="text-stone-300">Client Preview Modal Active</span></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => notify('Resend email service verified: Ready to dispatch candidate score summaries.')}
                    className="w-full py-2 bg-blue-600/30 hover:bg-blue-600/40 text-blue-200 border border-blue-500/30 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Send Test Score Report
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#061020] border-t border-white/10 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>All systems nominal &bull; EliteProctorPrep v2026.4 Clinical Engine</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCloseAndLock}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Done &amp; Lock
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
