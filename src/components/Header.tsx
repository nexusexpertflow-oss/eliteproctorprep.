import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Activity, LayoutDashboard, UserCheck, LogOut } from 'lucide-react';
import { useClerkBridge, UserButton } from '../context/ClerkAuthContext';

interface HeaderProps {
  onOpenSignIn: () => void;
  onOpenSignUp: () => void;
  onOpenPlans: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenMcqs: () => void;
  onOpenBlog: () => void;
  onOpenNgnSimulator?: () => void;
  onOpenReadinessCalculator?: () => void;
  loggedInUser?: string | null;
  onOpenDashboard?: () => void;
  onSignOut?: () => void;
  onOpenClerkConfig?: () => void;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSignIn,
  onOpenSignUp,
  onOpenPlans,
  onOpenAbout,
  onOpenContact,
  onOpenMcqs,
  onOpenBlog,
  onOpenNgnSimulator,
  onOpenReadinessCalculator,
  loggedInUser,
  onOpenDashboard,
  onSignOut,
  onOpenClerkConfig,
  onOpenAdmin,
}) => {
  const { hasKey, targetAppId, clerkSession } = useClerkBridge();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-200 border-b border-white/10 ${
        scrolled ? 'scrolled bg-[#06152d] shadow-lg shadow-black/40' : 'bg-[#06152d] backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand Zone */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 shrink-0 cursor-pointer group"
            aria-label="EliteProctorPrep Home"
          >
            {/* Clean white badge that showcases the official EliteProctorPrep logo */}
            <div className="bg-white/95 hover:bg-white px-2 sm:px-2.5 py-1 rounded-xl shadow-sm border border-amber-300/40 transition-all flex items-center gap-1.5 sm:gap-2">
              <img
                src="/assets/favicon.png"
                alt="EliteProctorPrep"
                className="h-6 w-6 sm:h-7 sm:w-7 rounded-lg object-contain shrink-0"
                width="28"
                height="28"
              />
              <span className="font-bold text-[#071838] text-xs sm:text-base tracking-tight font-serif">
                Elite<span className="text-[#c4553a]">Proctor</span>Prep
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white/90 hover:text-white hover:bg-white/10"
            >
              Home
            </a>
            <a
              href="#exams"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white/90 hover:text-white hover:bg-white/10"
            >
              Exams
            </a>

            {/* Direct Study Dashboard trigger */}
            {onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/30 transition-colors flex items-center gap-1.5 cursor-pointer ml-1 mr-1"
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
              </button>
            )}

            {/* NGN Simulator direct trigger */}
            {onOpenNgnSimulator && (
              <button
                type="button"
                onClick={onOpenNgnSimulator}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-400/20 text-[#e8a838] hover:bg-amber-400/30 border border-amber-400/30 transition-colors flex items-center gap-1.5 cursor-pointer ml-1 mr-1"
              >
                <Activity className="h-3.5 w-3.5" /> NGN Simulator
              </button>
            )}

            {/* Pass Predictor direct trigger */}
            {onOpenReadinessCalculator && (
              <button
                type="button"
                onClick={onOpenReadinessCalculator}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white/90 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                Pass Predictor
              </button>
            )}

            <button
              type="button"
              onClick={onOpenMcqs}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white/90 hover:text-white hover:bg-white/10 cursor-pointer"
            >
              MCQs PDFs
            </button>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white/90 hover:text-white hover:bg-white/10"
            >
              Features
            </a>
            <a
              href="#faq"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white/90 hover:text-white hover:bg-white/10"
            >
              FAQ
            </a>
            <button
              type="button"
              onClick={onOpenPlans}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-white/90 hover:text-white hover:bg-white/10 cursor-pointer font-semibold text-[#e8a838]"
            >
              Plans
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {loggedInUser ? (
              <>
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold transition-all h-8 rounded-lg px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm cursor-pointer"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">My Hub</span>
                  <span className="sm:hidden">Hub</span>
                </button>
                {clerkSession?.isSignedIn ? (
                  <div className="flex items-center ml-1">
                    <UserButton />
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-1.5 bg-white/10 py-1 px-2.5 rounded-lg border border-white/10 text-xs text-white">
                    <div className="w-5 h-5 rounded-full bg-[#c4553a] flex items-center justify-center text-[10px] font-bold text-white">
                      {loggedInUser.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate text-stone-200 text-[11px]">{loggedInUser}</span>
                  </div>
                )}
                {onSignOut && (
                  <button
                    type="button"
                    onClick={onSignOut}
                    title="Sign Out"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onOpenSignIn}
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors h-8 rounded-md px-2.5 sm:px-3 text-xs text-white hover:bg-white/10 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={onOpenSignUp}
                  className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-all h-8 rounded-md px-2.5 sm:px-3 text-xs bg-[#c4553a] hover:bg-[#8b3a2f] text-white shadow-lg shadow-[#c4553a]/25 cursor-pointer"
                >
                  Sign up
                </button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-lg h-8 w-8 sm:h-9 sm:w-9 lg:hidden text-white hover:bg-white/10 cursor-pointer ml-0.5"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden bg-[#06152d]/98 border-b border-white/10 px-4 pt-3 pb-6 space-y-1 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <a
            className="block px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Home
          </a>
          <a
            className="block px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
            href="#exams"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              document.getElementById('exams')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Exam Tracks
          </a>

          {onOpenDashboard && (
            <button
              type="button"
              className="block w-full text-left px-3 py-2.5 rounded-lg text-base font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-400/20 cursor-pointer flex items-center gap-2"
              onClick={() => {
                closeMenu();
                onOpenDashboard();
              }}
            >
              <LayoutDashboard className="h-4 w-4" /> Candidate Study Dashboard
            </button>
          )}

          {onOpenNgnSimulator && (
            <button
              type="button"
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-[#e8a838] bg-amber-400/10 hover:bg-amber-400/20"
              onClick={() => {
                closeMenu();
                onOpenNgnSimulator();
              }}
            >
              ⚡ Next Gen NCLEX (NGN) Simulator
            </button>
          )}

          {onOpenReadinessCalculator && (
            <button
              type="button"
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
              onClick={() => {
                closeMenu();
                onOpenReadinessCalculator();
              }}
            >
              📊 Pass Readiness Predictor
            </button>
          )}

          <button
            type="button"
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
            onClick={() => {
              closeMenu();
              onOpenMcqs();
            }}
          >
            MCQs PDFs
          </button>
          <a
            className="block px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Features
          </a>
          <a
            className="block px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            FAQ
          </a>
          <button
            type="button"
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
            onClick={() => {
              closeMenu();
              onOpenPlans();
            }}
          >
            Subscription Plans
          </button>
          <button
            type="button"
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
            onClick={() => {
              closeMenu();
              onOpenAbout();
            }}
          >
            About Us
          </button>
          <button
            type="button"
            className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-white/90 hover:bg-white/10 hover:text-white"
            onClick={() => {
              closeMenu();
              onOpenContact();
            }}
          >
            Contact Support
          </button>

          <div className="border-t border-white/10 my-3 pt-3 flex flex-col gap-2">
            {loggedInUser ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    if (onOpenDashboard) onOpenDashboard();
                  }}
                  className="w-full py-2.5 px-4 text-center rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  My Study Dashboard ({loggedInUser})
                </button>
                {onSignOut && (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onSignOut();
                    }}
                    className="w-full py-2 text-center rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onOpenSignIn();
                  }}
                  className="block w-full py-2.5 text-center rounded-lg text-sm font-medium text-white/90 hover:bg-white/10 border border-white/10 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    onOpenSignUp();
                  }}
                  className="block w-full py-2.5 text-center rounded-lg text-sm font-medium bg-[#c4553a] text-white hover:bg-[#8b3a2f] shadow-md shadow-[#c4553a]/30 cursor-pointer"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
