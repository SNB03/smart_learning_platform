import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { BarChart3, ExternalLink } from 'lucide-react';

const StudentStats = () => {
  const { t } = useOutletContext();
  const navigate = useNavigate();

  // Mock Structured Backend Data
  const statsData = [
    {
      classLevel: '5',
      divisions: [
        { name: 'A', classTeacher: { id: 1, name: 'Rahul Sharma' }, boys: 20, girls: 18 },
        { name: 'B', classTeacher: { id: 2, name: 'Aditi Deshmukh' }, boys: 19, girls: 20 }
      ]
    },
    {
      classLevel: '6',
      divisions: [
        { name: 'A', classTeacher: { id: 4, name: 'Priya Kapoor' }, boys: 22, girls: 21 }
      ]
    }
  ];

  const routeToTeacher = (teacherId) => {
    // Navigate to the Teacher Directory.
    // In a full app, you'd pass the ID in the URL (?teacherId=X) to highlight them!
    navigate('/admin-dashboard/teacher-info');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t.studentStats}</h2>
      </div>

      {statsData.map((cls, idx) => (
        <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-black text-gray-900 mb-6 border-b border-gray-200 pb-2">
            {t.classLabel} {cls.classLevel}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {cls.divisions.map((div, dIdx) => (
              <div key={dIdx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                {/* Header with Clickable Teacher Link */}
                <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
                  <span className="font-black text-lg">Div {div.name}</span>
                  <div className="text-right">
                    <span className="text-xs text-blue-200 uppercase block">{t.classTeacherLabel}</span>
                    <button
                      onClick={() => routeToTeacher(div.classTeacher.id)}
                      className="font-bold hover:text-amber-300 transition-colors flex items-center gap-1 group"
                    >
                      {div.classTeacher.name} <ExternalLink className="w-3 h-3 group-hover:scale-110" />
                    </button>
                  </div>
                </div>

                {/* Stats Body */}
                <div className="p-4 grid grid-cols-3 divide-x divide-gray-100 text-center">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">{t.boys}</p>
                    <p className="text-xl font-black text-blue-600 mt-1">{div.boys}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">{t.girls}</p>
                    <p className="text-xl font-black text-pink-500 mt-1">{div.girls}</p>
                  </div>
                  <div className="bg-gray-50">
                    <p className="text-xs font-bold text-gray-500 uppercase">{t.total}</p>
                    <p className="text-xl font-black text-gray-900 mt-1">{div.boys + div.girls}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentStats;