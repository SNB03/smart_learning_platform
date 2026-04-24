// import React, { useState, useEffect } from 'react';
// import { UploadCloud, UserPlus, Key, FileText, CheckCircle2, XCircle, Loader2, Plus, Trash2 } from 'lucide-react';
// import { useOutletContext } from 'react-router-dom';
//
// const AddTeacher = () => {
//   const { t } = useOutletContext();
//   const [entryMode, setEntryMode] = useState('manual');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
//   const [selectedFile, setSelectedFile] = useState(null);
//
//   // 1. Teacher Basic Info
//   const [basicInfo, setBasicInfo] = useState({
//     name: '', mobile: '', email: ''
//   });
//
//   // 2. Dynamic Assignments Array
//   const [assignments, setAssignments] = useState([
//     { id: Date.now(), role: 'subject', classLevel: '5', division: 'A', subject: '' }
//   ]);
//
//   useEffect(() => {
//     if (toast.show) {
//       const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [toast.show]);
//
//   const showToast = (message, type = 'success') => setToast({ show: true, message, type });
//
//   // Handle Dynamic Assignment Changes
//   const addAssignment = () => {
//     setAssignments([...assignments, { id: Date.now(), role: 'subject', classLevel: '5', division: 'A', subject: '' }]);
//   };
//
//   const removeAssignment = (id) => {
//     if (assignments.length > 1) {
//       setAssignments(assignments.filter(a => a.id !== id));
//     }
//   };
//
//   const updateAssignment = (id, field, value) => {
//     setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));
//   };
//
//   const handleManualSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//
//     // Format assignments for Spring Boot
//     const formattedAssignments = assignments.map(a => ({
//       classLevel: parseInt(a.classLevel),
//       division: a.division,
//       assignmentRole: a.role, // "class" or "subject"
//       subjectName:  a.subject
//     }));
//
//     const payload = {
//       fullName: basicInfo.name,
//       email: basicInfo.email,
//       mobileNo: basicInfo.mobile,
//       assignments: formattedAssignments
//     };
//
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/teachers`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       });
//
//       if (response.ok) {
//         const savedTeacher = await response.json();
//         showToast(`Success! Password for ${savedTeacher.fullName.split(' ')[0]}: ${savedTeacher.passwordHash}`, 'success');
//
//         // Reset form
//         setBasicInfo({ name: '', mobile: '', email: '' });
//         setAssignments([{ id: Date.now(), role: 'subject', classLevel: '5', division: 'A', subject: '' }]);
//       } else {
//         const errText = await response.text();
//         showToast(errText || "Failed to save teacher.", 'error');
//       }
//     } catch (error) {
//       showToast("Could not connect to backend server.", 'error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//
//   const handleBulkSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedFile) return showToast("Please select a CSV file first.", "error");
//
//     setIsSubmitting(true);
//     const formData = new FormData();
//     formData.append("file", selectedFile);
//
//     try {
//       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/teachers/bulk-upload', {
//         method: 'POST',
//         body: formData
//       });
//       const resultMessage = await response.text();
//       if (response.ok) {
//         showToast(resultMessage, 'success');
//         setSelectedFile(null);
//       } else {
//         showToast(resultMessage, 'error');
//       }
//     } catch (error) {
//       showToast("Failed to connect to backend.", 'error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
// const downloadTemplate = () => {
//     // 1. Define the exact headers your Spring Boot backend expects
//     // Note: Classes and Divisions tell the user to use a semicolon
//     const header = "FullName,Email,MobileNo,Role,Classes(split by ;),Divisions(split by ;),Subjects\n";
//
//     // 2. Provide a couple of sample rows so the Admin knows exactly how to format it
//     const sampleRow1 = "Rahul Sharma,rahul@school.com,9876543210,subject,5;6,A;B,Mathematics\n";
//     const sampleRow2 = "Aditi Deshmukh,aditi@school.com,9876543211,class,7,A,Class Teacher\n";
//
//     // 3. Combine them into a single CSV string
//     const csvContent = header + sampleRow1 + sampleRow2;
//
//     // 4. Create a Blob (a file-like object) and trigger a browser download
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//
//     link.href = url;
//     link.download = "Teacher_Bulk_Upload_Template.csv"; // The name of the downloaded file
//     link.style.display = 'none';
//
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
//
//   return (
//     <div className="relative animate-fade-in bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
//
//       {/* Toast Notification */}
//       <div className={`absolute top-4 right-4 z-50 transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
//         <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
//           {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
//           <p className="font-bold text-sm">{toast.message}</p>
//         </div>
//       </div>
//
//       <div className="flex border-b border-gray-200 bg-gray-50">
//         <button onClick={() => setEntryMode('manual')} className={`flex-1 py-4 font-bold flex justify-center items-center gap-2 ${entryMode === 'manual' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
//           <UserPlus className="w-5 h-5" /> {t.manualEntry}
//         </button>
//         <button onClick={() => setEntryMode('bulk')} className={`flex-1 py-4 font-bold flex justify-center items-center gap-2 ${entryMode === 'bulk' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
//           <UploadCloud className="w-5 h-5" /> {t.bulkUpload}
//         </button>
//       </div>
//
//       <div className="p-6 md:p-8">
//         {entryMode === 'manual' && (
//           <form onSubmit={handleManualSubmit} className="space-y-8 max-w-4xl mx-auto">
//
//             {/* 1. Basic Info Section */}
//             <div>
//               <h3 className="text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">Teacher Details</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div>
//                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.fullName}</label>
//                   <input type="text" required value={basicInfo.name} onChange={e => setBasicInfo({...basicInfo, name: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Rahul Sharma" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.mobile}</label>
//                   <input type="tel" required value={basicInfo.mobile} onChange={e => setBasicInfo({...basicInfo, mobile: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 98765 43210" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.email}</label>
//                   <input type="email" required value={basicInfo.email} onChange={e => setBasicInfo({...basicInfo, email: e.target.value})} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="teacher@school.com" />
//                 </div>
//               </div>
//             </div>
//
//             {/* 2. Dynamic Assignment Builder */}
//             <div>
//               <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
//                 <h3 className="text-lg font-black text-gray-900">Class & Subject Assignments</h3>
//                 <button type="button" onClick={addAssignment} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg">
//                   <Plus className="w-4 h-4" /> Add Assignment
//                 </button>
//               </div>
//
//               <div className="space-y-3">
//                 {assignments.map((assignment, index) => (
//                   <div key={assignment.id} className="flex flex-wrap md:flex-nowrap items-end gap-4 bg-slate-50 p-4 rounded-xl border border-gray-200 relative group">
//
//                     <div className="w-full md:w-auto flex-1">
//                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
//                       <select value={assignment.role} onChange={e => updateAssignment(assignment.id, 'role', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none font-semibold text-gray-700">
//                         <option value="class">Class Teacher</option>
//                         <option value="subject">Subject Teacher</option>
//                       </select>
//                     </div>
//
//                     <div className="w-full md:w-auto flex-1">
//                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class</label>
//                       <select value={assignment.classLevel} onChange={e => updateAssignment(assignment.id, 'classLevel', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none font-semibold text-gray-700">
//                         {['5', '6', '7', '8', '9', '10'].map(c => <option key={c} value={c}>Class {c}</option>)}
//                       </select>
//                     </div>
//
//                     <div className="w-full md:w-auto flex-1">
//                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Division</label>
//                       <select value={assignment.division} onChange={e => updateAssignment(assignment.id, 'division', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none font-semibold text-gray-700">
//                         {['A', 'B', 'C', 'D'].map(d => <option key={d} value={d}>Div {d}</option>)}
//                       </select>
//                     </div>
// <div className="w-full md:w-auto flex-1">
//                       <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
//                       <input
//                         type="text"
//                         required
//                         placeholder="e.g. Math"
//                         value={assignment.subject}
//                         onChange={e => updateAssignment(assignment.id, 'subject', e.target.value)}
//                         className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg outline-none font-semibold text-gray-700"
//                       />
//                     </div>
//
//                     {assignments.length > 1 && (
//                       <button type="button" onClick={() => removeAssignment(assignment.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors md:mb-1">
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//
//             <button type="submit" disabled={isSubmitting} className={`w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}>
//               {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
//               {isSubmitting ? 'Saving to Database...' : t.generateBtn}
//             </button>
//           </form>
//         )}
//
//        {/* BULK UPLOAD MODE */}
//                {entryMode === 'bulk' && (
//                  <div className="max-w-2xl mx-auto text-center py-10">
//                     <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-100">
//                        <UploadCloud className="w-10 h-10" />
//                     </div>
//                     <h3 className="text-xl font-bold text-gray-900 mb-3">{t.bulkUpload}</h3>
//                     <p className="text-gray-600 mb-8">Upload a CSV file containing teacher details.</p>
//
//                     <form onSubmit={handleBulkSubmit} className="flex flex-col items-center gap-4">
//                        <input
//                          type="file"
//                          accept=".csv"
//                          id="csv-upload"
//                          className="hidden"
//                          onChange={(e) => setSelectedFile(e.target.files[0])}
//                        />
//
//                        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
//                           {/* CONNECTED THE onClick HANDLER HERE */}
//                           <button
//                             type="button"
//                             onClick={downloadTemplate}
//                             className="bg-white text-gray-700 border border-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
//                           >
//                             <FileText className="w-5 h-5" /> Download Template
//                           </button>
//
//                           <label
//                             htmlFor="csv-upload"
//                             className="bg-blue-100 text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-blue-200 cursor-pointer flex items-center justify-center gap-2 transition-colors"
//                           >
//                             {selectedFile ? selectedFile.name : 'Select CSV File'}
//                           </label>
//                        </div>
//
//                        {selectedFile && (
//                           <button
//                             type="submit"
//                             disabled={isSubmitting}
//                             className="mt-4 w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-12 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
//                           >
//                             {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
//                             {isSubmitting ? 'Uploading...' : 'Upload & Save'}
//                           </button>
//                        )}
//                     </form>
//                  </div>
//                )}
//       </div>
//     </div>
//   );
// };
//
// export default AddTeacher;

