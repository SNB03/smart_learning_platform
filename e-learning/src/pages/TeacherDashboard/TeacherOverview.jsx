import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Clock, MapPin, Users, BookOpen, CheckCircle2, PlayCircle, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

const TeacherOverview = () => {
  // Try to grab the mock user from the Outlet, fallback if not available
  const context = useOutletContext();
  const user = context?.user || { fullName: 'Rahul Sharma' };

  // ==========================================
  // 🛠️ MOCK SCHEDULE DATA
  // ==========================================
  const schedule = [
    {
      id: 1,
      startTime: '08:30 AM',
      endTime: '09:15 AM',
      type: 'Class Teacher Period',
      class: 'Class 5',
      division: 'A',
      room: 'Room 102',
      status: 'completed'
    },
    {
      id: 2,
      startTime: '09:15 AM',
      endTime: '10:00 AM',
      type: 'Subject',
      subject: 'Mathematics',
      class: 'Class 6',
      division: 'B',
      room: 'Room 204',
      status: 'completed'
    },
    {
      id: 3,
      startTime: '10:15 AM',
      endTime: '11:00 AM',
      type: 'Subject',
      subject: 'Mathematics',
      class: 'Class 7',
      division: 'A',
      room: 'Room 301',
      status: 'ongoing'
    },
    {
      id: 4,
      startTime: '11:45 AM',
      endTime: '12:30 PM',
      type: 'Subject',
      subject: 'Science',
      class: 'Class 5',
      division: 'A',
      room: 'Lab 1',
      status: 'upcoming'
    },
    {
      id: 5,
      startTime: '01:30 PM',
      endTime: '02:15 PM',
      type: 'Free Period',
      subject: 'Planning & Grading',
      room: 'Staff Room',
      status: 'upcoming'
    },
  ];

  // Calculations for UI
  const completedClasses = schedule.filter(s => s.status === 'completed').length;
  const totalClasses = schedule.length;
  const progressPercentage = Math.round((completedClasses / totalClasses) * 100);

  return (
    <div className="animate-fade-in pb-20 max-w-4xl mx-auto">

      {/* --- 1. WELCOME HEADER CARD --- */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden mb-8">
        {/* Decorative Background Graphics */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-blue-200 font-medium text-sm sm:text-base mb-1 flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h2 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">
              Good morning, {user.fullName.split(' ')[0]}!
            </h2>
            <p className="text-blue-100 font-medium text-sm sm:text-base max-w-md">
              You have <span className="text-white font-bold">{totalClasses - completedClasses} classes</span> remaining today. Have a great day teaching!
            </p>
          </div>

          {/* Progress Tracker */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl w-full sm:w-48 flex-shrink-0">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-blue-100">Day Progress</span>
              <span className="text-lg font-black text-white">{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-blue-200 mt-2 font-medium text-right">
              {completedClasses} of {totalClasses} periods done
            </p>
          </div>
        </div>
      </div>

      {/* --- 2. DAILY TIMELINE --- */}
      <div className="px-2 sm:px-0">
        <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-600" /> Today's Schedule
        </h3>

        <div className="relative border-l-2 border-gray-100 ml-4 sm:ml-6 space-y-6 sm:space-y-8">

          {schedule.map((session) => (
            <div key={session.id} className="relative pl-6 sm:pl-8 group">

              {/* Timeline Dot Indicator */}
              <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 shadow-sm transition-colors duration-300 ${
                session.status === 'completed' ? 'bg-emerald-500 border-white' :
                session.status === 'ongoing' ? 'bg-blue-600 border-blue-100 animate-pulse' :
                'bg-gray-300 border-white group-hover:bg-blue-400'
              }`}></div>

              {/* Class Card */}
              <div className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                session.status === 'completed' ? 'border-gray-200 opacity-75' :
                session.status === 'ongoing' ? 'border-blue-300 shadow-md shadow-blue-100 ring-1 ring-blue-50' :
                'border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200'
              }`}>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  {/* Left Side: Time & Subject Info */}
                  <div className="flex gap-4 sm:gap-6">
                    {/* Time Block */}
                    <div className="flex flex-col items-start min-w-[80px]">
                      <span className={`text-sm sm:text-base font-black ${session.status === 'ongoing' ? 'text-blue-700' : 'text-gray-900'}`}>
                        {session.startTime}
                      </span>
                      <span className="text-xs font-bold text-gray-400">
                        to {session.endTime}
                      </span>
                    </div>

                    {/* Details Block */}
                    <div className="border-l border-gray-100 pl-4 sm:pl-6">
                      <div className="flex items-center gap-2 mb-1">
                        {session.status === 'ongoing' && (
                          <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> Live
                          </span>
                        )}
                        <h4 className="text-base sm:text-lg font-bold text-gray-900">
                          {session.type === 'Free Period' ? session.type : `${session.class} - Div ${session.division}`}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                        {session.subject && (
                          <span className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                            <BookOpen className="w-3.5 h-3.5 text-blue-500" /> {session.subject}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-500">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {session.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Action Buttons (Mobile friendly stack) */}
                  <div className="mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    {session.status === 'completed' ? (
                      <div className="flex items-center justify-center sm:justify-end gap-1.5 text-emerald-600 font-bold text-sm bg-emerald-50 py-2 sm:py-1 px-4 rounded-xl sm:bg-transparent">
                        <CheckCircle2 className="w-5 h-5" /> <span className="sm:hidden">Completed</span>
                      </div>
                    ) : session.type === 'Free Period' ? (
                      <div className="text-center sm:text-right text-gray-400 text-sm font-medium italic">
                        No action required
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {/* Attendance Button */}
                        <button className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 sm:px-5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                          session.status === 'ongoing'
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                            : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                        }`}>
                          {session.status === 'ongoing' ? <PlayCircle className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                          {session.status === 'ongoing' ? 'Join Class' : 'Take Attendance'}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}

          {/* End of day marker */}
          <div className="relative pl-6 sm:pl-8 pt-2 pb-4">
             <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-full bg-gray-300"></div>
             <p className="text-sm font-bold text-gray-400 italic">End of Schedule</p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default TeacherOverview;