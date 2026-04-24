import React, { useState, useEffect } from 'react';
import { Send, Bell, Clock, Loader2, CheckCircle2, Paperclip, FileText, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const AnnouncementManager = () => {
  const { t } = useOutletContext();

  // States
  const [notice, setNotice] = useState({ title: '', body: '', audience: 'all' });
  const [attachment, setAttachment] = useState(null); // NEW: File State
  const [history, setHistory] = useState([]);

  // Loading States
  const [isFetching, setIsFetching] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/notices`);
        if (response.ok) {
          const data = await response.json();
          const formattedHistory = data.map(item => ({
            id: item.id,
            title: item.title,
            body: item.content,
            audience: item.audience.toLowerCase(),
            attachmentName: item.attachmentName || null,
            date: new Date(item.datePublished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }));
          setHistory(formattedHistory);
        }
      } catch (error) {
        console.error("Failed to fetch history");
      } finally {
        setIsFetching(false);
      }
    };
    fetchHistory();
  }, []);

  // --- UPGRADED: SENDING MULTIPART FORM DATA ---
  const handlePublish = async (e) => {
    e.preventDefault();
    setIsPublishing(true);

    const formData = new FormData();
    formData.append('title', notice.title);
    formData.append('content', notice.body);
    formData.append('audience', notice.audience.toUpperCase());
    if (attachment) {
      formData.append('file', attachment);
    }

    try {
      // NOTE: Do NOT set 'Content-Type' when sending FormData.
      // The browser sets it automatically with the correct boundary!
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/notices`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const savedNotice = await response.json();
        const uiNotice = {
          id: savedNotice.id,
          title: savedNotice.title,
          body: savedNotice.content,
          audience: savedNotice.audience.toLowerCase(),
          attachmentName: savedNotice.attachmentName || null,
          date: new Date(savedNotice.datePublished).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        setHistory([uiNotice, ...history]);

        // Reset
        setNotice({ title: '', body: '', audience: 'all' });
        setAttachment(null);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      }
    } catch (error) {
      alert("Could not connect to backend.");
    } finally {
      setIsPublishing(false);
    }
  };
// --- REAL FILE DOWNLOAD LOGIC ---
  const handleDownloadAttachment = async (noticeId, fileName) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/notices/${noticeId}/download`);
      if (!response.ok) throw new Error("Failed to download");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      alert("Error downloading file. It may be missing.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachment(file);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 md:gap-8 animate-fade-in max-w-7xl mx-auto pb-10">

      {/* ========================================================= */}
      {/* COLUMN 1: CREATE NOTICE FORM */}
      {/* ========================================================= */}
      <div className="w-full lg:w-1/2 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm p-5 sm:p-8 flex flex-col">

        <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
            <Bell className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">{t.newNotice || "New Announcement"}</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Broadcast a message to the school.</p>
          </div>
        </div>

        <form onSubmit={handlePublish} className="space-y-5 flex-1 flex flex-col">
          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">{t.noticeTitle || "Notice Title"}</label>
            <input
              type="text" required value={notice.title} onChange={e => setNotice({...notice, title: e.target.value})} disabled={isPublishing}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-800 transition-all disabled:opacity-50"
              placeholder="e.g. Holiday Tomorrow"
            />
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col">
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">{t.noticeBody || "Message Body"}</label>
            <textarea
              required rows="4" value={notice.body} onChange={e => setNotice({...notice, body: e.target.value})} disabled={isPublishing}
              className="w-full flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm font-medium text-slate-700 transition-all disabled:opacity-50 min-h-[100px]"
              placeholder="Type your official announcement here..."
            ></textarea>
          </div>

          {/* --- NEW: FILE ATTACHMENT UI --- */}
          <div>
             <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-1.5">Attachment (Optional)</label>
             {attachment ? (
               <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                 <div className="flex items-center gap-3 overflow-hidden">
                   <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></div>
                   <p className="text-sm font-bold text-indigo-900 truncate">{attachment.name}</p>
                 </div>
                 <button type="button" onClick={() => setAttachment(null)} className="p-1.5 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
               </div>
             ) : (
               <label className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300 rounded-xl cursor-pointer transition-all text-slate-500 font-bold text-sm group">
                 <Paperclip className="w-4 h-4 group-hover:text-indigo-500 transition-colors" />
                 <span className="group-hover:text-indigo-600 transition-colors">Attach PDF / Document</span>
                 <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.png" disabled={isPublishing} />
               </label>
             )}
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide mb-2">{t.targetAudience || "Target Audience"}</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 flex-1 transition-all active:scale-95 ${notice.audience === 'all' ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-slate-200 hover:border-indigo-300'}`}>
                <input type="radio" name="audience" value="all" checked={notice.audience === 'all'} onChange={e => setNotice({...notice, audience: e.target.value})} className="hidden" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${notice.audience === 'all' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                  {notice.audience === 'all' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className={`text-sm font-bold ${notice.audience === 'all' ? 'text-indigo-900' : 'text-slate-600'}`}>{t.allSchool || "Entire School"}</span>
              </label>

              <label className={`flex items-center gap-3 cursor-pointer p-4 rounded-xl border-2 flex-1 transition-all active:scale-95 ${notice.audience === 'teachers' ? 'bg-purple-50 border-purple-500 shadow-sm' : 'bg-white border-slate-200 hover:border-purple-300'}`}>
                <input type="radio" name="audience" value="teachers" checked={notice.audience === 'teachers'} onChange={e => setNotice({...notice, audience: e.target.value})} className="hidden" />
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${notice.audience === 'teachers' ? 'border-purple-600 bg-purple-600' : 'border-slate-300'}`}>
                  {notice.audience === 'teachers' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className={`text-sm font-bold ${notice.audience === 'teachers' ? 'text-purple-900' : 'text-slate-600'}`}>{t.teachersOnly || "Teachers Only"}</span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={isPublishing || !notice.title.trim() || !notice.body.trim()} className={`w-full font-black py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm mt-2 ${showSuccessMessage ? 'bg-emerald-500 text-white' : isPublishing || !notice.title.trim() || !notice.body.trim() ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95 shadow-indigo-200'}`}>
            {showSuccessMessage ? <><CheckCircle2 className="w-5 h-5" /> Published Successfully!</> :
             isPublishing ? <><Loader2 className="w-5 h-5 animate-spin" /> Publishing...</> :
             <><Send className="w-5 h-5" /> {t.publishNotice || "Publish Notice"}</>}
          </button>
        </form>
      </div>

      {/* ========================================================= */}
      {/* COLUMN 2: RECENT NOTICE HISTORY */}
      {/* ========================================================= */}
      <div className="w-full lg:w-1/2 bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm p-5 sm:p-8 flex flex-col h-[500px] lg:h-auto max-h-[850px]">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2 shrink-0">
          <Clock className="w-4 h-4" /> {t.recentNotices || "Recent Broadcasts"}
        </h3>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
          {isFetching ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-400" />
              <p className="font-bold text-sm">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-4">
              <Bell className="w-12 h-12 mb-3 text-slate-200" />
              <p className="font-bold text-slate-600">No notices published yet.</p>
            </div>
          ) : (
            history.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all group flex flex-col gap-3">

                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-black text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-200 whitespace-nowrap">{item.date}</span>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{item.body}</p>

                {/* --- NEW: FILE ATTACHMENT BADGE IN HISTORY --- */}
                {item.attachmentName && (
                  <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg max-w-fit pr-4">
                    <div className="w-6 h-6 bg-rose-50 text-rose-500 rounded flex items-center justify-center shrink-0"><FileText className="w-3.5 h-3.5" /></div>
                    <span className="text-[11px] font-bold text-slate-700 truncate max-w-[150px]">{item.attachmentName}</span>
                  </div>
                )}

                <div className="inline-flex mt-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                    item.audience === 'all'
                      ? 'bg-indigo-50 text-indigo-600 border-indigo-100'
                      : 'bg-purple-50 text-purple-600 border-purple-100'
                  }`}>
                    To: {item.audience === 'all' ? (t.allSchool || "Entire School") : (t.teachersOnly || "Teachers Only")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default AnnouncementManager;