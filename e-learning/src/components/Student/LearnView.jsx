import React, { useState } from 'react';
import { BookOpen, ExternalLink, Download, Search, PlayCircle, FileText, Loader2, X, Play, Sparkles } from 'lucide-react';

const LearnView = ({ materials }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState('All');

  // Action States
  const [downloadingId, setDownloadingId] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [summaryModal, setSummaryModal] = useState({ isOpen: false, material: null, isLoading: false, content: '' });

  const subjects = ['All', ...new Set(materials.map(m => m.subject).filter(Boolean))];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.subject?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = activeSubject === 'All' || m.subject === activeSubject;
    return matchesSearch && matchesSubject;
  });

  const handleDownload = async (materialId) => {
    setDownloadingId(materialId);
    setTimeout(() => setDownloadingId(null), 1500); // Mock download delay
  };

  const handleOpenLink = (url) => {
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  // --- UPGRADED: MOCK AI SUMMARIZER FOR PDFs AND VIDEOS ---
  const handleSummarize = (material) => {
    setSummaryModal({ isOpen: true, material, isLoading: true, content: '' });

    setTimeout(() => {
      const isVideo = material.type === 'video';
      setSummaryModal({
        isOpen: true,
        material,
        isLoading: false,
        content: `**AI ${isVideo ? 'Transcript ' : ''}Summary for ${material.title}**\n\n` +
                 (isVideo
                  ? `In this lecture, the professor covers the core concepts of ${material.subject}. \n\n**Key Timestamps & Takeaways:**\n• **02:15** - Introduction and basic definitions.\n• **14:30** - The 3 main formulas you need to memorize.\n• **28:45** - Walkthrough of a real-world example.\n\n*Tip: The professor hints that the topic at 14:30 will be heavily featured on the upcoming test!*`
                  : `This document outlines the foundational concepts of ${material.subject}. \n\n**Key Takeaways:**\n• It introduces the primary structures and functions necessary for this topic.\n• Highlights the most common formulas and real-world applications.\n• Includes 5 practice problems at the end to test your knowledge.\n\n*Tip: Focus heavily on page 3, as it covers topics frequently asked in exams!*`)
      });
    }, 2000);
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    let embedUrl = url;
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`;
    }
    return embedUrl;
  };

  return (
    <div className="animate-fade-in space-y-5 sm:space-y-6 relative">

      {/* ================================================================= */}
      {/* 1. CINEMATIC VIDEO PLAYER MODAL */}
      {/* ================================================================= */}
      {playingVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-6 md:p-12">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity" onClick={() => setPlayingVideo(null)}></div>

          {/* Mobile: Full screen. Desktop: Rounded floating box */}
          <div className="relative w-full h-[100dvh] sm:h-auto sm:max-w-5xl bg-black sm:rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col justify-center">

            <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent z-10 pointer-events-none">
              <div className="pointer-events-auto max-w-[80%] mt-safe">
                <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-2 inline-block shadow-sm">
                  {playingVideo.subject}
                </span>
                <h3 className="text-white font-bold text-base sm:text-xl drop-shadow-md leading-tight line-clamp-2">
                  {playingVideo.title}
                </h3>
              </div>
              <button onClick={() => setPlayingVideo(null)} className="pointer-events-auto mt-safe p-2 sm:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-95">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="relative w-full pt-[56.25%] bg-slate-900">
              <iframe
                src={getEmbedUrl(playingVideo.linkUrl)}
                title={playingVideo.title}
                className="absolute top-0 left-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. AI SUMMARY MODAL (Mobile-Optimized Bottom Drawer) */}
      {/* ================================================================= */}
      {summaryModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !summaryModal.isLoading && setSummaryModal({ isOpen: false, material: null, content: '', isLoading: false })}></div>

          <div className="relative bg-white w-full max-w-2xl rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85dvh] sm:max-h-[90dvh]">

            {/* Mobile Drag Handle Indicator */}
            <div className="sm:hidden absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/40 rounded-full z-20"></div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 sm:p-6 pt-8 sm:pt-6 flex justify-between items-center text-white shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-inner border border-white/30 shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-lg">AI Summary</h3>
                  <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold truncate">{summaryModal.material?.title}</p>
                </div>
              </div>
              <button onClick={() => !summaryModal.isLoading && setSummaryModal({ isOpen: false, material: null, content: '', isLoading: false })} className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto flex-1 bg-slate-50">
              {summaryModal.isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-50 rounded-full animate-pulse"></div>
                    <FileText className="w-14 h-14 sm:w-16 sm:h-16 text-indigo-600 relative z-10 animate-bounce" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-800">Analyzing Material...</h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 mt-2 max-w-[200px] mx-auto">Our AI is extracting the key points for you.</p>
                </div>
              ) : (
                <div className="prose prose-sm sm:prose-base prose-indigo max-w-none animate-fade-in">
                  {summaryModal.content.split('\n').map((paragraph, i) => {
                    if (paragraph.startsWith('**')) return <h4 key={i} className="font-black text-indigo-900 text-base sm:text-lg mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</h4>;
                    if (paragraph.startsWith('•')) return <li key={i} className="text-slate-700 font-medium ml-4 mb-2 text-sm sm:text-base">{paragraph.replace('• ', '')}</li>;
                    if (paragraph.startsWith('*')) return <p key={i} className="text-indigo-700 font-bold bg-indigo-50/80 p-3 sm:p-4 rounded-xl border border-indigo-100 mt-6 text-sm sm:text-base">{paragraph.replace(/\*/g, '')}</p>;
                    return paragraph ? <p key={i} className="text-slate-600 font-medium leading-relaxed mb-4 text-sm sm:text-base">{paragraph}</p> : null;
                  })}
                </div>
              )}
            </div>

            {!summaryModal.isLoading && (
              <div className="p-4 sm:p-5 bg-white border-t border-slate-100 flex gap-3 shrink-0 pb-safe">
                {summaryModal.material?.type === 'video' ? (
                   <button onClick={() => { setSummaryModal({ isOpen: false }); setPlayingVideo(summaryModal.material); }} className="flex-1 py-3.5 sm:py-4 bg-rose-50 text-rose-700 font-black rounded-xl transition-all flex justify-center items-center gap-2 active:scale-95">
                     <PlayCircle className="w-5 h-5" /> Watch Full Video
                   </button>
                ) : (
                  <button onClick={() => handleDownload(summaryModal.material.id)} className="flex-1 py-3.5 sm:py-4 bg-indigo-50 text-indigo-700 font-black rounded-xl transition-all flex justify-center items-center gap-2 active:scale-95">
                    <Download className="w-5 h-5" /> Download Full PDF
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- HEADER & SEARCH --- */}
      <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:justify-between md:items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Study Materials</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Video lectures, notes, and resources.</p>
        </div>
        <div className="relative w-full md:w-72 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text" placeholder="Search materials..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 sm:py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold shadow-sm transition-all"
          />
        </div>
      </div>

      {/* --- SUBJECT FILTERS --- */}
      {subjects.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {subjects.map(subject => (
            <button
              key={subject} onClick={() => setActiveSubject(subject)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeSubject === subject ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
      )}

      {/* --- MATERIALS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-[1.5rem] border border-slate-200 border-dashed mx-2 sm:mx-0">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-600 text-base sm:text-lg">No materials found.</p>
          </div>
        ) : (
          filteredMaterials.map(material => (
            <div key={material.id} className="bg-white rounded-2xl sm:rounded-[1.5rem] shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md hover:border-indigo-200 transition-all group overflow-hidden">

              {/* MEDIA PREVIEW HEADER */}
              <div className="cursor-pointer h-32 sm:h-36 relative flex items-center justify-center overflow-hidden"
                onClick={() => {
                  if (material.type === 'video') setPlayingVideo(material);
                  else if (material.type === 'file') handleSummarize(material);
                  else handleOpenLink(material.linkUrl);
                }}>

                {material.type === 'video' ? (
                  <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-900/40 to-slate-900 z-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center z-10 group-hover:scale-110 group-hover:bg-rose-500 transition-all duration-300">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md z-10">Video</div>
                  </div>
                ) : material.type === 'file' ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-600">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:16px_16px]"></div>
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-1.5">
                      <div className="bg-white/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-white/20 group-hover:-translate-y-2 transition-transform duration-300">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <span className="bg-white/20 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">PDF Guide</span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform duration-300">
                      <ExternalLink className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* CONTENT AREA */}
              <div className="p-4 sm:p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                    material.type === 'video' ? 'bg-rose-50 text-rose-600' :
                    material.type === 'file' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {material.subject}
                  </span>
                </div>

                <h4 className="font-black text-slate-800 text-sm sm:text-base mb-4 sm:mb-5 leading-snug line-clamp-2 flex-1 group-hover:text-indigo-600 transition-colors">
                  {material.title}
                </h4>

                {/* MOBILE-OPTIMIZED ACTION BUTTONS */}
                <div className="pt-3 sm:pt-4 border-t border-slate-100 flex gap-2">

                  {material.type === 'video' || material.type === 'file' ? (
                    <>
                      {/* Primary Button: AI Summary */}
                      <button
                        onClick={() => handleSummarize(material)}
                        className="flex-[2] py-2.5 sm:py-3 bg-indigo-600 text-white hover:bg-indigo-700 font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-indigo-100"
                      >
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden xs:inline">Summary</span><span className="xs:hidden">Sum</span>
                      </button>

                      {/* Secondary Action: Download / Watch */}
                      <button
                        onClick={() => material.type === 'video' ? setPlayingVideo(material) : handleDownload(material.id)}
                        disabled={downloadingId === material.id}
                        className={`flex-1 py-2.5 sm:py-3 font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5 active:scale-95 ${
                          material.type === 'video' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {downloadingId === material.id ? <Loader2 className="w-4 h-4 animate-spin" /> :
                         material.type === 'video' ? <PlayCircle className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        <span className="hidden sm:inline">{material.type === 'video' ? 'Watch' : 'Save'}</span>
                      </button>
                    </>
                  ) : (
                    // External Link Layout
                    <button
                      onClick={() => handleOpenLink(material.linkUrl)}
                      className="w-full py-2.5 sm:py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-black text-[10px] sm:text-xs uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 active:scale-95"
                    >
                      <ExternalLink className="w-4 h-4" /> Open Web Link
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default LearnView;