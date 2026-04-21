import React from 'react';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Header Section */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, Alex! 👋</h1>
          <p className="text-gray-500 mt-1">Class 10 • Smart School Academy</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
          🔥 5 Day Learning Streak
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content: Subjects */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Your Subjects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Subject Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 text-2xl mb-4">
                📐
              </div>
              <h3 className="font-bold text-lg mb-1">Advanced Mathematics</h3>
              <p className="text-sm text-gray-500 mb-4">Trigonometry & Calculus</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs text-right mt-2 text-gray-500">75% Completed</p>
            </div>

            {/* Subject Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-2xl mb-4">
                🧬
              </div>
              <h3 className="font-bold text-lg mb-1">Biology</h3>
              <p className="text-sm text-gray-500 mb-4">Genetics Chapter</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <p className="text-xs text-right mt-2 text-gray-500">40% Completed</p>
            </div>

          </div>
        </div>

        {/* Sidebar: AI Actions & Tasks */}
        <div className="space-y-6">

          {/* AI Task Card */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <h3 className="font-bold text-lg">AI Smart Review</h3>
            </div>
            <p className="text-sm text-purple-100 mb-6">
              Your teacher uploaded a new 45-minute Physics video. I generated a 3-minute Quick Review and a 5-question prep quiz for you.
            </p>
            <button className="w-full bg-white text-indigo-700 font-bold py-2 rounded-lg hover:bg-gray-50 transition">
              Start Quick Review
            </button>
          </div>

          {/* Up Next List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Pending Assignments</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Math Mid-Term</span>
                <span className="text-red-500 font-semibold">Due Tomorrow</span>
              </li>
              <li className="flex justify-between items-center text-sm">
                <span className="text-gray-600">History Essay</span>
                <span className="text-gray-400">Due in 3 days</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;