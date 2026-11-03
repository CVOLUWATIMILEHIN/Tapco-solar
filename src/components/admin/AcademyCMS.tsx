import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { Course } from "../../types";
import { Plus, Trash, BookOpen, GraduationCap, Users, Video, FileText, Check, X } from "lucide-react";

export default function AcademyCMS() {
  const { coursesList, setCoursesList, studentsList, setStudentsList, addAuditLog } = useCMS();
  const [activeTab, setActiveTab] = useState<"courses" | "students">("courses");
  
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseState, setNewCourseState] = useState({
    title: "Off-Grid Battery Sizing Mastery",
    price: 120000,
    duration: "4 Weeks",
    instructor: "Engr. Louis Olosunde",
    lecturesCount: 16,
    studentsEnrolled: 0,
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?w=300"
  });

  const showToast = (msg: string) => {
    addAuditLog(msg, "olosundelouis@gmail.com", "SUCCESS");
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm("Permanently retire this Academy course?")) {
      setCoursesList(prev => prev.filter(c => c.id !== id));
      showToast(`Removed course catalog ID: ${id}`);
    }
  };

  const handleAddCourse = () => {
    const fresh: Course = {
      id: `course-${Date.now()}`,
      ...newCourseState
    };
    setCoursesList(prev => [...prev, fresh]);
    setShowAddCourse(false);
    showToast(`Published Academy Course: "${fresh.title}"`);
  };

  const handleApproveEnrollment = (id: string) => {
    setStudentsList(prev => prev.map(s => s.id === id ? { ...s, active: true } : s));
    showToast(`Approved academy training enrollment ID ${id}`);
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-[#0057B8]" />
            TAPCO Solar Academy CMS
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Author solar training syllabuses, register corporate engineers, manage certifications, and track local workspace student rosters.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-1 bg-slate-50 border p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "courses" ? "bg-[#0057B8] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Syllabus Courses
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === "students" ? "bg-[#0057B8] text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Students Roster
          </button>
        </div>
      </div>

      {activeTab === "courses" ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Curriculum Classes</span>
            <button 
              onClick={() => setShowAddCourse(true)}
              className="px-3.5 py-2 bg-[#0057B8] hover:bg-[#0057B8]/95 text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coursesList.map(course => (
              <div key={course.id} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20 flex flex-col justify-between group">
                <div className="h-40 overflow-hidden relative border-b">
                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <span className="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/85 rounded text-[9px] font-mono font-bold text-white uppercase tracking-wider">
                    {course.duration}
                  </span>
                </div>

                <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-800 leading-snug line-clamp-2">{course.title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold block">Instructor: <span className="text-slate-600">{course.instructor}</span></span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100/60 pt-3 text-[10px] font-bold text-slate-400">
                    <span>Lectures: {course.lecturesCount}</span>
                    <span>Enrolled: {course.studentsEnrolled}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-black text-slate-800">
                    <span>₦{course.price.toLocaleString()}</span>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-1 border border-red-100 text-red-500 rounded hover:bg-red-50 transition"
                      title="De-register syllabus class"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Student Enrollment Verification ({studentsList.length})</span>
          {studentsList.map(st => (
            <div key={st.id} className="border border-slate-100 p-4.5 rounded-2xl bg-slate-50/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {st.id}
                  </span>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide">{st.name}</span>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  Enrolled Class: <span className="text-slate-800 font-bold">{st.courseTitle}</span>
                </p>
                <div className="text-[10px] font-bold text-slate-400">
                  <span>Student Email: <span className="text-slate-600">{st.email}</span></span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border ${
                  st.active ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-amber-50 border-amber-100 text-amber-700"
                }`}>
                  {st.active ? "Access Approved" : "Pending Tuition Payment"}
                </span>

                {!st.active && (
                  <button 
                    onClick={() => handleApproveEnrollment(st.id)}
                    className="p-1.5 border border-[#00A651]/20 bg-[#00A651]/5 text-[#00A651] rounded-lg hover:bg-[#00A651]/10 text-[10px] font-black cursor-pointer"
                  >
                    Confirm Payment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourse && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 space-y-4 shadow-2xl text-left">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xs font-black uppercase text-slate-900">Add Academy Class</h3>
              <button onClick={() => setShowAddCourse(false)} className="p-1 hover:bg-slate-100 rounded-full cursor-pointer">
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-700">
              <div>
                <label>Course Title</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newCourseState.title}
                  onChange={e => setNewCourseState(p => ({ ...p, title: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label>Tuition (Naira)</label>
                  <input 
                    type="number" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                    value={newCourseState.price}
                    onChange={e => setNewCourseState(p => ({ ...p, price: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label>Course Duration</label>
                  <input 
                    type="text" 
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                    value={newCourseState.duration}
                    onChange={e => setNewCourseState(p => ({ ...p, duration: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label>Instructor</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newCourseState.instructor}
                  onChange={e => setNewCourseState(p => ({ ...p, instructor: e.target.value }))}
                />
              </div>

              <div>
                <label>Image Banner URL</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-1"
                  value={newCourseState.image}
                  onChange={e => setNewCourseState(p => ({ ...p, image: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button onClick={() => setShowAddCourse(false)} className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleAddCourse} className="px-4 py-2 bg-[#0057B8] text-white rounded-xl text-xs font-bold hover:bg-[#0057B8]/90 cursor-pointer">
                Publish Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
