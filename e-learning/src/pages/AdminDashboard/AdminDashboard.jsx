import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Globe, LogOut, Menu, X, LayoutDashboard, Users, Bell,UserPlus,Contact,BarChart3 } from 'lucide-react';
import { translations } from '../../utils/translations';


const AdminDashboard = () => {
  const [lang, setLang] = useState('en');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Gets current URL
  //const [t, setT] = useState(translations['en']);

  const t = translations[lang] || translations['en'];

  const handleLogout = () => navigate('/login');

  // Helper to style active tabs correctly
  const getTabClass = (path) => {
    // Check if current URL matches the tab's path
    const isActive = location.pathname.endsWith(path) || (path === '' && location.pathname === '/admin-dashboard');
    return `flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`;
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col selection:bg-blue-200">

      {/* Top Navbar */}
      <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">{t.adminTitle}</h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-1 bg-blue-800 px-2 py-1.5 rounded-lg border border-blue-700">
              <Globe className="w-4 h-4 text-blue-300 hidden sm:block" />
              <select
                className="bg-transparent text-sm font-bold text-white border-none focus:ring-0 cursor-pointer outline-none"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="en" className="text-gray-900">English</option>
                <option value="mr" className="text-gray-900">मराठी</option>
                <option value="hi" className="text-gray-900">हिंदी</option>
              </select>
            </div>

            <button onClick={handleLogout} className="hidden md:flex items-center gap-2 text-sm font-bold bg-blue-800 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors border border-blue-700 hover:border-red-600">
              <LogOut className="w-4 h-4" /> {t.logout}
            </button>

            <button className="md:hidden p-2 bg-blue-800 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Layout Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row py-6 px-4 sm:px-6 lg:px-8 gap-6">

        {/* Desktop Sidebar with Real Links */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-2 sticky top-24">
          <NavLink to="/admin-dashboard" end className={getTabClass('')}>
            <LayoutDashboard className="w-5 h-5" /> {t.overview}
          </NavLink>
          <NavLink to="/admin-dashboard/add-teacher" className={getTabClass('add-teacher')}>
            <UserPlus className="w-5 h-5" /> {t.addTeacher}
          </NavLink>
          <NavLink to="/admin-dashboard/teacher-info" className={getTabClass('teacher-info')}>
            <Contact className="w-5 h-5" /> {t.teacherInfo}
          </NavLink>
          <NavLink to="/admin-dashboard/student-stats" className={getTabClass('student-stats')}>
            <BarChart3 className="w-5 h-5" /> {t.studentStats}
          </NavLink>
          <NavLink to="/admin-dashboard/notices" className={getTabClass('notices')}>
            <Bell className="w-5 h-5" /> {t.announcements}
          </NavLink>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1">
          {/* The Outlet passes the translation dictionary down to whatever page is active */}
          <Outlet context={{ t, lang }} />
        </main>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 bg-white h-full flex flex-col shadow-2xl animate-slide-in-left">
            <div className="h-16 flex justify-between items-center px-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Admin Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 py-4 px-3 flex flex-col gap-2">
             <NavLink to="/admin-dashboard" end className={getTabClass('')}>
                         <LayoutDashboard className="w-5 h-5" /> {t.overview}
                       </NavLink>
                       <NavLink to="/admin-dashboard/add-teacher" className={getTabClass('add-teacher')}>
                         <UserPlus className="w-5 h-5" /> {t.addTeacher}
                       </NavLink>
                       <NavLink to="/admin-dashboard/teacher-info" className={getTabClass('teacher-info')}>
                         <Contact className="w-5 h-5" /> {t.teacherInfo}
                       </NavLink>
                       <NavLink to="/admin-dashboard/student-stats" className={getTabClass('student-stats')}>
                         <BarChart3 className="w-5 h-5" /> {t.studentStats}
                       </NavLink>
                       <NavLink to="/admin-dashboard/notices" className={getTabClass('notices')}>
                         <Bell className="w-5 h-5" /> {t.announcements}
                       </NavLink>
              <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl font-bold text-red-500 hover:bg-red-50 mt-auto">
                <LogOut className="w-5 h-5" /> {t.logout}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;