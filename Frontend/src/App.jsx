import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import ScenePage       from './pages/ScenePage';
import LeaderboardPage from './pages/LeaderboardPage';
import SplashPage      from './pages/SplashPage';
import DashboardPage   from './pages/DashboardPage';
import Navbar          from './components/Navbar';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to='/login' />;
}

function AppContent() {
  const [theme, setTheme] = useState(() => localStorage.getItem('bunnyTheme') || 'dark'); //manages dark/light theme
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bunnyTheme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const withNav = (el) => <><Navbar theme={theme} toggleTheme={toggleTheme} />{el}</>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/'            element={<SplashPage />} />
        <Route path='/login'       element={withNav(<LoginPage />)} />
        <Route path='/register'    element={withNav(<RegisterPage />)} />
        <Route path='/dashboard'   element={withNav(<PrivateRoute><DashboardPage /></PrivateRoute>)} />
        <Route path='/play'        element={withNav(<PrivateRoute><ScenePage /></PrivateRoute>)} />
        <Route path='/leaderboard' element={withNav(<LeaderboardPage />)} />
        <Route path='*'            element={<Navigate to={user ? '/dashboard' : '/'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}