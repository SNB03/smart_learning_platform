import React from 'react';
import { BrainCircuit, CheckCircle2, XCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuizResults = () => {
  const navigate = useNavigate();

  // MOCK DATA: A completed quiz with AI explanations
  const resultData = {
    title: "Science Mid-Term: Cell Biology",
    score: 1,
    total: 2,
    percentage: 50,
    questions: [
      {
        id: 1,
        question: "What is the powerhouse of the cell?",
        studentAnswer: "Mitochondria",
        correctAnswer: "Mitochondria",
        isCorrect: true,
      },
      {
        id: 2,
        question: "Which gas do plants absorb during photosynthesis?",
        studentAnswer: "Oxygen",
        correctAnswer: "Carbon Dioxide",
        isCorrect: false,
        aiExplanation: "Plants take in Carbon Dioxide (CO2) from the air to make their food, and they release Oxygen (O2) back into the air as a byproduct. Remember: Plants 'breathe in' what we breathe out!"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4 sticky top-0 z-30">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Quiz Results</p>
          <h2 className="font-black text-lg text-gray-900 leading-tight">{resultData.title}</h2>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-6">

        {/* Score Card */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-[2rem] shadow-xl text-center relative overflow-hidden text-white animate-fade-in">
          <div className="absolute top-[-20%] left-[-10%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

          <BrainCircuit className="w-12 h-12 text-blue-300 mx-auto mb-4 relative z-10" />
          <h3 className="text-[11px] font-black text-blue-200 uppercase tracking-widest relative z-10 mb-2">Final Score</h3>
          <div className="text-6xl font-black tracking-tighter relative z-10">
            {resultData.percentage}<span className="text-3xl text-blue-300 ml-1">%</span>
          </div>
          <p className="text-sm font-bold text-blue-200 mt-4 bg-white/10 inline-block px-4 py-1.5 rounded-full border border-white/20">
            {resultData.score} out of {resultData.total} correct
          </p>
        </div>

        {/* Questions Review */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest pl-2">Answer Review</h3>

          {resultData.questions.map((q, index) => (
            <div key={q.id} className="bg-white border border-gray-200 p-5 sm:p-6 rounded-[1.5rem] shadow-sm animate-slide-up">

              {/* Question Header */}
              <div className="flex gap-3 items-start mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  q.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}>
                  {q.isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">Question {index + 1}</p>
                  <p className="font-bold text-gray-900 text-lg leading-snug">{q.question}</p>
                </div>
              </div>

              {/* Answers Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-11 mb-4">
                <div className={`p-3.5 rounded-xl border ${q.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Your Answer</p>
                  <p className={`font-bold ${q.isCorrect ? 'text-emerald-800' : 'text-red-800'}`}>{q.studentAnswer}</p>
                </div>
                {!q.isCorrect && (
                  <div className="p-3.5 rounded-xl border bg-emerald-50 border-emerald-200">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Correct Answer</p>
                    <p className="font-bold text-emerald-800">{q.correctAnswer}</p>
                  </div>
                )}
              </div>

              {/* NEW: AI EXPLANATION FOR WRONG ANSWERS */}
              {!q.isCorrect && q.aiExplanation && (
                <div className="ml-11 bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 rounded-full blur-xl -translate-y-1/2 translate-x-1/4"></div>

                  <div className="flex gap-2.5 items-start relative z-10">
                    <Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-[11px] font-black text-indigo-800 uppercase tracking-widest mb-1.5">AI Tutor Explanation</h4>
                      <p className="text-sm font-medium text-indigo-900/80 leading-relaxed">
                        {q.aiExplanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default QuizResults;