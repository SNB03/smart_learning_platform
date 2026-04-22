import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BrainCircuit,BookOpen, LogOut, Menu, X, LayoutDashboard, Users, Bell, FileText, UserCircle, UserPlus } from 'lucide-react';

const TeacherDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // =======================================================================
  // 🔐 REAL AUTHENTICATION LOGIC
  // =======================================================================
  // 1. Grab the user from localStorage (set by Login.jsx)
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // 2. Protect the Route: Kick them to login if they aren't a Teacher
  useEffect(() => {
    if (!user || user.role !== 'TEACHER') {
      navigate('/login');
    }
  }, [user, navigate]);

  // 3. Prevent rendering the dashboard until the redirect happens
  if (!user) return null;

  // 4. Check if they are a Class Teacher based on the database value
  const isClassTeacher = user.teacherType === 'class';

  // 5. Real Logout Function
  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear the session
    navigate('/login');              // Send them back to the login page
  };
  // =======================================================================

  // Upgraded Tab styling with a sleek left-border highlight for the active state
  const getTabClass = (path) => {
    const isActive = location.pathname.endsWith(path) || (path === '' && location.pathname === '/teacher-dashboard');
    return `flex items-center gap-3 px-4 py-3.5 md:py-3 rounded-xl font-bold transition-all relative overflow-hidden ${
      isActive
        ? 'bg-blue-50 text-blue-700 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-blue-600'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col selection:bg-blue-200">

      {/* --- Top Navbar --- */}
      <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-white/10">
              <BookOpen className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight truncate">Teacher Portal</h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
             {/* Dynamic Name Tag from Database */}
            <div className="hidden sm:flex items-center gap-2 bg-blue-800 px-3 py-1.5 rounded-lg border border-blue-700 shadow-inner">
              <UserCircle className="w-4 h-4 text-blue-300 flex-shrink-0" />
              <span className="font-bold text-white text-sm truncate">
                {user.fullName.split(' ')[0]}
                <span className="text-blue-300 font-medium text-xs ml-1.5 px-1.5 py-0.5 bg-blue-900/50 rounded">
                  {isClassTeacher ? 'Class Tr.' : 'Subject Tr.'}
                </span>
              </span>
            </div>

            <button onClick={handleLogout} className="hidden md:flex items-center gap-2 text-sm font-bold bg-blue-800 hover:bg-red-500 px-4 py-2 rounded-lg transition-colors border border-blue-700 hover:border-red-600 text-blue-50">
              <LogOut className="w-4 h-4" /> Logout
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              className="md:hidden p-2.5 bg-blue-800 hover:bg-blue-700 active:scale-95 transition-all rounded-lg flex-shrink-0 border border-blue-700 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- Main Layout --- */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row py-4 sm:py-6 px-4 sm:px-6 lg:px-8 gap-6">

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col gap-1.5 sticky top-24">

            {/* Standard Features */}
            <NavLink to="/teacher-dashboard" end className={getTabClass('')}>
              <LayoutDashboard className="w-5 h-5" /> Daily Schedule
            </NavLink>
            <NavLink to="/teacher-dashboard/materials" className={getTabClass('materials')}>
              <FileText className="w-5 h-5" /> Study Materials
            </NavLink>

            {/* 🔥 Restricted: Class Admin Features 🔥 */}
            {isClassTeacher && (
              <div className="mt-4 animate-fade-in">
                <div className="mb-2 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Class Admin</div>
                <div className="space-y-1.5">
                  <NavLink to="/teacher-dashboard/class-roster" className={getTabClass('class-roster')}>
                    <Users className="w-5 h-5 text-amber-500" /> Class Roster
                  </NavLink>
                  <NavLink to="/teacher-dashboard/add-student" className={getTabClass('add-student')}>
                    <UserPlus className="w-5 h-5 text-amber-500" /> Add Student
                  </NavLink>
                  <NavLink to="/teacher-dashboard/class-notices" className={getTabClass('class-notices')}>
                    <Bell className="w-5 h-5 text-amber-500" /> Class Notices
                  </NavLink>
                  <NavLink to="/teacher-dashboard/quizzes" className={getTabClass('quizzes')} onClick={() => setIsMobileMenuOpen(false)}>
                    <BrainCircuit className="w-5 h-5" /> Quiz Manager
                  </NavLink>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 w-full min-w-0">
          {/* We pass down the REAL user to all child pages! */}
          <Outlet context={{ user, isClassTeacher }} />
        </main>
      </div>

      {/* ========================================== */}
      {/* --- MOBILE SLIDE-IN DRAWER MENU --- */}
      {/* ========================================== */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Dark Backdrop */}
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>

          {/* Sliding Drawer */}
          <div className="relative w-[80%] max-w-[320px] bg-white h-full flex flex-col shadow-2xl animate-slide-in-left">

            {/* User Profile Header */}
            <div className="bg-gradient-to-b from-blue-600 to-blue-700 p-6 flex flex-col items-start text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>

              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4 border border-white/30 backdrop-blur-sm">
                <UserCircle className="w-8 h-8 text-white" />
              </div>
              <span className="font-black text-xl tracking-tight">{user.fullName}</span>
              <span className="mt-1 text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full border border-white/20 uppercase tracking-wider">
                {isClassTeacher ? 'Primary Class Teacher' : 'Subject Teacher'}
              </span>

              <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
              <NavLink to="/teacher-dashboard" end onClick={() => setIsMobileMenuOpen(false)} className={getTabClass('')}>
                <LayoutDashboard className="w-5 h-5" /> Daily Schedule
              </NavLink>
              <NavLink to="/teacher-dashboard/materials" onClick={() => setIsMobileMenuOpen(false)} className={getTabClass('materials')}>
                <FileText className="w-5 h-5" /> Study Materials
              </NavLink>

              {isClassTeacher && (
                <div className="mt-6 animate-fade-in">
                  <div className="mb-3 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">Class Admin</div>
                  <div className="space-y-2">
                    <NavLink to="/teacher-dashboard/class-roster" onClick={() => setIsMobileMenuOpen(false)} className={getTabClass('class-roster')}>
                      <Users className="w-5 h-5 text-amber-500" /> Class Roster
                    </NavLink>
                    <NavLink to="/teacher-dashboard/add-student" onClick={() => setIsMobileMenuOpen(false)} className={getTabClass('add-student')}>
                      <UserPlus className="w-5 h-5 text-amber-500" /> Add Student
                    </NavLink>
                    <NavLink to="/teacher-dashboard/class-notices" onClick={() => setIsMobileMenuOpen(false)} className={getTabClass('class-notices')}>
                      <Bell className="w-5 h-5 text-amber-500" /> Class Notices
                    </NavLink>
                    <NavLink to="/teacher-dashboard/quizzes" className={getTabClass('quizzes')} onClick={() => setIsMobileMenuOpen(false)}>
                      <BrainCircuit className="w-5 h-5" /> Quiz Manager
                    </NavLink>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-sm">
                <LogOut className="w-5 h-5" /> Secure Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;