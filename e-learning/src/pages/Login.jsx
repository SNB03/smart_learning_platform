import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, KeyRound, User, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Admin Bypass for testing
    if (identifier === 'admin' && password === 'admin') {
      localStorage.setItem('user', JSON.stringify({ role: 'ADMIN', fullName: 'System Admin' }));
      navigate('/admin-dashboard');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));

        if (userData.role === 'ADMIN') navigate('/admin-dashboard');
        else if (userData.role === 'TEACHER') navigate('/teacher-dashboard');
        else if (userData.role === 'STUDENT') navigate('/student-dashboard');
      } else {
        const errText = await response.text();
        setError(errText || 'Invalid credentials');
      }
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-blue-200 relative overflow-hidden">

      {/* Decorative Background Elements for Desktop (Hidden on small mobile) */}
      <div className="hidden sm:block absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="hidden sm:block absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden relative z-10 animate-fade-in">

        <div className="bg-blue-600 p-6 sm:p-8 text-center relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:16px_16px]"></div>

          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30 relative z-10">
            <BookOpen className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight relative z-10">E-Learning Portal</h1>
          <p className="text-sm sm:text-base text-blue-100 font-medium mt-1 sm:mt-2 relative z-10">Welcome back! Please login.</p>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 rounded-r-lg flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-bold text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Email or Mobile Number</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text" required
                  value={identifier} onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or mobile"
                  className="w-full pl-11 pr-4 py-3.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base font-semibold text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 sm:mb-2">Password</label>
              <div className="relative group">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base font-semibold text-gray-800"
                />
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className={`w-full bg-blue-600 text-white font-bold py-3.5 sm:py-3.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 sm:mt-4 shadow-md shadow-blue-200 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;