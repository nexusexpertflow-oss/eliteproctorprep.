import React, { useState } from 'react';
import {
  X,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  GraduationCap,
  Calendar,
  Building2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { EXAM_TRACKS } from '../data/examsData';

export interface CandidateProfile {
  name: string;
  email: string;
  examTrack: string;
  school?: string;
  targetDate?: string;
  rememberMe?: boolean;
  loggedInAt?: number;
  plan?: {
    id: string;
    name: string;
    price: string;
    exam: string;
    period: string;
    purchasedAt: string;
    receiptId: string;
  };
}

interface AuthModalProps {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSwitchMode: (mode: 'signin' | 'signup') => void;
  onSuccess: (candidate: CandidateProfile | string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  mode,
  onClose,
  onSwitchMode,
  onSuccess,
}) => {
  // Active internal view: 'signin', 'signup', or 'forgot'
  const [currentView, setCurrentView] = useState<'signin' | 'signup' | 'forgot'>(mode);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedExam, setSelectedExam] = useState('NCLEX-RN');
  const [nursingSchool, setNursingSchool] = useState('');
  const [targetDateWindow, setTargetDateWindow] = useState('Next 60 Days');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'None', color: 'bg-stone-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 9) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { score: 2, label: 'Good', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong (Recommended)', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  // Quick autofill demo candidates
  const handleQuickDemo = (role: 'nclex-rn' | 'teas' | 'hesi') => {
    setErrorMessage('');
    if (role === 'nclex-rn') {
      setEmail('taylor.rn@eliteproctorprep.com');
      setPassword('NursePass2026!');
      setName('Taylor Morgan, BSN Candidate');
      setSelectedExam('NCLEX-RN');
      setNursingSchool('Chamberlain College of Nursing');
      setTargetDateWindow('Within 30 Days (Intensive)');
    } else if (role === 'teas') {
      setEmail('alex.teas@college.edu');
      setPassword('TeasPrep2026!');
      setName('Alex Rivera, Pre-Nursing');
      setSelectedExam('ATI TEAS 7');
      setNursingSchool('Galen College of Nursing');
      setTargetDateWindow('Next 60 Days');
    } else {
      setEmail('sam.hesi@prep.edu');
      setPassword('HesiReady2026!');
      setName('Sam Washington');
      setSelectedExam('HESI A2');
      setNursingSchool('Western Governors University');
      setTargetDateWindow('Next 90 Days');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (currentView === 'signup') {
      if (!name.trim()) {
        setErrorMessage('Please provide your candidate name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
      if (!agreeTerms) {
        setErrorMessage('Please accept the Terms of Service & Honor Code.');
        return;
      }
    }

    setSubmitted(true);

    const candidateProfile: CandidateProfile = {
      email,
      name: name || (email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase())),
      examTrack: selectedExam,
      school: nursingSchool || 'Nursing Program',
      targetDate: targetDateWindow,
      rememberMe,
      loggedInAt: Date.now(),
    };

    if (rememberMe) {
      try {
        localStorage.setItem('epp_active_candidate', JSON.stringify(candidateProfile));
      } catch (err) {
        console.warn('Could not save to localStorage', err);
      }
    }

    setTimeout(() => {
      onSuccess(candidateProfile);
      onClose();
    }, 1100);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address to receive reset instructions.');
      return;
    }

    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setResetSent(true);
    }, 900);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200 relative my-auto max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          /* Success Screen Transition */
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-md ring-4 ring-emerald-50 animate-bounce">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              {currentView === 'signup' ? 'Welcome to EliteProctorPrep!' : 'Welcome Back!'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
              {currentView === 'signup'
                ? `Account configured for ${name || email}. Launching your ${selectedExam} study portal...`
                : `Authenticated as ${email}. Syncing your progress and readiness metrics...`}
            </p>
            <div className="pt-2 flex justify-center items-center gap-2 text-xs font-semibold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Opening Candidate Dashboard...
            </div>
          </div>
        ) : currentView === 'forgot' ? (
          /* Forgot Password View */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 text-[#c4553a] border border-amber-200/60 shadow-xs mb-3">
                <KeyRound className="h-6 w-6" />
              </div>
              <h3 id="auth-modal-title" className="text-xl font-bold font-serif text-stone-900">
                Reset Candidate Password
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Enter your registered student email address and we'll dispatch an encrypted recovery link and one-time verification code.
              </p>
            </div>

            {resetSent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-emerald-900">Recovery Email Dispatched</h4>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  We've sent password reset instructions to <strong className="text-emerald-900">{email}</strong>.
                  Please check your inbox (and spam folder) within the next 15 minutes.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetSent(false);
                      setCurrentView('signin');
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Return to Sign In
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. candidate@nursing.edu"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 focus:border-[#c4553a] text-stone-900 placeholder:text-stone-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full py-2.5 px-4 bg-[#c4553a] hover:bg-[#8b3a2f] text-white font-semibold text-xs rounded-xl shadow-md shadow-[#c4553a]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isResetting ? (
                    <>
                      <RotateCcw className="h-4 w-4 animate-spin" />
                      Sending Link...
                    </>
                  ) : (
                    <>
                      Send Password Reset Link
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setCurrentView('signin');
                    }}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900 underline cursor-pointer"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Sign In & Sign Up Tabbed View */
          <div>
            {/* Top Brand Tag */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl bg-white border border-amber-300/40 shadow-xs mx-auto mb-2.5 gap-2">
                <img
                  src="/assets/favicon.png"
                  alt="EliteProctorPrep"
                  className="h-6 w-6 rounded-md object-contain shrink-0"
                  width="24"
                  height="24"
                />
                <span className="font-bold text-[#071838] text-xs sm:text-sm tracking-tight font-serif">
                  Elite<span className="text-[#c4553a]">Proctor</span>Prep
                </span>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex bg-stone-100 p-1 rounded-xl max-w-xs mx-auto mt-2 border border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setCurrentView('signin');
                    onSwitchMode('signin');
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    currentView === 'signin'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setCurrentView('signup');
                    onSwitchMode('signup');
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    currentView === 'signup'
                      ? 'bg-white text-[#c4553a] shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <h3 id="auth-modal-title" className="text-lg sm:text-xl font-bold font-serif text-stone-900 mt-4">
                {currentView === 'signup' ? 'Start Your Free Board Prep Account' : 'Welcome Back, Candidate'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {currentView === 'signup'
                  ? 'Join 50,000+ nursing candidates. Instant access to diagnostic MCQs & NGN cases.'
                  : 'Access your saved practice tests, clinical rationales, and pass probability.'}
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {currentView === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Smith, BSN"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 focus:border-[#c4553a] text-stone-900 placeholder:text-stone-400"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="student@nursing.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 focus:border-[#c4553a] text-stone-900 placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* Exam Track & Nursing School for Sign Up */}
              {currentView === 'signup' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Target Exam Track <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <select
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 text-stone-900"
                      >
                        {EXAM_TRACKS.map((exam) => (
                          <option key={exam.id} value={exam.name}>
                            {exam.name} ({exam.badge})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Nursing School / College
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        placeholder="e.g. Chamberlain Univ."
                        value={nursingSchool}
                        onChange={(e) => setNursingSchool(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 text-stone-900 placeholder:text-stone-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  {currentView === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage('');
                        setCurrentView('forgot');
                      }}
                      className="text-[11px] font-semibold text-[#c4553a] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 focus:border-[#c4553a] text-stone-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password strength indicator for signup */}
                {currentView === 'signup' && password.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-500">
                      <span>Password strength:</span>
                      <span className="font-semibold text-stone-700">{passwordStrength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden flex gap-1">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          passwordStrength.score >= 1 ? passwordStrength.color : 'bg-transparent'
                        }`}
                        style={{ width: '33.3%' }}
                      />
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          passwordStrength.score >= 2 ? passwordStrength.color : 'bg-transparent'
                        }`}
                        style={{ width: '33.3%' }}
                      />
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          passwordStrength.score >= 3 ? passwordStrength.color : 'bg-transparent'
                        }`}
                        style={{ width: '33.3%' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password for Sign Up */}
              {currentView === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 focus:border-[#c4553a] text-stone-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-[10px] text-rose-600 mt-1">Passwords do not match</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
                      <Check className="h-3 w-3" /> Passwords match
                    </p>
                  )}
                </div>
              )}

              {/* Target Exam Date for Sign Up */}
              {currentView === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Target Exam Timeline
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                    <select
                      value={targetDateWindow}
                      onChange={(e) => setTargetDateWindow(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 text-stone-900"
                    >
                      <option value="Within 30 Days (Intensive)">Within 30 Days (Sprint Prep)</option>
                      <option value="Next 60 Days">Next 60 Days (Standard Pace)</option>
                      <option value="Next 90 Days">Next 90 Days (Comprehensive)</option>
                      <option value="Final Semester / Later this year">Final Semester / Later this year</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Checkboxes: Remember Me & Terms */}
              <div className="pt-1 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#c4553a] focus:ring-[#c4553a] border-stone-300 h-3.5 w-3.5"
                  />
                  <span>Keep me signed in on this browser</span>
                </label>

                {currentView === 'signup' && (
                  <label className="flex items-start gap-2 cursor-pointer text-[11px] text-stone-600 select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded text-[#c4553a] focus:ring-[#c4553a] border-stone-300 h-3.5 w-3.5 mt-0.5"
                    />
                    <span>
                      I accept the{' '}
                      <span className="font-semibold text-stone-800 underline">Terms of Service</span>,{' '}
                      <span className="font-semibold text-stone-800 underline">Nursing Honor Code</span>, and{' '}
                      <span className="font-semibold text-stone-800 underline">Pass Guarantee Policy</span>.
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#c4553a] hover:bg-[#8b3a2f] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-[#c4553a]/25 transition-all cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                {currentView === 'signup' ? (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Create Free Account & Start Diagnostic
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    Sign In to Candidate Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Pre-fills */}
            <div className="mt-4 pt-3.5 border-t border-stone-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Fast Demo Test-Drive
                </span>
                <span className="text-[10px] text-stone-400">1-click fill</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('nclex-rn')}
                  className="py-1 px-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-medium transition-colors text-center cursor-pointer hover:border-amber-300"
                >
                  🎓 NCLEX-RN
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('teas')}
                  className="py-1 px-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-medium transition-colors text-center cursor-pointer hover:border-amber-300"
                >
                  🩺 ATI TEAS 7
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('hesi')}
                  className="py-1 px-2 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-medium transition-colors text-center cursor-pointer hover:border-amber-300"
                >
                  💊 HESI A2
                </button>
              </div>
            </div>

            {/* Bottom Security / Trust Footer */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-center gap-2 text-[10px] text-stone-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>256-bit TLS encrypted &bull; HIPAA / FERPA candidate vault</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
