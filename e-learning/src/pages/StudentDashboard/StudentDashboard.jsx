import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Bell, UserCircle, Sparkles, LayoutDashboard, BrainCircuit, ChevronRight, Loader2 } from 'lucide-react';

import AITutorChat from '../../components/Student/AITutorChat';
import HomeView from '../../components/Student/HomeView';
import LearnView from '../../components/Student/LearnView';
import AssessmentsView from '../../components/Student/AssessmentsView';
import InboxView from '../../components/Student/InboxView';
import ProfileView from '../../components/Student/ProfileView';

const StudentDashboard = () => {
  const navigate = useNavigate();

  // UI State
  const [activeTab, setActiveTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // =========================================================
  // 🚀 REAL DATA STATE
  // =========================================================
  const [student, setStudent] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [notices, setNotices] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]); // We will fetch this later when doing Assessments
  const [isLoading, setIsLoading] = useState(true);

  // 1. Auth Check & Load User
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(userString);
    if (userData.role !== 'STUDENT') {
      navigate('/login');
      return;
    }
    setStudent(userData);
  }, [navigate]);

  // 2. Fetch Backend Data
  useEffect(() => {
    if (!student) return;

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch all required data simultaneously for speed
        const [scheduleRes, noticesRes, materialsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/student/schedule?classLevel=${student.classLevel}&division=${student.division}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/student/notices?classLevel=${student.classLevel}&division=${student.division}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/student/materials?classLevel=${student.classLevel}`),
            fetch(`${import.meta.env.VITE_API_URL}/api/student/quizzes?classLevel=${student.classLevel}`)
        ]);

        if (scheduleRes.ok) setSchedule(await scheduleRes.json());
        if (noticesRes.ok) setNotices(await noticesRes.json());
        if (materialsRes.ok) setMaterials(await materialsRes.json());
if (quizzesRes.ok) setQuizzes(await quizzesRes.json());
        // Note: Quizzes fetch will be added here when we wire up the AssessmentsView!

      } catch (error) {
        console.error("Failed to connect to the server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [student]);

  // Scroll listener for mobile header
  useEffect(() => {
    const handleScroll = (e) => setIsScrolled(e.target.scrollTop > 20);
    const scrollableDiv = document.getElementById('main-scroll-area');
    if (scrollableDiv) scrollableDiv.addEventListener('scroll', handleScroll);
    return () => scrollableDiv?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!student) return null; // Prevent rendering before auth check

  // Data pre-processing for views
  const latestNotice = notices.length > 0 ? notices[0] : null;
  const recentMaterials = materials.slice(0, 4);
  const generateAIBriefing = () => {
    const urgentCount = notices.filter(n => n.type === 'urgent').length;
    let briefing = `Good morning, ${student.fullName.split(' ')[0]}! `;
    if (urgentCount > 0) briefing += `You have ${urgentCount} urgent notice to review. `;
    if (schedule.length > 0) briefing += `Your first class is at ${schedule[0].startTime}.`;
    else briefing += "You have no scheduled classes today. Enjoy your break!";
    return briefing;
  };

  const navItems = [
    { id: 'home', icon: LayoutDashboard, label: 'Home', desktopLabel: 'Dashboard' },
    { id: 'learn', icon: BookOpen, label: 'Learn', desktopLabel: 'Study Materials' },
    { id: 'assessments', icon: BrainCircuit, label: 'Quiz', desktopLabel: 'Assessments' },
    { id: 'inbox', icon: Bell, label: 'Inbox', desktopLabel: 'Class Inbox', badge: notices.length },
    { id: 'profile', icon: UserCircle, label: 'Me', desktopLabel: 'My Profile' }
  ];

  return (
    <div className="h-[100dvh] bg-[#F1F5F9] flex flex-col md:flex-row font-sans selection:bg-indigo-200 overflow-hidden">

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-white border-r border-slate-200 flex-col h-full shadow-sm z-30 shrink-0 transition-all duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">E-Learn</h1>
        </div>

        <div className="p-6 flex flex-col items-center border-b border-slate-100 bg-slate-50/50">
          <div className="w-16 h-16 bg-white text-indigo-600 rounded-full flex items-center justify-center border-4 border-indigo-50 shadow-sm mb-3">
            <UserCircle className="w-8 h-8" />
          </div>
          <h2 className="font-bold text-slate-800 text-center">{student.fullName}</h2>
          <span className="text-[10px] font-black bg-white border border-slate-200 text-slate-500 uppercase tracking-widest px-3 py-1 rounded-full mt-2 shadow-sm">
            Class {student.classLevel}-{student.division}
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 font-bold rounded-xl transition-all duration-200 group ${
                activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100/50' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-5 h-5 transition-transform ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                {tab.desktopLabel}
              </div>
              <div className="flex items-center gap-2">
                {tab.badge > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow-sm">{tab.badge}</span>}
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-indigo-400 opacity-50" />}
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN SCROLLABLE CONTENT AREA */}
      <main id="main-scroll-area" className="flex-1 overflow-y-auto w-full relative pb-24 md:pb-0 bg-slate-50/50 scroll-smooth">

        {/* MOBILE DYNAMIC HEADER */}
        <div className={`md:hidden sticky top-0 z-20 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md pt-safe' : 'bg-transparent pt-safe'}`}>
          <div className={`flex justify-between items-center px-5 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5 bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-b-[2rem] shadow-xl'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-colors ${isScrolled ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-white/20 border-white/20 text-white backdrop-blur-sm'}`}>
                <UserCircle className="w-6 h-6" />
              </div>
              <div>
                <p className={`text-[9px] font-black uppercase tracking-widest mb-0.5 transition-colors ${isScrolled ? 'text-slate-400' : 'text-slate-300'}`}>
                  {isScrolled ? 'Student Portal' : `Class ${student.classLevel}-${student.division}`}
                </p>
                <h1 className={`text-lg font-black tracking-tight transition-colors ${isScrolled ? 'text-slate-800' : 'text-white'}`}>
                  {student.fullName.split(' ')[0]}
                </h1>
              </div>
            </div>
            <button onClick={() => setActiveTab('inbox')} className={`relative p-2 rounded-full transition-colors ${isScrolled ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/20 text-white'}`}>
               <Bell className="w-5 h-5" />
               {notices.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>}
            </button>
          </div>
        </div>

        {/* CONTENT RENDERER */}
        <div className="px-4 sm:px-6 md:px-8 py-6 md:py-8 max-w-7xl mx-auto relative z-10 min-h-full flex flex-col">

          <div className="hidden md:flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mb-8 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Welcome back, {student.fullName.split(' ')[0]}!</h1>
              <p className="text-slate-500 font-medium mt-1">Ready to learn something new today?</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
              <p className="text-lg font-black text-indigo-600">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="flex-1 transition-all duration-300">
            {/* LOADING STATE */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-fade-in">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                <p className="font-bold">Syncing your portal...</p>
              </div>
            ) : (
              <>
                {/* VIEWS WITH REAL DATA */}
                {activeTab === 'home' && <HomeView schedule={schedule} latestNotice={latestNotice} recentMaterials={recentMaterials} setActiveTab={setActiveTab} briefingText={generateAIBriefing()} />}
                {activeTab === 'learn' && <LearnView materials={materials} />}
                {activeTab === 'assessments' && <AssessmentsView quizzes={quizzes} />}
                {activeTab === 'inbox' && <InboxView notices={notices} />}
                {activeTab === 'profile' && <ProfileView student={student} handleLogout={handleLogout} />}
              </>
            )}
          </div>
        </div>
      </main>

      {/* NATIVE MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex justify-around items-center z-40 rounded-t-[1.5rem] px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)] transition-transform duration-300">
        {navItems.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className="relative flex flex-col items-center gap-1 w-16 p-1.5 active:scale-90 transition-all duration-200 group">
            {activeTab === tab.id && <div className="absolute inset-0 bg-indigo-50 rounded-xl -z-10 scale-110 animate-fade-in"></div>}
            <div className="relative">
              <tab.icon className={`w-6 h-6 transition-colors ${activeTab === tab.id ? 'text-indigo-600 fill-indigo-100' : 'text-slate-400 group-hover:text-slate-600'}`} />
              {tab.badge > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 border-[2px] border-white rounded-full shadow-sm"></span>}
            </div>
            <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${activeTab === tab.id ? 'text-indigo-700' : 'text-slate-400'}`}>{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* FLOATING AI TUTOR */}
      <button onClick={() => setIsChatOpen(true)} className="fixed bottom-[calc(85px+env(safe-area-inset-bottom))] md:bottom-8 right-4 md:right-8 z-30 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-xl shadow-indigo-200/50 hover:scale-105 active:scale-95 transition-all duration-300 group flex items-center gap-2 ring-4 ring-white/50">
        <Sparkles className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 md:max-w-xs overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out font-bold text-sm hidden md:block">Ask AI Tutor</span>
      </button>

      <AITutorChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} student={student} />

    </div>
  );
};

export default StudentDashboard;