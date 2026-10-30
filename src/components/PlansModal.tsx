import React, { useState } from 'react';
import {
  X,
  Check,
  Sparkles,
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  ArrowLeft,
  Tag,
  CheckCircle2,
  Calendar,
  Award,
  Zap,
  HelpCircle,
  Landmark,
  Globe,
  Copy,
  CheckCircle
} from 'lucide-react';
import { EXAM_TRACKS } from '../data/examsData';

export interface PurchasedPlan {
  id: string;
  name: string;
  price: string;
  exam: string;
  period: string;
  purchasedAt: string;
  receiptId: string;
  paymentMethod?: string;
}

interface PlansModalProps {
  onClose: () => void;
  onOpenSignUp: () => void;
  userEmail?: string | null;
  onPlanPurchased?: (plan: PurchasedPlan) => void;
}

export const PlansModal: React.FC<PlansModalProps> = ({
  onClose,
  onOpenSignUp,
  userEmail,
  onPlanPurchased
}) => {
  const [selectedExam, setSelectedExam] = useState('NCLEX-RN');
  const [step, setStep] = useState<'select' | 'checkout' | 'confirmation'>('select');
  const [chosenPlanId, setChosenPlanId] = useState<string>('90-day');

  // Promo code states
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number; type: 'fixed' | 'percent' } | null>(null);
  const [promoError, setPromoError] = useState('');

  // Supported Payment Gateways: card | stripe | paypal | payoneer | bank
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'stripe' | 'paypal' | 'payoneer' | 'bank'>('card');
  
  // Card / Stripe states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardZip, setCardZip] = useState('');
  const [cardholderName, setCardholderName] = useState('');

  // PayPal state
  const [paypalEmail, setPaypalEmail] = useState(userEmail || '');

  // Payoneer states
  const [payoneerEmail, setPayoneerEmail] = useState(userEmail || '');
  const [payoneerTxId, setPayoneerTxId] = useState('');

  // Bank Transfer states
  const [bankSenderName, setBankSenderName] = useState('');
  const [wireRefNumber, setWireRefNumber] = useState('');
  const [copiedBankField, setCopiedBankField] = useState<string | null>(null);

  const [studentEmail, setStudentEmail] = useState(userEmail || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedPlan, setPurchasedPlan] = useState<PurchasedPlan | null>(null);

  const handleCopyText = (field: string, text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedBankField(field);
      setTimeout(() => setCopiedBankField(null), 2500);
    }
  };

  const plans = [
    {
      id: 'trial',
      name: 'Free Diagnostic Trial',
      rawPrice: 0,
      price: '$0',
      period: 'Forever free',
      desc: 'Ideal for taking initial benchmark test & seeing real clinical question quality.',
      features: [
        '5 sample practice questions per subject',
        'Expert clinical rationales & key points',
        'Basic score analytics',
        'Mobile & desktop access',
      ],
      popular: false,
      cta: 'Start Free Trial',
      badge: 'Free Forever',
    },
    {
      id: '90-day',
      name: '90-Day Standard Pass',
      rawPrice: 89,
      price: '$89',
      period: '3 months access',
      desc: 'Our recommended plan for passing the first time with high clinical confidence.',
      features: [
        'Unlimited access to all selected exam tracks',
        '30,000+ NCLEX / TEAS / HESI practice questions',
        'Full Next-Gen NCLEX (NGN) clinical cases & bow-ties',
        'Computer Adaptive Testing (CAT) exam engine',
        'AI predicted pass score probability',
        'Detailed rationale with pathophysiology illustrations',
        '24/7 clinical educator ticket support',
      ],
      popular: true,
      cta: 'Get 90-Day Access',
      badge: 'Most Popular',
    },
    {
      id: '180-day',
      name: '180-Day Comprehensive Pass',
      rawPrice: 139,
      price: '$139',
      period: '6 months access',
      desc: 'Complete mastery package with 100% Pass or 100% Money-Back Guarantee.',
      features: [
        'Everything in 90-Day Standard Pass',
        '100% Pass or Money-Back Guarantee',
        'Offline PDF study summaries & cheat sheets',
        'High-alert pharmacology flashcards deck',
        'Dosage calculation & clinical math drill suite',
        'Personalized 1-on-1 remediation study plan',
        'Priority educator support with <2h response',
      ],
      popular: false,
      cta: 'Get 180-Day Guarantee',
      badge: 'Pass Guarantee',
    },
  ];

  const currentPlan = plans.find((p) => p.id === chosenPlanId) || plans[1];

  // Calculate pricing with promo
  const calculateTotal = () => {
    if (currentPlan.rawPrice === 0) return 0;
    let base = currentPlan.rawPrice;
    if (appliedPromo) {
      if (appliedPromo.type === 'fixed') {
        base = Math.max(0, base - appliedPromo.discount);
      } else {
        base = Math.max(0, Math.round(base * (1 - appliedPromo.discount / 100)));
      }
    }
    return base;
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    // Check dynamic admin promo codes from localStorage first
    try {
      const adminPromosStr = localStorage.getItem('epp_admin_promos');
      if (adminPromosStr) {
        const adminPromos = JSON.parse(adminPromosStr);
        const match = adminPromos.find((p: any) => p.code === code && p.isActive);
        if (match) {
          setAppliedPromo({ code, discount: match.discountPercent, type: 'percent' });
          return;
        }
      }
    } catch (err) {
      console.warn('Could not check admin promos', err);
    }

    if (code === 'PASS2026' || code === 'NURSE2026') {
      setAppliedPromo({ code, discount: 25, type: 'percent' });
    } else if (code === 'PASS_GUARANTEED') {
      setAppliedPromo({ code, discount: 30, type: 'percent' });
    } else if (code === 'FUTURE_CLINICIAN') {
      setAppliedPromo({ code, discount: 40, type: 'percent' });
    } else if (code === 'FUTURENURSE') {
      setAppliedPromo({ code, discount: 20, type: 'percent' });
    } else if (code === 'HERO25') {
      setAppliedPromo({ code, discount: 25, type: 'fixed' });
    } else {
      setPromoError('Invalid coupon code. Try NURSE2026 or PASS_GUARANTEED');
    }
  };

  const handleSelectPlan = (planId: string) => {
    setChosenPlanId(planId);
    if (planId === 'trial') {
      onClose();
      onOpenSignUp();
    } else {
      setStep('checkout');
    }
  };

  // Card number auto-spacing
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  const handleCompleteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    let methodLabel = 'Credit / Debit Card';
    if (paymentMethod === 'stripe') {
      methodLabel = 'Stripe (Apple / Google Pay & Cards)';
    } else if (paymentMethod === 'paypal') {
      methodLabel = `PayPal (${paypalEmail || studentEmail})`;
    } else if (paymentMethod === 'payoneer') {
      methodLabel = `Payoneer (${payoneerTxId ? `Ref: ${payoneerTxId}` : payoneerEmail || studentEmail})`;
    } else if (paymentMethod === 'bank') {
      methodLabel = `Direct Bank Wire / ACH (${bankSenderName || 'Institutional Transfer'})`;
    } else {
      methodLabel = `Credit Card (ending in ${cardNumber.replace(/\s/g, '').slice(-4) || '4242'})`;
    }

    setTimeout(() => {
      setIsProcessing(false);
      const receiptId = `EPP-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;
      const planRecord: PurchasedPlan = {
        id: currentPlan.id,
        name: currentPlan.name,
        price: `$${calculateTotal()}`,
        exam: selectedExam,
        period: currentPlan.period,
        purchasedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        receiptId,
        paymentMethod: methodLabel,
      };

      setPurchasedPlan(planRecord);
      setStep('confirmation');

      if (onPlanPurchased) {
        onPlanPurchased(planRecord);
      }
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-stone-200 shadow-2xl p-5 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between pb-5 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#c4553a] bg-[#c4553a]/10 px-3 py-1 rounded-full">
                {step === 'select' ? 'Subscription Plans' : step === 'checkout' ? 'Secure Checkout' : 'Enrollment Confirmed'}
              </span>
              <span className="text-xs text-stone-500 font-medium hidden sm:inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#2d5a4a]" /> 256-bit Encrypted
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2 font-serif">
              {step === 'select' && 'Pass Your Nursing Board Exam on First Attempt'}
              {step === 'checkout' && `Complete Enrollment for ${currentPlan.name}`}
              {step === 'confirmation' && 'Welcome to EliteProctorPrep Pro!'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {step === 'select' && 'Transparent, affordable pricing built for high-stakes nursing & health sciences candidates.'}
              {step === 'checkout' && `Target Exam: ${selectedExam} • Instant access to full 30,000+ question bank.`}
              {step === 'confirmation' && `Receipt & study license generated for ${selectedExam}.`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: PLAN SELECTION */}
        {step === 'select' && (
          <div>
            {/* Exam Selection Dropdown */}
            <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#faf7f2] rounded-2xl border border-stone-200">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#c4553a]" />
                <div>
                  <div className="text-xs sm:text-sm font-bold text-stone-900">Choose your candidate exam track:</div>
                  <div className="text-[11px] text-stone-500">Includes exam-specific NGN clinical scenarios & test plan blueprints</div>
                </div>
              </div>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30"
              >
                {EXAM_TRACKS.map((exam) => (
                  <option key={exam.id} value={exam.name}>
                    {exam.name} ({exam.badge})
                  </option>
                ))}
              </select>
            </div>

            {/* Plans Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className={`relative rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                    p.popular
                      ? 'border-[#c4553a] bg-[#fffdf9] shadow-lg shadow-[#c4553a]/10 ring-2 ring-[#c4553a]'
                      : 'border-stone-200 bg-white hover:border-stone-300 shadow-sm'
                  }`}
                >
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#c4553a] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-stone-900">{p.name}</h4>
                      {p.id === '180-day' && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Pass Guarantee
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-1 min-h-[32px]">{p.desc}</p>

                    <div className="my-4">
                      <span className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
                        {p.price}
                      </span>
                      <span className="text-xs text-stone-500 ml-1.5">{p.period}</span>
                    </div>

                    <ul className="space-y-2 text-xs text-stone-600 mb-6">
                      {p.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-3.5 w-3.5 text-[#2d5a4a] shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectPlan(p.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                      p.popular
                        ? 'bg-[#c4553a] hover:bg-[#8b3a2f] text-white shadow-md shadow-[#c4553a]/30'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    {p.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Special Promo Notice */}
            <div className="mt-6 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <Tag className="h-4 w-4 text-amber-700" />
                <span className="text-xs text-amber-900 font-medium">
                  Use coupon code <strong className="font-bold text-amber-950 font-mono">PASS2026</strong> at checkout for $20 off!
                </span>
              </div>
              <span className="text-[11px] text-amber-800 font-semibold">Limited seasonal test intake offer</span>
            </div>
          </div>
        )}

        {/* STEP 2: CHECKOUT DRAWER */}
        {step === 'checkout' && (
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setStep('select')}
              className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1.5 mb-5 cursor-pointer font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to plan choices
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Payment Form */}
              <div className="lg:col-span-7 space-y-6">
                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    Select Payment Gateway
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {/* 1. Credit / Debit Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-[#c4553a] bg-[#fffdf9] text-[#c4553a] shadow-xs ring-1 ring-[#c4553a]'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <CreditCard className="h-4 w-4" />
                      <span className="font-bold">Card</span>
                      <span className="text-[9px] text-stone-400 font-normal">Visa/MC/Amex</span>
                    </button>

                    {/* 2. Stripe */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'stripe'
                          ? 'border-[#635BFF] bg-[#635BFF]/5 text-[#635BFF] shadow-xs ring-1 ring-[#635BFF]'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Zap className="h-4 w-4 text-[#635BFF]" />
                      <span className="font-bold">Stripe</span>
                      <span className="text-[9px] text-stone-400 font-normal">Apple/GPay</span>
                    </button>

                    {/* 3. PayPal */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'paypal'
                          ? 'border-[#0070BA] bg-[#0070BA]/5 text-[#0070BA] shadow-xs ring-1 ring-[#0070BA]'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4 text-[#0070BA]" />
                      <span className="font-bold">PayPal</span>
                      <span className="text-[9px] text-stone-400 font-normal">Pay in 4</span>
                    </button>

                    {/* 4. Payoneer */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('payoneer')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'payoneer'
                          ? 'border-[#FF4800] bg-[#FF4800]/5 text-[#FF4800] shadow-xs ring-1 ring-[#FF4800]'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Globe className="h-4 w-4 text-[#FF4800]" />
                      <span className="font-bold">Payoneer</span>
                      <span className="text-[9px] text-stone-400 font-normal">Global Card</span>
                    </button>

                    {/* 5. Bank Wire / ACH */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                        paymentMethod === 'bank'
                          ? 'border-[#0c1a2e] bg-[#0c1a2e]/5 text-[#0c1a2e] shadow-xs ring-1 ring-[#0c1a2e]'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Landmark className="h-4 w-4 text-[#0c1a2e]" />
                      <span className="font-bold">Bank Wire</span>
                      <span className="text-[9px] text-stone-400 font-normal">ACH / Swift</span>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleCompleteCheckout} className="space-y-4">
                  {/* Student Email */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Candidate Account Email
                    </label>
                    <input
                      type="email"
                      required
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      placeholder="nurse.candidate@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">Your pro license and simulated CAT exams will be bound to this email.</p>
                  </div>

                  {/* 1. CREDIT / DEBIT CARD */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3.5 pt-2">
                      <div className="flex items-center justify-between text-xs text-stone-500 pb-1 border-b border-stone-100">
                        <span className="font-medium text-stone-700">Credit / Debit Card Checkout</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-mono">
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">VISA</span>
                          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200">MC</span>
                          <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-bold border border-sky-200">AMEX</span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">DISCOVER</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          placeholder="Kelly Muthomi"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4532 •••• •••• ••••"
                            className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 font-mono"
                          />
                          <Lock className="absolute right-3.5 top-3 h-4 w-4 text-stone-400" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            Expires
                          </label>
                          <input
                            type="text"
                            required
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            CVC / CVV
                          </label>
                          <input
                            type="password"
                            required
                            maxLength={4}
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                            placeholder="123"
                            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 font-mono text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            ZIP / Postal
                          </label>
                          <input
                            type="text"
                            required
                            value={cardZip}
                            onChange={(e) => setCardZip(e.target.value.substring(0, 7))}
                            placeholder="94105"
                            className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 text-center"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. STRIPE EXPRESS & WALLETS */}
                  {paymentMethod === 'stripe' && (
                    <div className="p-5 bg-gradient-to-br from-[#635BFF]/5 to-purple-50/50 rounded-2xl border border-[#635BFF]/25 space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[#635BFF]/15">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#635BFF] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            S
                          </div>
                          <div>
                            <span className="font-bold text-sm text-stone-900 block leading-tight">Stripe 1-Click Payments</span>
                            <span className="text-[10px] text-stone-500">Apple Pay &bull; Google Pay &bull; Link by Stripe</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Instant
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed">
                        Authorize instantly with your device biometric passkey (FaceID / TouchID) or default Google Pay account for zero typing. Transactions are routed securely through Stripe's banking network.
                      </p>

                      <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs text-stone-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Lock className="h-3.5 w-3.5 text-stone-400" />
                          256-Bit TLS &bull; Level 1 PCI-DSS
                        </span>
                        <span className="text-stone-400">Merchant: EliteProctorPrep LLC</span>
                      </div>
                    </div>
                  )}

                  {/* 3. PAYPAL */}
                  {paymentMethod === 'paypal' && (
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-200/80 space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#0070BA] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            P
                          </div>
                          <div>
                            <span className="font-bold text-sm text-stone-900 block leading-tight">PayPal Checkout</span>
                            <span className="text-[10px] text-stone-500">PayPal Balance &bull; Pay in 4 &bull; Bank Link</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Buyer Protection
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                          PayPal Registered Email
                        </label>
                        <input
                          type="email"
                          required
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          placeholder="paypal.account@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0070BA]/30 bg-white"
                        />
                      </div>

                      <p className="text-xs text-stone-600">
                        Includes optional <strong>Pay in 4 interest-free installments</strong> of ${(calculateTotal() / 4).toFixed(2)}. Complete checkout with $0 fraud liability guarantee.
                      </p>
                    </div>
                  )}

                  {/* 4. PAYONEER */}
                  {paymentMethod === 'payoneer' && (
                    <div className="p-5 bg-[#FF4800]/5 rounded-2xl border border-[#FF4800]/25 space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-[#FF4800]/15">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#FF4800] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            <Globe className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-stone-900 block leading-tight">Payoneer Global Clearance</span>
                            <span className="text-[10px] text-stone-500">Account-to-Account &bull; Commercial Mastercard</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          190+ Countries
                        </span>
                      </div>

                      {/* Payoneer Official Transfer Coordinates */}
                      <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Payoneer Recipient:</span>
                          <span className="font-mono font-bold text-stone-900 flex items-center gap-1.5">
                            billing@eliteproctorprep.com
                            <button
                              type="button"
                              onClick={() => handleCopyText('payoneer', 'billing@eliteproctorprep.com')}
                              className="text-stone-400 hover:text-stone-800 cursor-pointer"
                              title="Copy Payoneer email"
                            >
                              {copiedBankField === 'payoneer' ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Beneficiary:</span>
                          <span className="font-semibold text-stone-800">EliteProctorPrep LLC</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            Your Payoneer Email / ID
                          </label>
                          <input
                            type="text"
                            required
                            value={payoneerEmail}
                            onChange={(e) => setPayoneerEmail(e.target.value)}
                            placeholder="candidate@payoneer.com"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#FF4800]/30 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            Transaction / Transfer ID (Optional)
                          </label>
                          <input
                            type="text"
                            value={payoneerTxId}
                            onChange={(e) => setPayoneerTxId(e.target.value)}
                            placeholder="e.g. 39482015"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#FF4800]/30 bg-white"
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-500">
                        Supports zero-fee Payoneer internal transfers and Payoneer Commercial Debit cards with zero foreign exchange markup.
                      </p>
                    </div>
                  )}

                  {/* 5. BANK WIRE / ACH */}
                  {paymentMethod === 'bank' && (
                    <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-[#0c1a2e] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                            <Landmark className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-stone-900 block leading-tight">Direct Bank Wire &amp; ACH Transfer</span>
                            <span className="text-[10px] text-stone-500">ACH &bull; Fedwire &bull; SWIFT &bull; Institutional PO</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-stone-800 bg-stone-200 px-2 py-0.5 rounded-full">
                          Institutional
                        </span>
                      </div>

                      {/* Official Wire Coordinates */}
                      <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Bank Name:</span>
                          <span className="font-semibold text-stone-900">JPMorgan Chase Bank, N.A.</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Account Name:</span>
                          <span className="font-semibold text-stone-900">EliteProctorPrep LLC</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Routing Number (ABA):</span>
                          <span className="font-mono font-bold text-stone-900 flex items-center gap-1.5">
                            121000358
                            <button
                              type="button"
                              onClick={() => handleCopyText('routing', '121000358')}
                              className="text-stone-400 hover:text-stone-800 cursor-pointer"
                              title="Copy Routing"
                            >
                              {copiedBankField === 'routing' ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">Account Number:</span>
                          <span className="font-mono font-bold text-stone-900 flex items-center gap-1.5">
                            482910492842
                            <button
                              type="button"
                              onClick={() => handleCopyText('account', '482910492842')}
                              className="text-stone-400 hover:text-stone-800 cursor-pointer"
                              title="Copy Account"
                            >
                              {copiedBankField === 'account' ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-stone-500">SWIFT / BIC (International):</span>
                          <span className="font-mono font-bold text-stone-900 flex items-center gap-1.5">
                            CHASUS33
                            <button
                              type="button"
                              onClick={() => handleCopyText('swift', 'CHASUS33')}
                              className="text-stone-400 hover:text-stone-800 cursor-pointer"
                              title="Copy SWIFT"
                            >
                              {copiedBankField === 'swift' ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            Sending Bank / Institution
                          </label>
                          <input
                            type="text"
                            required
                            value={bankSenderName}
                            onChange={(e) => setBankSenderName(e.target.value)}
                            placeholder="e.g. Chase / School Nursing Dept"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                            Wire Reference / PO Number
                          </label>
                          <input
                            type="text"
                            required
                            value={wireRefNumber}
                            onChange={(e) => setWireRefNumber(e.target.value)}
                            placeholder="e.g. WIRE-849204 or PO-2026"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 bg-white"
                          />
                        </div>
                      </div>

                      <p className="text-[11px] text-stone-500">
                        Include your candidate email in the transfer memo. Instant access is granted upon entering your reference number.
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-[#c4553a] hover:bg-[#8b3a2f] shadow-lg shadow-[#c4553a]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Authorizing Secure Enrollment...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay ${calculateTotal()} &amp; Unlock Full Question Bank</span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                    <div className="text-center mt-2.5 text-[11px] text-stone-500 flex items-center justify-center gap-1">
                      <Lock className="h-3 w-3 text-stone-400" />
                      <span>Instant account activation • No hidden recurring charges • 100% Pass Guarantee</span>
                    </div>
                  </div>
                </form>
              </div>

              {/* Right Column: Order Summary & Coupon */}
              <div className="lg:col-span-5 bg-[#faf7f2] p-5 rounded-2xl border border-stone-200 space-y-5">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Order Summary</h4>
                  <div className="mt-3 p-3.5 bg-white rounded-xl border border-stone-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-stone-900">{currentPlan.name}</span>
                      <span className="font-mono font-bold text-xs text-stone-900">${currentPlan.rawPrice}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center justify-between">
                      <span>Exam Blueprint:</span>
                      <span className="font-medium text-stone-800">{selectedExam}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center justify-between">
                      <span>Access Duration:</span>
                      <span className="font-medium text-stone-800">{currentPlan.period}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code Form */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Have a Promo Code?
                  </label>
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="e.g. PASS2026"
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs text-stone-900 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {promoError && <p className="text-[11px] text-rose-600 mt-1">{promoError}</p>}
                  {appliedPromo && (
                    <div className="mt-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center justify-between">
                      <span>Coupon &quot;{appliedPromo.code}&quot; applied!</span>
                      <span className="font-bold">
                        {appliedPromo.type === 'fixed' ? `-$${appliedPromo.discount}` : `-${appliedPromo.discount}%`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Pricing Calculation breakdown */}
                <div className="pt-3 border-t border-stone-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">${currentPlan.rawPrice}.00</span>
                  </div>
                  {appliedPromo && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount:</span>
                      <span className="font-mono">-${currentPlan.rawPrice - calculateTotal()}.00</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Tax &amp; Regulatory Fees:</span>
                    <span className="font-mono text-emerald-700 font-semibold">$0.00</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                    <span>Total Due Now:</span>
                    <span className="text-xl font-bold font-serif text-[#c4553a]">${calculateTotal()}.00</span>
                  </div>
                </div>

                {/* Pass Guarantee Seal */}
                <div className="p-3 bg-white rounded-xl border border-emerald-200/70 text-xs text-stone-700 flex items-start gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-[#2d5a4a] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-stone-900">100% Pass or Money-Back Guarantee</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">
                      Score at least 75% on our computer adaptive mock exams; if you do not pass your official board exam, receive an unconditional full refund.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMATION / RECEIPT */}
        {step === 'confirmation' && purchasedPlan && (
          <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
              <Check className="h-8 w-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Active Pro Subscription
              </span>
              <h4 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif mt-2">
                Congratulations! You are officially enrolled.
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto mt-1">
                Your full access pass for <strong>{purchasedPlan.exam}</strong> is now live. Complete access to 30,000+ questions, adaptive mock tests, and NGN clinical cases has been activated.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="max-w-md mx-auto bg-[#faf7f2] p-5 rounded-2xl border border-stone-200 text-left text-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <span className="text-stone-500">Order Reference:</span>
                <span className="font-mono font-bold text-stone-900">{purchasedPlan.receiptId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Enrolled Plan:</span>
                <span className="font-bold text-stone-900">{purchasedPlan.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Target Board:</span>
                <span className="font-bold text-[#c4553a]">{purchasedPlan.exam}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Amount Paid:</span>
                <span className="font-bold text-emerald-700">{purchasedPlan.price} (One-Time)</span>
              </div>
              {purchasedPlan.paymentMethod && (
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Payment Gateway:</span>
                  <span className="font-semibold text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-[11px]">{purchasedPlan.paymentMethod}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Valid Through:</span>
                <span className="font-medium text-stone-800">{purchasedPlan.period} from today</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#c4553a] hover:bg-[#8b3a2f] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Access My Study Portal Now →
              </button>
            </div>
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="mt-8 pt-5 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="h-4 w-4 text-[#2d5a4a]" />
          <span>Compliant with NCSBN Test Plans &bull; 256-bit SSL encrypted checkout &bull; Instant activation</span>
        </div>
      </div>
    </div>
  );
};