import React, { useState, useEffect } from 'react';
import { UploadCloud, UserPlus, Key, FileText, CheckCircle2, XCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const AddTeacher = () => {
  const { t } = useOutletContext();
  const [entryMode, setEntryMode] = useState('manual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [selectedFile, setSelectedFile] = useState(null);

  const [basicInfo, setBasicInfo] = useState({ name: '', mobile: '', email: '' });
  const [assignments, setAssignments] = useState([
    { id: Date.now(), role: 'subject', classLevel: '5', division: 'A', subject: '' }
  ]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  const addAssignment = () => setAssignments([...assignments, { id: Date.now(), role: 'subject', classLevel: '5', division: 'A', subject: '' }]);
  const removeAssignment = (id) => assignments.length > 1 && setAssignments(assignments.filter(a => a.id !== id));
  const updateAssignment = (id, field, value) => setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formattedAssignments = assignments.map(a => ({
      classLevel: parseInt(a.classLevel),
      division: a.division,
      assignmentRole: a.role,
      subjectName: a.subject
    }));

    const payload = {
      fullName: basicInfo.name,
      email: basicInfo.email,
      mobileNo: basicInfo.mobile,
      teacherType: assignments[0]?.role || 'subject', // Fallback primary role based on first assignment
      assignments: formattedAssignments
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedTeacher = await response.json();
        showToast(`Success! Password for ${savedTeacher.fullName.split(' ')[0]}: ${savedTeacher.passwordHash}`, 'success');
        setBasicInfo({ name: '', mobile: '', email: '' });
        setAssignments([{ id: Date.now(), role: 'subject', classLevel: '5', division: 'A', subject: '' }]);
      } else {
        const errText = await response.text();
        showToast(errText || "Failed to save teacher.", 'error');
      }
    } catch (error) {
      showToast("Could not connect to backend server.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return showToast("Please select a CSV file first.", "error");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/teachers/bulk-upload`, { method: 'POST', body: formData });
      const resultMessage = await response.text();
      if (response.ok) {
        showToast(resultMessage, 'success');
        setSelectedFile(null);
      } else {
        showToast(resultMessage, 'error');
      }
    } catch (error) {
      showToast("Failed to connect to backend.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTemplate = () => {
    const header = "FullName,Email,MobileNo,Role,Classes(split by ;),Divisions(split by ;),Subjects\n";
    const sampleRow1 = "Rahul Sharma,rahul@school.com,9876543210,subject,5;6,A;B,Mathematics\n";
    const sampleRow2 = "Aditi Deshmukh,aditi@school.com,9876543211,class,7,A,Science\n";
    const blob = new Blob([header + sampleRow1 + sampleRow2], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "Teacher_Bulk_Upload_Template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative animate-fade-in bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[600px]">
      {/* Toast Notification */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-gray-50">
        <button onClick={() => setEntryMode('manual')} className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-bold flex justify-center items-center gap-2 ${entryMode === 'manual' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" /> {t.manualEntry}
        </button>
        <button onClick={() => setEntryMode('bulk')} className={`flex-1 py-3 sm:py-4 text-sm sm:text-base font-bold flex justify-center items-center gap-2 ${entryMode === 'bulk' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
          <UploadCloud className="w-4 h-4 sm:w-5 sm:h-5" /> {t.bulkUpload}
        </button>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {entryMode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-8 max-w-4xl mx-auto">
            {/* Basic Info */}
            <div className="bg-white p-0 sm:p-4 rounded-xl">
              <h3 className="text-base sm:text-lg font-black text-gray-900 mb-4 border-b border-gray-100 pb-2">Teacher Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.fullName}</label>
                  <input type="text" required value={basicInfo.name} onChange={e => setBasicInfo({...basicInfo, name: e.target.value})} className="w-full px-4 py-2.5 sm:py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Rahul Sharma" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.mobile}</label>
                  <input type="tel" required value={basicInfo.mobile} onChange={e => setBasicInfo({...basicInfo, mobile: e.target.value})} className="w-full px-4 py-2.5 sm:py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+91 98765 43210" />
                </div>
                <div className="sm:col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{t.email}</label>
                  <input type="email" required value={basicInfo.email} onChange={e => setBasicInfo({...basicInfo, email: e.target.value})} className="w-full px-4 py-2.5 sm:py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="teacher@school.com" />
                </div>
              </div>
            </div>

            {/* Dynamic Assignments (MOBILE FIRST STACKING) */}
            <div className="bg-white p-0 sm:p-4 rounded-xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b border-gray-100 pb-2 gap-2">
                <h3 className="text-base sm:text-lg font-black text-gray-900">Class & Subject Assignments</h3>
                <button type="button" onClick={addAssignment} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-2 rounded-lg w-full sm:w-auto justify-center">
                  <Plus className="w-4 h-4" /> Add Assignment
                </button>
              </div>

              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <div key={assignment.id} className="flex flex-col md:flex-row items-stretch md:items-end gap-3 sm:gap-4 bg-slate-50 p-4 rounded-xl border border-gray-200 relative">

                    <div className="w-full md:w-1/4 flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                      <select value={assignment.role} onChange={e => updateAssignment(assignment.id, 'role', e.target.value)} className="w-full px-3 py-2.5 sm:py-2 bg-white border border-gray-300 rounded-lg outline-none font-semibold text-gray-700">
                        <option value="class">Class Teacher</option>
                        <option value="subject">Subject Teacher</option>
                      </select>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto flex-1">
                      <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class</label>
                        <select value={assignment.classLevel} onChange={e => updateAssignment(assignment.id, 'classLevel', e.target.value)} className="w-full px-3 py-2.5 sm:py-2 bg-white border border-gray-300 rounded-lg outline-none font-semibold text-gray-700">
                          {['5', '6', '7', '8', '9', '10'].map(c => <option key={c} value={c}>Class {c}</option>)}
                        </select>
                      </div>
                      <div className="w-1/2">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Div</label>
                        <select value={assignment.division} onChange={e => updateAssignment(assignment.id, 'division', e.target.value)} className="w-full px-3 py-2.5 sm:py-2 bg-white border border-gray-300 rounded-lg outline-none font-semibold text-gray-700">
                          {['A', 'B', 'C', 'D'].map(d => <option key={d} value={d}>Div {d}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="w-full md:w-1/3 flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                      <input type="text" required placeholder="e.g. Math" value={assignment.subject} onChange={e => updateAssignment(assignment.id, 'subject', e.target.value)} className="w-full px-3 py-2.5 sm:py-2 bg-white border border-gray-300 rounded-lg outline-none font-semibold text-gray-700" />
                    </div>

                    {assignments.length > 1 && (
                      <button type="button" onClick={() => removeAssignment(assignment.id)} className="w-full md:w-auto mt-2 md:mt-0 p-2.5 sm:p-2 text-red-500 hover:bg-red-50 bg-red-50 md:bg-transparent rounded-lg transition-colors flex items-center justify-center gap-2 md:mb-1">
                        <Trash2 className="w-5 h-5" /> <span className="md:hidden font-bold">Remove</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className={`w-full bg-blue-600 text-white font-bold py-3.5 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center gap-2 shadow-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}>
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Key className="w-5 h-5" />}
              {isSubmitting ? 'Saving to Database...' : t.generateBtn}
            </button>
          </form>
        )}

        {entryMode === 'bulk' && (
          <div className="max-w-2xl mx-auto text-center py-6 sm:py-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border-4 border-blue-100">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{t.bulkUpload}</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Upload a CSV file containing teacher details.</p>

            <form onSubmit={handleBulkSubmit} className="flex flex-col items-center gap-4 w-full">
              <input type="file" accept=".csv" id="csv-upload" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <button type="button" onClick={downloadTemplate} className="w-full sm:w-auto bg-white text-gray-700 border border-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
                  <FileText className="w-5 h-5" /> Template
                </button>
                <label htmlFor="csv-upload" className="w-full sm:w-auto bg-blue-100 text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-blue-200 cursor-pointer flex items-center justify-center gap-2 transition-colors">
                  {selectedFile ? selectedFile.name : 'Select CSV File'}
                </label>
              </div>
              {selectedFile && (
                <button type="submit" disabled={isSubmitting} className="mt-2 sm:mt-4 w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-12 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />} Upload & Save
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTeacher;