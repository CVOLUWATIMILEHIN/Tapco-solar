import React, { useState } from "react";
import { 
  BookOpen, Search, PlusCircle, Trash2, Edit, RefreshCw,
  X, Check, DollarSign, Calendar, UserCheck, Award, GraduationCap, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AcademyStudent, AcademyClass } from "./AdminData";

interface AcademyConsoleProps {
  students: AcademyStudent[];
  classes: AcademyClass[];
  onUpdateStudentStatus: (email: string, status: AcademyStudent["status"]) => void;
  onUpdateStudentScore: (email: string, score: string) => void;
  onAddStudent: (stud: Omit<AcademyStudent, "progress" | "score">) => void;
  onDeleteStudent: (email: string) => void;
}

export default function AcademyConsole({
  students,
  classes,
  onUpdateStudentStatus,
  onUpdateStudentScore,
  onAddStudent,
  onDeleteStudent
}: AcademyConsoleProps) {
  const [activeAcademyTab, setActiveAcademyTab] = useState<"students" | "timetable">("students");
  const [searchQuery, setSearchQuery] = useState("");

  // Enrol modal
  const [showEnrolModal, setShowEnrolModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    status: "In Progress" as AcademyStudent["status"],
    totalLessons: 24,
    completedLessons: 0
  });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-black text-[#0057B8] tracking-widest">Academic Board</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Solar Education & Academy Console</h2>
          <p className="text-xs text-slate-400 mt-0.5">Oversee certifications, curriculum lesson completion rates, and grading score sheets.</p>
        </div>
        {activeAcademyTab === "students" && (
          <button
            onClick={() => setShowEnrolModal(true)}
            className="rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Enrol Student</span>
          </button>
        )}
      </div>

      {/* CORE STATS TILES */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase">Total Active Enrolled</span>
            <div className="text-2xl font-black text-slate-900">{students.length}</div>
          </div>
          <div className="p-3 bg-[#0057B8]/5 text-[#0057B8] rounded-2xl">
            <GraduationCap className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase">Certified Graduates</span>
            <div className="text-2xl font-black text-slate-900">
              {students.filter(s => s.status === "Graduated").length}
            </div>
          </div>
          <div className="p-3 bg-[#00A651]/5 text-[#00A651] rounded-2xl">
            <Award className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] p-6 rounded-[20px] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] text-slate-400 font-extrabold uppercase">Timetable Rota</span>
            <div className="text-2xl font-black text-slate-900">{classes.length} Schedules</div>
          </div>
          <div className="p-3 bg-amber-500/5 text-amber-500 rounded-2xl">
            <Calendar className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* SEARCH AND TOGGLE */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border border-[#E2E8F0] p-4 rounded-[20px] shadow-sm">
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveAcademyTab("students")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeAcademyTab === "students" ? "bg-white text-[#0057B8] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Registered Student Body
          </button>
          <button
            onClick={() => setActiveAcademyTab("timetable")}
            className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${activeAcademyTab === "timetable" ? "bg-white text-[#00A651] shadow-sm" : "text-slate-500 hover:text-slate-900"}`}
          >
            Curriculum Timetable Rota
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student directories..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-[#E2E8F0] rounded-xl focus:bg-white focus:outline-none"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {activeAcademyTab === "students" ? (
        /* STUDENTS DIRECTORY */
        <div className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Student Enrollment</th>
                  <th className="py-4 px-6">Curriculum Progress</th>
                  <th className="py-4 px-6">Academic Score</th>
                  <th className="py-4 px-6">Graduation Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-xs">
                {filteredStudents.map(stud => (
                  <tr key={stud.email} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#0057B8]/10 text-[#0057B8] font-bold flex items-center justify-center text-xs uppercase shrink-0">
                          {stud.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900">{stud.name}</h4>
                          <span className="text-[10px] text-slate-400 block font-semibold">{stud.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="w-40 space-y-1">
                        <div className="flex justify-between text-[9px] font-extrabold text-slate-400 font-mono">
                          <span>LESSONS COMPLETED</span>
                          <span>{stud.completedLessons}/{stud.totalLessons}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#0057B8] to-[#00A651] transition-all duration-300"
                            style={{ width: `${(stud.completedLessons / stud.totalLessons) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        className="p-1 border border-[#E2E8F0] rounded-xl text-[10px] font-black uppercase text-slate-700 bg-white"
                        value={stud.score}
                        onChange={e => onUpdateStudentScore(stud.email, e.target.value)}
                      >
                        <option value="100%">100% Score</option>
                        <option value="95%">95% Score</option>
                        <option value="85%">85% Score</option>
                        <option value="N/A">Awaiting Evaluation</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        className="p-1.5 border border-[#E2E8F0] rounded-xl text-[10px] font-black uppercase text-slate-700 bg-white"
                        value={stud.status}
                        onChange={e => onUpdateStudentStatus(stud.email, e.target.value as any)}
                      >
                        <option value="In Progress">In Progress</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onDeleteStudent(stud.email)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer inline-block"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TIMETABLE VIEW */
        <div className="grid gap-6 md:grid-cols-2">
          {classes.map(cls => (
            <div key={cls.id} className="bg-white border border-[#E2E8F0] p-6 rounded-[24px] shadow-sm text-left flex gap-4 items-start">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <span className="text-[9px] text-slate-400 font-extrabold uppercase bg-slate-50 border border-slate-100 px-2.5 py-0.5 rounded-md">
                  {cls.category}
                </span>
                <h4 className="text-xs font-black text-slate-900">{cls.topic}</h4>
                <div className="text-[11px] text-slate-500 font-semibold space-y-1 pt-1">
                  <p>Instructor: {cls.instructor}</p>
                  <p>Date Schedule: {cls.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ENROL STUDENT MODAL */}
      {showEnrolModal && (
        <div className="fixed inset-0 bg-[#0F172A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-[#E2E8F0] max-w-lg w-full p-8 shadow-2xl space-y-6 text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Enrol New Student</h3>
              <button onClick={() => setShowEnrolModal(false)} className="p-1 hover:bg-slate-100 rounded-full transition">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400">Student Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ibrahim Musa"
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                  value={newStudent.name}
                  onChange={e => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-black text-slate-400">Student Email</label>
                <input
                  type="email"
                  placeholder="e.g. musa@solartech.ng"
                  className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                  value={newStudent.email}
                  onChange={e => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Completed Lessons</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                    value={newStudent.completedLessons}
                    onChange={e => setNewStudent(prev => ({ ...prev, completedLessons: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] uppercase font-black text-slate-400">Total Course Lessons</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none"
                    value={newStudent.totalLessons}
                    onChange={e => setNewStudent(prev => ({ ...prev, totalLessons: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!newStudent.name || !newStudent.email) return;
                onAddStudent({
                  name: newStudent.name,
                  email: newStudent.email,
                  status: newStudent.status,
                  enrolledDate: "2026-07-03",
                  completedLessons: newStudent.completedLessons,
                  totalLessons: newStudent.totalLessons
                });
                setShowEnrolModal(false);
                setNewStudent({ name: "", email: "", status: "In Progress", totalLessons: 24, completedLessons: 0 });
              }}
              className="w-full rounded-xl bg-[#0057B8] hover:bg-[#0057B8]/95 py-3 text-xs font-bold uppercase text-white transition shadow-lg"
            >
              Dispatch Enrollment Registry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
