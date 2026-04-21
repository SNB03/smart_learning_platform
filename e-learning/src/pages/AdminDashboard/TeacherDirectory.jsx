// import React, { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import { Contact, Power, Trash2, Loader2, Search, Filter, Eye, X, Mail, Phone, BookOpen, Lock, Copy, CheckCircle2, UserCircle, Users, XCircle } from 'lucide-react';
//
// const TeacherDirectory = () => {
//   const { t } = useOutletContext();
//   const [teachers, setTeachers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//
//   // --- NEW: Custom Toast State ---
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
//
//   // Top-Level Tab State
//   const [activeRoleTab, setActiveRoleTab] = useState('class'); // 'class' or 'subject'
//
//   // Filter & Search State
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedClass, setSelectedClass] = useState('all');
//
//   // Modal & Password State
//   const [selectedTeacher, setSelectedTeacher] = useState(null);
//   const [copied, setCopied] = useState(false);
//
//   // Auto-hide toast after 3 seconds
//   useEffect(() => {
//     if (toast.show) {
//       const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [toast.show]);
//
//   const showToast = (message, type = 'success') => {
//     setToast({ show: true, message, type });
//   };
//
//   // Fetch Teachers
//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const response = await fetch('http://localhost:8080/api/admin/teachers');
//         if (response.ok) {
//           const data = await response.json();
//           setTeachers(data);
//         } else {
//           showToast("Failed to load teachers from database.", "error");
//         }
//       } catch (error) {
//         console.error("Failed to fetch teachers:", error);
//         showToast("Cannot connect to server.", "error");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchTeachers();
//   }, []);
//
//   // API Calls - NOW USING TOASTS!
//   const handleToggleStatus = async (id, currentStatus) => {
//     try {
//       const response = await fetch(`http://localhost:8080/api/admin/teachers/${id}/status`, { method: 'PUT' });
//       if (response.ok) {
//         const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
//         setTeachers(teachers.map(teacher =>
//           teacher.id === id ? { ...teacher, status: newStatus } : teacher
//         ));
//         showToast(`Teacher marked as ${newStatus}.`, "success");
//       } else {
//         showToast("Failed to update status in database.", "error");
//       }
//     } catch (error) {
//       showToast("Network error. Could not update status.", "error");
//     }
//   };
//
//   const handleDelete = async (id, name) => {
//     if (window.confirm(`Are you sure you want to permanently delete ${name}? This cannot be undone.`)) {
//       try {
//         const response = await fetch(`http://localhost:8080/api/admin/teachers/${id}`, { method: 'DELETE' });
//         if (response.ok) {
//           setTeachers(teachers.filter(teacher => teacher.id !== id));
//           if (selectedTeacher?.id === id) setSelectedTeacher(null);
//           showToast(`${name} has been deleted.`, "success");
//         } else {
//           showToast("Failed to delete teacher from database.", "error");
//         }
//       } catch (error) {
//         showToast("Network error. Could not delete.", "error");
//       }
//     }
//   };
//
//   const handleCopyPassword = (password) => {
//     navigator.clipboard.writeText(password);
//     setCopied(true);
//     showToast("Password copied to clipboard!", "success");
//     setTimeout(() => setCopied(false), 2000);
//   };
//
//   // Helpers
//   const formatClasses = (assignments) => {
//     if (!assignments || assignments.length === 0) return "Unassigned";
//     const uniqueClasses = [...new Set(assignments.map(a => a.classLevel))].sort((a, b) => a - b);
//     return uniqueClasses.map(c => `Class ${c}`).join(', ');
//   };
//
//   const getSubjects = (assignments) => {
//     if (!assignments) return "None";
//     const uniqueSubjects = [...new Set(assignments.map(a => a.subjectName).filter(s => s.toLowerCase() !== 'class teacher'))];
//     return uniqueSubjects.length > 0 ? uniqueSubjects.join(', ') : "No Subjects";
//   };
//
//   // Filtering Logic
//   const filteredTeachers = teachers.filter(teacher => {
//     const matchesSearch =
//       teacher.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       teacher.email?.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesRole = teacher.teacherType === activeRoleTab;
//     const matchesClass = selectedClass === 'all' ||
//       teacher.assignments?.some(a => a.classLevel.toString() === selectedClass);
//     return matchesSearch && matchesRole && matchesClass;
//   });
//
//   return (
//     <div className="relative animate-fade-in bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
//
//       {/* --- CUSTOM TOAST NOTIFICATION --- */}
//       <div className={`absolute top-4 right-4 z-[60] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
//         <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
//           {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
//           <p className="font-bold text-sm">{toast.message}</p>
//         </div>
//       </div>
//
//       {/* --- MODAL --- */}
//       {selectedTeacher && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedTeacher(null)}></div>
//
//           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
//             <div className="bg-blue-600 p-6 text-white flex justify-between items-start flex-shrink-0">
//               <div>
//                 <h3 className="text-2xl font-bold">{selectedTeacher.fullName}</h3>
//                 <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-sm font-bold border border-white/30">
//                   {selectedTeacher.teacherType === 'class' ? (t.classTeacher || "Class Teacher") : (t.subjectTeacher || "Subject Teacher")}
//                 </span>
//               </div>
//               <button onClick={() => setSelectedTeacher(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
//                 <X className="w-5 h-5 text-white" />
//               </button>
//             </div>
//
//             <div className="p-6 overflow-y-auto">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//
//                 <div className="space-y-6">
//                   <div>
//                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Details</h4>
//                     <div className="space-y-3">
//                       <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                         <Mail className="w-5 h-5 text-gray-400" />
//                         <span className="text-sm font-medium text-gray-700">{selectedTeacher.email}</span>
//                       </div>
//                       <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
//                         <Phone className="w-5 h-5 text-gray-400" />
//                         <span className="text-sm font-medium text-gray-700">{selectedTeacher.mobileNo || "N/A"}</span>
//                       </div>
//                     </div>
//                   </div>
//
//                   <div>
//                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Login Credentials</h4>
//                     <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
//                       <div className="flex items-center gap-2 mb-2">
//                         <Lock className="w-4 h-4 text-blue-600" />
//                         <span className="text-sm font-bold text-blue-900">Current Password</span>
//                       </div>
//                       <div className="flex items-center justify-between bg-white px-3 py-2 border border-blue-200 rounded-lg">
//                         <span className="font-mono font-bold text-gray-800 tracking-wider">
//                           {selectedTeacher.passwordHash || "********"}
//                         </span>
//                         <button
//                           onClick={() => handleCopyPassword(selectedTeacher.passwordHash)}
//                           className="p-1.5 hover:bg-blue-50 rounded-md transition-colors text-blue-600"
//                           title="Copy to clipboard"
//                         >
//                           {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//
//                 <div>
//                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Class & Subject Assignments</h4>
//                   {selectedTeacher.assignments && selectedTeacher.assignments.length > 0 ? (
//                     <div className="space-y-3">
//                       {selectedTeacher.assignments.map((assignment, idx) => (
//                         <div key={idx} className="bg-white border border-gray-200 p-3 rounded-lg flex items-start gap-3 shadow-sm">
//                           <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${assignment.assignmentRole === 'class' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'}`}>
//                             {assignment.assignmentRole === 'class' ? <UserCircle className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
//                           </div>
//                           <div>
//                             <p className="font-bold text-gray-900">Class {assignment.classLevel} - Div {assignment.division}</p>
//                             <p className="text-sm text-gray-600 font-medium">{assignment.subjectName}</p>
//                             <p className={`text-[10px] font-bold mt-1 uppercase ${assignment.assignmentRole === 'class' ? 'text-amber-600' : 'text-purple-600'}`}>
//                               {assignment.assignmentRole === 'class' ? 'Primary Class Teacher' : 'Subject Teacher'}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="bg-gray-50 border border-gray-200 border-dashed p-6 rounded-lg text-center">
//                       <p className="text-gray-500 font-medium text-sm">No classes assigned yet.</p>
//                     </div>
//                   )}
//                 </div>
//
//               </div>
//             </div>
//
//             <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end flex-shrink-0">
//               <button
//                 onClick={() => setSelectedTeacher(null)}
//                 className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* --- END MODAL --- */}
//
//       {/* TOP ROLE TABS */}
//       <div className="flex bg-gray-50 border-b border-gray-200">
//         <button
//           onClick={() => setActiveRoleTab('class')}
//           className={`flex-1 py-4 font-bold flex justify-center items-center gap-2 transition-colors ${activeRoleTab === 'class' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
//         >
//           <UserCircle className="w-5 h-5" /> {t.classTeacher || "Class Teachers"}
//           <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full ml-1 border border-gray-200">
//             {teachers.filter(t => t.teacherType === 'class').length}
//           </span>
//         </button>
//         <button
//           onClick={() => setActiveRoleTab('subject')}
//           className={`flex-1 py-4 font-bold flex justify-center items-center gap-2 transition-colors ${activeRoleTab === 'subject' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
//         >
//           <Users className="w-5 h-5" /> {t.subjectTeacher || "Subject Teachers"}
//           <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full ml-1 border border-gray-200">
//              {teachers.filter(t => t.teacherType === 'subject').length}
//           </span>
//         </button>
//       </div>
//
//       {/* Filters and Search Bar */}
//       <div className="p-6 md:p-8 border-b border-gray-100">
//         <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-xl border border-gray-200">
//
//           <div className="relative w-full md:w-96">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder={t.searchTeacher || "Search by name or email..."}
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-700"
//             />
//           </div>
//
//           <div className="flex w-full md:w-auto gap-4">
//             <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2 rounded-lg flex-1 md:flex-none">
//               <Filter className="w-4 h-4 text-gray-400" />
//               <select
//                 value={selectedClass}
//                 onChange={(e) => setSelectedClass(e.target.value)}
//                 className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full cursor-pointer"
//               >
//                 <option value="all">All Classes</option>
//                 {[5, 6, 7, 8, 9, 10].map(c => <option key={c} value={c}>Class {c}</option>)}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//
//       {/* Simplified Table Section */}
//       <div className="flex-1 overflow-x-auto">
//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
//           </div>
//         ) : filteredTeachers.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-64 text-gray-500">
//             <Contact className="w-12 h-12 text-gray-300 mb-3" />
//             <p className="font-medium">{searchQuery || selectedClass !== 'all' ? "No teachers match your filters." : "No teachers found in this category."}</p>
//           </div>
//         ) : (
//           <table className="w-full text-left border-collapse min-w-[600px]">
//             <thead>
//               <tr className="bg-slate-50 text-gray-700 border-b border-gray-200 text-sm">
//                 <th className="p-4 font-bold">{t.fullName}</th>
//                 <th className="p-4 font-bold">Assignments</th>
//                 <th className="p-4 font-bold">{t.status}</th>
//                 <th className="p-4 font-bold text-center">{t.actions}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTeachers.map(teacher => (
//                 <tr key={teacher.id} className={`border-b border-gray-100 transition-colors ${teacher.status === 'inactive' ? 'bg-gray-50 opacity-75' : 'hover:bg-blue-50/50'}`}>
//
//                   {/* Master Info */}
//                   <td className="p-4 w-1/3">
//                     <p className="font-bold text-gray-900">{teacher.fullName}</p>
//                     <p className="text-xs text-gray-500 mt-0.5">{teacher.email}</p>
//                   </td>
//
//                   {/* Clean Assignments Display */}
//                   <td className="p-4 w-1/3">
//                     <p className="text-sm font-semibold text-gray-700">
//                       {formatClasses(teacher.assignments)}
//                     </p>
//                     <p className="text-xs text-gray-500 mt-0.5" title={getSubjects(teacher.assignments)}>
//                       Subjects: <span className="font-medium">{getSubjects(teacher.assignments)}</span>
//                     </p>
//                   </td>
//
//                   <td className="p-4">
//                     <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${teacher.status === 'active' || !teacher.status ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
//                       {teacher.status === 'inactive' ? (t.inactive || "Inactive") : (t.active || "Active")}
//                     </span>
//                   </td>
//
//                   {/* Action Buttons */}
//                   <td className="p-4 flex justify-center gap-2">
//                     <button
//                       onClick={() => setSelectedTeacher(teacher)}
//                       title="View Details & Password"
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
//                     >
//                       <Eye className="w-4 h-4" />
//                     </button>
//
//                     <button
//                       onClick={() => handleToggleStatus(teacher.id, teacher.status || 'active')}
//                       title={teacher.status === 'inactive' ? "Activate" : "Deactivate"}
//                       className={`p-2 rounded-lg transition-colors border ${teacher.status === 'inactive' ? 'text-emerald-600 border-emerald-200 hover:bg-emerald-50' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}`}
//                     >
//                       <Power className="w-4 h-4" />
//                     </button>
//
//                     <button
//                       onClick={() => handleDelete(teacher.id, teacher.fullName)}
//                       title="Delete Permanently"
//                       className="p-2 text-red-500 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Contact, Power, Trash2, Loader2, Search, Filter, Eye, X, Mail, Phone, BookOpen, Lock, Copy, CheckCircle2, UserCircle, Users, XCircle, Edit3, Plus, Save } from 'lucide-react';

