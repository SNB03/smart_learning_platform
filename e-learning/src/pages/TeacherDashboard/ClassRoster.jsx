import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Search, Phone, UserCircle, ShieldAlert, Edit3, Trash2, X, CheckCircle2, Mail, Download, KeyRound, Copy } from 'lucide-react';

const ClassRoster = () => {
  const { user, isClassTeacher } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Management State
  const [viewStudent, setViewStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [copied, setCopied] = useState(false);

  const myClass = user?.assignments?.find(a => a.assignmentRole === 'class');

  // Auto-hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  // 1. FETCH ROSTER
  useEffect(() => {
    if (!myClass) return;
    const fetchRoster = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/teacher/roster?classLevel=${myClass.classLevel}&division=${myClass.division}`);
        if (response.ok) setStudents(await response.json());
      } catch (error) {
        // Silently fail for UI preview
      }
    };
    fetchRoster();
  }, [myClass]);

  if (!isClassTeacher || !myClass) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400 animate-fade-in">
        <ShieldAlert className="w-16 h-16 mb-4 opacity-30" />
        <p className="font-black text-xl text-gray-600 tracking-tight">Access Restricted</p>
      </div>
    );
  }

  // --- ACTIONS ---
  const exportCredentialsCSV = () => {
    const headers = "Roll No,Full Name,Gender,Parent Mobile,Student Email,Login Password\n";
    const rows = filteredStudents.map(s => {
      const name = s.fullName || s.name || '';
      const email = s.email || 'N/A';
      const mobile = s.parentMobileNo || s.parentMobile || 'N/A';
      const password = s.passwordHash || 'Not Set';
      return `${s.rollNo},"${name}",${s.gender},${mobile},${email},${password}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Class_${myClass.classLevel}${myClass.division}_Credentials.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Credentials exported successfully!", "success");
  };

  const handleDelete = async (id, name) => {
    setViewStudent(null);
    if (window.confirm(`Remove ${name} from the roster?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/teacher/students/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setStudents(students.filter(s => s.id !== id));
          showToast(`${name} removed from class.`, "success");
        }
      } catch (error) {
        showToast("Failed to delete student.", "error");
      }
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8080/api/teacher/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStudent)
      });
      if (response.ok) {
        const updatedStudent = await response.json();
        setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        setEditingStudent(null);
        showToast("Student details updated!", "success");
      }
    } catch (error) {
      showToast("Failed to update student.", "error");
    }
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast("Password copied to clipboard!", "success");
  };

  // Analytics & Filtering
  const totalStudents = students.length;
  const boysCount = students.filter(s => s.gender === 'Boy').length;
  const girlsCount = students.filter(s => s.gender === 'Girl').length;
  const otherCount = students.filter(s => s.gender === 'Other').length;

  const filteredStudents = students.filter(s => {
    const searchString = `${s.fullName || s.name} ${s.rollNo}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || s.gender === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="animate-fade-in pb-20 relative">

      {/* --- TOAST NOTIFICATION --- */}
      <div className={`fixed top-4 right-4 z-[200] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <ShieldAlert className="w-5 h-5 text-red-500" />}
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 1. VIEW STUDENT PROFILE MODAL (REFINED FOR VISIBILITY) */}
      {/* ================================================================= */}
      {viewStudent && !editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewStudent(null)}></div>

          {/* Modal Container: Max Height 90vh, Flex Col for scrollable middle */}
          <div className="relative bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slide-up sm:animate-fade-in overflow-hidden">

            {/* Fixed Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 pt-8 flex flex-col items-center text-white relative flex-shrink-0">
              <button onClick={() => setViewStudent(null)} className="absolute top-4 right-4 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 border-2 border-white/40 rounded-full flex items-center justify-center mb-2 text-2xl sm:text-3xl font-black shadow-inner">
                {viewStudent.rollNo}
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-center px-4">{viewStudent.fullName || viewStudent.name}</h3>
              <p className="text-blue-100 font-medium text-xs sm:text-sm mt-1">{viewStudent.gender} • Class {myClass.classLevel}-{myClass.division}</p>
            </div>

            {/* Scrollable Middle Body */}
            <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
              {/* Credentials Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-400"></div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-black text-blue-800 uppercase tracking-wider flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5"/> Login Password</span>
                </div>
                <div className="flex justify-between items-center bg-white px-3 py-2.5 border border-blue-100 rounded-xl shadow-sm">
                  <span className="font-mono font-bold text-slate-800 tracking-wider text-base sm:text-lg">{viewStudent.passwordHash || 'Not Set'}</span>
                  <button onClick={() => handleCopyPassword(viewStudent.passwordHash)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-400"><Phone className="w-4 h-4"/></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Parent Mobile</p>
                    <p className="font-bold text-slate-700 truncate">{viewStudent.parentMobileNo || viewStudent.parentMobile}</p>
                  </div>
                </div>
                {viewStudent.email && (
                  <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-400"><Mail className="w-4 h-4"/></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Email</p>
                      <p className="font-bold text-slate-700 truncate">{viewStudent.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Action Footer */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex gap-3 flex-shrink-0">
              <button onClick={() => { setEditingStudent(viewStudent); setViewStudent(null); }} className="flex-1 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-bold rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm">
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => handleDelete(viewStudent.id, viewStudent.fullName || viewStudent.name)} className="flex-1 py-3.5 bg-red-50 border border-red-100 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors flex justify-center items-center gap-2 shadow-sm">
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. EDIT STUDENT MODAL (REFINED FOR VISIBILITY) */}
      {/* ================================================================= */}
      {editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingStudent(null)}></div>

          <div className="relative bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slide-up sm:animate-fade-in overflow-hidden">

            {/* Fixed Header */}
            <div className="bg-amber-500 p-5 sm:p-6 flex justify-between items-center text-white flex-shrink-0 shadow-sm z-10">
              <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
                <Edit3 className="w-5 h-5 sm:w-6 sm:h-6" /> Edit Student
              </h3>
              <button onClick={() => setEditingStudent(null)} className="p-1.5 bg-black/10 hover:bg-black/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="p-5 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="block text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input type="text" required value={editingStudent.fullName || editingStudent.name} onChange={e => setEditingStudent({...editingStudent, fullName: e.target.value})} className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-gray-800" />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Roll No</label>
                  <input type="text" required value={editingStudent.rollNo} onChange={e => setEditingStudent({...editingStudent, rollNo: e.target.value})} className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-gray-800" />
                </div>
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Gender</label>
                  <select value={editingStudent.gender} onChange={e => setEditingStudent({...editingStudent, gender: e.target.value})} className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-gray-800">
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Parent Mobile</label>
                <input type="tel" required value={editingStudent.parentMobileNo || editingStudent.parentMobile} onChange={e => setEditingStudent({...editingStudent, parentMobileNo: e.target.value})} className="w-full px-4 py-3 sm:py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-gray-800" />
              </div>
            </div>

            {/* Fixed Action Footer */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex gap-3 flex-shrink-0">
              <button type="button" onClick={() => setEditingStudent(null)} className="flex-1 py-3 sm:py-3.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold rounded-xl transition-colors shadow-sm">
                Cancel
              </button>
              <button type="button" onClick={handleEditSave} className="flex-1 py-3 sm:py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-xl transition-all shadow-md shadow-amber-200 active:scale-95">
                Save Changes
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2 sm:px-0">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Class Roster
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Overview and contact details for Class {myClass.classLevel}-{myClass.division}.</p>
        </div>

        <button onClick={exportCredentialsCSV} className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Export Credentials
        </button>
      </div>


    {/* --- STATS SUMMARY CARDS --- */}
          <div className="flex sm:grid sm:grid-cols-4 gap-3 sm:gap-4 mb-8 overflow-x-auto pb-2 sm:pb-0 px-2 sm:px-0 snap-x no-scrollbar">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm min-w-[140px] flex-1 snap-start">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Total</span>
              <span className="text-3xl sm:text-4xl font-black text-gray-900">{totalStudents}</span>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-blue-100 shadow-sm shadow-blue-50 min-w-[140px] flex-1 snap-start">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 block">Boys</span>
              <span className="text-3xl sm:text-4xl font-black text-blue-600">{boysCount}</span>
            </div>
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-pink-100 shadow-sm shadow-pink-50 min-w-[140px] flex-1 snap-start">
              <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1 block">Girls</span>
              <span className="text-3xl sm:text-4xl font-black text-pink-500">{girlsCount}</span>
            </div>

            {/* CHANGED: Removed the conditional wrapper so this always shows! */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-50 min-w-[140px] flex-1 snap-start">
              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1 block">Other</span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-500">{otherCount}</span>
            </div>
          </div>

      {/* --- SEARCH & TABS --- */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-2 mx-2 sm:mx-0">
        <div className="flex bg-gray-50 p-1 rounded-xl md:w-auto w-full overflow-x-auto no-scrollbar">
          {['All', 'Boy', 'Girl', 'Other'].map(tab => {
//             if (tab === 'Other' && otherCount === 0) return null;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-5 sm:px-6 py-2.5 sm:py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'All' ? 'All' : `${tab}s`}
              </button>
            )
          })}
        </div>

        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search roster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-none rounded-xl outline-none text-sm font-semibold text-gray-700"
          />
        </div>
      </div>

      {/* --- STUDENT LIST CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 px-2 sm:px-0">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 border-dashed">
            <UserCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-bold text-lg text-gray-600">No students found</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => setViewStudent(student)}
              className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3 sm:gap-4 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-50 border-2 border-slate-100 shadow-inner flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 transition-colors">
                <span className="text-base sm:text-lg font-black text-slate-500 group-hover:text-blue-600">{student.rollNo}</span>
                <div className={`absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white ${
                  student.gender === 'Boy' ? 'bg-indigo-400' :
                  student.gender === 'Girl' ? 'bg-pink-400' : 'bg-emerald-400'
                }`}></div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-gray-900 truncate group-hover:text-blue-700 transition-colors">{student.fullName || student.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-gray-500 mt-0.5 sm:mt-1">
                  <Phone className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gray-400" /> {student.parentMobileNo || student.parentMobile}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ClassRoster;