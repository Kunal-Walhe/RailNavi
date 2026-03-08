
import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, UserRole, Station } from '../types';
import {
  Train as TrainIcon,
  MapPin,
  Search,
  User as UserIcon,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  Navigation2,
  LogIn,
  Map as MapIcon,
  ChevronDown,
  Bell,
  Sun,
  Moon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  stations: Station[];
  activeStation: Station;
  onStationChange: (station: Station) => void;
  onLogout: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  stations,
  activeStation,
  onStationChange,
  onLogout,
  currentView,
  onViewChange,
  toggleTheme,
  isDark
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isStationSelectorOpen, setIsStationSelectorOpen] = React.useState(false);
  const isGuest = user.id === 'guest';

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navItems = [
    { id: 'dashboard', label: t('common.dashboard'), icon: LayoutDashboard, roles: ['PASSENGER', 'ADMIN'] as UserRole[] },
    { id: 'schedule', label: t('common.schedule'), icon: TrainIcon, roles: ['PASSENGER', 'ADMIN'] as UserRole[] },
    { id: 'locator', label: t('common.locator'), icon: Search, roles: ['PASSENGER'] as UserRole[] },
    { id: 'map', label: t('common.station_map'), icon: MapIcon, roles: ['PASSENGER', 'ADMIN'] as UserRole[] },
    { id: 'navigation', label: t('common.ai_assistant'), icon: Navigation2, roles: ['PASSENGER'] as UserRole[] },
    { id: 'admin', label: t('common.admin_panel'), icon: Settings, roles: ['ADMIN'] as UserRole[] },
    { id: 'login', label: t('common.official_login'), icon: LogIn, roles: [] as UserRole[], showOnlyForGuest: true },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.showOnlyForGuest) return isGuest;
    return item.roles.includes(user.role);
  });

  return (
    <div className={`min-h-screen flex bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 overflow-hidden font-sans relative transition-colors duration-300`}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed opacity-30 dark:opacity-20 translate-x-[1] translate-y-[1]"
          style={{ backgroundImage: `url('/background.jpg')` }}
        />
        <div className="absolute inset-0 bg-white/50 dark:bg-slate-950/40 backdrop-blur-sm" />
      </div>

      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-30 shadow-sm`}>
        <div
          onClick={() => onViewChange('home')}
          className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 bg-blue-900 text-white cursor-pointer hover:bg-blue-800 transition-colors"
        >
          <div className="bg-white/10 p-2 rounded shrink-0">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/200px-Emblem_of_India.svg.png" alt="Emblem" className="w-6 h-6 object-contain grayscale brightness-200 invert" />
          </div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">{t('common.ministry_of_railways')}</span>
              <span className="text-lg font-bold tracking-tight">{t('common.railnavi_portal')}</span>
            </div>
          )}
        </div>

        <nav className="flex-1 mt-6 px-3 space-y-1">
          {filteredNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 border-l-4 ${currentView === item.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-700 text-blue-800 dark:text-blue-400 font-bold'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100 font-medium'
                }`}
            >
              <item.icon size={20} className={`${currentView === item.id ? 'text-blue-700 dark:text-blue-400' : 'text-gray-500 dark:text-gray-500'} shrink-0`} />
              {isSidebarOpen && <span className="text-sm truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 flex items-center justify-center shrink-0 text-gray-400">
                <UserIcon size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 uppercase">{user.role}</p>
              </div>
              {!isGuest && (
                <button
                  onClick={onLogout}
                  className="text-gray-500 hover:text-red-600 p-2 hover:bg-red-50 rounded transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center">
                <UserIcon size={16} className="text-gray-500" />
              </div>
              {!isGuest && (
                <button onClick={onLogout} className="text-gray-400 hover:text-red-500">
                  <LogOut size={18} />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10">
        <header className="bg-white dark:bg-slate-900 h-14 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all"
            >
              <Menu size={20} />
            </button>

            {/* Station Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsStationSelectorOpen(!isStationSelectorOpen)}
                className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-4 py-2 rounded text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
              >
                <MapPin size={16} className="text-blue-700" />
                <span className="text-sm font-bold uppercase tracking-wide">{activeStation.name}</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${isStationSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {isStationSelectorOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsStationSelectorOpen(false)}></div>
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded shadow-lg z-20 overflow-hidden">
                    <div className="bg-gray-50 dark:bg-slate-950 px-4 py-2 border-b border-gray-200 dark:border-slate-800 text-xs font-bold text-gray-500 uppercase">
                      {t('common.select_junction')}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {stations.map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            onStationChange(s);
                            setIsStationSelectorOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all ${activeStation.id === s.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-bold ${activeStation.id === s.id ? 'text-blue-800 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                              {s.name}
                            </span>
                            <span className="text-xs font-mono bg-gray-100 dark:bg-slate-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">{s.code}</span>
                          </div>
                          <span className="text-xs text-gray-500 mt-1 block">{s.city} Division</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png" alt="Flag" className="h-4 shadow-sm border border-gray-200 dark:border-slate-700" />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400">GOI</span>
            </div>

            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-200 dark:hover:bg-slate-700 transition"
            >
              {i18n.language === 'en' ? 'HI' : 'EN'}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border border-white dark:border-slate-900"></span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
