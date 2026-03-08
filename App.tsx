
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Locator from './components/Locator';
import Assistant from './components/Assistant';
import Schedule from './components/Schedule';
import AdminPanel from './components/AdminPanel';
import StationMap from './components/StationMap';
import Home from './components/Home';
import { MOCK_USERS, MOCK_STATIONS } from './mockData';
import { User, Station } from './types';
import { Train as TrainIcon, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest Passenger',
  role: 'PASSENGER',
  email: 'guest@railnavi.com'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>(GUEST_USER);
  const [activeStation, setActiveStation] = useState<Station>(MOCK_STATIONS[0]);
  const [currentView, setCurrentView] = useState('home');
  const [isDark, setIsDark] = useState(true);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Theme Toggle Effect
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const { t } = useTranslation();

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    setTimeout(() => {
      // Find user by email (User ID) AND password
      const foundUser = MOCK_USERS.find(u => u.email === loginEmail && u.password === loginPassword);

      if (foundUser) {
        setUser(foundUser);
        setCurrentView('dashboard');
      } else {
        setLoginError('Invalid User ID or Password');
      }
      setIsLoggingIn(false);
    }, 800);
  };

  const handleLogout = () => {
    setUser(GUEST_USER);
    setCurrentView('home');
    setLoginEmail('');
    setLoginPassword('');
  };

  const renderLoginView = () => (
    <div className="flex items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden p-10 border border-gray-200 dark:border-slate-800">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-900 p-4 rounded-full text-white mb-4 shadow-lg">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{t('common.official_staff_access')}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 text-center font-medium max-w-xs">{t('common.restricted_access')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">{t('common.government_id')}</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-700 transition-colors" size={18} />
              <input
                type="text"
                required
                placeholder="Enter ID"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded focus:ring-2 focus:ring-blue-800/10 focus:border-blue-700 transition-all text-sm text-gray-900 dark:text-white font-medium placeholder-gray-400"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">{t('common.secure_pin')}</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-700 transition-colors" size={18} />
              <input
                type="password"
                required
                placeholder="••••"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded focus:ring-2 focus:ring-blue-800/10 focus:border-blue-700 transition-all text-sm text-gray-900 dark:text-white font-medium placeholder-gray-400"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
          </div>

          {loginError && <p className="text-xs text-red-600 font-bold text-center bg-red-50 py-2 rounded border border-red-100">{loginError}</p>}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3.5 rounded shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
          >
            {isLoggingIn ? t('common.verifying') : t('common.login')}
            {!isLoggingIn && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 text-center">
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
            {t('common.protected_by')}
          </p>
        </div>
      </div>
    </div>
  );

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard activeStation={activeStation} onNavigate={() => setCurrentView('navigation')} />;
      case 'locator': return <Locator activeStation={activeStation} />;
      case 'navigation': return <Assistant activeStation={activeStation} />;
      case 'schedule': return <Schedule activeStation={activeStation} />;
      case 'map': return <StationMap station={activeStation} />;
      case 'admin': return <AdminPanel />;
      case 'login': return renderLoginView();
      default: return <Dashboard activeStation={activeStation} onNavigate={() => setCurrentView('navigation')} />;
    }
  };

  if (currentView === 'home') {
    return (
      <Home
        onExplore={() => setCurrentView('dashboard')}
        onOpenAssistant={() => setCurrentView('navigation')}
        toggleTheme={toggleTheme}
        isDark={isDark}
      />
    );
  }

  return (
    <Layout
      user={user}
      activeStation={activeStation}
      onStationChange={setActiveStation}
      onLogout={handleLogout}
      currentView={currentView}
      onViewChange={setCurrentView}
      toggleTheme={toggleTheme}
      isDark={isDark}
    >
      {renderView()}
    </Layout>
  );
};

export default App;
