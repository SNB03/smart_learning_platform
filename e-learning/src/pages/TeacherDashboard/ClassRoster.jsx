import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Search, Phone, UserCircle, ShieldAlert } from 'lucide-react';

const ClassRoster = () => {
  const { isClassTeacher } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Boy', 'Girl', 'Other'

  if (!isClassTeacher) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <ShieldAlert className="w-16 h-16 mb-4 opacity-50" />
        <p className="font-bold text-lg text-gray-600">Access Denied</p>
      </div>
    );
  }

  // ==========================================
  // 🛠️ MOCK ROSTER DATA
  // ==========================================
  const students = [
    { id: 1, rollNo: '01', name: 'Aarav Patel', gender: 'Boy', parentMobile: '9876543210' },
    { id: 2, rollNo: '02', name: 'Diya Sharma', gender: 'Girl', parentMobile: '9876543211' },
    { id: 3, rollNo: '03', name: 'Kabir Singh', gender: 'Boy', parentMobile: '9876543212' },
    { id: 4, rollNo: '04', name: 'Ananya Gupta', gender: 'Girl', parentMobile: '9876543213' },
    { id: 5, rollNo: '05', name: 'Rohan Mehta', gender: 'Boy', parentMobile: '9876543214' },
    { id: 6, rollNo: '06', name: 'Kiran Desai', gender: 'Other', parentMobile: '9876543215' },
  ];

  // Analytics Calculations
  const totalStudents = students.length;
  const boysCount = students.filter(s => s.gender === 'Boy').length;
  const girlsCount = students.filter(s => s.gender === 'Girl').length;
  const otherCount = students.filter(s => s.gender === 'Other').length;

  // Filtering Logic
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.rollNo.includes(searchQuery);
    const matchesTab = activeTab === 'All' || s.gender === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="animate-fade-in pb-20">

      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" /> Class Roster
        </h2>
        <p className="text-sm font-medium text-gray-500 mt-1">Overview and contact details for your primary class.</p>
      </div>

      {/* --- STATS SUMMARY CARDS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">Total Students</span>
          <span className="text-3xl font-black text-blue-600">{totalStudents}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">Boys</span>
          <span className="text-3xl font-black text-indigo-600">{boysCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">Girls</span>
          <span className="text-3xl font-black text-pink-500">{girlsCount}</span>
        </div>
        {otherCount > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">Other</span>
            <span className="text-3xl font-black text-emerald-500">{otherCount}</span>
          </div>
        )}
      </div>

      {/* --- SEARCH & CATEGORY TABS --- */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-2">

        {/* Tabs */}
        <div className="flex bg-gray-50 p-1 rounded-xl md:w-auto w-full overflow-x-auto no-scrollbar">
          {['All', 'Boy', 'Girl', 'Other'].map(tab => {
            // Hide 'Other' tab if count is 0 to keep UI clean
            if (tab === 'Other' && otherCount === 0) return null;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200/50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'All' ? 'All Students' : `${tab}s`}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search roster..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border-none rounded-xl outline-none text-sm font-semibold text-gray-700"
          />
        </div>
      </div>

      {/* --- STUDENT LIST --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200 border-dashed">
            <UserCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-bold text-lg text-gray-600">No students found</p>
            <p className="text-sm mt-1">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors group">

              {/* Avatar / Roll No */}
              <div className="relative w-14 h-14 rounded-full bg-slate-50 border-2 border-slate-100 shadow-inner flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-black text-slate-500">{student.rollNo}</span>
                {/* Gender Indicator Dot */}
                <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  student.gender === 'Boy' ? 'bg-indigo-400' :
                  student.gender === 'Girl' ? 'bg-pink-400' : 'bg-emerald-400'
                }`}></div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-gray-900 truncate">{student.name}</h4>
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mt-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> {student.parentMobile}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ClassRoster;