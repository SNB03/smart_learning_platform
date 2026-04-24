import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ExternalLink, Loader2, Users, UsersRound, User, UserCheck, Filter, DownloadCloud } from 'lucide-react';

const StudentStats = () => {
  const navigate = useNavigate();

  const [statsData, setStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/student-stats`);
        if (response.ok) {
          const data = await response.json();
          setStatsData(data);
        } else {
          throw new Error("Failed to fetch");
        }
      } catch (error) {
        console.error("Network error, using fallback data.");
        setStatsData([
          {
            classLevel: '5',
            divisions: [
              { name: 'A', classTeacher: { id: 1, name: 'Rahul Sharma' }, boys: 20, girls: 18 },
              { name: 'B', classTeacher: { id: 2, name: 'Aditi Deshmukh' }, boys: 19, girls: 20 }
            ]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // --- CSV EXPORT LOGIC ---
  const handleExportCSV = () => {
    if (statsData.length === 0) return;

    // 1. Define CSV Headers
    const headers = ["Class Level", "Division", "Class Teacher", "Boys", "Girls", "Total Students"];

    // 2. Flatten the nested structure into rows
    const rows = statsData.flatMap(cls =>
      cls.divisions.map(div => [
        `Class ${cls.classLevel}`,
        div.name,
        div.classTeacher.name,
        div.boys,
        div.girls,
        div.boys + div.girls
      ])
    );

    // 3. Create the CSV content string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // 4. Create a blob and trigger a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `School_Demographics_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
    document.body.appendChild(link);

    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const { totalStudents, totalBoys, totalGirls, uniqueClasses } = useMemo(() => {
    let boys = 0; let girls = 0;
    const classes = ['All'];
    statsData.forEach(cls => {
      classes.push(cls.classLevel);
      cls.divisions.forEach(div => {
        boys += div.boys;
        girls += div.girls;
      });
    });
    return { totalStudents: boys + girls, totalBoys: boys, totalGirls: girls, uniqueClasses: classes };
  }, [statsData]);

  const filteredStats = activeFilter === 'All'
    ? statsData
    : statsData.filter(cls => cls.classLevel === activeFilter);

  const routeToTeacher = (teacherId) => {
    navigate(`/admin-dashboard/teacher-info?id=${teacherId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="font-bold text-slate-500 uppercase tracking-widest text-sm">Aggregating School Data...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 md:space-y-8 max-w-7xl mx-auto pb-10">

      <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">Student Demographics</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Macro overview of school enrollment.</p>
          </div>
        </div>

        {/* WORKED: Export CSV Button */}
        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-100 transition-all flex items-center gap-2 active:scale-95 text-sm"
        >
          <DownloadCloud className="w-4 h-4" /> Export CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-[1.5rem] sm:rounded-[2rem] text-white shadow-md shadow-indigo-200 relative overflow-hidden flex items-center justify-between">
          <div className="absolute -right-4 -bottom-4 opacity-20"><UsersRound className="w-32 h-32" /></div>
          <div className="relative z-10">
            <p className="text-indigo-100 font-black uppercase tracking-widest text-xs mb-1">Total Enrollment</p>
            <h3 className="text-4xl sm:text-5xl font-black">{totalStudents}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
            <User className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-0.5">Total Boys</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800">{totalBoys}</h3>
            <p className="text-xs font-bold text-blue-500">{Math.round((totalBoys/totalStudents)*100)}% of school</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-400 font-black uppercase tracking-widest text-xs mb-0.5">Total Girls</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800">{totalGirls}</h3>
            <p className="text-xs font-bold text-pink-500">{Math.round((totalGirls/totalStudents)*100)}% of school</p>
          </div>
        </div>
      </div>

      {uniqueClasses.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-slate-200 text-slate-500 rounded-xl shrink-0">
            <Filter className="w-4 h-4" />
          </div>
          {uniqueClasses.map(cls => (
            <button
              key={cls}
              onClick={() => setActiveFilter(cls)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === cls
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cls === 'All' ? 'All Classes' : `Class ${cls}`}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-6 sm:space-y-8">
        {filteredStats.map((cls, idx) => (
          <div key={idx} className="bg-slate-50/50 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 animate-slide-up">

            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black text-lg">
                  {cls.classLevel}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800">Class {cls.classLevel}</h3>
                  <p className="text-xs font-bold text-slate-500">{cls.divisions.length} Divisions Active</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {cls.divisions.map((div, dIdx) => (
                <div key={dIdx} className="bg-white rounded-2xl sm:rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all group">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 sm:p-5 flex justify-between items-center text-white relative">
                    <div className="relative z-10">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Division</span>
                      <span className="font-black text-3xl">{div.name}</span>
                    </div>

                    <div className="text-right relative z-10">
                      <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-1">Class Teacher</span>
                      <button
                        onClick={() => routeToTeacher(div.classTeacher.id)}
                        className="font-bold text-xs sm:text-sm text-indigo-200 hover:text-white transition-colors flex items-center gap-1.5 group/btn bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm"
                      >
                        <User className="w-3 h-3" /> {div.classTeacher.name}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 grid grid-cols-3 divide-x divide-slate-100 text-center">
                    <div className="p-2">
                      <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Boys</p>
                      <p className="text-xl sm:text-2xl font-black text-blue-600 mt-1">{div.boys}</p>
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">Girls</p>
                      <p className="text-xl sm:text-2xl font-black text-pink-500 mt-1">{div.girls}</p>
                    </div>
                    <div className="bg-slate-50 p-2">
                      <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest">Total</p>
                      <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{div.boys + div.girls}</p>
                    </div>
                  </div>

                  <div className="w-full h-1.5 flex bg-slate-100">
                    <div className="bg-blue-500 h-full" style={{ width: `${(div.boys / (div.boys + div.girls)) * 100}%` }}></div>
                    <div className="bg-pink-500 h-full" style={{ width: `${(div.girls / (div.boys + div.girls)) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentStats;