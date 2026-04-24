import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, Loader2, BrainCircuit } from 'lucide-react';

const TakeQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // In a real app, you would fetch this by ID. We'll use mock data for the UI.
  const quiz = location.state?.quiz || {
    id: 1,
    title: "Science Mid-Term: Cell Biology",
    timeLimit: 15, // minutes
    questions: [
      { id: 101, text: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"] },
      { id: 102, text: "Which gas do plants absorb during photosynthesis?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"] },
      { id: 103, text: "What is the chemical symbol for water?", options: ["CO2", "O2", "H2O", "NaCl"] }
    ]
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Stores { questionId: "Selected Option Text" }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];
  const progress = Math.round(((currentIndex) / quiz.questions.length) * 100);
  const isLastQuestion = currentIndex === quiz.questions.length - 1;

  const handleOptionSelect = (optionText) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionText });
  };

  const handleNext = () => {
    if (!isLastQuestion) setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // --- SUBMIT TO AI GRADER ---
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      quizId: quiz.id,
      studentId: JSON.parse(localStorage.getItem('user')).id,
      submittedAnswers: answers
    };

    try {
      // Send answers to Spring Boot -> Spring Boot checks correct answers ->
      // Sends wrong answers to Gemini AI -> Returns Grade + AI Explanations
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/quizzes/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const gradedResults = await response.json();
        // Route the student directly to the QuizResults page with the AI data!
        navigate('/student-dashboard/quiz-results', { state: { results: gradedResults } });
      } else {
        alert("Failed to grade quiz.");
        setIsSubmitting(false);
      }
    } catch (error) {
      // Fallback for UI Testing if Spring Boot is offline
      setTimeout(() => {
        setIsSubmitting(false);
        // Navigate to the Results page we built earlier
        navigate('/student-dashboard/quiz-results');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-200">

      {/* 1. Header & Progress */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-4 flex items-center justify-between max-w-3xl mx-auto w-full">
          <button onClick={() => navigate(-1)} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{quiz.title}</p>
            <p className="font-bold text-indigo-600 flex items-center justify-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4" /> {quiz.timeLimit}:00
            </p>
          </div>
          <div className="w-9 h-9"></div> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100">
          <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </header>

      {/* 2. Question Area */}
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:py-12 w-full max-w-3xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 animate-slide-up">

          <div className="flex justify-between items-end mb-6">
            <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
              Question {currentIndex + 1} of {quiz.questions.length}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug mb-8">
            {currentQuestion.text}
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === option;
              return (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full flex items-center p-4 sm:p-5 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm'
                      : 'border-gray-100 bg-white hover:border-indigo-200 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mr-4 transition-colors ${
                    isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span className={`font-bold text-base sm:text-lg ${isSelected ? 'text-indigo-900' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>

        </div>
      </main>

      {/* 3. Bottom Action Bar */}
      <footer className="bg-white border-t border-gray-200 p-4 sm:p-6 fixed bottom-0 w-full z-40 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-6 py-4 rounded-2xl font-bold transition-colors ${
              currentIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
            }`}
          >
            Back
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !answers[currentQuestion.id]}
              className={`flex-1 py-4 rounded-2xl font-black text-white flex justify-center items-center gap-2 transition-all shadow-md ${
                answers[currentQuestion.id] ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-200 active:scale-95' : 'bg-gray-300 cursor-not-allowed shadow-none'
              }`}
            >
              {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
              {isSubmitting ? 'AI is Grading...' : 'Submit & Get Results'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              className={`flex-1 py-4 rounded-2xl font-black flex justify-center items-center transition-all ${
                answers[currentQuestion.id] ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next Question
            </button>
          )}
        </div>
      </footer>

    </div>
  );
};

export default TakeQuiz;