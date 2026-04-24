import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { UserPlus, Loader2, CheckCircle2, XCircle, Users, UploadCloud, FileText, FileSpreadsheet } from 'lucide-react';

const AddStudent = () => {
 const { user, isClassTeacher } = useOutletContext();
   const [entryMode, setEntryMode] = useState('manual');
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
   const [selectedFile, setSelectedFile] = useState(null);

   const [formData, setFormData] = useState({
     fullName: '', rollNo: '', email: '', parentMobileNo: '', gender: 'Boy'
   });

   // Get teacher's class assignment
   const myClass = user?.assignments?.find(a => a.assignmentRole === 'class');

   useEffect(() => {
     if (toast.show) {
       const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000);
       return () => clearTimeout(timer);
     }
   }, [toast.show]);

   if (!isClassTeacher || !myClass) {
     return (
       <div className="flex flex-col items-center justify-center h-96 text-gray-400">
         <Users className="w-16 h-16 mb-4 opacity-50" />
         <p className="font-bold text-lg text-gray-600">Access Denied</p>
       </div>
     );
   }

   const showToast = (message, type = 'success') => setToast({ show: true, message, type });

   // --- MANUAL ENTRY API CALL ---
   const handleManualSubmit = async (e) => {
     e.preventDefault();
     setIsSubmitting(true);

     const payload = {
       ...formData,
       classLevel: myClass.classLevel,
       division: myClass.division,
       mobileNo: formData.parentMobileNo // Login credential
     };

     try {
       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/students`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(payload)
       });

       if (response.ok) {
         const savedStudent = await response.json();
         // Crucial: Show the teacher the generated password so they can tell the student!
         showToast(`Success! Login Password: ${savedStudent.passwordHash}`, 'success');
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
  // --- BULK UPLOAD SUBMIT (MOCK) ---
  const handleBulkSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please select a CSV file first.", "error");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      showToast(`Successfully imported students from ${selectedFile.name}!`, 'success');
      setSelectedFile(null);
      setIsSubmitting(false);
    }, 1500);
  };

  // --- DOWNLOAD TEMPLATE ---
  const downloadTemplate = () => {
    const header = "FullName,RollNo,Gender(Boy/Girl/Other),ParentMobileNo,StudentEmail\n";
    const sampleRow1 = "Aarav Patel,01,Boy,9876543210,aarav@school.com\n";
    const sampleRow2 = "Diya Sharma,02,Girl,9876543211,\n"; // Email is optional, left blank

    const blob = new Blob([header + sampleRow1 + sampleRow2], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "Student_Roster_Template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
   <div className="animate-fade-in pb-20 max-w-2xl mx-auto relative">
         {/* Toast Notification */}
         <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
           <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
             {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
             <p className="font-bold text-sm">{toast.message}</p>
           </div>
         </div>

         {/* Header */}
         <div className="mb-6 px-2 sm:px-0">
           <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
             <UserPlus className="w-6 h-6 text-amber-500" /> Register Students
           </h2>
           <p className="text-sm font-medium text-gray-500 mt-1">
             Adding to Class {myClass.classLevel} - Div {myClass.division}. They will automatically get login access.
           </p>
         </div>

      {/* Mode Toggle Switch */}
      <div className="flex bg-gray-200/50 p-1 rounded-2xl mb-6 mx-2 sm:mx-0">
        <button
          onClick={() => setEntryMode('manual')}
          className={`flex-1 py-3 sm:py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${entryMode === 'manual' ? 'bg-white text-amber-600 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <UserPlus className="w-4 h-4" /> Single Entry
        </button>
        <button
          onClick={() => setEntryMode('bulk')}
          className={`flex-1 py-3 sm:py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${entryMode === 'bulk' ? 'bg-white text-amber-600 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <FileSpreadsheet className="w-4 h-4" /> CSV Bulk Upload
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white sm:rounded-3xl border-y sm:border border-gray-200 shadow-sm overflow-hidden">

        {/* --- MANUAL ENTRY MODE --- */}
        {entryMode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="animate-fade-in">
            <div className="bg-amber-50/50 border-b border-amber-100/50 p-5 sm:p-6">
              <h3 className="font-bold text-amber-800 flex items-center gap-2">
                <Users className="w-4 h-4" /> Student Information
              </h3>
            </div>

            <div className="p-5 sm:p-8 space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-gray-800 transition-all" placeholder="e.g. Aarav Patel" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Roll Number</label>
                  <input type="text" required value={formData.rollNo} onChange={e => setFormData({...formData, rollNo: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-gray-800 transition-all" placeholder="e.g. 42" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Gender</label>
                  <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-gray-800 transition-all cursor-pointer">
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Parent Mobile Number</label>
                <input type="tel" required value={formData.parentMobileNo} onChange={e => setFormData({...formData, parentMobileNo: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-gray-800 transition-all" placeholder="+91 98765 43210" />
                <p className="text-[11px] font-medium text-gray-400 mt-2">This number will be used for SMS notices and student login.</p>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Student Email (Optional)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 font-bold text-gray-800 transition-all" placeholder="student@school.com" />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-lg rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-md shadow-amber-200">
                  {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <UserPlus className="w-6 h-6" />}
                  {isSubmitting ? 'Saving Student...' : 'Register Student'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* --- BULK UPLOAD MODE --- */}
        {entryMode === 'bulk' && (
          <div className="p-6 sm:p-10 animate-fade-in text-center">

            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-amber-100/50 shadow-inner">
              <FileSpreadsheet className="w-9 h-9" />
            </div>

            <h3 className="text-xl font-black text-gray-900 mb-2">Upload Roster CSV</h3>
            <p className="text-sm font-medium text-gray-500 mb-8 max-w-sm mx-auto">
              Save time by uploading your entire class list at once using our spreadsheet template.
            </p>

            <form onSubmit={handleBulkSubmit} className="space-y-6 max-w-sm mx-auto">

              {/* Custom File Upload Dropzone */}
              <label htmlFor="csv-upload" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${selectedFile ? 'border-amber-400 bg-amber-50' : 'border-gray-300 bg-gray-50 hover:bg-amber-50/50 hover:border-amber-300'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <UploadCloud className={`w-8 h-8 mb-3 transition-colors ${selectedFile ? 'text-amber-500' : 'text-gray-400 group-hover:text-amber-500'}`} />
                  {selectedFile ? (
                    <>
                      <p className="text-sm font-bold text-amber-700 truncate max-w-[250px]">{selectedFile.name}</p>
                      <p className="text-xs font-semibold text-amber-600/70 mt-1">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-gray-600 group-hover:text-amber-700">Tap to select CSV file</p>
                      <p className="text-[11px] font-medium text-gray-400 mt-1.5 uppercase tracking-wider">Only .csv files supported</p>
                    </>
                  )}
                </div>
                <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} />
              </label>

              <div className="flex flex-col gap-3">
                <button type="button" onClick={downloadTemplate} className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <FileText className="w-5 h-5 text-gray-400" /> Download Blank Template
                </button>

                {selectedFile && (
                  <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-amber-500 text-white font-black text-lg rounded-xl hover:bg-amber-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-amber-200 animate-slide-up">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                    {isSubmitting ? 'Processing File...' : 'Upload & Register Roster'}
                  </button>
                )}
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default AddStudent;