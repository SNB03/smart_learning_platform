import React from 'react';
import { Calendar, Bell, BookOpen, Download, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';

const HomeView = ({ schedule, latestNotice, recentMaterials, setActiveTab, briefingText }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-2 space-y-6">

        {/* AI Briefing */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 sm:p-6 rounded-[2rem] shadow-lg shadow-indigo-200/50 flex gap-4 items-center relative overflow-hidden">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-white/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mb-1">AI Daily Briefing</h4>
            <p className="text-white text-sm sm:text-base font-medium leading-snug">{briefingText}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600"/> Today's Classes
            </h3>
          </div>
          <div className="space-y-3">
            {schedule.length === 0 ? (
              <p className="text-sm font-bold text-slate-400 text-center py-4">No classes scheduled.</p>
            ) : (
              schedule.map((session) => (
                <div key={session.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center pr-4 border-r border-slate-200 min-w-[70px]">
                      <p className="text-sm font-black text-slate-900">{session.startTime.split(' ')[0]}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{session.startTime.split(' ')[1]}</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{session.subject || session.type}</h4>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{session.teacher?.fullName} • {session.room}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-6">

        {/* Latest Notice */}
        {latestNotice && (
          <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-200 shadow-sm cursor-pointer hover:border-amber-200 transition-colors" onClick={() => setActiveTab('inbox')}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500"/> Important Notice
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <div className={`p-4 rounded-xl border ${latestNotice.type === 'urgent' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
              <h4 className="font-bold text-slate-900 text-sm">{latestNotice.title}</h4>
              <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">{latestNotice.content}</p>
            </div>
          </div>
        )}

        {/* Materials Grid */}
        {recentMaterials.length > 0 && (
          <div className="bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-200 shadow-sm cursor-pointer hover:border-indigo-200 transition-colors" onClick={() => setActiveTab('learn')}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500"/> Recent Materials
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {recentMaterials.map(material => (
                <div key={material.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${material.type === 'file' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                      {material.type === 'file' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{material.title}</h4>
                      <p className="text-[10px] font-medium text-slate-400 truncate">{material.subject}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeView;