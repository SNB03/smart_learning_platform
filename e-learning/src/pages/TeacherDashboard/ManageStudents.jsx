import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Search, Plus, UserCircle, Phone, Loader2, X, CheckCircle2, XCircle } from 'lucide-react';

const ManageStudents = () => {
  const { user, isClassTeacher } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [formData, setFormData] = useState({ fullName: '', rollNo: '', email: '', parentMobileNo: '', gender: 'Boy' });

  // 1. Ensure only Class Teachers are here
  if (!isClassTeacher) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <Users className="w-16 h-16 mb-4 opacity-50" />
        <p className="font-bold text-lg text-gray-600">Access Denied</p>
        <p className="text-sm">Only Class Teachers can manage student rosters.</p>
      </div>
    );
  }

  // 2. Identify the teacher's class
  const myClass = user.assignments?.find(a => a.assignmentRole === 'class');

  // 3. Auto-hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  // 4. Fetch Students on Load
  useEffect(() => {
    const fetchStudents = async () => {
      if (!myClass) return;
      try {
        const response = await fetch(`http://localhost:8080/api/teacher/students?classLevel=${myClass.classLevel}&division=${myClass.division}`);
        if (response.ok) {
          setStudents(await response.json());
        }
      } catch (error) {
        showToast("Cannot connect to server.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, [myClass]);

  // 5. Handle Add Student Form Submit
  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      classLevel: myClass.classLevel,
      division: myClass.division,
      mobileNo: formData.parentMobileNo // Using parent's mobile as the unique mobile identifier
    };

    try {
      const response = await fetch('http://localhost:8080/api/teacher/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedStudent = await response.json();
        setStudents([...students, savedStudent]);
        showToast(`Student Added! Password: ${savedStudent.passwordHash}`, 'success');
        setIsModalOpen(false);
        setFormData({ fullName: '', rollNo: '', email: '', parentMobileNo: '', gender: 'Boy' });
      } else {
        const errText = await response.text();
        showToast(errText || "Failed to add student.", "error");
      }
    } catch (error) {
      showToast("Network error.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s =>
    s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo?.includes(searchQuery)
  );

  return (
    <div className="animate-fade-in pb-20 relative">

      {/* Toast */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      </div>

      {/* --- ADD STUDENT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in flex flex-col">

            <div className="bg-blue-600 p-5 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Add New Student</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Aarav Patel" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Roll No</label>
                  <input type="text" required value={formData.rollNo} onChange={e => setFormData({...formData, rollNo: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 101" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Parent Mobile Number</label>
                <input type="tel" required value={formData.parentMobileNo} onChange={e => setFormData({...formData, parentMobileNo: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="+91 98765 43210" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Student Email (Optional)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" placeholder="student@school.com" />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> My Class Roster
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">
            {myClass ? `Class ${myClass.classLevel} - Div ${myClass.division}` : 'No Class Assigned'} • {students.length} Students
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm">
          <Plus className="w-5 h-5" /> Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or roll number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 sm:py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm font-medium text-gray-700"
        />
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : filteredStudents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            <p className="font-medium">No students found. Add one to get started!</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors group">

              <div className="relative w-14 h-14 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-black text-slate-400">{student.rollNo}</span>
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${student.gender === 'Boy' ? 'bg-blue-400' : 'bg-pink-400'}`}></div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-900 truncate">{student.fullName}</h4>
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mt-1">
                  <Phone className="w-3.5 h-3.5" /> {student.parentMobileNo || student.mobileNo || "N/A"}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ManageStudents;