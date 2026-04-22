import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

// Admin Imports
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminOverview from './pages/AdminDashboard/AdminOverview';
import AddTeacher from './pages/AdminDashboard/AddTeacher';
import TeacherDirectory from './pages/AdminDashboard/TeacherDirectory';
import StudentStats from './pages/AdminDashboard/StudentStats';
import AnnouncementManager from './pages/AdminDashboard/AnnouncementManager';

// Teacher Imports
import TeacherDashboard from './pages/TeacherDashboard/TeacherDashboard';
import TeacherOverview from './pages/TeacherDashboard/TeacherOverview'; // <-- 1. Import this!
import ManageStudents from './pages/TeacherDashboard/ManageStudents';
import StudyMaterials from './pages/TeacherDashboard/StudyMaterials';
import AddStudent from './pages/TeacherDashboard/AddStudent';
import ClassRoster from './pages/TeacherDashboard/ClassRoster';
import ClassNotices from './pages/TeacherDashboard/ClassNotices';
import StudentDashboard from './pages/StudentDashboard/StudentDashboard'
import QuizManager from './pages/TeacherDashboard/QuizManager';
import TakeQuiz from './pages/StudentDashboard/TakeQuiz'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Nested Routing for Admin Dashboard */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route index element={<AdminOverview />} />
          <Route path="add-teacher" element={<AddTeacher />} />
          <Route path="teacher-info" element={<TeacherDirectory />} />
          <Route path="student-stats" element={<StudentStats />} />
          <Route path="notices" element={<AnnouncementManager />} />
        </Route>

        {/* Nested Routing for Teacher Dashboard */}
        <Route path="/teacher-dashboard" element={<TeacherDashboard />}>
          {/* <-- 2. Tell React to load the Overview inside the Outlet by default! --> */}
          <Route index element={<TeacherOverview />} />
           <Route path="manage-students" element={<ManageStudents />} />
            <Route path="materials" element={<StudyMaterials />} />
            <Route path="class-roster" element={<ClassRoster />} />
            <Route path="add-student" element={<AddStudent />} />
                   <Route path="class-notices" element={<ClassNotices />} />
                   <Route path="quizzes" element={<QuizManager />} />


        </Route>
<Route path="/student-dashboard" element={<StudentDashboard/>}/>
<Route path="take-quiz" element={<TakeQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;