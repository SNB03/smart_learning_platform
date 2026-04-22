import React, { useState } from 'react';
import { UserCircle, LogOut, Award, ShieldCheck, BookOpen, Camera, Info, Flame, Star, TrendingUp, Globe, CheckCircle2 } from 'lucide-react';

// --- TRANSLATION DICTIONARY ---
const translations = {
  en: {
    title: "My Profile",
    subtitle: "View your academic identity and progress.",
    activeStudent: "Active Student",
    academicProgress: "Academic Progress",
    achievements: "Achievements & Badges",
    accountDetails: "Account Details",
    logout: "Secure Logout",
    streak: "7-Day Streak",
    streakDesc: "Logged in for 7 consecutive days!",
    topScorer: "Top Scorer",
    topScorerDesc: "Highest score in Science Mid-Term",
    fastLearner: "Fast Learner",
    fastLearnerDesc: "Completed 5 materials this week",
    mastery: "Subject Mastery",
    managedBy: "Your profile details are managed by the school. Please contact the class teacher for updates."
  },
  hi: {
    title: "मेरी प्रोफ़ाइल",
    subtitle: "अपनी शैक्षणिक पहचान और प्रगति देखें।",
    activeStudent: "सक्रिय छात्र",
    academicProgress: "शैक्षणिक प्रगति",
    achievements: "उपलब्धियां और बैज",
    accountDetails: "खाता विवरण",
    logout: "सुरक्षित लॉगआउट",
    streak: "7-दिन की स्ट्रीक",
    streakDesc: "लगातार 7 दिनों तक लॉग इन किया!",
    topScorer: "शीर्ष स्कोरर",
    topScorerDesc: "विज्ञान मिड-टर्म में उच्चतम स्कोर",
    fastLearner: "तेज़ सीखने वाला",
    fastLearnerDesc: "इस सप्ताह 5 सामग्री पूरी की",
    mastery: "विषय महारत",
    managedBy: "आपके प्रोफ़ाइल विवरण स्कूल द्वारा प्रबंधित किए जाते हैं। अपडेट के लिए कृपया कक्षा शिक्षक से संपर्क करें।"
  },
  mr: {
    title: "माझी प्रोफाइल",
    subtitle: "तुमची शैक्षणिक ओळख आणि प्रगती पहा.",
    activeStudent: "सक्रिय विद्यार्थी",
    academicProgress: "शैक्षणिक प्रगती",
    achievements: "कामगिरी आणि बॅजेस",
    accountDetails: "खाते तपशील",
    logout: "सुरक्षित लॉगआउट",
    streak: "7-दिवसांची स्ट्रीक",
    streakDesc: "सलग 7 दिवस लॉग इन केले!",
    topScorer: "टॉप स्कोअरर",
    topScorerDesc: "विज्ञान मिड-टर्ममध्ये सर्वोच्च गुण",
    fastLearner: "जलद शिकणारा",
    fastLearnerDesc: "या आठवड्यात 5 साहित्य पूर्ण केले",
    mastery: "विषय प्रभुत्व",
    managedBy: "तुमचे प्रोफाइल तपशील शाळेद्वारे व्यवस्थापित केले जातात. अद्यतनांसाठी कृपया वर्ग शिक्षकांशी संपर्क साधा."
  }
};

const ProfileView = ({ student, handleLogout }) => {
  const [lang, setLang] = useState('en'); // 'en', 'hi', 'mr'
  const t = translations[lang];

  // Mock Progress Data
  const subjectProgress = [
    { subject: "Mathematics", score: 85, color: "bg-blue-500" },
    { subject: "Science", score: 92, color: "bg-emerald-500" },
    { subject: "English", score: 78, color: "bg-purple-500" },
    { subject: "History", score: 88, color: "bg-amber-500" }
  ];

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-6">

      {/* ========================================================= */}
      {/* HEADER & LANGUAGE SWITCHER */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2 sm:px-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800">{t.title}</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{t.subtitle}</p>
        </div>

        {/* Language Toggle */}
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button onClick={() => setLang('en')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>English</button>
          <button onClick={() => setLang('hi')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'hi' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>हिंदी</button>
          <button onClick={() => setLang('mr')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${lang === 'mr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>मराठी</button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ID CARD STYLE PROFILE */}
      {/* ========================================================= */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden relative">
        <div className="h-28 sm:h-36 bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
           <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <div className="px-6 sm:px-8 pb-6">
          <div className="relative flex justify-between items-end -mt-14 sm:-mt-16 mb-4">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-full p-1 shadow-lg border-2 border-slate-50 relative z-10 overflow-hidden">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                  <UserCircle className="w-full h-full" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white border-4 border-white rounded-full flex items-center justify-center z-20 shadow-md transition-transform group-hover:scale-110">
                <Camera className="w-3 h-3" />
              </div>
            </div>

            <div className="pb-2">
              <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg flex items-center gap-1.5">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ========================================================= */}
        {/* PARENT VIEW: ACADEMIC PROGRESS */}
        {/* ========================================================= */}
        <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4" /> {t.academicProgress}
          </h3>

          <div className="space-y-5">
            {subjectProgress.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-slate-700 text-sm">{item.subject}</span>
                  <span className="font-black text-slate-900 text-sm">{item.score}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center mt-6">
            {t.mastery}
          </p>
        </div>

        {/* ========================================================= */}
        {/* STUDENT VIEW: ACHIEVEMENTS & GAMIFICATION */}
        {/* ========================================================= */}
        <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Award className="w-4 h-4" /> {t.achievements}
          </h3>

          <div className="space-y-4">
            {/* Streak Badge */}
            <div className="p-4 rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 flex items-center gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" fill="currentColor" />
              </div>
              <div>
                <h4 className="font-black text-orange-900">{t.streak}</h4>
                <p className="text-xs font-medium text-orange-700/80 mt-0.5">{t.streakDesc}</p>
              </div>
            </div>

            {/* Top Scorer Badge */}
            <div className="p-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-blue-50 flex items-center gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6" fill="currentColor" />
              </div>
              <div>
                <h4 className="font-black text-indigo-900">{t.topScorer}</h4>
                <p className="text-xs font-medium text-indigo-700/80 mt-0.5">{t.topScorerDesc}</p>
              </div>
            </div>

             {/* Fast Learner Badge */}
             <div className="p-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 flex items-center gap-4 group">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-emerald-900">{t.fastLearner}</h4>
                <p className="text-xs font-medium text-emerald-700/80 mt-0.5">{t.fastLearnerDesc}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* READ-ONLY INFO & LOGOUT */}
      {/* ========================================================= */}
      <div className="bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl flex items-start sm:items-center gap-3">
        <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
          {t.managedBy}
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 hover:bg-red-100 text-red-600 font-black text-sm uppercase tracking-wider rounded-xl transition-colors active:scale-95"
      >
        <LogOut className="w-5 h-5" /> {t.logout}
      </button>

    </div>
  );
};

export default ProfileView;