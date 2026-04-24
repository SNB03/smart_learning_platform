import React, { useState, useEffect } from 'react';
import { UserCircle, LogOut, Award, ShieldCheck, BookOpen, Camera, Info, Flame, Star, TrendingUp, CheckCircle2, CalendarCheck, Clock, DownloadCloud, Loader2, PlayCircle } from 'lucide-react';

// --- TRANSLATION DICTIONARY ---
const translations = {
  en: { title: "My Profile", subtitle: "View your academic identity.", activeStudent: "Active Student", academicProgress: "Academic Progress", achievements: "Achievements", logout: "Secure Logout", attendance: "Attendance", daysPresent: "Days Present", activity: "Recent Activity", downloadReport: "Download Report Card", downloading: "Downloading...", managedBy: "Profile managed by school. Contact teacher for updates." },
  hi: { title: "मेरी प्रोफ़ाइल", subtitle: "अपनी शैक्षणिक पहचान देखें।", activeStudent: "सक्रिय छात्र", academicProgress: "शैक्षणिक प्रगति", achievements: "उपलब्धियां", logout: "सुरक्षित लॉगआउट", attendance: "उपस्थिति", daysPresent: "उपस्थित दिन", activity: "हाल की गतिविधि", downloadReport: "रिपोर्ट कार्ड डाउनलोड करें", downloading: "डाउनलोड हो रहा है...", managedBy: "प्रोफ़ाइल स्कूल द्वारा प्रबंधित। अपडेट के लिए शिक्षक से संपर्क करें।" },
  mr: { title: "माझी प्रोफाइल", subtitle: "तुमची शैक्षणिक ओळख पहा.", activeStudent: "सक्रिय विद्यार्थी", academicProgress: "शैक्षणिक प्रगती", achievements: "कामगिरी", logout: "लॉगआउट", attendance: "उपस्थिती", daysPresent: "उपस्थित दिवस", activity: "अलीकडील क्रियाकलाप", downloadReport: "रिपोर्ट कार्ड डाउनलोड करा", downloading: "डाउनलोड करत आहे...", managedBy: "प्रोफाइल शाळेद्वारे व्यवस्थापित. अद्यतनांसाठी शिक्षकांशी संपर्क साधा." }
};

// =========================================================
// THE ICON MAPPERS (Translates DB Strings to UI Elements)
// =========================================================
const achievementConfig = {
  'STREAK': { icon: Flame, wrapperBg: 'bg-gradient-to-r from-orange-50 to-amber-50', border: 'border-orange-100', iconBg: 'bg-gradient-to-br from-orange-400 to-amber-500', shadow: 'shadow-orange-200', titleColor: 'text-orange-900', descColor: 'text-orange-700/80' },
  'TOP_SCORE': { icon: Star, wrapperBg: 'bg-gradient-to-r from-indigo-50 to-blue-50', border: 'border-indigo-100', iconBg: 'bg-gradient-to-br from-indigo-500 to-blue-600', shadow: 'shadow-indigo-200', titleColor: 'text-indigo-900', descColor: 'text-indigo-700/80' },
  'DEFAULT': { icon: Award, wrapperBg: 'bg-slate-50', border: 'border-slate-200', iconBg: 'bg-slate-500', shadow: 'shadow-slate-200', titleColor: 'text-slate-800', descColor: 'text-slate-500' }
};

const activityConfig = {
  'QUIZ': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  'VIDEO': { icon: PlayCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  'DOWNLOAD': { icon: DownloadCloud, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  'DEFAULT': { icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' }
};

const ProfileView = ({ student, handleLogout }) => {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  // Action States
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  // REAL Data States
  const [stats, setStats] = useState({ attendance: { percentage: 0, present: 0, total: 0 }, progress: [] });
  const [achievements, setAchievements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // --- FETCH ALL REAL PROFILE DATA ---
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [statsRes, achieveRes, activityRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/student/profile/stats?studentId=${student.id || 1}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/student/profile/achievements?studentId=${student.id || 1}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/student/profile/activity?studentId=${student.id || 1}`)
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (achieveRes.ok) setAchievements(await achieveRes.json());
        if (activityRes.ok) setRecentActivity(await activityRes.json());
      } catch (error) {
        console.error("Failed to fetch profile data");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchProfileData();
  }, [student]);

  // Photo Upload Logic (Preserved)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('studentId', student.id || 1);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/profile/photo`, { method: 'POST', body: formData });
      if (response.ok) {
        const localImageUrl = URL.createObjectURL(file);
        setProfilePhoto(localImageUrl);
      }
    } catch (error) { alert("Network error."); }
    finally { setIsUploading(false); }
  };

  // Report Card Logic (Preserved)
  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/profile/report-card/download?studentId=${student.id || 1}`);
      if (!response.ok) throw new Error();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${student.fullName.replace(' ', '_')}_Report_Card.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) { alert("Error downloading report."); }
    finally { setIsDownloading(false); }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-6 pb-4">

      {/* HEADER & LANGUAGE SWITCHER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2 sm:px-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800">{t.title}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{t.subtitle}</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 shrink-0">
          <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>English</button>
          <button onClick={() => setLang('hi')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'hi' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>हिंदी</button>
          <button onClick={() => setLang('mr')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'mr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>मराठी</button>
        </div>
      </div>

      {/* ID CARD HEADER (Preserved) */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
           <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        <div className="px-6 sm:px-8 pb-6">
          <div className="relative flex justify-between items-end -mt-14 sm:-mt-16 mb-4">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-full p-1 shadow-lg border-2 border-slate-50 relative z-10 overflow-hidden">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-300 overflow-hidden">
                  {isUploading ? <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /> : profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : <UserCircle className="w-full h-full" />}
                </div>
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white border-[3px] border-white rounded-full flex items-center justify-center z-20 shadow-md cursor-pointer hover:bg-indigo-700">
                <Camera className="w-3 h-3" />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploading} />
              </label>
            </div>
            <div className="pb-2">
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> {t.activeStudent}
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">{student.fullName}</h2>
            <p className="text-slate-500 font-medium text-sm sm:text-base mt-1 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-slate-400" /> Class {student.classLevel} • Div {student.division} • Roll #{student.rollNo}
            </p>
          </div>
        </div>
      </div>

      {isLoadingData ? (
        <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* COLUMN 1: Progress & Attendance */}
          <div className="space-y-6">
            {/* ATTENDANCE */}
            <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1"><CalendarCheck className="w-4 h-4" /> {t.attendance}</h3>
                <p className="text-3xl font-black text-slate-800">{stats.attendance.percentage}%</p>
                <p className="text-xs font-bold text-slate-500 mt-1">{t.daysPresent}: {stats.attendance.present} / {stats.attendance.total}</p>
              </div>
              <div className="w-20 h-20 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                 <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-emerald-500" strokeDasharray={`${stats.attendance.percentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                 </svg>
                 <span className="font-black text-slate-700 text-sm">{stats.attendance.percentage}%</span>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6"><TrendingUp className="w-4 h-4" /> {t.academicProgress}</h3>
              <div className="space-y-5">
                {stats.progress.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-slate-700 text-sm">{item.subject}</span>
                      <span className="font-black text-slate-900 text-sm">{item.score}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`} style={{ width: `${item.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2: Achievements & Activity */}
          <div className="space-y-6">

            {/* DYNAMIC ACHIEVEMENTS */}
            <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-5"><Award className="w-4 h-4" /> {t.achievements}</h3>
              <div className="space-y-3">
                {achievements.length === 0 ? (
                  <p className="text-sm font-bold text-slate-400 text-center py-4">Complete more tasks to earn badges!</p>
                ) : (
                  achievements.map((badge) => {
                    // Fetch the UI config based on the DB string (or use DEFAULT)
                    const config = achievementConfig[badge.type] || achievementConfig['DEFAULT'];
                    const IconComponent = config.icon;

                    return (
                      <div key={badge.id} className={`p-3 sm:p-4 rounded-2xl border ${config.border} ${config.wrapperBg} flex items-center gap-4 group`}>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${config.iconBg} rounded-full flex items-center justify-center text-white shadow-md ${config.shadow} group-hover:scale-110 transition-transform shrink-0`}>
                          <IconComponent className="w-5 h-5" fill="currentColor" />
                        </div>
                        <div>
                          <h4 className={`font-black text-sm sm:text-base ${config.titleColor}`}>{badge.title}</h4>
                          <p className={`text-[10px] sm:text-xs font-medium ${config.descColor} mt-0.5`}>{badge.description}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* DYNAMIC ACTIVITY TIMELINE */}
            <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-5"><Clock className="w-4 h-4" /> {t.activity}</h3>
              <div className="relative pl-3 space-y-6">
                <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
                {recentActivity.length === 0 ? (
                  <p className="text-sm font-bold text-slate-400 text-center py-4 relative z-10 bg-white">No recent activity.</p>
                ) : (
                  recentActivity.map(activity => {
                    const config = activityConfig[activity.type] || activityConfig['DEFAULT'];
                    const IconComponent = config.icon;

                    return (
                      <div key={activity.id} className="flex gap-4 relative z-10">
                        <div className={`w-8 h-8 rounded-full ${config.bg} ${config.color} flex items-center justify-center shrink-0 ring-4 ring-white`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="pt-1.5">
                          <p className="text-xs font-bold text-slate-500 leading-tight mb-0.5">{activity.action}</p>
                          <p className="text-sm font-black text-slate-800 leading-tight mb-1">{activity.target}</p>
                          <p className="text-[10px] font-bold text-slate-400">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={handleDownloadReport} disabled={isDownloading} className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-black text-sm uppercase tracking-wider rounded-xl transition-colors active:scale-95 border border-indigo-100">
          {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <DownloadCloud className="w-5 h-5" />}
          {isDownloading ? t.downloading : t.downloadReport}
        </button>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 hover:bg-red-100 text-red-600 font-black text-sm uppercase tracking-wider rounded-xl transition-colors active:scale-95 border border-red-100">
          <LogOut className="w-5 h-5" /> {t.logout}
        </button>
      </div>
      <p className="text-xs text-center text-slate-400 font-medium px-4 pb-4">{t.managedBy}</p>
    </div>
  );
};

export default ProfileView;