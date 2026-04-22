import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { BrainCircuit, Plus, Sparkles, FileText, CheckCircle2, XCircle, Loader2, Trash2, Edit3, Send, UploadCloud, Clock } from 'lucide-react';

const QuizManager = () => {
  const { user } = useOutletContext();
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // AI Generation States
  const [step, setStep] = useState(1); // 1: Setup, 2: AI Loading, 3: Review & Publish
  const [isGenerating, setIsGenerating] = useState(false);
  const [setupData, setSetupData] = useState({ title: '', classLevel: '5', subject: '', prompt: '', file: null });
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (message, type = 'success') => setToast({ show: true, message, type });

  // --- REAL API: AI QUESTION GENERATION ---
    const handleGenerateQuestions = async (e) => {
      e.preventDefault();
      setStep(2); // Loading screen
      setIsGenerating(true);

      const formData = new FormData();
      if (setupData.prompt) formData.append("prompt", setupData.prompt);
      if (setupData.file) formData.append("file", setupData.file);

      try {
        const response = await fetch("http://localhost:8080/api/teacher/quizzes/generate", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const rawJsonString = await response.text();
          const parsedQuestions = JSON.parse(rawJsonString);

          setGeneratedQuestions(parsedQuestions);
          setStep(3); // Move to review step
        } else {
          showToast("AI failed to generate quiz.", "error");
          setStep(1);
        }
      } catch (error) {
        showToast("Network error connecting to AI.", "error");
        setStep(1);
      } finally {
        setIsGenerating(false);
      }
    };

  // --- MOCK API: PUBLISH QUIZ ---
  const handlePublishQuiz = () => {
    const newQuiz = {
      id: Date.now(),
      title: setupData.title,
      classLevel: setupData.classLevel,
      subject: setupData.subject,
      questionCount: generatedQuestions.length,
      status: 'Active',
      date: 'Just now'
    };

    setQuizzes([newQuiz, ...quizzes]);
    setIsModalOpen(false);
    showToast("Quiz published successfully to students!", "success");

    // Reset State
    setStep(1);
    setSetupData({ title: '', classLevel: '5', subject: '', prompt: '', file: null });
    setGeneratedQuestions([]);
  };

  const removeQuestion = (id) => {
    setGeneratedQuestions(generatedQuestions.filter(q => q.id !== id));
  };

  return (
    <div className="animate-fade-in pb-24 sm:pb-10 relative max-w-5xl mx-auto">

      {/* --- TOAST NOTIFICATION --- */}
      <div className={`fixed top-4 right-4 z-[200] transition-all duration-300 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border-l-4 ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-500 text-red-800'}`}>
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <p className="font-bold text-sm">{toast.message}</p>
        </div>
      </div>

      {/* --- MOBILE FAB --- */}
      <button
        onClick={() => { setStep(1); setIsModalOpen(true); }}
        className="sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {/* ================================================================= */}
      {/* SMART QUIZ GENERATOR MODAL */}
      {/* ================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isGenerating && setIsModalOpen(false)}></div>

          <div className="relative bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-slide-up sm:animate-fade-in overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-5 sm:p-6 flex justify-between items-center text-white flex-shrink-0 shadow-sm z-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay"></div>
              <h3 className="text-lg sm:text-xl font-black flex items-center gap-2 relative z-10">
                <BrainCircuit className="w-6 h-6 text-indigo-200" /> AI Quiz Generator
              </h3>
              <button onClick={() => !isGenerating && setIsModalOpen(false)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative z-10">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-8 overflow-y-auto flex-1 bg-slate-50/50">

              {/* STEP 1: SETUP */}
              {step === 1 && (
                <form id="ai-quiz-form" onSubmit={handleGenerateQuestions} className="space-y-5 animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Quiz Title</label>
                      <input type="text" required value={setupData.title} onChange={e => setSetupData({...setupData, title: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-800 shadow-sm" placeholder="e.g. Science Mid-Term" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Class</label>
                        <input type="number" required value={setupData.classLevel} onChange={e => setSetupData({...setupData, classLevel: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-800 shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
                        <input type="text" required value={setupData.subject} onChange={e => setSetupData({...setupData, subject: e.target.value})} className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-gray-800 shadow-sm" placeholder="e.g. Biology" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60">
                    <label className="block text-[11px] font-black text-indigo-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4"/> AI Generation Source
                    </label>
                    <p className="text-xs font-medium text-gray-500 mb-4">Paste a topic description OR upload a PDF study guide. The AI will extract key concepts and build a test.</p>

                    <textarea required={!setupData.file} rows="3" value={setupData.prompt} onChange={e => setSetupData({...setupData, prompt: e.target.value})} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-800 resize-none shadow-sm mb-4" placeholder="e.g. Create 10 multiple choice questions about Cell Biology, focusing on organelle functions..." />

                    <div className="text-center font-black text-xs text-gray-400 uppercase tracking-widest mb-4">— OR —</div>

                    <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition-all ${setupData.file ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 bg-white hover:bg-indigo-50/50 hover:border-indigo-300'}`}>
                      <div className="flex items-center gap-3">
                        {setupData.file ? <FileText className="w-6 h-6 text-indigo-500" /> : <UploadCloud className="w-6 h-6 text-gray-400" />}
                        <span className={`text-sm font-bold ${setupData.file ? 'text-indigo-700' : 'text-gray-500'}`}>
                          {setupData.file ? setupData.file.name : 'Upload PDF Syllabus (Optional)'}
                        </span>
                      </div>
                      <input type="file" accept=".pdf,.txt" className="hidden" onChange={(e) => setSetupData({...setupData, file: e.target.files[0]})} />
                    </label>
                  </div>
                </form>
              )}

              {/* STEP 2: LOADING */}
              {step === 2 && (
                <div className="flex flex-col items-center justify-center py-16 animate-fade-in text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-50 rounded-full animate-pulse"></div>
                    <BrainCircuit className="w-20 h-20 text-indigo-600 relative z-10 animate-bounce" />
                  </div>
                  <h3 className="text-xl font-black text-gray-800 mt-6 mb-2">AI is analyzing context...</h3>
                  <p className="text-sm font-medium text-gray-500 max-w-xs">Generating relevant multiple-choice questions based on your syllabus.</p>
                </div>
              )}

              {/* STEP 3: REVIEW & PUBLISH */}
              {step === 3 && (
                <div className="animate-fade-in space-y-5">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-indigo-900">{setupData.title}</h4>
                      <p className="text-xs font-bold text-indigo-600 mt-0.5">Class {setupData.classLevel} • {setupData.subject} • {generatedQuestions.length} Questions generated</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {generatedQuestions.map((q, index) => (
                      <div key={q.id} className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm relative group">
                        <button onClick={() => removeQuestion(q.id)} className="absolute top-4 right-4 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <p className="font-bold text-gray-900 pr-8 mb-3"><span className="text-indigo-500 mr-1">{index + 1}.</span> {q.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, i) => (
                            <div key={i} className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                              i === q.correct ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-600'
                            }`}>
                              <span className="font-black mr-2 opacity-50">{['A', 'B', 'C', 'D'][i]}</span> {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fixed Action Footer */}
            <div className="p-4 sm:p-5 bg-white border-t border-gray-100 flex gap-3 flex-shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              {step === 1 && (
                <button form="ai-quiz-form" type="submit" className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black rounded-xl transition-all shadow-md shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5" /> Generate Questions
                </button>
              )}
              {step === 3 && (
                <>
                  <button onClick={() => setStep(1)} className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Regenerate</button>
                  <button onClick={handlePublishQuiz} className="flex-[2] py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-md shadow-blue-200 active:scale-95 flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" /> Publish to Students
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- PAGE HEADER --- */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2 sm:px-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <BrainCircuit className="w-7 h-7 text-indigo-600" /> Assessment Hub
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Generate AI quizzes or create manual tests for your classes.</p>
        </div>

        <button onClick={() => { setStep(1); setIsModalOpen(true); }} className="hidden sm:flex bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 active:scale-95 transition-all items-center justify-center gap-2 shadow-sm">
          <Sparkles className="w-4 h-4" /> AI Quiz Builder
        </button>
      </div>

      {/* --- ACTIVE QUIZZES LIST --- */}
      <div className="px-2 sm:px-0 space-y-4">
        {quizzes.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-[2rem] border-2 border-gray-200 border-dashed">
            <BrainCircuit className="w-14 h-14 text-gray-300 mx-auto mb-4" />
            <p className="font-black text-xl text-gray-800">No active quizzes</p>
            <p className="text-sm font-medium text-gray-400 mt-1">Use the AI Builder to generate your first test.</p>
          </div>
        ) : (
          quizzes.map(quiz => (
            <div key={quiz.id} className="bg-white p-5 sm:p-6 rounded-[1.5rem] border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md hover:border-indigo-200 group">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Active
                  </span>
                  <span className="text-xs font-bold text-gray-400">{quiz.date}</span>
                </div>
                <h4 className="text-lg font-black text-gray-900 group-hover:text-indigo-700 transition-colors">{quiz.title}</h4>
                <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" /> Class {quiz.classLevel} • {quiz.subject} • {quiz.questionCount} Questions
                </p>
              </div>

              <div className="w-full sm:w-auto flex gap-2">
                <button className="flex-1 sm:flex-none py-2.5 px-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl transition-colors">
                  View Results
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default QuizManager;