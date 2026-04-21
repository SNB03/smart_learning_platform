import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Bell, Loader2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const AdminOverview = () => {
  const { t } = useOutletContext();

  // State to hold our live database numbers
  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    notices: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  // Fetch the live stats when the component loads
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats({
            teachers: data.activeTeachers || 0,
            students: data.totalStudents || 0,
            notices: data.activeNotices || 0
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false); // Turn off the loading spinner
      }
    };

    fetchStats();
  }, []); // Empty dependency array means this runs once when the page opens

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t.overview}</h2>
        {isLoading && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Teachers Stat */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-blue-300 transition-colors">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase">{t.manageTeachers}</p>
            <p className="text-gray-500 text-sm font-bold uppercase">Total Teacher</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <h4 className="text-2xl font-black text-gray-900">{stats.teachers}</h4>
            )}
          </div>
        </div>

        {/* Students Stat */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-purple-300 transition-colors">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            {/* You can add 'totalStudents' to your translations.js file later! */}
            <p className="text-gray-500 text-sm font-bold uppercase">Total Students</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <h4 className="text-2xl font-black text-gray-900">{stats.students}</h4>
            )}
          </div>
        </div>

        {/* Notices Stat */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-emerald-300 transition-colors">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <Bell className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold uppercase">{t.announcements}</p>
            {isLoading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
            ) : (
              <h4 className="text-2xl font-black text-gray-900">{stats.notices}</h4>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminOverview;