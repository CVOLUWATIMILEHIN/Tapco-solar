/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ArrowLeft, Check, Play, BookOpen, Clock, FileText, HelpCircle, 
  Sparkles, Send, Star, Volume2, ShieldAlert, Award
} from "lucide-react";
import { motion } from "motion/react";
import { Course, StudentProfile } from "../types";

interface AcademyClassroomProps {
  student: StudentProfile;
  setStudent: (std: StudentProfile) => void;
  selectedCourse: Course;
  activeLessonIndex: number;
  setActiveLessonIndex: (idx: number) => void;
  isLessonCompleted: boolean;
  setIsLessonCompleted: (completed: boolean) => void;
  classroomNotes: string;
  setClassroomNotes: (notes: string) => void;
  savedNotes: string[];
  setSavedNotes: (notes: string[]) => void;
  xpPoints: number;
  setXpPoints: (updater: number | ((prev: number) => number)) => void;
  darkMode: boolean;
  setCurrentView: (view: any) => void;
  setDashboardTab: (tab: any) => void;
}

const TRANSCRIPTS = [
  { time: "0:00", text: "Welcome to TAPCO Solar Training Academy. Today we are detailing off-grid sizing calculations." },
  { time: "1:20", text: "The primary equation balances solar peak generation hours against continuous watt load draws." },
  { time: "3:40", text: "Always secure a 1.25x safety multiplier on continuous inverter thresholds to prevent high-surge failures." },
  { time: "6:15", text: "Next, we will align the delta-star three-phase vectors to ensure load distributions are balanced." }
];

export default function AcademyClassroom({
  student,
  setStudent,
  selectedCourse,
  activeLessonIndex,
  setActiveLessonIndex,
  isLessonCompleted,
  setIsLessonCompleted,
  classroomNotes,
  setClassroomNotes,
  savedNotes,
  setSavedNotes,
  xpPoints,
  setXpPoints,
  darkMode,
  setCurrentView,
  setDashboardTab
}: AcademyClassroomProps) {

  const [classroomTab, setClassroomTab] = useState<"transcript" | "discussion" | "resources" | "quiz">("transcript");
  
  // Quiz evaluation states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Discussion state
  const [commentText, setCommentText] = useState("");
  const [discussions, setDiscussions] = useState([
    { sender: "Engr. Louis", role: "Instructor", text: "Ensure your battery string cables accounts for ambient room temperature offsets.", time: "2h ago" },
    { sender: "Ibrahim (Kano)", role: "Trainee", text: "My calculations matched the 5kVA continuous surge beautifully. Excellent explanation!", time: "1h ago" },
    { sender: "Funmi (Lagos)", role: "Trainee", text: "Can we get high-resolution single-line diagrams for three-phase configurations?", time: "30m ago" }
  ]);

  const activeLesson = selectedCourse.lessons[activeLessonIndex] || selectedCourse.lessons[0];

  const handleLessonDone = () => {
    if (!student.completedLessons.includes(activeLesson.id)) {
      const completed = [...student.completedLessons, activeLesson.id];
      setStudent({
        ...student,
        completedLessons: completed
      });
      setXpPoints(prev => prev + 50); // Add 50 XP
    }
    setIsLessonCompleted(true);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setDiscussions([
      ...discussions,
      { sender: student.name, role: "Trainee", text: commentText, time: "Just now" }
    ]);
    setCommentText("");
  };

  const handleQuizAnswer = (ansIdx: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIdx]: ansIdx
    });
  };

  const handleSubmitQuiz = () => {
    const quizzes = selectedCourse.quizzes;
    let correctCount = 0;
    quizzes.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / quizzes.length) * 100);
    setQuizScore(finalScore);
    setShowQuizResults(true);

    if (finalScore >= 70) {
      // Graduate student
      setStudent({
        ...student,
        isGraduated: true,
        quizScores: {
          ...student.quizScores,
          [selectedCourse.id]: finalScore
        }
      });
      setXpPoints(prev => prev + 250); // Unlocks massive XP!
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setShowQuizResults(false);
    setQuizScore(null);
  };

  return (
    <div className="space-y-8 pb-16 bg-white text-[#0F172A] w-full text-left">
      
      {/* 1. BACK BAR */}
      <button 
        onClick={() => {
          setCurrentView("dashboard");
          setDashboardTab("courses");
        }}
        className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-[#0F172A] transition uppercase tracking-wider cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 text-[#0057B8]" />
        <span>Return to Dashboard</span>
      </button>

      {/* 2. PLAYER & SYLLABUS DIRECTORY GRID */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        
        {/* CINEMATIC MOVIE PLAYER CONTAINER */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase font-black tracking-widest text-[#00A651] bg-[#00A651]/10 px-2.5 py-1 rounded">
              Module {activeLessonIndex + 1} of {selectedCourse.lessonsCount}
            </span>
            
            <button 
              onClick={handleLessonDone}
              className={`rounded-xl text-[10px] font-black uppercase tracking-wider px-4 py-2.5 transition flex items-center gap-1 cursor-pointer ${
                student.completedLessons.includes(activeLesson.id) || isLessonCompleted
                  ? "bg-[#00A651]/10 text-[#00A651] border border-[#00A651]/20" 
                  : "bg-[#00A651] text-white hover:bg-[#00A651]/95"
              }`}
            >
              {student.completedLessons.includes(activeLesson.id) || isLessonCompleted ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Module Done (+50 XP)</span>
                </>
              ) : (
                <span>Mark Module Completed</span>
              )}
            </button>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] leading-tight text-left">
            {activeLesson.title}
          </h2>

          {/* NETFLIX-STYLE HERO PLAYER CANVAS */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] shadow-md flex items-center justify-center">
            {/* Embedded video simulation */}
            <video 
              src={activeLesson.videoUrl || "https://www.w3schools.com/html/movie.mp4"}
              controls
              autoPlay
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* Cinematic Overlay HUD on pause */}
            <div className="absolute top-4 right-4 flex gap-1.5 pointer-events-none">
              <span className="rounded bg-slate-900/80 border border-slate-750 text-white text-[8px] font-mono font-black px-2 py-0.5 uppercase tracking-widest backdrop-blur-md">
                1080p stream
              </span>
            </div>
          </div>

          <p className="text-xs text-[#64748B] leading-relaxed font-semibold text-left">
            {activeLesson.description}
          </p>

          {/* QUICK NOTE WRITER SCRIBBLER */}
          <div className="space-y-4 border-t border-[#E2E8F0] pt-6 text-left">
            <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Lesson Note-taking Scribbler</h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Jot down calculations, surge continuous ratios, or compliance rules..." 
                className="w-full rounded-xl border px-4 py-3 text-xs bg-white border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                value={classroomNotes}
                onChange={(e) => setClassroomNotes(e.target.value)}
              />
              <button 
                onClick={() => {
                  if (classroomNotes.trim()) {
                    setSavedNotes([...savedNotes, classroomNotes]);
                    setClassroomNotes("");
                  }
                }}
                className="rounded-xl bg-[#0057B8] text-white text-xs font-black px-4 py-3 hover:bg-[#0057B8]/95 transition cursor-pointer shadow-sm"
              >
                Save
              </button>
            </div>
            {savedNotes.length > 0 && (
              <div className="space-y-1.5">
                {savedNotes.map((note, i) => (
                  <div key={i} className="text-[10px] text-[#64748B] font-mono p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex justify-between items-center">
                    <span>📝 {note}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* SYLLABUS LESSON DIRECTORY SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <div className="rounded-2xl border border-[#E2E8F0] p-4 bg-[#F8FAFC] space-y-4 shadow-sm">
            <div className="text-[10px] uppercase font-black text-[#64748B] tracking-wider border-b border-slate-150 pb-2">
              Curriculum Syllabus Directory
            </div>
            
            <div className="space-y-2">
              {selectedCourse.lessons.map((lesson, idx) => {
                const isCompleted = student.completedLessons.includes(lesson.id);
                const isActive = activeLessonIndex === idx;

                return (
                  <div 
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonIndex(idx);
                      setIsLessonCompleted(false);
                    }}
                    className={`cursor-pointer flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                      isActive 
                        ? "bg-[#0057B8]/8 border-[#0057B8] text-[#0057B8] shadow-sm" 
                        : "bg-white border-[#E2E8F0] text-slate-600 hover:border-slate-350"
                    }`}
                  >
                    <div className="space-y-0.5 max-w-[85%] text-left">
                      <div className={`text-[11px] font-bold leading-snug truncate ${isActive ? "text-[#0057B8]" : "text-[#0F172A]"}`}>{lesson.title}</div>
                      <span className="text-[9px] text-[#64748B] font-bold font-mono">{lesson.duration} duration</span>
                    </div>
                    {isCompleted ? (
                      <Check className="h-3.5 w-3.5 text-[#00A651]" />
                    ) : (
                      <Play className={`h-3 w-3 ${isActive ? "text-[#0057B8]" : "text-slate-400"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* certification unlocking criteria */}
          <div className="rounded-2xl border border-[#E2E8F0] p-4 bg-[#F8FAFC] space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
              <Award className="h-4 w-4 text-[#00A651]" />
              <span>Certified Diploma Track</span>
            </div>
            <p className="text-[10px] text-[#64748B] leading-normal font-semibold">
              Complete all lessons and score over 70% in the evaluation quiz to instantly unlock your verifiable NERC-standard solar certificate.
            </p>
          </div>
        </div>

      </div>

      {/* 3. MULTI-TABS INTERACTIVE PANEL (TRANSCRIPT, DISCUSSION, QUIZZES) */}
      <section className="rounded-3xl border border-[#E2E8F0] bg-white overflow-hidden shadow-sm text-left">
        
        {/* Navigation tabs */}
        <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] flex">
          {[
            { id: "transcript", label: "Interactive Transcript", icon: "💬" },
            { id: "discussion", label: "Trainee Discussion", icon: "👥" },
            { id: "resources", label: "Downloads & Code Sheets", icon: "💾" },
            { id: "quiz", label: "Evaluation Quiz", icon: "📜" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setClassroomTab(tab.id as any)}
              className={`flex-1 sm:flex-none px-6 py-4 text-xs font-black transition flex items-center justify-center gap-2 border-b-2 cursor-pointer ${
                classroomTab === tab.id 
                  ? "border-[#00A651] text-[#00A651] bg-white font-black" 
                  : "border-transparent text-[#64748B] hover:text-[#0F172A]"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab workspace */}
        <div className="p-6 min-h-[180px]">
          
          {/* TAB 1: TRANSCRIPT */}
          {classroomTab === "transcript" && (
            <div className="space-y-4 text-left">
              {TRANSCRIPTS.map((t, i) => (
                <div key={i} className="flex gap-4 items-start text-xs leading-relaxed">
                  <span className="font-mono text-[#00A651] font-bold min-w-[40px]">{t.time}</span>
                  <p className="text-[#0F172A] font-semibold">{t.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: DISCUSSION */}
          {classroomTab === "discussion" && (
            <div className="space-y-6 text-left">
              <div className="space-y-3">
                {discussions.map((d, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex gap-3.5 items-start text-xs shadow-inner">
                    <div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px]">👤</div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0F172A]">{d.sender}</span>
                        <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded leading-none font-bold">{d.role}</span>
                        <span className="text-[9px] text-[#64748B] font-mono">{d.time}</span>
                      </div>
                      <p className="text-slate-600 leading-normal font-semibold">{d.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handlePostComment} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Post a query about safety grounding multipliers..."
                  className="w-full rounded-xl border px-4 py-3.5 text-xs bg-white border-[#E2E8F0] text-[#0F172A] focus:outline-none focus:border-[#0057B8]"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" className="rounded-xl bg-[#00A651] text-white text-xs font-black px-5 py-3.5 hover:bg-[#00A651]/95 transition cursor-pointer shadow-md">
                  Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: RESOURCES */}
          {classroomTab === "resources" && (
            <div className="grid gap-4 sm:grid-cols-2 text-left">
              {selectedCourse.lessons[activeLessonIndex]?.materials?.map((mat, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between shadow-inner">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[#0F172A]">{mat}</div>
                    <span className="text-[9px] text-[#64748B] font-mono">Reference Drawing sheet • Vector schematic</span>
                  </div>
                  <button 
                    onClick={() => alert(`📥 Downloading resource vector manual: ${mat}`)}
                    className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 text-white font-bold text-[10px] px-4 py-2 transition cursor-pointer shadow-sm"
                  >
                    Download
                  </button>
                </div>
              )) || <div className="text-xs text-slate-400">No specific resources for this lesson node.</div>}
            </div>
          )}

          {/* TAB 4: EVALUATION QUIZ */}
          {classroomTab === "quiz" && (
            <div className="space-y-6 text-left">
              {!showQuizResults ? (
                <div className="space-y-6">
                  <div className="space-y-1.5 text-left">
                    <div className="text-[10px] font-mono text-[#00A651] font-bold uppercase tracking-wider">Question {currentQuestionIdx + 1} of {selectedCourse.quizzes.length}</div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">{selectedCourse.quizzes[currentQuestionIdx].question}</h4>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-left">
                    {selectedCourse.quizzes[currentQuestionIdx].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuizAnswer(i)}
                        className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          selectedAnswers[currentQuestionIdx] === i 
                            ? "bg-[#00A651]/8 border-[#00A651] text-[#00A651]" 
                            : "bg-white border-[#E2E8F0] text-slate-700 hover:border-slate-350"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between border-t border-[#E2E8F0] pt-4">
                    <button 
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx(currentQuestionIdx - 1)}
                      className="rounded-xl border border-[#E2E8F0] text-slate-500 hover:text-[#0F172A] hover:bg-slate-50 px-4 py-2.5 text-xs font-bold cursor-pointer disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {currentQuestionIdx < selectedCourse.quizzes.length - 1 ? (
                      <button 
                        onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
                        className="rounded-xl bg-[#0057B8] text-white hover:bg-[#0057B8]/95 px-5 py-2.5 text-xs font-bold cursor-pointer"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button 
                        onClick={handleSubmitQuiz}
                        className="rounded-xl bg-[#00A651] text-white hover:bg-[#00A651]/95 px-6 py-2.5 text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
                      >
                        Submit Assessment
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6 py-4 max-w-sm mx-auto bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-[#00A651]/10 border border-[#00A651]/20 text-[#00A651] flex items-center justify-center mx-auto text-lg font-bold font-mono">
                    {quizScore}%
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-[#0F172A]">
                      {quizScore >= 70 ? "🎉 Congratulations!" : "⚠️ Assessment Failed"}
                    </h4>
                    <p className="text-xs text-[#64748B] leading-normal font-semibold">
                      {quizScore >= 70 
                        ? `Outstanding sizing performance! You scored ${quizScore}% (Passing criteria: 70%). Your verifiable diploma certificate is now active inside the Certifications workspace.`
                        : `Your score is ${quizScore}% (Passing criteria: 70%). Study the stringing vector models and safety calculators and try the evaluation again.`
                      }
                    </p>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={handleResetQuiz}
                      className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 text-[10px] font-black uppercase tracking-wider cursor-pointer transition"
                    >
                      Retake Quiz
                    </button>
                    {quizScore >= 70 && (
                      <button 
                        onClick={() => {
                          setCurrentView("dashboard");
                          setDashboardTab("certificates");
                        }}
                        className="rounded-xl bg-[#00A651] text-white px-5 py-2.5 text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-sm"
                      >
                        View Certificate
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </section>

    </div>
  );
}
