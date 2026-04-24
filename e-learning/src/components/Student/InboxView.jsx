import React, { useState } from 'react';
import { Download, Loader2, FileText, AlertCircle } from 'lucide-react';

const InboxView = ({ notices }) => {
  const [downloadingId, setDownloadingId] = useState(null);

  // --- REAL FILE DOWNLOAD LOGIC ---
  const handleDownload = async (noticeId, fileName) => {
    setDownloadingId(noticeId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/notices/${noticeId}/download`, {
        method: 'GET',
        // If you add Spring Security later, you will pass your JWT token here:
        // headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error("Failed to download file");

      // Convert the response to a Blob
      const blob = await response.blob();

      // Create a temporary hidden link to trigger the browser's download manager
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName; // Force the correct filename
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      alert("Error downloading file. It may have been removed.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-800">Class Inbox</h2>
        <p className="text-sm text-slate-500 font-medium">Official notices and announcements.</p>
      </div>

      <div className="space-y-4">
        {notices.length === 0 ? (
           <div className="py-12 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
             <p className="font-bold text-slate-500">No notices in your inbox.</p>
           </div>
        ) : (
          notices.map(notice => (
            <div key={notice.id} className="bg-white p-5 sm:p-6 rounded-[2rem] shadow-sm border border-slate-200 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                  notice.type === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' :
                  notice.type === 'homework' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                  'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {notice.type === 'urgent' && <AlertCircle className="w-3 h-3" />}
                  {notice.type}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {new Date(notice.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h4 className="font-black text-lg text-slate-900 mb-2">{notice.title}</h4>
              <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">{notice.content}</p>

              {/* ATTACHMENT DOWNLOAD UI */}
              {notice.attachmentName && (
                <div
                  onClick={() => handleDownload(notice.id, notice.attachmentName)}
                  className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-indigo-500 group-hover:border-indigo-200 shadow-sm">
                      <FileText className="w-5 h-5"/>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">{notice.attachmentName}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Click to download</p>
                    </div>
                  </div>

                  {/* Show spinner if downloading, else show download icon */}
                  <div className="pr-2 text-slate-400 group-hover:text-indigo-600 transition-colors">
                    {downloadingId === notice.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Download className="w-5 h-5" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InboxView;