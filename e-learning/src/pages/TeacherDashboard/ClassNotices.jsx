import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Bell, Plus, Megaphone, BookOpen, AlertCircle, Trash2, X, CheckCircle2, XCircle, Loader2, Send, Paperclip, FileText, Download } from 'lucide-react';

const ClassNotices = () => {
    const { user, isClassTeacher } = useOutletContext();
    // 1. DEFINE myClass FIRST! (This fixes the ReferenceError)
          const myClass = user.assignments?.find(a => a.assignmentRole === 'class') || { classLevel: '5', division: 'A' };


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

 // Add this inside your ClassNotices component

   const [notices, setNotices] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   // 1. FETCH NOTICES ON LOAD
   useEffect(() => {
     const fetchNotices = async () => {
       try {
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/notices?classLevel=${myClass.classLevel}&division=${myClass.division}`);
         if (response.ok) {
           const data = await response.json();
           setNotices(data);
         }
       } catch (error) {
         showToast("Failed to fetch notices.", "error");
       } finally {
         setIsLoading(false);
       }
     };
     fetchNotices();
   }, [myClass.classLevel, myClass.division]);

   // 2. SEND NOTICE TO BACKEND
   const handleSendNotice = async (e) => {
     e.preventDefault();
     setIsSending(true);

     // Because we are sending a File, we MUST use FormData, not JSON.stringify!
     const formData = new FormData();
     formData.append('title', newNotice.title);
     formData.append('content', newNotice.content);
     formData.append('type', newNotice.type);
     formData.append('classLevel', myClass.classLevel);
     formData.append('division', myClass.division);
     formData.append('authorId', user.id); // From your user context

     if (newNotice.file) {
       formData.append('file', newNotice.file);
     }

     try {
       const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/notices`, {
         method: 'POST',
         // Do NOT set Content-Type header manually when using FormData!
         body: formData
       });

       if (response.ok) {
         const savedNotice = await response.json();
         setNotices([savedNotice, ...notices]); // Add new notice to top of feed
         setIsModalOpen(false);
         setNewNotice({ title: '', content: '', type: 'info', file: null });
         showToast("Notice broadcasted to class!", "success");
       } else {
         showToast("Failed to send notice.", "error");
       }
     } catch (error) {
       showToast("Server connection error.", "error");
     } finally {
       setIsSending(false);
     }
   };

   // 3. DELETE NOTICE
   const handleDelete = async (id) => {
     if (window.confirm("Delete this notice? It will be removed from the students' dashboard.")) {
       try {
         const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/notices/${id}`, {
           method: 'DELETE'
         });

         if (response.ok) {
           setNotices(notices.filter(n => n.id !== id));
           showToast("Notice removed.", "success");
         }
       } catch (error) {
         showToast("Failed to delete notice.", "error");
       }
     }
   };
  // Auto-hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  if (!isClassTeacher) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400 animate-fade-in">
        <Bell className="w-16 h-16 mb-4 opacity-30" />
        <p className="font-black text-xl text-gray-600 tracking-tight">Access Restricted</p>
        <p className="text-sm font-medium mt-1 text-center max-w-xs">Only Class Teachers can broadcast official notices to their specific division.</p>
      </div>
    );
  }





  const getTypeStyles = (type) => {
    switch(type) {
      case 'urgent': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: <AlertCircle className="w-5 h-5 text-red-600" /> };
      case 'homework': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: <BookOpen className="w-5 h-5 text-purple-600" /> };
      default: return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <Megaphone className="w-5 h-5 text-blue-600" /> };
    }
  };

  return (
    <div className="animate-fade-in pb-24 sm:pb-10 relative max-w-3xl mx-auto">

      {/* Toast Notification */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      </div>

      {/* --- MOBILE FAB --- */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-amber-500 text-white rounded-full shadow-xl shadow-amber-200 flex items-center justify-center hover:bg-amber-600 active:scale-95 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* --- COMPOSE MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSending && setIsModalOpen(false)}></div>

          <div className="relative bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up sm:animate-fade-in flex flex-col max-h-[90vh]">

            <div className="bg-amber-500 p-5 sm:p-6 flex justify-between items-center text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Send className="w-5 h-5" /> Broadcast Notice
              </h3>
              <button onClick={() => !isSending && setIsModalOpen(false)} className="p-2 bg-black/10 hover:bg-black/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNotice} className="p-5 sm:p-6 space-y-5 overflow-y-auto">

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">Notice Category</label>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
                  {['info', 'homework', 'urgent'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewNotice({...newNotice, type})}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold capitalize flex justify-center items-center gap-1.5 transition-all ${
                        newNotice.type === type
                          ? type === 'urgent' ? 'bg-white text-red-600 shadow-sm' : type === 'homework' ? 'bg-white text-purple-600 shadow-sm' : 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {type === 'info' && <Megaphone className="w-3.5 h-3.5" />}
                      {type === 'homework' && <BookOpen className="w-3.5 h-3.5" />}
                      {type === 'urgent' && <AlertCircle className="w-3.5 h-3.5" />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Notice Title</label>
                <input
                  type="text" required
                  value={newNotice.title}
                  onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 font-bold text-gray-800 transition-all"
                  placeholder="e.g. Tomorrow is a Holiday"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Message Content</label>
                <textarea
                  required rows="3"
                  value={newNotice.content}
                  onChange={e => setNewNotice({...newNotice, content: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-amber-500 font-medium text-gray-800 transition-all resize-none"
                  placeholder="Write your announcement here..."
                />
              </div>

              {/* NEW: Optional PDF Attachment */}
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5" /> Attach File (Optional)
                </label>
                <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed rounded-xl cursor-pointer transition-all ${newNotice.file ? 'border-amber-400 bg-amber-50 py-3' : 'border-gray-300 bg-gray-50 hover:bg-amber-50/50 hover:border-amber-300 py-4'}`}>
                  {newNotice.file ? (
                    <div className="flex items-center gap-3 px-4 w-full">
                      <FileText className="w-8 h-8 text-amber-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-bold text-amber-800 truncate">{newNotice.file.name}</p>
                        <p className="text-xs text-amber-600/70 font-medium mt-0.5">Click to replace file</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-4">
                      <p className="text-sm font-bold text-gray-500">Tap to upload PDF or Image</p>
                      <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wider">Max 5MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    className="hidden"
                    onChange={(e) => setNewNotice({...newNotice, file: e.target.files[0]})}
                  />
                </label>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <button type="submit" disabled={isSending} className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-lg rounded-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 shadow-md shadow-amber-200">
                  {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                  {isSending ? 'Sending...' : 'Broadcast to Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mx-2 sm:mx-0">
        <div>
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" /> Class Notices
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Broadcasting to <strong className="text-gray-700">Class {myClass.classLevel} - Div {myClass.division}</strong>
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="hidden sm:flex w-full sm:w-auto bg-amber-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-amber-600 active:scale-95 transition-all items-center justify-center gap-2 shadow-sm shadow-amber-200">
          <Plus className="w-5 h-5" /> New Notice
        </button>
      </div>

      {/* --- FEED --- */}
      <div className="space-y-4 px-2 sm:px-0">
        {notices.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-gray-200 border-dashed">
            <Megaphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="font-bold text-gray-600 text-lg">No notices sent yet</p>
            <p className="text-gray-400 text-sm mt-1 mb-4">Keep your class updated by sending your first announcement.</p>
          </div>
        ) : (
          notices.map((notice) => {
            const styles = getTypeStyles(notice.type);

            return (
              <div key={notice.id} className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm relative group transition-all hover:shadow-md">

                {/* Notice Type Tag */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border}`}>
                    {styles.icon} {notice.type}
                  </span>
                  <span className="text-xs font-bold text-gray-400">{notice.date}</span>
                </div>

                {/* Content */}
                <h4 className="text-lg font-bold text-gray-900 mb-2 pr-8">{notice.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{notice.content}</p>

               {/* NEW: Attachment Display Block (Updated for Spring Boot Data) */}
                               {notice.attachmentName && (
                                 <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3 group/file transition-colors hover:bg-blue-50 hover:border-blue-200 cursor-pointer">
                                   <div className="flex items-center gap-3 min-w-0">
                                     <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/file:border-blue-200">
                                       <FileText className="w-5 h-5 text-red-500" />
                                     </div>
                                     <div className="min-w-0">
                                       <p className="text-sm font-bold text-gray-800 truncate group-hover/file:text-blue-700 transition-colors">
                                         {notice.attachmentName} {/* <--- Changed this! */}
                                       </p>
                                       <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">
                                         Attached Document
                                       </p>
                                     </div>
                                   </div>
                                   <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 group-hover/file:text-blue-600 group-hover/file:border-blue-200 transition-all flex-shrink-0 shadow-sm">
                                     <Download className="w-4 h-4" />
                                   </button>
                                 </div>
                               )}

                {/* Delete Button (Visible on hover on desktop, always visible on mobile) */}
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="absolute right-4 top-14 sm:top-5 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors sm:opacity-0 group-hover:opacity-100"
                  title="Delete Notice"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default ClassNotices;