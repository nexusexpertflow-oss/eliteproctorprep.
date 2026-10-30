import React, { useState } from 'react';
import {
  X,
  Pill,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  Sparkles,
  Bookmark,
  Volume2,
  Download,
  Filter
} from 'lucide-react';

interface PharmaDrillModalProps {
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const PharmaDrillModal: React.FC<PharmaDrillModalProps> = ({ onClose, onOpenSignUp }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('epp_mastered_drugs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [speaking, setSpeaking] = useState(false);

  const allDrugs = [
    {
      id: 'digoxin',
      category: 'cardiac',
      generic: 'Digoxin',
      brand: 'Lanoxin',
      class: 'Cardiac Glycoside (Positive inotrope, negative chronotrope)',
      therapeuticRange: '0.8 – 2.0 ng/mL',
      nursingAlert: 'Hold if apical pulse < 60 bpm in adults (<90 bpm in infants). Hypokalemia drastically magnifies toxicity risk (nausea/vomiting, xanthopsia - yellow/green visual halos, bradycardia).',
      antidote: 'Digoxin Immune Fab (DigiFab / Digibind)',
      clinicalPearl: 'Check serum potassium before administering! Diuretics like furosemide can precipitate fatal digoxin toxicity.',
    },
    {
      id: 'heparin',
      category: 'anticoagulants',
      generic: 'Heparin (Unfractionated)',
      brand: 'Hep-Lock',
      class: 'Anticoagulant (Indirect Thrombin & Factor Xa Inhibitor)',
      therapeuticRange: 'aPTT: 1.5 – 2.5x normal control (therapeutic: approx. 60–80 seconds)',
      nursingAlert: 'Assess daily platelets for Heparin-Induced Thrombocytopenia (HIT: >50% drop in platelet count). Never give via intramuscular route due to hematoma risk.',
      antidote: 'Protamine Sulfate (1 mg neutralizes ~100 units of heparin)',
      clinicalPearl: 'Bleeding precautions: use soft-bristle toothbrush, electric razor, and monitor stool for occult blood.',
    },
    {
      id: 'warfarin',
      category: 'anticoagulants',
      generic: 'Warfarin',
      brand: 'Coumadin',
      class: 'Vitamin K Antagonist (Inhibits Factors II, VII, IX, X)',
      therapeuticRange: 'INR: 2.0 – 3.0 (Target 2.5 – 3.5 for mechanical prosthetic heart valves)',
      nursingAlert: 'Maintain consistent dietary intake of green leafy vegetables (kale, spinach). Requires 3–5 days for full therapeutic onset; bridge with heparin.',
      antidote: 'Vitamin K (Phytonadione) / Fresh Frozen Plasma (FFP) or Kcentra',
      clinicalPearl: 'Avoid concurrent NSAIDs, aspirin, and St. John’s Wort which alter INR and bleed risks.',
    },
    {
      id: 'vancomycin',
      category: 'antibiotics',
      generic: 'Vancomycin',
      brand: 'Vancocin',
      class: 'Glycopeptide Antibacterial',
      therapeuticRange: 'Trough level: 10 – 20 mcg/mL (drawn 30 min prior to 4th dose)',
      nursingAlert: 'Infuse over at least 60 minutes (10 mg/min max). Rapid infusion triggers Red Man Syndrome (flushing, pruritus, hypotension via histamine release). Nephrotoxic & Ototoxic.',
      antidote: 'Discontinue infusion, administer diphenhydramine (Benadryl) IV for Red Man Syndrome',
      clinicalPearl: 'Monitor serum creatinine and BUN closely. Assess for tinnitus or vertigo prior to each dose.',
    },
    {
      id: 'lithium',
      category: 'psych',
      generic: 'Lithium Carbonate',
      brand: 'Lithobid / Eskalith',
      class: 'Mood Stabilizer (Bipolar Affective Disorder)',
      therapeuticRange: '0.6 – 1.2 mEq/L (Early toxicity > 1.5 mEq/L; Severe > 2.0 mEq/L)',
      nursingAlert: 'Do NOT place on a low-sodium diet. Hyponatremia causes renal lithium retention and toxic accumulation. Signs of toxicity: coarse tremors, ataxia, polyuria, tinnitus.',
      antidote: 'Gastric lavage, aggressive IV hydration, Hemodialysis in severe overdose',
      clinicalPearl: 'Maintain 2 to 3 liters of fluid daily. Avoid thiazide diuretics and NSAIDs.',
    },
    {
      id: 'morphine',
      category: 'critical',
      generic: 'Morphine Sulfate',
      brand: 'MS Contin / Roxanol',
      class: 'Opioid Agonist (Pure Mu-opioid receptor)',
      therapeuticRange: 'Titrate to clinical pain assessment score',
      nursingAlert: 'Hold dose if respiratory rate < 12 breaths/minute. Monitor for severe orthostatic hypotension and urinary retention. Constipation does not develop tolerance.',
      antidote: 'Naloxone (Narcan) IV/IM/Nasal (0.4 – 2 mg repeated every 2-3 mins)',
      clinicalPearl: 'Naloxone has a shorter half-life than morphine; monitor closely as patient may relapse into respiratory depression!',
    },
    {
      id: 'magnesium',
      category: 'critical',
      generic: 'Magnesium Sulfate',
      brand: 'MgSO4',
      class: 'CNS Depressant / Tocolytic (Preeclampsia & Eclampsia Seizure Prophylaxis)',
      therapeuticRange: 'Therapeutic: 4.0 – 7.0 mg/dL (Toxic: Loss of DTRs at 8–10; Respiratory arrest at >12)',
      nursingAlert: 'Assess patellar Deep Tendon Reflexes (DTRs) hourly. Ensure urine output > 30 mL/hr and respirations > 12/min. Have antidote immediately at bedside.',
      antidote: 'Calcium Gluconate 10% IV (administer 1 g over 3 minutes)',
      clinicalPearl: 'Loss of deep tendon reflexes is the FIRST warning sign of impending toxic respiratory depression.',
    },
    {
      id: 'potassium',
      category: 'critical',
      generic: 'Potassium Chloride',
      brand: 'K-Dur / Micro-K',
      class: 'Electrolyte Replenisher',
      therapeuticRange: 'Serum K+: 3.5 – 5.0 mEq/L',
      nursingAlert: 'NEVER ADMINISTER IV PUSH OR BOLUS (Causes instant cardiac arrest). Max peripheral IV rate is 10 mEq/hr; max central line rate 20 mEq/hr on continuous telemetry.',
      antidote: 'For Hyperkalemia: IV Calcium Gluconate (membrane stabilizer), Regular Insulin + D50W, Sodium Polystyrene Sulfonate (Kayexalate)',
      clinicalPearl: 'Burning at peripheral IV site is common; dilute solution or slow rate, never speed up.',
    },
    {
      id: 'regular_insulin',
      category: 'endocrine',
      generic: 'Regular Insulin (Short-Acting)',
      brand: 'Humulin R / Novolin R',
      class: 'Pancreatic Hormone (Only insulin that can be given IV)',
      therapeuticRange: 'Target fasting glucose: 70 – 130 mg/dL',
      nursingAlert: 'Onset: 30–60 min, Peak: 2–4 hours, Duration: 5–8 hours. Peak is the highest risk window for hypoglycemia (diaphoresis, tremors, confusion). Administer 30 mins before meals.',
      antidote: 'Oral fast-acting carbs (15-20 g) if conscious; IV 50% Dextrose (D50W) or IM Glucagon if unconscious',
      clinicalPearl: 'Remember the Rule of 15: 15 g simple carbs, recheck in 15 minutes, repeat if blood glucose < 70 mg/dL.',
    },
    {
      id: 'nitroglycerin',
      category: 'cardiac',
      generic: 'Nitroglycerin',
      brand: 'Nitrostat / Nitro-Bid',
      class: 'Vasodilator (Nitrate - Venous & Coronary Arterial Dilator)',
      therapeuticRange: 'Relief of angina pectoris',
      nursingAlert: 'Take 1 tablet sublingually every 5 minutes up to 3 doses. If chest pain does not improve 5 minutes after the first dose, CALL 911 immediately. Strictly contraindicated with PDE-5 inhibitors (sildenafil/tadalafil) due to fatal refractory hypotension.',
      antidote: 'IV fluids, Trendelenburg position for hypotension, alpha-agonists',
      clinicalPearl: 'Keep in original dark amber glass bottle; expires 3–6 months after opening. Expect headache.',
    },
  ];

  const filteredDrugs = selectedCategory === 'all'
    ? allDrugs
    : allDrugs.filter((d) => d.category === selectedCategory);

  const current = filteredDrugs[currentIndex] || filteredDrugs[0];

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredDrugs.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredDrugs.length) % filteredDrugs.length);
  };

  const handleRateMastery = (difficulty: 'again' | 'hard' | 'good' | 'easy') => {
    let updated = [...masteredIds];
    if (difficulty === 'easy' || difficulty === 'good') {
      if (!updated.includes(current.id)) {
        updated.push(current.id);
      }
    } else {
      updated = updated.filter((id) => id !== current.id);
    }
    setMasteredIds(updated);
    try {
      localStorage.setItem('epp_mastered_drugs', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    handleNext();
  };

  const handleSpeakDrug = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      setSpeaking(true);
      const text = `${current.generic}. Also known as ${current.brand}. Antidote: ${current.antidote}`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const progressPercent = Math.round((masteredIds.length / allDrugs.length) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full border border-stone-200 shadow-2xl p-5 sm:p-7 animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#c4553a]/10 text-[#c4553a] flex items-center justify-center font-bold">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#c4553a]">
                  Pharmacology Mastery Deck
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Spaced Repetition Active
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                Must-Know NCLEX High-Alert Drugs &amp; Antidotes
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

        {/* Progress & Category Filters */}
        <div className="mt-4 space-y-3">
          {/* Spaced Repetition Mastery Counter */}
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1.5 font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Mastered: {masteredIds.length} of {allDrugs.length} Drugs ({progressPercent}%)
            </span>
            <span className="text-stone-400">Card {currentIndex + 1} of {filteredDrugs.length} in Category</span>
          </div>

          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#2d5a4a] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Must-Know' },
              { id: 'cardiac', label: 'Cardiac & Nitrates' },
              { id: 'anticoagulants', label: 'Anticoagulants' },
              { id: 'antibiotics', label: 'Antibiotics' },
              { id: 'critical', label: 'Critical Care & Antidotes' },
              { id: 'psych', label: 'Psychotropics' },
              { id: 'endocrine', label: 'Endocrine & Insulins' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                  setFlipped(false);
                }}
                className={`px-3 py-1 rounded-full transition-colors font-medium whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#c4553a] text-white shadow-xs font-bold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive 3D Flip Card */}
        <div className="my-5 perspective-1000">
          <div
            onClick={() => setFlipped(!flipped)}
            className={`cursor-pointer min-h-[300px] p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between shadow-lg select-none ${
              flipped
                ? 'bg-[#071838] border-amber-400/50 text-white'
                : 'bg-gradient-to-br from-[#faf7f2] via-[#fffdf9] to-[#f4eee6] border-[#c4553a]/30 text-stone-900'
            }`}
          >
            {!flipped ? (
              /* Front of Card */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#c4553a] bg-[#c4553a]/10 px-2.5 py-0.5 rounded-full">
                    {current.class}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSpeakDrug}
                      className="p-1 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors"
                      title="Audio Pronunciation"
                    >
                      <Volume2 className={`h-4 w-4 ${speaking ? 'text-[#c4553a] animate-pulse' : ''}`} />
                    </button>
                    <span className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                      <RotateCw className="h-3.5 w-3.5" /> Tap to reveal antidote
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-3xl font-extrabold text-stone-900 font-serif tracking-tight">
                    {current.generic}
                  </h4>
                  <div className="text-sm font-semibold text-stone-500 mt-0.5">
                    Brand Name: <span className="text-stone-800">{current.brand}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200/80 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-xs text-stone-700 w-32 shrink-0">Therapeutic Range:</span>
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {current.therapeuticRange}
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-stone-700">
                    <strong className="text-amber-900 block font-semibold mb-0.5">Clinical Pearl:</strong>
                    {current.clinicalPearl}
                  </div>
                </div>

                <div className="text-center text-[11px] text-stone-400 font-medium">
                  Click card to view critical nursing alerts &amp; toxic antidote →
                </div>
              </div>
            ) : (
              /* Back of Card */
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <AlertOctagon className="h-4 w-4" /> Priority Black Box &amp; Antidote
                  </span>
                  <span className="text-xs text-stone-300 flex items-center gap-1">
                    <RotateCw className="h-3.5 w-3.5" /> Tap to flip back
                  </span>
                </div>

                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
                    Specific Antidote / Reversal Agent
                  </div>
                  <div className="text-xl font-bold text-white bg-rose-500/20 border border-rose-500/40 p-3 rounded-xl">
                    {current.antidote}
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    High-Alert Nursing Directives &amp; Toxicity Cues
                  </div>
                  <p className="text-xs text-stone-200 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                    {current.nursingAlert}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Leitner Spaced Repetition Buttons */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider text-center">
            Rate Your Recall (Spaced Repetition Schedule)
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleRateMastery('again')}
              className="py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer"
            >
              Again (&lt;1m)
            </button>
            <button
              type="button"
              onClick={() => handleRateMastery('hard')}
              className="py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
            >
              Hard (12h)
            </button>
            <button
              type="button"
              onClick={() => handleRateMastery('good')}
              className="py-2 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
            >
              Good (1d)
            </button>
            <button
              type="button"
              onClick={() => handleRateMastery('easy')}
              className="py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
            >
              Easy (3d) ★
            </button>
          </div>
        </div>

        {/* Card Navigation Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer flex items-center gap-1 font-medium"
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSignUp();
            }}
            className="text-[#c4553a] hover:text-[#8b3a2f] font-bold text-xs underline cursor-pointer"
          >
            Unlock All 250+ Pharmacology Flashcards →
          </button>
        </div>
      </div>
    </div>
  );
};
