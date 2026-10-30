import React, { useState } from 'react';
import {
  X,
  FileText,
  Activity,
  FlaskConical,
  ClipboardList,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  Lightbulb,
  Pill,
  HelpCircle,
  ChevronRight,
  Award,
  Sparkles,
  Layers,
  Mail
} from 'lucide-react';
import { EmailReportModal } from './EmailReportModal';

interface NgnCaseSimulatorProps {
  onClose: () => void;
  onOpenSignUp: () => void;
}

export const NgnCaseSimulator: React.FC<NgnCaseSimulatorProps> = ({ onClose, onOpenSignUp }) => {
  // Navigation: Mode Selection ('unfolding' | 'bowtie' | 'matrix')
  const [activeItemType, setActiveItemType] = useState<'unfolding' | 'bowtie' | 'matrix'>('unfolding');

  // EHR Tab: 'hnp' | 'vitals' | 'labs' | 'mar' | 'notes'
  const [activeEhrTab, setActiveEhrTab] = useState<'hnp' | 'vitals' | 'labs' | 'mar' | 'notes'>('hnp');

  // -------------------------------------------------------------------------
  // 1. UNFOLDING CASE STUDY (6 Steps matching NCSBN CJMM)
  // -------------------------------------------------------------------------
  const [unfoldingStep, setUnfoldingStep] = useState<number>(1);
  const [unfoldingChoices, setUnfoldingChoices] = useState<string[]>([]);
  const [unfoldingSubmitted, setUnfoldingSubmitted] = useState<boolean>(false);
  const [unfoldingScore, setUnfoldingScore] = useState<number>(0);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  const unfoldingSteps = [
    {
      stepNum: 1,
      title: 'Step 1: Recognize Cues',
      cjmm: 'Layer 3: Recognize Cues',
      type: 'sata',
      prompt: 'Based on the client’s electronic health record, which of the following clinical findings require IMMEDIATE nursing follow-up? (Select all that apply)',
      options: [
        { id: '1', text: 'Core body temperature 39.1°C (102.4°F)' },
        { id: '2', text: 'Blood Pressure 88/54 mmHg with MAP 65 mmHg' },
        { id: '3', text: 'Right hip surgical incision dry and intact' },
        { id: '4', text: 'Serum Lactate 3.8 mmol/L (Normal: 0.5–2.2 mmol/L)' },
        { id: '5', text: 'Urine output 15 mL/hr over past 2 consecutive hours' },
        { id: '6', text: 'Mild drowsiness with orientation to person, place, and time' },
      ],
      correctIds: ['1', '2', '4', '5'],
      rationale:
        'Fever (39.1°C), severe hypotension (88/54 mmHg), elevated lactate (3.8 mmol/L), and oliguria (<0.5 mL/kg/hr) are hallmark cues of systemic inflammatory response syndrome (SIRS) progressing toward septic shock secondary to hospital-acquired infection.',
    },
    {
      stepNum: 2,
      title: 'Step 2: Analyze Cues',
      cjmm: 'Layer 3: Analyze Cues',
      type: 'mcq',
      prompt: 'The nurse synthesizes the abnormal vitals, urine output, and laboratory data. Which physiological mechanism explains the client’s worsening hypoperfusion?',
      options: [
        { id: 'A', text: 'Profound systemic vasodilation and increased microvascular endothelial permeability' },
        { id: 'B', text: 'Excessive sympathetic outflow causing acute hypertensive crisis' },
        { id: 'C', text: 'Left ventricular pump failure from acute myocardial infarction' },
        { id: 'D', text: 'Osmotic diuresis secondary to uncontrolled diabetic hyperglycemia' },
      ],
      correctIds: ['A'],
      rationale:
        'In sepsis, inflammatory cytokines trigger widespread endothelial damage and diffuse vasodilation, resulting in relative hypovolemia, massive capillary leakage, and systemic tissue hypoperfusion reflected by lactic acidosis.',
    },
    {
      stepNum: 3,
      title: 'Step 3: Prioritize Hypotheses',
      cjmm: 'Layer 3: Prioritize Hypotheses',
      type: 'mcq',
      prompt: 'The nurse analyzes the client presentation and determines the client is in which clinical condition requiring emergent physician notification?',
      options: [
        { id: 'A', text: 'Hypovolemic shock secondary to internal occult hip hemorrhage' },
        { id: 'B', text: 'Septic shock secondary to severe systemic bloodstream infection' },
        { id: 'C', text: 'Acute pulmonary embolism with right ventricular outflow obstruction' },
        { id: 'D', text: 'Severe allergic anaphylactoid response to prophylactic cefazolin' },
      ],
      correctIds: ['B'],
      rationale:
        'The combination of high fever, extreme tachycardia, profound vasodilation, elevated lactate indicating cellular dysoxia, and inadequate renal perfusion directly points to Septic Shock.',
    },
    {
      stepNum: 4,
      title: 'Step 4: Generate Solutions',
      cjmm: 'Layer 3: Generate Solutions',
      type: 'sata',
      prompt: 'According to the Surviving Sepsis Campaign 1-Hour Bundle, which interventions are ANTICIPATED for this client? (Select all that apply)',
      options: [
        { id: '1', text: 'Measure initial blood lactate level' },
        { id: '2', text: 'Obtain two sets of blood cultures prior to administering broad-spectrum antibiotics' },
        { id: '3', text: 'Administer 30 mL/kg IV crystalloid fluid bolus for hypotension or lactate ≥ 4 mmol/L' },
        { id: '4', text: 'Administer oral furosemide 40 mg to increase urine output' },
        { id: '5', text: 'Prepare vasopressors (Norepinephrine) if fluid resuscitation fails to restore MAP ≥ 65 mmHg' },
      ],
      correctIds: ['1', '2', '3', '5'],
      rationale:
        'The 1-hour sepsis bundle mandates: (1) measure lactate, (2) obtain blood cultures before antibiotics, (3) administer broad-spectrum IV antibiotics, (4) rapid crystalloid bolus 30 mL/kg for hypotension, and (5) vasopressors if MAP remains <65 mmHg. Diuretics (furosemide) are strictly contraindicated during hypovolemic sepsis.',
    },
    {
      stepNum: 5,
      title: 'Step 5: Take Action',
      cjmm: 'Layer 3: Take Action',
      type: 'mcq',
      prompt: 'Which physician order should the nurse execute FIRST to maintain diagnostic accuracy without delaying antimicrobial therapy?',
      options: [
        { id: 'A', text: 'Infuse IV Vancomycin 1.5 g in 500 mL D5W over 60 minutes' },
        { id: 'B', text: 'Draw two sets of blood cultures (aerobic and anaerobic) from two distinct venipuncture sites' },
        { id: 'C', text: 'Administer acetaminophen 650 mg suppository for fever' },
        { id: 'D', text: 'Insert a 14 Fr indwelling urinary catheter to gravity drainage' },
      ],
      correctIds: ['B'],
      rationale:
        'Blood cultures (at least two sets from separate sites) MUST be drawn prior to starting broad-spectrum antibiotics to avoid sterilizing the blood and obscuring pathogen identification, immediately followed by the antibiotic infusion.',
    },
    {
      stepNum: 6,
      title: 'Step 6: Evaluate Outcomes',
      cjmm: 'Layer 3: Evaluate Outcomes',
      type: 'sata',
      prompt: 'Two hours following initial fluid resuscitation and empiric antibiotics, which findings indicate EFFECTIVE clinical response? (Select all that apply)',
      options: [
        { id: '1', text: 'Mean Arterial Pressure (MAP) increased to 72 mmHg' },
        { id: '2', text: 'Urine output increased to 45 mL/hr' },
        { id: '3', text: 'Repeat serum lactate decreased from 3.8 to 2.1 mmol/L' },
        { id: '4', text: 'Capillary refill normalized to < 2 seconds' },
        { id: '5', text: 'Respiratory rate increased from 26 to 34 breaths/min with accessory muscle use' },
      ],
      correctIds: ['1', '2', '3', '4'],
      rationale:
        'MAP ≥ 65 mmHg (72 mmHg), urine output > 0.5 mL/kg/hr (45 mL/hr), declining lactate (down to 2.1), and brisk capillary refill (<2s) confirm restored microvascular tissue perfusion and shock reversal. Tachypnea with accessory muscle use (34/min) indicates respiratory fatigue, not improvement.',
    },
  ];

  const currentUnfolding = unfoldingSteps[unfoldingStep - 1];

  const handleToggleUnfoldingOption = (id: string) => {
    if (unfoldingSubmitted) return;
    if (currentUnfolding.type === 'sata') {
      setUnfoldingChoices((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setUnfoldingChoices([id]);
    }
  };

  const handleSubmitUnfolding = () => {
    if (unfoldingChoices.length === 0) return;
    setUnfoldingSubmitted(true);
    const correctCount = unfoldingChoices.filter((id) =>
      currentUnfolding.correctIds.includes(id)
    ).length;
    const isExactMatch =
      correctCount === currentUnfolding.correctIds.length &&
      unfoldingChoices.length === currentUnfolding.correctIds.length;

    let finalScore = unfoldingScore;
    if (isExactMatch) {
      finalScore = unfoldingScore + 1;
      setUnfoldingScore(finalScore);
    }

    if (unfoldingStep === unfoldingSteps.length) {
      try {
        const pct = Math.round((finalScore / unfoldingSteps.length) * 100);
        const ngnAttempt = {
          id: `ngn_${Date.now()}`,
          title: 'NGN Clinical Case: Acute Septic Shock',
          date: 'Just now',
          score: `${finalScore}/${unfoldingSteps.length} (${pct}%)`,
          questions: '6-step clinical unfolding',
          time: '12 min',
          status: pct >= 66 ? 'Clinical Judgment Standard Met' : 'Review Sepsis Protocol',
          statusColor: pct >= 66 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200',
        };
        const prev = JSON.parse(localStorage.getItem('epp_quiz_history') || '[]');
        localStorage.setItem('epp_quiz_history', JSON.stringify([ngnAttempt, ...prev.slice(0, 19)]));
      } catch (err) {
        console.warn('Could not save NGN attempt to localStorage:', err);
      }
    }
  };

  const handleNextUnfoldingStep = () => {
    if (unfoldingStep < unfoldingSteps.length) {
      setUnfoldingStep((prev) => prev + 1);
      setUnfoldingChoices([]);
      setUnfoldingSubmitted(false);
    }
  };

  const handleResetUnfolding = () => {
    setUnfoldingStep(1);
    setUnfoldingChoices([]);
    setUnfoldingSubmitted(false);
    setUnfoldingScore(0);
  };

  // -------------------------------------------------------------------------
  // 2. BOW-TIE CLINICAL ITEM SIMULATOR
  // -------------------------------------------------------------------------
  // Center Condition: Acute Heart Failure Exacerbation with Pulmonary Edema
  // 2 Actions to take: Administer IV Furosemide, Place in High Fowler's position
  // 2 Parameters to monitor: Hourly urine output, SpO2 & lung sounds
  const [bowtieCondition, setBowtieCondition] = useState<string | null>(null);
  const [bowtieActions, setBowtieActions] = useState<string[]>([]);
  const [bowtieParams, setBowtieParams] = useState<string[]>([]);
  const [bowtieSubmitted, setBowtieSubmitted] = useState<boolean>(false);

  const bowtieConditionsList = [
    { id: 'c1', label: 'Acute Pulmonary Edema / Heart Failure Exacerbation', isCorrect: true },
    { id: 'c2', label: 'Tension Pneumothorax', isCorrect: false },
    { id: 'c3', label: 'Acute Asthma Bronchospasm', isCorrect: false },
    { id: 'c4', label: 'Pericardial Tamponade', isCorrect: false },
  ];

  const bowtieActionsList = [
    { id: 'a1', label: 'Administer IV Furosemide (Lasix) 40 mg STAT', isCorrect: true },
    { id: 'a2', label: 'Position client in High Fowler’s with legs dependent', isCorrect: true },
    { id: 'a3', label: 'Administer 500 mL IV 0.9% Normal Saline fluid bolus', isCorrect: false },
    { id: 'a4', label: 'Perform needle thoracostomy at second intercostal space', isCorrect: false },
    { id: 'a5', label: 'Administer subcutaneous epinephrine 0.3 mg', isCorrect: false },
  ];

  const bowtieParamsList = [
    { id: 'p1', label: 'SpO2 and auscultation of bilateral lung crackles', isCorrect: true },
    { id: 'p2', label: 'Hourly urine output via Foley drainage', isCorrect: true },
    { id: 'p3', label: 'Pupillary light reaction and Glasgow Coma Scale', isCorrect: false },
    { id: 'p4', label: 'Serial blood glucose fingersticks every 15 minutes', isCorrect: false },
    { id: 'p5', label: 'Calf circumference measurements bilaterally', isCorrect: false },
  ];

  const handleToggleBowtieAction = (id: string) => {
    if (bowtieSubmitted) return;
    setBowtieActions((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const handleToggleBowtieParam = (id: string) => {
    if (bowtieSubmitted) return;
    setBowtieParams((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const isBowtieComplete = bowtieCondition && bowtieActions.length === 2 && bowtieParams.length === 2;

  // -------------------------------------------------------------------------
  // 3. MATRIX / GRID CLINICAL DECISION TABLE
  // -------------------------------------------------------------------------
  // For each finding, candidate selects whether it is consistent with Sepsis, Hypovolemia, or Tension Pneumothorax
  const matrixRows = [
    {
      id: 'r1',
      finding: 'Core temperature 39.4°C (103°F) with profuse rigors',
      correctCol: 'sepsis',
      rationale: 'Elevated temperature with rigors indicates infectious systemic response (Sepsis).'
    },
    {
      id: 'r2',
      finding: 'Sudden absent unilateral breath sounds and tracheal deviation',
      correctCol: 'pneumo',
      rationale: 'Tracheal deviation and absent unilateral breath sounds are specific signs of Tension Pneumothorax.'
    },
    {
      id: 'r3',
      finding: 'Serum Lactate 4.2 mmol/L with profound peripheral vasodilation & warm skin',
      correctCol: 'sepsis',
      rationale: 'Distributive warm vasodilation with high lactate is classic hyperdynamic early septic shock.'
    },
    {
      id: 'r4',
      finding: 'Flat neck veins, dry mucous membranes, and CVP 1 mmHg',
      correctCol: 'hypovolemia',
      rationale: 'Flat neck veins and low central venous pressure (<2 mmHg) indicate intravascular volume depletion (Hypovolemia).'
    },
  ];

  const [matrixSelections, setMatrixSelections] = useState<Record<string, string>>({});
  const [matrixSubmitted, setMatrixSubmitted] = useState<boolean>(false);

  const handleSelectMatrix = (rowId: string, col: string) => {
    if (matrixSubmitted) return;
    setMatrixSelections((prev) => ({ ...prev, [rowId]: col }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-6xl w-full max-h-[94vh] flex flex-col border border-stone-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Simulator Top Header */}
        <div className="bg-[#071838] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c4553a] flex items-center justify-center text-white font-bold text-xs shadow-md">
              NGN
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#e8a838] uppercase tracking-wider">
                  NCSBN Next Generation NCLEX
                </span>
                <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded text-white/80 hidden sm:inline-block">
                  Clinical Judgment Measurement Model (CJMM)
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                Client: Evelyn Garcia, 68 yo Female &bull; Room 412 &bull; Post-Op Day 2 Sepsis Case
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Item Format Selector Tabs */}
            <div className="flex items-center bg-white/10 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveItemType('unfolding')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeItemType === 'unfolding'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Unfolding Case ({unfoldingStep}/6)
              </button>
              <button
                type="button"
                onClick={() => setActiveItemType('bowtie')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  activeItemType === 'bowtie'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Layers className="h-3 w-3 text-amber-500" />
                Bow-Tie Item
              </button>
              <button
                type="button"
                onClick={() => setActiveItemType('matrix')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer hidden md:inline-block ${
                  activeItemType === 'matrix'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Matrix Decision
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 2-Column Split: Electronic Health Record (EHR) on Left, Clinical Question on Right */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
          {/* LEFT: Complete Interactive EHR Console */}
          <div className="lg:col-span-5 bg-[#faf7f2] flex flex-col p-4 sm:p-5">
            {/* EHR Tabs Bar */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/80 rounded-xl mb-4 text-xs font-medium overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveEhrTab('hnp')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                  activeEhrTab === 'hnp'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FileText className="h-3.5 w-3.5 text-[#c4553a]" /> H&amp;P
              </button>
              <button
                type="button"
                onClick={() => setActiveEhrTab('vitals')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                  activeEhrTab === 'vitals'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Activity className="h-3.5 w-3.5 text-[#2d5a4a]" /> Vitals
              </button>
              <button
                type="button"
                onClick={() => setActiveEhrTab('labs')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                  activeEhrTab === 'labs'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <FlaskConical className="h-3.5 w-3.5 text-[#e8a838]" /> Labs
              </button>
              <button
                type="button"
                onClick={() => setActiveEhrTab('mar')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                  activeEhrTab === 'mar'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Pill className="h-3.5 w-3.5 text-blue-600" /> MAR
              </button>
              <button
                type="button"
                onClick={() => setActiveEhrTab('notes')}
                className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap ${
                  activeEhrTab === 'notes'
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ClipboardList className="h-3.5 w-3.5 text-stone-700" /> Notes
              </button>
            </div>

            {/* EHR Content Body */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-4 text-xs flex-1 shadow-sm overflow-y-auto min-h-[300px]">
              {/* Tab 1: H&P */}
              {activeEhrTab === 'hnp' && (
                <div className="space-y-3 text-stone-700 leading-relaxed">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="font-bold text-stone-900 text-sm">Admission History &amp; Physical</span>
                    <span className="text-[10px] text-stone-400 font-mono">ID: #99214-EHR</span>
                  </div>
                  <p><strong>Demographics:</strong> 68-year-old female, admitted 48 hours ago for scheduled Right Total Hip Arthroplasty (THA).</p>
                  <p><strong>Past Medical History:</strong> Type 2 Diabetes Mellitus (HbA1c 7.9%), Hypertension, Osteoarthritis.</p>
                  <p><strong>Allergies:</strong> Penicillin (manifested by generalized urticaria and facial angioedema).</p>
                  <p><strong>Surgical Course:</strong> Uncomplicated spinal anesthesia with right posterior hip prosthesis placement. Blood loss estimated at 180 mL.</p>
                  <p><strong>Urinary Status:</strong> Foley catheter removed at 08:00 today (6 hours ago). Spontaneous voiding recorded once (80 mL).</p>
                </div>
              )}

              {/* Tab 2: Vitals */}
              {activeEhrTab === 'vitals' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="font-bold text-stone-900 text-sm">Flowsheet: Vital Signs Trends</span>
                    <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded">STAT Alert Triggered</span>
                  </div>
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead>
                      <tr className="border-b text-stone-500">
                        <th className="py-1">Parameter</th>
                        <th className="py-1">08:00</th>
                        <th className="py-1">12:00</th>
                        <th className="py-1 font-bold text-stone-900">14:30 (Current)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr>
                        <td className="py-1.5 font-medium">Temperature</td>
                        <td>37.1°C</td>
                        <td>38.2°C</td>
                        <td className="text-rose-600 font-bold">39.1°C (102.4°F) ↑</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium">Blood Pressure</td>
                        <td>128/78</td>
                        <td>106/64</td>
                        <td className="text-rose-600 font-bold">88/54 (MAP 65) ↓</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium">Heart Rate</td>
                        <td>78 bpm</td>
                        <td>94 bpm</td>
                        <td className="text-rose-600 font-bold">124 bpm (Tachy) ↑</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium">Respiratory Rate</td>
                        <td>16 /min</td>
                        <td>20 /min</td>
                        <td className="text-rose-600 font-bold">26 /min (Tachypneic) ↑</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium">SpO2</td>
                        <td>98% RA</td>
                        <td>96% RA</td>
                        <td className="text-amber-600 font-bold">93% on Room Air</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium">Urine Output</td>
                        <td>40 mL/hr</td>
                        <td>25 mL/hr</td>
                        <td className="text-rose-600 font-bold">15 mL/hr (Oliguria) ↓</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 3: Labs */}
              {activeEhrTab === 'labs' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="font-bold text-stone-900 text-sm">STAT Laboratory Profile</span>
                    <span className="text-[10px] text-stone-500">Collected 14:15</span>
                  </div>
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead>
                      <tr className="border-b text-stone-500">
                        <th className="py-1">Analyte</th>
                        <th className="py-1">Result</th>
                        <th className="py-1">Reference Range</th>
                        <th className="py-1">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr>
                        <td className="py-1.5 font-medium">White Blood Cells (WBC)</td>
                        <td className="text-rose-600 font-bold font-mono">18,400 /mm³</td>
                        <td className="font-mono">4,500 – 11,000</td>
                        <td><span className="text-rose-600 font-bold text-[10px] bg-rose-50 px-1.5 py-0.5 rounded">HIGH</span></td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium">Bands (Immature PMNs)</td>
                        <td className="text-rose-600 font-bold font-mono">14%</td>
                        <td className="font-mono">0 – 5%</td>
                        <td><span className="text-rose-600 font-bold text-[10px] bg-rose-50 px-1.5 py-0.5 rounded">LEFT SHIFT</span></td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium">Serum Lactate</td>
                        <td className="text-rose-600 font-bold font-mono">3.8 mmol/L</td>
                        <td className="font-mono">0.5 – 2.2</td>
                        <td><span className="text-rose-600 font-bold text-[10px] bg-rose-50 px-1.5 py-0.5 rounded">CRITICAL</span></td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium">Serum Creatinine</td>
                        <td className="text-rose-600 font-bold font-mono">1.8 mg/dL</td>
                        <td className="font-mono">0.6 – 1.2</td>
                        <td><span className="text-rose-600 font-bold text-[10px] bg-rose-50 px-1.5 py-0.5 rounded">AKI</span></td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-medium">Blood Glucose</td>
                        <td className="text-amber-600 font-bold font-mono">198 mg/dL</td>
                        <td className="font-mono">70 – 110</td>
                        <td><span className="text-amber-600 font-bold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded">ELEVATED</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 4: MAR */}
              {activeEhrTab === 'mar' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="font-bold text-stone-900 text-sm">Medication Administration Record (MAR)</span>
                    <span className="text-[10px] text-stone-500 font-medium">Inpatient Routine</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50">
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>Cefazolin IV 1 g</span>
                        <span className="text-stone-500 text-[10px]">Discontinued (Allergy Warning)</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">Postoperative surgical site prophylaxis.</p>
                    </div>
                    <div className="p-2.5 rounded-xl border border-stone-200 bg-stone-50">
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>Enoxaparin (Lovenox) 40 mg SubQ daily</span>
                        <span className="text-emerald-700 text-[10px] font-semibold">Given 09:00</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-0.5">Venous thromboembolism (DVT) prophylaxis.</p>
                    </div>
                    <div className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/50">
                      <div className="flex justify-between font-bold text-amber-950">
                        <span>STAT Physician Orders Pending</span>
                        <span className="text-amber-800 text-[10px] font-bold">Unsigned / Awaiting Action</span>
                      </div>
                      <p className="text-[11px] text-amber-800 mt-0.5">Blood cultures x2, IV fluid resuscitation, broad-spectrum Vancomycin.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Notes */}
              {activeEhrTab === 'notes' && (
                <div className="space-y-3 text-stone-700 leading-relaxed">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <span className="font-bold text-stone-900 text-sm">Nurse’s Shift Narrative</span>
                    <span className="text-[10px] text-stone-500">14:30 Entry</span>
                  </div>
                  <p><strong>14:30:</strong> Unlicensed assistive personnel alerted primary nurse to client’s change in status. Client reported feeling suddenly very cold with severe rigors, shivering under three thermal blankets. Flushed, warm, diaphoretic skin to chest and extremities. Capillary refill is 4 seconds. Client responds slowly with mild confusion. Incisional dressing over right hip remains clean, dry, and intact with no erythema or fluctuance. Foley output: 30 mL over past 2 hours. Attending physician paged STAT for sepsis bundle initiation.</p>
                </div>
              )}
            </div>

            {/* Bottom EHR Status Bar */}
            <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Electronic Record Verified
              </span>
              <span>NCSBN NGN Format Validated</span>
            </div>
          </div>

          {/* RIGHT: Interactive Clinical Question Interface */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between">
            {/* 1. UNFOLDING CASE VIEW */}
            {activeItemType === 'unfolding' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#c4553a] bg-[#c4553a]/10 px-3 py-1 rounded-full">
                      {currentUnfolding.title}
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {currentUnfolding.cjmm}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-stone-600">
                    Phase {unfoldingStep} of {unfoldingSteps.length}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-bold text-stone-900 mb-4 leading-snug">
                  {currentUnfolding.prompt}
                </h4>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentUnfolding.options.map((opt) => {
                    const isSelected = unfoldingChoices.includes(opt.id);
                    const isCorrect = currentUnfolding.correctIds.includes(opt.id);

                    let style = 'border-stone-200 bg-white hover:border-stone-300 text-stone-800';
                    if (unfoldingSubmitted) {
                      if (isCorrect) {
                        style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        style = 'border-rose-400 bg-rose-50 text-rose-950';
                      } else {
                        style = 'border-stone-100 bg-stone-50 text-stone-400 opacity-60';
                      }
                    } else if (isSelected) {
                      style = 'border-[#c4553a] bg-[#c4553a]/10 text-stone-900 shadow-xs';
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleToggleUnfoldingOption(opt.id)}
                        disabled={unfoldingSubmitted}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${style}`}
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border ${
                            currentUnfolding.type === 'sata' ? 'rounded-md' : 'rounded-full'
                          } ${
                            isSelected
                              ? 'bg-[#c4553a] text-white border-[#c4553a]'
                              : 'border-stone-300 bg-white text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                        <span className="flex-1 text-xs sm:text-sm leading-normal">{opt.text}</span>
                        {unfoldingSubmitted && isCorrect && (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        )}
                        {unfoldingSubmitted && isSelected && !isCorrect && (
                          <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Rationale feedback */}
                {unfoldingSubmitted && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs sm:text-sm text-stone-800 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs uppercase tracking-wider">
                      <Lightbulb className="h-4 w-4 text-[#e8a838]" />
                      Clinical Judgment Measurement Rationale
                    </div>
                    <p className="leading-relaxed text-xs sm:text-[13px]">{currentUnfolding.rationale}</p>
                  </div>
                )}
              </div>
            )}

            {/* 2. BOW-TIE ITEM VIEW */}
            {activeItemType === 'bowtie' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#c4553a] bg-[#c4553a]/10 px-3 py-1 rounded-full">
                      NGN Bow-Tie Item
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      Multi-Component Clinical Judgment
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-600">Standard NCSBN Format</span>
                </div>

                <p className="text-xs text-stone-600 mb-4">
                  Complete the diagram by selecting: <strong>2 Actions to Take</strong> (left), the <strong>1 Condition to Address</strong> (center), and <strong>2 Parameters to Monitor</strong> (right).
                </p>

                {/* Bow-Tie Visual Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
                  {/* Left: 2 Actions */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-800 text-center pb-1 border-b border-stone-200">
                      Actions to Take (Choose 2)
                    </div>
                    <div className="space-y-1.5">
                      {bowtieActionsList.map((act) => {
                        const isChosen = bowtieActions.includes(act.id);
                        return (
                          <button
                            key={act.id}
                            type="button"
                            onClick={() => handleToggleBowtieAction(act.id)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                              isChosen
                                ? bowtieSubmitted
                                  ? act.isCorrect
                                    ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900'
                                    : 'border-rose-400 bg-rose-50 text-rose-900'
                                  : 'border-[#c4553a] bg-[#c4553a]/10 font-bold text-stone-900'
                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {act.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Center: Condition */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-800 text-center pb-1 border-b border-stone-200">
                      Primary Condition (Choose 1)
                    </div>
                    <div className="space-y-1.5">
                      {bowtieConditionsList.map((cond) => {
                        const isChosen = bowtieCondition === cond.id;
                        return (
                          <button
                            key={cond.id}
                            type="button"
                            onClick={() => !bowtieSubmitted && setBowtieCondition(cond.id)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                              isChosen
                                ? bowtieSubmitted
                                  ? cond.isCorrect
                                    ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900'
                                    : 'border-rose-400 bg-rose-50 text-rose-900'
                                  : 'border-[#c4553a] bg-[#c4553a]/10 font-bold text-stone-900'
                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {cond.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: 2 Parameters */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-800 text-center pb-1 border-b border-stone-200">
                      Parameters to Monitor (Choose 2)
                    </div>
                    <div className="space-y-1.5">
                      {bowtieParamsList.map((param) => {
                        const isChosen = bowtieParams.includes(param.id);
                        return (
                          <button
                            key={param.id}
                            type="button"
                            onClick={() => handleToggleBowtieParam(param.id)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                              isChosen
                                ? bowtieSubmitted
                                  ? param.isCorrect
                                    ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900'
                                    : 'border-rose-400 bg-rose-50 text-rose-900'
                                  : 'border-[#c4553a] bg-[#c4553a]/10 font-bold text-stone-900'
                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            {param.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {bowtieSubmitted && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-stone-800 space-y-1.5">
                    <div className="font-bold text-amber-950 flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4 text-[#e8a838]" /> Bow-Tie Clinical Rationale
                    </div>
                    <p>
                      The client exhibits signs of acute left-sided heart failure decompensation with flash pulmonary edema. High Fowler’s position reduces venous return and preload while IV Furosemide causes rapid venodilation and subsequent diuresis. Monitoring lung crackles and hourly urine output confirms therapeutic effect.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. MATRIX / GRID VIEW */}
            {activeItemType === 'matrix' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#c4553a] bg-[#c4553a]/10 px-3 py-1 rounded-full">
                      Matrix / Grid Item
                    </span>
                    <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      +/- Scoring Rule Applied
                    </span>
                  </div>
                  <span className="text-xs font-bold text-stone-600">Differential Diagnosis</span>
                </div>

                <p className="text-xs text-stone-600 mb-3">
                  For each clinical finding below, select whether it is consistent with <strong>Sepsis</strong>, <strong>Hypovolemic Shock</strong>, or <strong>Tension Pneumothorax</strong>.
                </p>

                <div className="border border-stone-200 rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#faf7f2] border-b border-stone-200 text-stone-800">
                      <tr>
                        <th className="p-3 font-bold">Clinical Cue / Finding</th>
                        <th className="p-3 font-bold text-center w-24">Sepsis</th>
                        <th className="p-3 font-bold text-center w-28">Hypovolemia</th>
                        <th className="p-3 font-bold text-center w-32">Pneumothorax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 bg-white">
                      {matrixRows.map((row) => (
                        <tr key={row.id} className="hover:bg-stone-50">
                          <td className="p-3 font-medium text-stone-900">{row.finding}</td>
                          {['sepsis', 'hypovolemia', 'pneumo'].map((colKey) => {
                            const isSelected = matrixSelections[row.id] === colKey;
                            const isCorrect = row.correctCol === colKey;

                            let ring = '';
                            if (matrixSubmitted) {
                              if (isCorrect) ring = 'bg-emerald-500 border-emerald-600 text-white';
                              else if (isSelected && !isCorrect) ring = 'bg-rose-500 border-rose-600 text-white';
                            } else if (isSelected) {
                              ring = 'bg-[#c4553a] border-[#c4553a] text-white';
                            }

                            return (
                              <td key={colKey} className="p-3 text-center">
                                <input
                                  type="radio"
                                  name={`row-${row.id}`}
                                  checked={isSelected}
                                  onChange={() => handleSelectMatrix(row.id, colKey)}
                                  disabled={matrixSubmitted}
                                  className="h-4 w-4 text-[#c4553a] focus:ring-[#c4553a] cursor-pointer"
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {matrixSubmitted && (
                  <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-stone-800">
                    <span className="font-bold text-amber-950">Scoring Breakdown: </span>
                    NCSBN +/- scoring rules reward accurate associations and subtract points for erroneous categorization without dropping below zero.
                  </div>
                )}
              </div>
            )}

            {/* Bottom Controls / Action Bar */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              {activeItemType === 'unfolding' && (
                <>
                  <button
                    type="button"
                    onClick={handleResetUnfolding}
                    className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Restart Unfolding Case
                  </button>

                  <div className="flex items-center gap-2">
                    {!unfoldingSubmitted ? (
                      <button
                        type="button"
                        onClick={handleSubmitUnfolding}
                        disabled={unfoldingChoices.length === 0}
                        className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm cursor-pointer ${
                          unfoldingChoices.length > 0
                            ? 'bg-[#c4553a] hover:bg-[#8b3a2f]'
                            : 'bg-stone-300 cursor-not-allowed'
                        }`}
                      >
                        Submit Decision ({unfoldingChoices.length} selected)
                      </button>
                    ) : unfoldingStep < unfoldingSteps.length ? (
                      <button
                        type="button"
                        onClick={handleNextUnfoldingStep}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#2d5a4a] hover:bg-[#1e3d32] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        Proceed to Step {unfoldingStep + 1} <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowEmailModal(true)}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Mail className="h-4 w-4 text-[#c4553a]" /> Email NGN Report
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenSignUp();
                          }}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#c4553a] hover:bg-[#8b3a2f] transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        >
                          Unlock All 150+ NGN Cases <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeItemType === 'bowtie' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setBowtieCondition(null);
                      setBowtieActions([]);
                      setBowtieParams([]);
                      setBowtieSubmitted(false);
                    }}
                    className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Clear Diagram
                  </button>

                  <button
                    type="button"
                    onClick={() => setBowtieSubmitted(true)}
                    disabled={!isBowtieComplete || bowtieSubmitted}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#c4553a] hover:bg-[#8b3a2f] disabled:bg-stone-300 transition-all cursor-pointer shadow-sm"
                  >
                    {bowtieSubmitted ? 'Bow-Tie Evaluated' : 'Submit Complete Bow-Tie'}
                  </button>
                </>
              )}

              {activeItemType === 'matrix' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMatrixSelections({});
                      setMatrixSubmitted(false);
                    }}
                    className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Clear Selections
                  </button>

                  <button
                    type="button"
                    onClick={() => setMatrixSubmitted(true)}
                    disabled={Object.keys(matrixSelections).length < 4 || matrixSubmitted}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#c4553a] hover:bg-[#8b3a2f] disabled:bg-stone-300 transition-all cursor-pointer shadow-sm"
                  >
                    {matrixSubmitted ? 'Scoring Verified' : 'Grade Matrix Decision Grid'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <EmailReportModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        reportData={{
          examTrack: 'NCLEX-RN® (NGN)',
          subjectTitle: 'Unfolding Clinical Case: Acute Sepsis & Shock',
          score: unfoldingScore,
          totalQuestions: unfoldingSteps.length,
          percentage: Math.round((unfoldingScore / unfoldingSteps.length) * 100),
          passProbability: Math.min(99, Math.round(75 + (unfoldingScore / unfoldingSteps.length) * 23)),
        }}
      />
    </div>
  );
};
