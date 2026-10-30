import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ExamLibrary } from './components/ExamLibrary';
import { InteractiveToolsBanner } from './components/InteractiveToolsBanner';
import { HowItWorks } from './components/HowItWorks';
import { FeaturesBento } from './components/FeaturesBento';
import { Testimonials } from './components/Testimonials';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { QuizModal } from './components/QuizModal';
import { PlansModal } from './components/PlansModal';
import { AuthModal, CandidateProfile } from './components/AuthModals';
import { InfoModals } from './components/InfoModals';
import { NgnCaseSimulator } from './components/NgnCaseSimulator';
import { ReadinessCalculator } from './components/ReadinessCalculator';
import { PharmaDrillModal } from './components/PharmaDrillModal';
import { LegalModals } from './components/LegalModals';
import { StudentDashboardModal } from './components/StudentDashboardModal';
import { ClerkConfigModal } from './components/ClerkConfigModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { useClerkBridge } from './context/ClerkAuthContext';
import { ExamSubject, ExamTrack } from './data/examsData';

export default function App() {
  // Modal States
  const [authModal, setAuthModal] = useState<'signin' | 'signup' | null>(null);
  const [plansModalOpen, setPlansModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'mcqs' | 'blogs' | 'about' | 'contact' | null>(null);
  const [isClerkConfigOpen, setIsClerkConfigOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Advanced Tools Modals
  const [isNgnOpen, setIsNgnOpen] = useState(false);
  const [isReadinessOpen, setIsReadinessOpen] = useState(false);
  const [isPharmaDrillOpen, setIsPharmaDrillOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'guarantee' | null>(null);

  // Active Subject for Quiz Simulator
  const [activeSubject, setActiveSubject] = useState<ExamSubject | null>(null);
  const [activeExam, setActiveExam] = useState<ExamTrack | null>(null);

  // Clerk Auth Bridge
  const { hasKey, clerkSession, targetAppId } = useClerkBridge();

  // User Candidate Session State
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);

  // Sync Clerk Session if user signed in via Clerk
  useEffect(() => {
    if (clerkSession?.isSignedIn && clerkSession.email) {
      setLoggedInUser(clerkSession.email);
      setCandidateProfile({
        email: clerkSession.email,
        name: clerkSession.name || clerkSession.email.split('@')[0],
        examTrack: 'NCLEX-RN',
        loggedInAt: Date.now()
      });
      setAuthModal(null);
    }
  }, [clerkSession]);

  // Restore authenticated candidate session from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('epp_active_candidate');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email) {
          setLoggedInUser(parsed.email);
          setCandidateProfile(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not restore candidate session:', e);
    }
  }, []);

  const handleSignOut = () => {
    setLoggedInUser(null);
    setCandidateProfile(null);
    setIsDashboardOpen(false);
    try {
      localStorage.removeItem('epp_active_candidate');
    } catch (e) {
      console.warn('Could not clear candidate session:', e);
    }
  };

  const handleSelectSubject = (subject: ExamSubject, exam: ExamTrack) => {
    setActiveSubject(subject);
    setActiveExam(exam);
  };

  const handleStartNow = () => {
    setAuthModal('signup');
  };

  const handleExploreExams = () => {
    document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c1917] selection:bg-[#c4553a]/20 selection:text-[#8b3a2f]">
      {/* Top Banner if logged in */}
      {loggedInUser && (
        <div className="bg-[#06152d] text-white text-xs py-2 px-4 border-b border-white/10 z-50 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              Candidate Portal: <strong>{candidateProfile?.name || loggedInUser}</strong>
              {candidateProfile?.examTrack ? ` (${candidateProfile.examTrack})` : ''} &bull;{' '}
              {candidateProfile?.plan ? (
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded text-[10px] border border-emerald-400/30">
                  ★ {candidateProfile.plan.name} Active
                </span>
              ) : (
                'Free diagnostic session active'
              )}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsDashboardOpen(true)}
              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
            >
              My Study Dashboard →
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-stone-300 hover:text-white text-[11px] underline cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <Header
        onOpenSignIn={() => setAuthModal('signin')}
        onOpenSignUp={() => setAuthModal('signup')}
        onOpenPlans={() => setPlansModalOpen(true)}
        onOpenAbout={() => setInfoModalType('about')}
        onOpenContact={() => setInfoModalType('contact')}
        onOpenMcqs={() => setInfoModalType('mcqs')}
        onOpenBlog={() => setInfoModalType('blogs')}
        onOpenNgnSimulator={() => setIsNgnOpen(true)}
        onOpenReadinessCalculator={() => setIsReadinessOpen(true)}
        loggedInUser={candidateProfile?.name || loggedInUser}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {/* Section 0: Hero with Video & Readiness Card */}
        <Hero
          onStartNow={handleStartNow}
          onExploreExams={handleExploreExams}
          onOpenDashboard={() => setIsDashboardOpen(true)}
        />

        {/* Section 1: Explore Exam Library */}
        <ExamLibrary onSelectSubject={handleSelectSubject} />

        {/* Section 1.5: High-Yield Interactive Clinical Tools Banner */}
        <InteractiveToolsBanner
          onOpenNgnSimulator={() => setIsNgnOpen(true)}
          onOpenReadinessCalculator={() => setIsReadinessOpen(true)}
          onOpenPharmaDrill={() => setIsPharmaDrillOpen(true)}
          onOpenGuarantee={() => setLegalModalType('guarantee')}
        />

        {/* Section 2: How It Works */}
        <HowItWorks />

        {/* Section 3: Built for Nursing Success Bento Grid */}
        <FeaturesBento />

        {/* Section 4: Testimonials Carousel */}
        <Testimonials />

        {/* Section 4.5: Frequently Asked Questions (FAQ) Section */}
        <FaqSection onOpenContact={() => setInfoModalType('contact')} />

        {/* Section 5: CTA License Awaits */}
        <CtaSection onGetStarted={handleStartNow} />
      </main>

      {/* Upgraded 5-Column High-Trust Footer */}
      <Footer
        onOpenPlans={() => setPlansModalOpen(true)}
        onOpenAbout={() => setInfoModalType('about')}
        onOpenContact={() => setInfoModalType('contact')}
        onOpenSignIn={() => setAuthModal('signin')}
        onOpenSignUp={() => setAuthModal('signup')}
        onOpenMcqs={() => setInfoModalType('mcqs')}
        onOpenBlog={() => setInfoModalType('blogs')}
        onOpenNgnSimulator={() => setIsNgnOpen(true)}
        onOpenReadinessCalculator={() => setIsReadinessOpen(true)}
        onOpenPharmaDrill={() => setIsPharmaDrillOpen(true)}
        onOpenLegal={(type) => setLegalModalType(type)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating WhatsApp Widget */}
      <WhatsAppWidget />

      {/* Candidate Interactive Study Dashboard Modal */}
      <StudentDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        userEmail={loggedInUser}
        candidateName={candidateProfile?.name}
        initialExamTrack={candidateProfile?.examTrack}
        candidatePlan={candidateProfile?.plan}
        onSignOut={handleSignOut}
        onOpenNgnSimulator={() => setIsNgnOpen(true)}
        onOpenReadinessCalculator={() => setIsReadinessOpen(true)}
        onOpenPharmaDrill={() => setIsPharmaDrillOpen(true)}
        onOpenMcqs={() => setInfoModalType('mcqs')}
        onStartPracticeQuiz={(subject, exam) => {
          setActiveSubject(subject);
          setActiveExam(exam);
        }}
        onOpenPlans={() => setPlansModalOpen(true)}
        onOpenAdmin={() => {
          setIsDashboardOpen(false);
          setIsAdminOpen(true);
        }}
      />

      {/* Interactive Quiz / Practice Question Simulator Modal */}
      {activeSubject && activeExam && (
        <QuizModal
          subject={activeSubject}
          exam={activeExam}
          onClose={() => {
            setActiveSubject(null);
            setActiveExam(null);
          }}
          onOpenSignUp={() => setAuthModal('signup')}
        />
      )}

      {/* Next Gen NCLEX (NGN) Clinical Case Study Simulator Modal */}
      {isNgnOpen && (
        <NgnCaseSimulator
          onClose={() => setIsNgnOpen(false)}
          onOpenSignUp={() => setAuthModal('signup')}
        />
      )}

      {/* AI Pass Readiness & Daily Target Calculator Modal */}
      {isReadinessOpen && (
        <ReadinessCalculator
          onClose={() => setIsReadinessOpen(false)}
          onOpenSignUp={() => setAuthModal('signup')}
        />
      )}

      {/* Pharmacology & Antidotes Flashcard Drill Modal */}
      {isPharmaDrillOpen && (
        <PharmaDrillModal
          onClose={() => setIsPharmaDrillOpen(false)}
          onOpenSignUp={() => setAuthModal('signup')}
        />
      )}

      {/* Legal & Policy Modals (Terms, Privacy, Pass Guarantee) */}
      {legalModalType && (
        <LegalModals
          type={legalModalType}
          onClose={() => setLegalModalType(null)}
        />
      )}

      {/* Plans & Pricing Modal */}
      {plansModalOpen && (
        <PlansModal
          onClose={() => setPlansModalOpen(false)}
          onOpenSignUp={() => setAuthModal('signup')}
          userEmail={candidateProfile?.email || loggedInUser}
          onPlanPurchased={(plan) => {
            const updatedProfile: CandidateProfile = {
              name: candidateProfile?.name || plan.receiptId.slice(0, 8),
              email: candidateProfile?.email || loggedInUser || 'candidate@eliteproctor.com',
              examTrack: plan.exam,
              loggedInAt: candidateProfile?.loggedInAt || Date.now(),
              plan: plan
            };
            setCandidateProfile(updatedProfile);
            setLoggedInUser(updatedProfile.email);
            try {
              localStorage.setItem('epp_active_candidate', JSON.stringify(updatedProfile));
            } catch (e) {
              console.warn(e);
            }
          }}
        />
      )}

      {/* Auth Modal (Sign In / Sign Up) */}
      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitchMode={(mode) => setAuthModal(mode)}
          onSuccess={(result) => {
            if (typeof result === 'string') {
              setLoggedInUser(result);
              setCandidateProfile({
                email: result,
                name: result.split('@')[0],
                examTrack: 'NCLEX-RN',
              });
            } else {
              setLoggedInUser(result.email);
              setCandidateProfile(result);
            }
            setIsDashboardOpen(true);
          }}
        />
      )}

      {/* Clerk Configuration & Integration Modal */}
      <ClerkConfigModal
        isOpen={isClerkConfigOpen}
        onClose={() => setIsClerkConfigOpen(false)}
      />

      {/* Faculty & Super Admin Command Center Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenClerkConfig={() => {
          setIsAdminOpen(false);
          setIsClerkConfigOpen(true);
        }}
      />

      {/* Info Modals (MCQs PDFs, Blogs, About Us, Contact) */}
      {infoModalType && (
        <InfoModals
          type={infoModalType}
          onClose={() => setInfoModalType(null)}
          onOpenPlans={() => setPlansModalOpen(true)}
        />
      )}
    </div>
  );
}