const TeacherDirectory = () => {
  const { t } = useOutletContext();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [activeRoleTab, setActiveRoleTab] = useState('class');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('all');
  
  // Modal State
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // --- NEW: Edit Mode State ---
  const [isEditing, setIsEditing] = useState(false);
  const [editAssignments, setEditAssignments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/teachers');
        if (response.ok) {
          const data = await response.json();
          setTeachers(data);
        }
      } catch (error) {
        showToast("Cannot connect to server.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Open Modal & Initialize Edit State
  const openModal = (teacher) => {
    setSelectedTeacher(teacher);
    setIsEditing(false);
    // Prepare assignments for potential editing
    const formattedAssignments = teacher.assignments?.map(a => ({
      id: a.id || Date.now() + Math.random(),
      role: a.assignmentRole || 'subject',
      classLevel: a.classLevel.toString(),
      division: a.division,
      subject: a.subjectName
    })) || [];
    setEditAssignments(formattedAssignments.length > 0 ? formattedAssignments : [{ id: Date.now(), role: 'subject', classLevel: '5', division: 'A', subject: '' }]);
  };

  // --- NEW: Edit Handlers ---
  const handleAddEditAssignment = () => {
    setEditAssignments([...editAssignments, { id: Date.now(), role: 'subject', classLevel: '5', division: 'A', subject: '' }]);
  };

  const handleRemoveEditAssignment = (id) => {
    setEditAssignments(editAssignments.filter(a => a.id !== id));
  };

  const handleUpdateEditAssignment = (id, field, value) => {
    setEditAssignments(editAssignments.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const saveAssignments = async () => {
    setIsSaving(true);
    const payload = {
      assignments: editAssignments.map(a => ({
        classLevel: parseInt(a.classLevel),
        division: a.division,
        assignmentRole: a.role,
        subjectName: a.role === 'class' ? 'Class Teacher' : a.subject
      }))
    };

    try {
      const response = await fetch(`http://localhost:8080/api/admin/teachers/${selectedTeacher.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const updatedTeacher = await response.json();
        // Update local state so UI refreshes instantly
        setTeachers(teachers.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
        setSelectedTeacher(updatedTeacher);
        setIsEditing(false);
        showToast("Assignments updated successfully!", "success");
      } else {
        showToast("Failed to update assignments.", "error");
      }
    } catch (error) {
      showToast("Network error during save.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Status & Delete Calls
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/teachers/${id}/status`, { method: 'PUT' });
      if (response.ok) {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        setTeachers(teachers.map(teacher => teacher.id === id ? { ...teacher, status: newStatus } : teacher));
        showToast(`Teacher marked as ${newStatus}.`, "success");
      }
    } catch (error) {
      showToast("Network error. Could not update status.", "error");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete ${name}?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/teachers/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setTeachers(teachers.filter(teacher => teacher.id !== id));
          if (selectedTeacher?.id === id) setSelectedTeacher(null);
          showToast(`${name} deleted.`, "success");
        }
      } catch (error) {
        showToast("Network error. Could not delete.", "error");
      }
    }
  };

  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    showToast("Password copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  // Helpers
  const formatClasses = (assignments) => {
    if (!assignments || assignments.length === 0) return "Unassigned";
    const uniqueClasses = [...new Set(assignments.map(a => a.classLevel))].sort((a, b) => a - b);
    return uniqueClasses.map(c => `Class ${c}`).join(', ');
  };

  const getSubjects = (assignments) => {
    if (!assignments) return "None";
    const uniqueSubjects = [...new Set(assignments.map(a => a.subjectName).filter(s => s?.toLowerCase() !== 'class teacher'))];
    return uniqueSubjects.length > 0 ? uniqueSubjects.join(', ') : "No Subjects";
  };

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) || teacher.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const roleToMatch = teacher.teacherType || 'subject'; 
    const matchesRole = roleToMatch === activeRoleTab;
    const matchesClass = selectedClass === 'all' || teacher.assignments?.some(a => a.classLevel.toString() === selectedClass);
    return matchesSearch && matchesRole && matchesClass;
  });

  return (
    <div className="relative animate-fade-in bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col min-h-[600px]">
      
      {/* Toast Notification */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      </div>

      {/* --- MODAL --- */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedTeacher(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in flex flex-col max-h-[95vh] sm:max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-blue-600 p-4 sm:p-6 text-white flex justify-between items-start flex-shrink-0">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">{selectedTeacher.fullName}</h3>
                <span className="inline-block mt-1 sm:mt-2 px-3 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-bold border border-white/30">
                  {selectedTeacher.teacherType === 'class' ? "Class Teacher" : "Subject Teacher"}
                </span>
              </div>
              <button onClick={() => setSelectedTeacher(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto bg-slate-50">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                
                {/* Column 1: Static Info */}
                <div className="space-y-6 lg:col-span-1">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contact Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium text-gray-700 break-all">{selectedTeacher.email}</span></div>
                      <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-gray-400" /><span className="text-sm font-medium text-gray-700">{selectedTeacher.mobileNo || "N/A"}</span></div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
                    <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3">Login Credentials</h4>
                    <div className="flex items-center justify-between bg-white px-3 py-2 border border-blue-200 rounded-lg">
                      <span className="font-mono font-bold text-gray-800 tracking-wider text-sm">{selectedTeacher.passwordHash || "********"}</span>
                      <button onClick={() => handleCopyPassword(selectedTeacher.passwordHash)} className="p-1 hover:bg-blue-50 rounded text-blue-600">{copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}</button>
                    </div>
                  </div>
                </div>

                {/* Column 2: Assignments (View OR Edit Mode) */}
                <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Class & Subject Assignments</h4>
                    {!isEditing ? (
                      <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                        <Edit3 className="w-4 h-4" /> Edit
                      </button>
                    ) : (
                      <button onClick={handleAddEditAssignment} className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                        <Plus className="w-4 h-4" /> Add Class
                      </button>
                    )}
                  </div>

                  {/* VIEW MODE */}
                  {!isEditing && (
                    selectedTeacher.assignments && selectedTeacher.assignments.length > 0 ? (
                      <div className="space-y-3">
                        {selectedTeacher.assignments.map((assignment, idx) => (
                          <div key={idx} className="bg-gray-50 border border-gray-200 p-3 rounded-lg flex items-start gap-3">
                            <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${assignment.assignmentRole === 'class' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'}`}>
                              {assignment.assignmentRole === 'class' ? <UserCircle className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">Class {assignment.classLevel} - Div {assignment.division}</p>
                              <p className="text-sm text-gray-600 font-medium">{assignment.subjectName}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 border border-gray-200 border-dashed p-6 rounded-lg text-center"><p className="text-gray-500 font-medium text-sm">No classes assigned.</p></div>
                    )
                  )}

                  {/* EDIT MODE */}
                  {isEditing && (
                    <div className="space-y-3">
                      {editAssignments.map((assignment) => (
                        <div key={assignment.id} className="flex flex-col sm:flex-row items-stretch gap-2 bg-slate-50 p-3 rounded-xl border border-gray-200 relative">
                          <select value={assignment.role} onChange={e => handleUpdateEditAssignment(assignment.id, 'role', e.target.value)} className="w-full sm:w-auto px-2 py-1.5 bg-white border border-gray-300 rounded outline-none text-sm font-semibold">
                            <option value="class">Class Tr.</option>
                            <option value="subject">Subject Tr.</option>
                          </select>
                          <select value={assignment.classLevel} onChange={e => handleUpdateEditAssignment(assignment.id, 'classLevel', e.target.value)} className="w-full sm:w-auto px-2 py-1.5 bg-white border border-gray-300 rounded outline-none text-sm font-semibold">
                            {[5, 6, 7, 8, 9, 10].map(c => <option key={c} value={c}>Cls {c}</option>)}
                          </select>
                          <select value={assignment.division} onChange={e => handleUpdateEditAssignment(assignment.id, 'division', e.target.value)} className="w-full sm:w-auto px-2 py-1.5 bg-white border border-gray-300 rounded outline-none text-sm font-semibold">
                            {['A', 'B', 'C', 'D'].map(d => <option key={d} value={d}>Div {d}</option>)}
                          </select>
                          <input type="text" placeholder="Subject" value={assignment.subject} onChange={e => handleUpdateEditAssignment(assignment.id, 'subject', e.target.value)} className="w-full flex-1 px-2 py-1.5 bg-white border border-gray-300 rounded outline-none text-sm font-semibold" />
                          
                          <button type="button" onClick={() => handleRemoveEditAssignment(assignment.id)} className="p-1.5 text-red-500 hover:bg-red-50 bg-white rounded border border-red-100 flex items-center justify-center">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}

                      <div className="pt-4 flex gap-3 mt-4 border-t border-gray-100">
                        <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button onClick={saveAssignments} disabled={isSaving} className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2">
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TOP TABS & TABLE (REMAINS EXACTLY THE SAME) --- */}
      <div className="flex bg-gray-50 border-b border-gray-200">
        <button onClick={() => setActiveRoleTab('class')} className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-bold flex justify-center items-center gap-1 sm:gap-2 transition-colors ${activeRoleTab === 'class' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
          <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Class Teachers</span><span className="sm:hidden">Class</span>
        </button>
        <button onClick={() => setActiveRoleTab('subject')} className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-bold flex justify-center items-center gap-1 sm:gap-2 transition-colors ${activeRoleTab === 'subject' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}>
          <Users className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Subject Teachers</span><span className="sm:hidden">Subject</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center bg-slate-50 p-3 sm:p-4 rounded-xl border border-gray-200">
          <div className="relative w-full sm:w-64 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 sm:py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-700" />
          </div>
          <div className="flex w-full sm:w-auto gap-3 sm:gap-4">
            <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-2.5 sm:py-2 rounded-lg flex-1 sm:flex-none">
              <Filter className="w-4 h-4 text-gray-400" />
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full cursor-pointer">
                <option value="all">All Classes</option>
                {[5, 6, 7, 8, 9, 10].map(c => <option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-slate-50/50 p-4 sm:p-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>
        ) : filteredTeachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500"><Contact className="w-12 h-12 text-gray-300 mb-3" /><p className="font-medium">No teachers match filters.</p></div>
        ) : (
          <>
            <div className="block md:hidden space-y-4">
              {filteredTeachers.map(teacher => (
                <div key={teacher.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${teacher.status === 'inactive' ? 'bg-red-400' : 'bg-emerald-400'}`}></div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="pl-2">
                      <h4 className="font-bold text-gray-900 text-lg">{teacher.fullName}</h4>
                      <p className="text-xs text-gray-500">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="pl-2 mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase">Assignments</p>
                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{formatClasses(teacher.assignments)}</p>
                    <p className="text-xs text-gray-600 truncate">{getSubjects(teacher.assignments)}</p>
                  </div>
                  <div className="flex gap-2 border-t border-gray-100 pt-3 mt-3">
                    <button onClick={() => openModal(teacher)} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-700 font-bold text-sm rounded-lg border border-blue-100"><Eye className="w-4 h-4"/> View</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto pb-8">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-gray-700 border-b border-gray-200 text-sm">
                    <th className="p-4 pl-6 font-bold">Name</th>
                    <th className="p-4 font-bold">Assignments</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 pr-6 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map(teacher => (
                    <tr key={teacher.id} className={`border-b border-gray-100 transition-colors ${teacher.status === 'inactive' ? 'bg-gray-50 opacity-75' : 'hover:bg-blue-50/50 bg-white'}`}>
                      <td className="p-4 pl-6 w-1/3">
                        <p className="font-bold text-gray-900">{teacher.fullName}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{teacher.email}</p>
                      </td>
                      <td className="p-4 w-1/3">
                        <p className="text-sm font-semibold text-gray-700">{formatClasses(teacher.assignments)}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate" title={getSubjects(teacher.assignments)}>Sub: <span className="font-medium">{getSubjects(teacher.assignments)}</span></p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${teacher.status === 'active' || !teacher.status ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                          {teacher.status === 'inactive' ? "Inactive" : "Active"}
                        </span>
                      </td>
                      <td className="p-4 pr-6 flex justify-center gap-2">
                        <button onClick={() => openModal(teacher)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 bg-white"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleToggleStatus(teacher.id, teacher.status || 'active')} className={`p-2 rounded-lg transition-colors border bg-white ${teacher.status === 'inactive' ? 'text-emerald-600 border-emerald-200 hover:bg-emerald-50' : 'text-amber-600 border-amber-200 hover:bg-amber-50'}`}><Power className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(teacher.id, teacher.fullName)} className="p-2 text-red-500 border border-red-200 hover:bg-red-50 bg-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDirectory;