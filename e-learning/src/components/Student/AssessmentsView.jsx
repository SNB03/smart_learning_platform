import React, { useState } from 'react';
import { BrainCircuit, Clock, CheckCircle2, ChevronRight, PlayCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AssessmentsView = ({ quizzes }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('pending'); // 'pending' or 'completed'

  const pendingQuizzes = quizzes.filter(q => q.status === 'pending');
  const completedQuizzes = quizzes.filter(q => q.status === 'completed');

  const displayedQuizzes = filter === 'pending' ? pendingQuizzes : completedQuizzes;

  const handleStartQuiz = (quiz) => {
    // Navigate to the TakeQuiz route and pass the quiz data in the state!
    navigate('/student-dashboard/take-quiz', { state: { quiz } });
  };

  const handleViewResults = (quiz) => {
    // Navigate to the QuizResults route
    navigate('/student-dashboard/quiz-results', { state: { results: quiz } });
  };

  return (
    <div className="animate-fade-in space-y-6">

      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-2">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Quizzes & Assessments</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Test your knowledge and review AI feedback.</p>
        </div>

        <div className="flex bg-slate-200/50 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Pending {pendingQuizzes.length > 0 && <span className="ml-1 bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px]">{pendingQuizzes.length}</span>}
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'completed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Quiz List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {displayedQuizzes.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-[2rem] border border-slate-200 border-dashed">
            <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
            <p className="font-bold text-slate-600 text-lg">You're all caught up!</p>
            <p className="text-sm text-slate-400 mt-1">No {filter} quizzes at the moment.</p>
          </div>
        ) : (
          displayedQuizzes.map(quiz => (
            <div key={quiz.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md hover:border-indigo-200 transition-all group">

              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${filter === 'pending' ? 'bg-indigo-50 text-indigo-500 border border-indigo-100' : 'bg-emerald-50 text-emerald-500 border border-emerald-100'}`}>
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  {filter === 'pending' ? (
                    <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md uppercase tracking-widest border border-amber-100">
                      <AlertCircle className="w-3 h-3"/> Due {quiz.dueDate}
                    </span>
                  ) : (
                    <span className="text-xl font-black text-slate-800">
                      {quiz.percentage}%
                    </span>
                  )}
                </div>

                <h4 className="font-black text-slate-800 text-base mb-1.5 leading-snug line-clamp-2">
                  {quiz.title}
                </h4>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md">
                    {quiz.subject}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {quiz.timeLimit} mins
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {filter === 'pending' ? (
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-indigo-200"
                >
                  <PlayCircle className="w-5 h-5" /> Start Quiz
                </button>
              ) : (
                <button
                  onClick={() => handleViewResults(quiz)}
                  className="w-full py-3.5 bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  View AI Feedback <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AssessmentsView;