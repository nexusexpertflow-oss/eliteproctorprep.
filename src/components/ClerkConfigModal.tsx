import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink, CheckCircle2, AlertCircle, Copy, Terminal, Server, ArrowRight } from 'lucide-react';
import { useClerkBridge, CLERK_APP_ID } from '../context/ClerkAuthContext';

interface ClerkConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClerkConfigModal: React.FC<ClerkConfigModalProps> = ({ isOpen, onClose }) => {
  const { hasKey, activeKey, setPublishableKey, targetAppId } = useClerkBridge();
  const [inputKey, setInputKey] = useState(activeKey);
  const [copiedAppId, setCopiedAppId] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (activeKey) {
      setInputKey(activeKey);
    }
  }, [activeKey]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishableKey(inputKey);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const copyText = (text: string, type: 'appId' | 'key') => {
    navigator.clipboard?.writeText(text);
    if (type === 'appId') {
      setCopiedAppId(true);
      setTimeout(() => setCopiedAppId(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#081832] text-stone-100 rounded-2xl border border-amber-400/30 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#061327]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6c47ff] to-[#4318ff] flex items-center justify-center shadow-md">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Clerk Authentication Center
                <span className="text-[11px] px-2 py-0.5 rounded-full font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  v5.61 React
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Target Application ID: <span className="font-mono text-amber-300 font-semibold">{targetAppId}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Status banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            hasKey
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}>
            {hasKey ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <div className="font-semibold text-sm">
                {hasKey ? 'Clerk Live Provider Active' : 'Ready for Dashboard Publishable Key'}
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                {hasKey
                  ? 'Your Clerk publishable key is connected. Live sign-in, user sessions, OAuth (Google/GitHub), and session tokens are enabled.'
                  : `Your Clerk app (${targetAppId}) is configured in the codebase. To activate live browser authentication, paste your publishable key below from the Clerk Dashboard.`}
              </p>
            </div>
          </div>

          {/* Quick Details Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-stone-400 block font-medium">Clerk Target Application ID</span>
              <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/10 font-mono text-[11px] text-amber-300">
                <span className="truncate">{targetAppId}</span>
                <button
                  type="button"
                  onClick={() => copyText(targetAppId, 'appId')}
                  className="ml-2 hover:text-white text-stone-400 cursor-pointer"
                  title="Copy Application ID"
                >
                  {copiedAppId ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <span className="text-stone-400 block font-medium">Clerk Dashboard Quick Link</span>
              <a
                href={`https://dashboard.clerk.com/apps/${targetAppId}/api-keys`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-[#6c47ff]/20 hover:bg-[#6c47ff]/30 text-purple-200 px-2.5 py-1.5 rounded-lg border border-[#6c47ff]/40 font-medium transition-colors cursor-pointer text-[11px]"
              >
                <span>Open API Keys in Dashboard</span>
                <ExternalLink className="h-3.5 w-3.5 text-purple-300 shrink-0" />
              </a>
            </div>
          </div>

          {/* Key Configuration Form */}
          <form onSubmit={handleSave} className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <label className="block text-xs font-semibold text-stone-200">
              Clerk Publishable Key (<code className="text-amber-300 font-mono">VITE_CLERK_PUBLISHABLE_KEY</code>)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Key className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="pk_test_... or pk_live_..."
                className="w-full pl-9 pr-24 py-2.5 rounded-lg bg-black/50 border border-white/20 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#6c47ff] font-mono"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-md bg-[#6c47ff] hover:bg-[#5b3ae6] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Save Key
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span>Found under <strong>Clerk Dashboard &gt; API Keys &gt; Publishable key</strong></span>
              {saveSuccess && <span className="text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Saved!</span>}
            </div>
          </form>

          {/* Deployment & Architecture Roadmap */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-2">
              <Server className="h-3.5 w-3.5 text-[#e8a838]" /> Full-Stack Architecture Roadmap
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-[#06152d] border border-white/10 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-[11px] shrink-0 border border-purple-500/30">1</span>
                <div>
                  <div className="font-semibold text-white">Clerk Authentication (Active)</div>
                  <p className="text-stone-400 text-[11px]">Handles student login, sign up, Google/GitHub OAuth, session JWTs, and secure token exchange.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#06152d] border border-white/10 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0 border border-cyan-500/30">2</span>
                <div>
                  <div className="font-semibold text-white">Neon PostgreSQL Database (Step 2)</div>
                  <p className="text-stone-400 text-[11px]">Serverless Postgres database for exam attempts, NGN clinical scoring logs, flashcard states, and subscription tiers linked via Clerk User ID.</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#06152d] border border-white/10 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0 border border-emerald-500/30">3</span>
                <div>
                  <div className="font-semibold text-white">GitHub Repository & Vercel Deployment (Step 3)</div>
                  <p className="text-stone-400 text-[11px]">Push repository to GitHub, link to Vercel, inject <code className="text-emerald-300">VITE_CLERK_PUBLISHABLE_KEY</code> and <code className="text-emerald-300">DATABASE_URL</code> in Vercel Environment Variables.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#061327] flex items-center justify-between text-xs">
          <span className="text-stone-400">EliteProctorPrep v2.0 • Clerk Ready</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
