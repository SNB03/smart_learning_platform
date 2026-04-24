import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Clock, MapPin, Users, BookOpen, CheckCircle2, PlayCircle, Calendar as CalendarIcon, Plus, X, Loader2, Sparkles, UploadCloud, FileImage } from 'lucide-react';

const TeacherOverview = () => {
  const context = useOutletContext();
  const user = context?.user || { id: 1, fullName: 'Teacher' };

  // App State
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Modal States
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Form & Upload States
  const [timetableFile, setTimetableFile] = useState(null);
  const [newPeriod, setNewPeriod] = useState({
    startTime: '', endTime: '', type: 'Subject', classLevel: '5', division: 'A', subject: '', room: ''
  });

  // Auto-hide toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  // 1. FETCH TODAY'S SCHEDULE
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/schedule?teacherId=${user.id}`);
        if (response.ok) {
          setSchedule(await response.json());
        }
      } catch (error) {
        // Silently fail for UI mockup if backend is off
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, [user.id]);

  // 2. MANUAL ADD
  const handleAddPeriod = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formatTime = (time24) => {
      const [h, m] = time24.split(':');
      const suffix = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${h12.toString().padStart(2, '0')}:${m} ${suffix}`;
    };

    const payload = {
      ...newPeriod,
      startTime: formatTime(newPeriod.startTime),
      endTime: formatTime(newPeriod.endTime)
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/schedule?teacherId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedPeriod = await response.json();
        const updatedSchedule = [...schedule, savedPeriod].sort((a, b) => a.startTime.localeCompare(b.startTime));
        setSchedule(updatedSchedule);
        setIsManualModalOpen(false);
        showToast("Period added manually!", "success");
        setNewPeriod({ startTime: '', endTime: '', type: 'Subject', classLevel: '5', division: 'A', subject: '', room: '' });
      } else {
        throw new Error("Failed to save to backend");
      }
    } catch (error) {
      // Fallback for UI testing if Spring Boot is offline
      const fallbackPeriod = { id: Date.now(), ...payload };
      const updatedSchedule = [...schedule, fallbackPeriod].sort((a, b) => a.startTime.localeCompare(b.startTime));
      setSchedule(updatedSchedule);
      setIsManualModalOpen(false);
      showToast("Period added (Mock Data - Backend Offline)", "success");
      setNewPeriod({ startTime: '', endTime: '', type: 'Subject', classLevel: '5', division: 'A', subject: '', room: '' });
    } finally {
      setIsSaving(false);
    }
  };

  // 3. SMART IMPORT MOCK LOGIC
  const handleSmartImport = async (e) => {
    e.preventDefault();
    if (!timetableFile) return showToast("Please select an image or PDF first.", "error");

    setIsParsing(true);

    // Simulate sending file to Spring Boot -> Spring Boot calls OCR/AI -> Returns JSON
    setTimeout(() => {
      const parsedPeriods = [
        { id: Date.now() + 1, startTime: '09:00 AM', endTime: '09:45 AM', type: 'Subject', subject: 'English', classLevel: '6', division: 'B', room: 'Room 201' },
        { id: Date.now() + 2, startTime: '10:00 AM', endTime: '10:45 AM', type: 'Subject', subject: 'History', classLevel: '7', division: 'A', room: 'Room 305' },
        { id: Date.now() + 3, startTime: '11:00 AM', endTime: '11:45 AM', type: 'Free Period', room: 'Staff Room' }
      ];

      const newSchedule = [...schedule, ...parsedPeriods].sort((a, b) => a.startTime.localeCompare(b.startTime));
      setSchedule(newSchedule);
      setIsParsing(false);
      setIsImportModalOpen(false);
      setTimetableFile(null);
      showToast("Timetable successfully scanned and imported!", "success");
    }, 2500); // Fake a 2.5 second AI processing delay
  };

  // 4. DYNAMIC STATUS CALCULATOR
  const getStatus = (startTimeStr, endTimeStr) => {
    const now = new Date();

    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;

      const dateObj = new Date();
      dateObj.setHours(hours, minutes, 0);
      return dateObj;
    };

    try {
      const start = parseTime(startTimeStr);
      const end = parseTime(endTimeStr);

      if (now > end) return 'completed';
      if (now >= start && now <= end) return 'ongoing';
      return 'upcoming';
    } catch {
      return 'upcoming';
    }
  };

  // Calculations for Progress Tracker
  const completedClasses = schedule.filter(s => getStatus(s.startTime, s.endTime) === 'completed').length;
  const totalClasses = schedule.length;
  const progressPercentage = totalClasses === 0 ? 0 : Math.round((completedClasses / totalClasses) * 100);

  return (
    <div className="animate-fade-in pb-20 max-w-4xl mx-auto relative">

      {/* --- TOAST NOTIFICATION --- */}
      <div className={`fixed top-4 right-4 z-[100] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      </div>

      {/* --- SMART IMPORT MODAL --- */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isParsing && setIsImportModalOpen(false)}></div>
          <div className="relative bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up sm:animate-fade-in">

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 flex justify-between items-center text-white">
              <h3 className="text-xl font-black flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-200" /> Auto-Import Timetable
              </h3>
              <button onClick={() => !isParsing && setIsImportModalOpen(false)} className="p-1.5 bg-white/10 rounded-full hover:bg-white/20"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleSmartImport} className="p-6 space-y-6 text-center">
              <p className="text-sm font-medium text-gray-600">
                Upload a photo or PDF of your daily schedule. Our system will scan the image and automatically create your timeline.
              </p>

              <label htmlFor="timetable-upload" className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${timetableFile ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-gray-50 hover:bg-indigo-50/50 hover:border-indigo-300'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                  {timetableFile ? (
                    <>
                      <FileImage className="w-10 h-10 mb-3 text-indigo-500" />
                      <p className="text-sm font-bold text-indigo-800 truncate max-w-[250px]">{timetableFile.name}</p>
                      <p className="text-xs font-semibold text-indigo-600 mt-1">Tap to change file</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 mb-3 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      <p className="text-sm font-bold text-gray-700">Tap to select Image or PDF</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-wider">Supports JPG, PNG, PDF</p>
                    </>
                  )}
                </div>
                <input id="timetable-upload" type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => setTimetableFile(e.target.files[0])} />
              </label>

              <button type="submit" disabled={isParsing || !timetableFile} className={`w-full py-4 text-white font-black text-lg rounded-xl flex justify-center items-center gap-2 transition-all shadow-md ${timetableFile && !isParsing ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 active:scale-[0.98]' : 'bg-gray-300 shadow-none cursor-not-allowed'}`}>
                {isParsing ? (
                  <><Loader2 className="w-6 h-6 animate-spin text-indigo-200" /> Scanning Image...</>
                ) : (
                  <><Sparkles className="w-5 h-5" /> Extract Schedule</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MANUAL ADD PERIOD MODAL --- */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsManualModalOpen(false)}></div>
          <div className="relative bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up sm:animate-fade-in">
            <div className="bg-blue-600 p-5 flex justify-between items-center text-white">
              <h3 className="text-xl font-black">Add to Today's Schedule</h3>
              <button onClick={() => setIsManualModalOpen(false)} className="p-1.5 bg-white/10 rounded-full hover:bg-white/20"><X className="w-5 h-5"/></button>
            </div>

            <form onSubmit={handleAddPeriod} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase mb-1">Start Time</label>
                  <input type="time" required value={newPeriod.startTime} onChange={e => setNewPeriod({...newPeriod, startTime: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl font-bold text-gray-800" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-gray-400 uppercase mb-1">End Time</label>
                  <input type="time" required value={newPeriod.endTime} onChange={e => setNewPeriod({...newPeriod, endTime: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl font-bold text-gray-800" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase mb-1">Period Type</label>
                <select value={newPeriod.type} onChange={e => setNewPeriod({...newPeriod, type: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl font-bold text-gray-800">
                  <option value="Subject">Subject Teaching</option>
                  <option value="Class Teacher Period">Class Teacher Period</option>
                  <option value="Free Period">Free Period / Planning</option>
                </select>
              </div>

              {newPeriod.type !== 'Free Period' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase mb-1">Class</label>
                    <input type="number" placeholder="e.g. 5" value={newPeriod.classLevel} onChange={e => setNewPeriod({...newPeriod, classLevel: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl font-bold text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase mb-1">Division</label>
                    <input type="text" placeholder="e.g. A" value={newPeriod.division} onChange={e => setNewPeriod({...newPeriod, division: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl font-bold text-gray-800" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {newPeriod.type !== 'Free Period' && (
                  <div>
                    <label className="block text-[11px] font-black text-gray-400 uppercase mb-1">Subject</label>
                    <input type="text" placeholder="e.g. Math" value={newPeriod.subject} onChange={e => setNewPeriod({...newPeriod, subject: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl font-bold text-gray-800" />
                  </div>
                )}
                <div className={newPeriod.type === 'Free Period' ? 'col-span-2' : ''}>
                  <label className="block text-[11px] font-black text-gray-400 uppercase mb-1">Room</label>
                  <input type="text" required placeholder="e.g. Room 102" value={newPeriod.room} onChange={e => setNewPeriod({...newPeriod, room: e.target.value})} className="w-full px-3 py-2.5 bg-gray-50 border rounded-xl font-bold text-gray-800" />
                </div>
              </div>

              <button type="submit" disabled={isSaving} className="w-full py-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl flex justify-center items-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-blue-200">
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin"/> : 'Save to Timeline'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- WELCOME HEADER CARD --- */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden mb-8">
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

      {/* --- TIMELINE SECTION --- */}
      <div className="px-2 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <Clock className="w-7 h-7 text-blue-600" /> Today's Timeline
          </h3>

          <div className="flex gap-2">
            <button onClick={() => setIsImportModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors border border-indigo-100 shadow-sm">
              <Sparkles className="w-4 h-4"/> Smart Import
            </button>
            <button onClick={() => setIsManualModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-blue-200">
              <Plus className="w-4 h-4"/> Manual Add
            </button>
          </div>
        </div>

        {isLoading ? (
           <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 text-blue-500 animate-spin"/></div>
        ) : schedule.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-3xl border-2 border-gray-200 border-dashed">
             <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3"/>
             <p className="font-bold text-gray-600 text-lg">Your schedule is clear</p>
             <p className="text-sm text-gray-400 mt-1">Add periods manually or import an image of your timetable.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-100 ml-4 sm:ml-6 space-y-6 sm:space-y-8">
            {schedule.map((session) => {
              const status = getStatus(session.startTime, session.endTime);

              return (
              <div key={session.id} className="relative pl-6 sm:pl-8 group">
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 shadow-sm transition-colors duration-300 ${
                  status === 'completed' ? 'bg-emerald-500 border-white' :
                  status === 'ongoing' ? 'bg-blue-600 border-blue-100 animate-pulse' :
                  'bg-gray-300 border-white group-hover:bg-blue-400'
                }`}></div>

                <div className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
                  status === 'completed' ? 'border-gray-200 opacity-75' :
                  status === 'ongoing' ? 'border-blue-300 shadow-md shadow-blue-100 ring-1 ring-blue-50' :
                  'border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div className="flex gap-4 sm:gap-6">
                      <div className="flex flex-col items-start min-w-[80px]">
                        <span className={`text-sm sm:text-base font-black ${status === 'ongoing' ? 'text-blue-700' : 'text-gray-900'}`}>
                          {session.startTime}
                        </span>
                        <span className="text-xs font-bold text-gray-400">to {session.endTime}</span>
                      </div>

                      <div className="border-l border-gray-100 pl-4 sm:pl-6">
                        <div className="flex items-center gap-2 mb-1">
                          {status === 'ongoing' && (
                            <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span> Live
                            </span>
                          )}
                          <h4 className="text-base sm:text-lg font-bold text-gray-900">
                            {session.type === 'Free Period' ? session.type : `Class ${session.classLevel} - Div ${session.division}`}
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

                    <div className="mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      {status === 'completed' ? (
                        <div className="flex items-center justify-center sm:justify-end gap-1.5 text-emerald-600 font-bold text-sm bg-emerald-50 py-2 sm:py-1 px-4 rounded-xl sm:bg-transparent">
                          <CheckCircle2 className="w-5 h-5" /> <span className="sm:hidden">Completed</span>
                        </div>
                      ) : session.type === 'Free Period' ? (
                        <div className="text-center sm:text-right text-gray-400 text-sm font-medium italic">No action required</div>
                      ) : (
                        <div className="flex gap-2">
                          <button className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 sm:px-5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                            status === 'ongoing'
                              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                              : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                          }`}>
                            {status === 'ongoing' ? <PlayCircle className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                            {status === 'ongoing' ? 'Join Class' : 'Take Attendance'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )})}
            <div className="relative pl-6 sm:pl-8 pt-2 pb-4">
               <div className="absolute -left-[5px] top-4 w-2 h-2 rounded-full bg-gray-300"></div>
               <p className="text-sm font-bold text-gray-400 italic">End of Schedule</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherOverview;