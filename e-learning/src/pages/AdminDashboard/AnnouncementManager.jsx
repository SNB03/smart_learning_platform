import React, { useState } from 'react';
import { Send, Bell, Clock } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
const AnnouncementManager = ( ) => {
  // Form State
  const [notice, setNotice] = useState({ title: '', body: '', audience: 'all' });
const { t, lang } = useOutletContext();
  // Mock State for Recent Notices
  const [history, setHistory] = useState([
    { id: 1, title: 'Welcome to the New Portal', audience: 'all', date: 'Oct 12, 2026' }
  ]);

const handlePublish = async (e) => {
    e.preventDefault();

    const payload = {
      title: notice.title,
      content: notice.body,
      audience: notice.audience.toUpperCase() // Spring Boot prefers uppercase standard
    };

    try {
      const response = await fetch('http://localhost:8080/api/admin/notices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedNotice = await response.json();

        // Map Spring Boot's 'content' and 'datePublished' back to our UI state
        const uiNotice = {
          id: savedNotice.id,
          title: savedNotice.title,
          body: savedNotice.content,
          audience: savedNotice.audience.toLowerCase(),
          date: new Date(savedNotice.datePublished).toLocaleDateString()
        };

        setHistory([uiNotice, ...history]);
        alert("Notice Published to Database Successfully!");
        setNotice({ title: '', body: '', audience: 'all' });
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Could not connect to backend.");
    }
  };


  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-fade-in">

      {/* Create Notice Form */}
      <div className="w-full xl:w-1/2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{t.newNotice}</h2>
        </div>

        <form onSubmit={handlePublish} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t.noticeTitle}</label>
            <input
              type="text" required
              value={notice.title}
              onChange={e => setNotice({...notice, title: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-800"
              placeholder="e.g. Holiday Tomorrow"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t.noticeBody}</label>
            <textarea
              required rows="4"
              value={notice.body}
              onChange={e => setNotice({...notice, body: e.target.value})}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Type your message here..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.targetAudience}</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 flex-1 hover:border-blue-400">
                <input type="radio" name="audience" value="all" checked={notice.audience === 'all'} onChange={e => setNotice({...notice, audience: e.target.value})} className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-800">{t.allSchool}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 flex-1 hover:border-blue-400">
                <input type="radio" name="audience" value="teachers" checked={notice.audience === 'teachers'} onChange={e => setNotice({...notice, audience: e.target.value})} className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-800">{t.teachersOnly}</span>
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-sm mt-4">
            <Send className="w-5 h-5" /> {t.publishNotice}
          </button>
        </form>
      </div>

      {/* Notice History */}
      <div className="w-full xl:w-1/2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-400" /> {t.recentNotices}
        </h3>

        <div className="space-y-4">
          {history.map((item) => (
            <div key={item.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-900">{item.title}</h4>
                <span className="text-xs font-bold text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">{item.date}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{item.body || "View message details..."}</p>
              <div className="mt-2 inline-flex">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.audience === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                  To: {item.audience === 'all' ? t.allSchool : t.teachersOnly}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AnnouncementManager;