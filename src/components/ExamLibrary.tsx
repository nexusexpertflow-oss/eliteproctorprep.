import React, { useState } from 'react';
import {
  Library,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  BookOpen,
  Stethoscope,
  Search,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { EXAM_TRACKS, ExamTrack, ExamSubject } from '../data/examsData';

interface ExamLibraryProps {
  onSelectSubject: (subject: ExamSubject, exam: ExamTrack) => void;
}

export const ExamLibrary: React.FC<ExamLibraryProps> = ({ onSelectSubject }) => {
  const [selectedExamId, setSelectedExamId] = useState<string>('content-ati-teas-7');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Entry Exams': true,
    'License Exams': true,
    'Nursing Exams': true,
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const activeExam = EXAM_TRACKS.find((e) => e.id === selectedExamId) || EXAM_TRACKS[0];

  // Group exams by category
  const categories = [
    { name: 'Entry Exams', icon: GraduationCap, color: '#c4553a' },
    { name: 'License Exams', icon: BookOpen, color: '#2d5a4a' },
    { name: 'Nursing Exams', icon: Stethoscope, color: '#2d5a4a' },
  ];

  // Filter subjects in active exam or across exams if search query exists
  const filteredSubjects = activeExam.subjects.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const getExamCategoryBadge = (category: string) => {
    switch (category) {
      case 'Entry Exams':
        return { label: 'Entrance', bg: 'bg-amber-500/20 text-amber-300 border-amber-400/30' };
      case 'License Exams':
        return { label: 'Board Licensure', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' };
      default:
        return { label: 'Specialty Exam', bg: 'bg-sky-500/20 text-sky-300 border-sky-400/30' };
    }
  };

  return (
    <section id="exams" className="np-section np-exams-section relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-[#faf6ef]/70 to-[#fffdf9]">
      <div className="np-container relative z-10">
        {/* Header */}
        <div className="np-exams-header text-center mb-8">
          <p className="np-pill np-pill-terracotta inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#c4553a]/10 text-[#c4553a]">
            <Library className="h-3.5 w-3.5" />
            Clinical Exam Library
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c1a2e] mt-3 tracking-tight">
            Comprehensive Nursing Board & Entrance Prep
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto mt-2 text-sm sm:text-base">
            Select your target exam track → choose a core clinical domain → launch interactive drills immediately with instant NGN rationales.
          </p>
        </div>

        {/* 1-2-3 Step Flow */}
        <div className="np-exam-flow flex items-center justify-center gap-2 mb-8 text-xs font-medium text-stone-600">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#c4553a] text-white text-[10px] font-bold flex items-center justify-center">1</span> Pick Exam
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#2d5a4a] text-white text-[10px] font-bold flex items-center justify-center">2</span> Pick Subject
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c1a2e] text-white shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#e8a838] text-[#0c1a2e] text-[10px] font-bold flex items-center justify-center">3</span> Start Practice
          </span>
        </div>

        {/* Quick Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Filter subjects (e.g., Pharmacology, Dosage, Med-Surg, Care Plan)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-16 py-2.5 bg-white border border-stone-200 rounded-xl text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#c4553a]/30 focus:border-[#c4553a] shadow-xs transition-all text-stone-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-800 bg-stone-100 rounded px-2 py-0.5 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Exam Scroll Tabs */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {EXAM_TRACKS.map((exam) => (
            <button
              key={exam.id}
              type="button"
              onClick={() => setSelectedExamId(exam.id)}
              className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                selectedExamId === exam.id
                  ? 'bg-[#c4553a] text-white border-[#c4553a] shadow-md shadow-[#c4553a]/25'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                selectedExamId === exam.id ? 'bg-white/20 text-white' : 'bg-[#0c1a2e]/10 text-[#0c1a2e]'
              }`}>
                {exam.name.slice(0, 2).toUpperCase()}
              </span>
              <span>{exam.name}</span>
            </button>
          ))}
        </div>

        {/* Desktop 2-Column Split: Sidebar + Main Content */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/90 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Exam Tracks
              </span>
              <span className="text-xs font-medium text-[#2d5a4a] bg-[#2d5a4a]/10 px-2 py-0.5 rounded-full">
                {EXAM_TRACKS.length} Available Tracks
              </span>
            </div>

            <div className="space-y-4">
              {categories.map((cat) => {
                const CatIcon = cat.icon;
                const isOpen = openCategories[cat.name] ?? true;
                const categoryExams = EXAM_TRACKS.filter((e) => e.category === cat.name);

                return (
                  <div key={cat.name} className="mb-1">
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.name)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition-colors text-left cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <CatIcon className="h-4 w-4 text-[#2d5a4a]" />
                        <span className="font-bold text-sm text-stone-900">{cat.name}</span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-stone-400 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="mt-1 space-y-1 pl-2">
                        {categoryExams.map((exam) => (
                          <button
                            key={exam.id}
                            type="button"
                            onClick={() => setSelectedExamId(exam.id)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm font-medium transition-all cursor-pointer ${
                              selectedExamId === exam.id
                                ? 'bg-[#c4553a] text-white shadow-sm shadow-[#c4553a]/30'
                                : 'text-stone-700 hover:bg-stone-100/80'
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                              selectedExamId === exam.id ? 'bg-white/20 text-white' : 'bg-stone-100 text-[#0c1a2e]'
                            }`}>
                              {exam.code.split('-')[0].toUpperCase()}
                            </div>
                            <span className="flex-1 truncate">{exam.name}</span>
                            <span
                              className={`text-[11px] px-1.5 py-0.5 rounded font-mono ${
                                selectedExamId === exam.id
                                  ? 'bg-white/20 text-white'
                                  : 'bg-stone-100 text-stone-600'
                              }`}
                            >
                              {exam.subjectsCount}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Right Main Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-md overflow-hidden">
              {/* Panel Hero */}
              <div className="relative h-44 sm:h-52 overflow-hidden bg-[#0c1a2e]">
                <img
                  src={activeExam.banner}
                  alt={activeExam.name}
                  width="800"
                  height="208"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c1a2e] via-[#0c1a2e]/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getExamCategoryBadge(activeExam.category).bg}`}>
                        {getExamCategoryBadge(activeExam.category).label}
                      </span>
                      <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> 100% NGN Verified
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {activeExam.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-300 flex items-center gap-1.5 mt-1">
                      <Sparkles className="h-3.5 w-3.5 text-[#e8a838]" />
                      {activeExam.subjectsCount} high-yield clinical domains &bull; Select any domain to launch free drill
                    </p>
                  </div>
                  <span className="hidden sm:inline-flex text-xs px-3 py-1 bg-white/15 backdrop-blur-md text-white rounded-full font-semibold border border-white/20">
                    {activeExam.badge}
                  </span>
                </div>
              </div>

              {/* Panel Body: Subjects Grid */}
              <div className="p-5 sm:p-6 bg-[#fffdf9]">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Target Clinical Domains ({filteredSubjects.length})
                  </p>
                  <span className="text-xs text-[#c4553a] font-semibold bg-[#c4553a]/10 px-2 py-0.5 rounded-full">
                    Free Diagnostic Questions Included
                  </span>
                </div>

                {filteredSubjects.length === 0 ? (
                  <div className="text-center py-10 text-stone-500 text-sm bg-stone-50 rounded-xl border border-stone-100">
                    No subjects found matching &quot;{searchQuery}&quot;. Try a different keyword like Pharmacology or Care.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {filteredSubjects.map((sub, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSelectSubject(sub, activeExam)}
                        className="group flex items-center gap-3.5 p-3 rounded-2xl border border-stone-200 bg-white hover:border-[#c4553a]/60 hover:shadow-lg hover:shadow-stone-200/60 transition-all duration-200 cursor-pointer text-left w-full relative overflow-hidden"
                      >
                        {/* Technical Domain Image */}
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200 shadow-inner bg-stone-100">
                          <img
                            src={sub.image}
                            alt={sub.name}
                            loading="lazy"
                            width="80"
                            height="80"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/assets/images/nursing_stethoscope_textbooks.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        </div>

                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2d5a4a] bg-[#2d5a4a]/10 px-2 py-0.5 rounded-md">
                              {sub.categoryTag}
                            </span>
                          </div>
                          <p className="font-bold text-sm text-stone-900 group-hover:text-[#c4553a] transition-colors truncate mt-1">
                            {sub.name}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                            <span>{sub.meta}</span>
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-[#c4553a] group-hover:translate-x-1 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
