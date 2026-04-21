import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, BookOpen, GraduationCap, Globe,
  LogOut, Menu, X, PlusCircle, LayoutDashboard, UserCheck
} from 'lucide-react';

// Translation Dictionary for Admin
const translations = {
  en: {
    title: "Admin Dashboard",
    overview: "Overview",
    manageTeachers: "Manage Teachers",
    logout: "Logout",
    totalStudents: "Total Students",
    activeTeachers: "Active Teachers",
    activeClasses: "Classes (5-10)",
    addNewTeacher: "Add New Teacher",
    fullName: "Full Name",
    email: "Email Address",
    password: "Password",
    saveTeacher: "Create Teacher Account",
    teacherList: "Current Teachers",
    noTeachers: "No teachers added yet."
  },
  mr: {
    title: "ॲडमिन डॅशबोर्ड",
    overview: "विहंगावलोकन",
    manageTeachers: "शिक्षक व्यवस्थापन",
    logout: "लॉग आउट",
    totalStudents: "एकूण विद्यार्थी",
    activeTeachers: "सक्रिय शिक्षक",
    activeClasses: "वर्ग (५-१०)",
    addNewTeacher: "नवीन शिक्षक जोडा",
    fullName: "पूर्ण नाव",
    email: "ईमेल पत्ता",
    password: "पासवर्ड",
    saveTeacher: "शिक्षक खाते तयार करा",
    teacherList: "विद्यमान शिक्षक",
    noTeachers: "अद्याप कोणतेही शिक्षक जोडलेले नाहीत."
  },
  hi: {
    title: "एडमिन डैशबोर्ड",
    overview: "अवलोकन",
    manageTeachers: "शिक्षक प्रबंधन",
    logout: "लॉग आउट",
    totalStudents: "कुल छात्र",
    activeTeachers: "सक्रिय शिक्षक",
    activeClasses: "कक्षाएं (5-10)",
    addNewTeacher: "नया शिक्षक जोड़ें",
    fullName: "पूरा नाम",
    email: "ईमेल पता",
    password: "पासवर्ड",
    saveTeacher: "शिक्षक खाता बनाएं",
    teacherList: "वर्तमान शिक्षक",
    noTeachers: "अभी तक कोई शिक्षक नहीं जोड़ा गया है।"
  }
};

const AdminDashboard = () => {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'teachers'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const t = translations[lang];

  // Mock State for Teachers
  const [teachers, setTeachers] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul.s@school.com' }
  ]);

  const handleLogout = () => {
    // Clear any auth tokens here later
    navigate('/login');
  };

  const handleAddTeacher = (e) => {
    e.preventDefault();
    // In the future, this will be a POST request to your Spring Boot API
    alert("Teacher creation logic will connect to backend here!");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

      {/* Top Navigation */}
      <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">{t.title}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
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

            {/* Desktop Logout */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 text-sm font-bold bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" /> {t.logout}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 bg-blue-800 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-700 p-4 flex flex-col gap-2">
            <button
              onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-3 p-3 rounded-lg font-bold ${activeTab === 'overview' ? 'bg-blue-700' : 'hover:bg-blue-700/50'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> {t.overview}
            </button>
            <button
              onClick={() => { setActiveTab('teachers'); setIsMobileMenuOpen(false); }}
              className={`flex items-center gap-3 p-3 rounded-lg font-bold ${activeTab === 'teachers' ? 'bg-blue-700' : 'hover:bg-blue-700/50'}`}
            >
              <Users className="w-5 h-5" /> {t.manageTeachers}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 rounded-lg font-bold text-red-300 hover:bg-blue-700/50 mt-2 border-t border-blue-700"
            >
              <LogOut className="w-5 h-5" /> {t.logout}
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row">

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] p-6">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> {t.overview}
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${activeTab === 'teachers' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Users className="w-5 h-5" /> {t.manageTeachers}
            </button>
          </div>
        </aside>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 md:p-8">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.overview}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-bold uppercase">{t.totalStudents}</p>
                    <p className="text-2xl font-black text-gray-900">1,240</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-bold uppercase">{t.activeTeachers}</p>
                    <p className="text-2xl font-black text-gray-900">{teachers.length}</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-bold uppercase">{t.activeClasses}</p>
                    <p className="text-2xl font-black text-gray-900">6</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MANAGE TEACHERS TAB */}
          {activeTab === 'teachers' && (
            <div className="animate-fade-in flex flex-col xl:flex-row gap-8">

              {/* Add Teacher Form */}
              <div className="w-full xl:w-1/3">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <PlusCircle className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">{t.addNewTeacher}</h3>
                  </div>

                  <form onSubmit={handleAddTeacher} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t.fullName}</label>
                      <input type="text" required className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Aditi Deshmukh" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t.email}</label>
                      <input type="email" required className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="teacher@school.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">{t.password}</label>
                      <input type="text" required className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Secure Password" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-2">
                      {t.saveTeacher}
                    </button>
                  </form>
                </div>
              </div>

              {/* Teacher List */}
              <div className="w-full xl:w-2/3">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">{t.teacherList}</h3>

                  {teachers.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-8">{t.noTeachers}</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                            <th className="p-3 font-bold">{t.fullName}</th>
                            <th className="p-3 font-bold">{t.email}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachers.map((teacher) => (
                            <tr key={teacher.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-3 font-bold text-gray-800">{teacher.name}</td>
                              <td className="p-3 text-gray-600 text-sm">{teacher.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;