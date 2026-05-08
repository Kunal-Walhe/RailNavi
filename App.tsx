
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
import { MOCK_USERS, MOCK_STATIONS, MOCK_TRAINS, MOCK_TRAINS_BY_CITY } from './mockData';
import { User, Station, Train } from './types';
import { Lock, Mail, ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { fetchTrainsForCity } from './services/railApiService';
import { getNearestStation } from './services/geolocationService';

const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest Passenger',
  role: 'PASSENGER',
  email: 'guest@railnavi.com'
};



const parseTime = (timeStr: string): number => {
  if (!timeStr || timeStr === '--:--' || timeStr === 'First' || timeStr === 'Last') return Infinity;
  const match = timeStr.match(/(\d+)[:.](\d+)\s*(AM|PM)?/i);
  if (!match) return Infinity;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const computeDynamicStatus = (arrivalTime: string, departureTime: string, currentMins: number) => {
  const arrMins = parseTime(arrivalTime);
  const depMins = parseTime(departureTime);
  
  if (arrMins === Infinity || depMins === Infinity) {
    return { status: 'ON_TIME' as any, delay: 0, sortWeight: 99999 };
  }

  let timeToArr = arrMins - currentMins;
  let timeToDep = depMins - currentMins;

  // Initial midnight wrap (within 12h window)
  if (timeToArr < -12 * 60) timeToArr += 24 * 60;
  if (timeToDep < -12 * 60) timeToDep += 24 * 60;
  if (timeToArr > 12 * 60) timeToArr -= 24 * 60;
  if (timeToDep > 12 * 60) timeToDep -= 24 * 60;

  const hash = (arrMins * 17) % 100;
  let delay = 0;
  if (hash > 80) delay = (hash % 20) + 5; 
  
  let actualArrDiff = timeToArr + delay;
  let actualDepDiff = timeToDep + delay;

  let isNextDay = false;
  
  // ROLLING SCHEDULE: If departed > 150 mins ago (2.5 hrs), push to next operational cycle
  if (actualDepDiff < -150) {
    actualArrDiff += 24 * 60;
    actualDepDiff += 24 * 60;
    isNextDay = true;
  }

  let status: any = 'ON_TIME';
  let sortWeight = 0;

  if (actualDepDiff < 0) {
    status = 'DEPARTED';
    // recently departed move lower. Diff is negative (e.g. -10). The more negative, the further down.
    sortWeight = 5000 + Math.abs(actualDepDiff);
  } else if (actualArrDiff <= 30 && actualDepDiff >= 0) {
    status = 'BOARDING';
    sortWeight = 1000 + actualArrDiff; 
  } else if (actualArrDiff > 30 && actualArrDiff <= 120) {
    status = 'ARRIVING_SOON';
    sortWeight = 2000 + actualArrDiff;
  } else if (actualArrDiff > 120) {
    if (hash > 95) {
      status = 'RESCHEDULED';
      delay += 120;
      sortWeight = 4000 + actualArrDiff;
    } else if (delay > 0) {
      status = 'DELAYED';
      sortWeight = 3000 + actualArrDiff;
    } else {
      status = 'ON_TIME';
      sortWeight = 3000 + actualArrDiff;
    }
  }

  // Push next-day trains completely to the bottom
  if (isNextDay) sortWeight += 10000;

  return { status, delay, sortWeight };
};

const filterAndSortTrains = (trainList: Train[], now: Date) => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return trainList.map(train => {
    const { status, delay, sortWeight } = computeDynamicStatus(train.arrivalTime, train.departureTime, currentMinutes);
    return { ...train, status, delayInMinutes: delay, sortWeight };
  })
  .sort((a, b) => (a as any).sortWeight - (b as any).sortWeight);
};

const App: React.FC = () => {
  const [user, setUser] = useState<User>(GUEST_USER);
  const [stations, setStations] = useState<Station[]>(MOCK_STATIONS);
  const [rawTrains, setRawTrains] = useState<Train[]>([]);
  const [trains, setTrains] = useState<Train[]>([]);
  const [activeStationId, setActiveStationId] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLiveData, setIsLiveData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Geolocation States
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);
  const [locationStatusMsg, setLocationStatusMsg] = useState('📍 Detecting your nearest station...');

  // Data is now handled exclusively by the city-based effect below

  // Derive activeStation from stations to ensure updates from AdminPanel reflect everywhere
  const activeStation = stations.find(s => s.id === activeStationId) || stations[0] || {} as Station;

  const [currentView, setCurrentView] = useState('home');
  const [isDark, setIsDark] = useState(true);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Auto-Detect Location on Mount
  React.useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatusMsg('Location unsupported. Showing default city.');
      setActiveStationId(stations[0].id);
      setTimeout(() => setIsDetectingLocation(false), 2500);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = getNearestStation(latitude, longitude, stations);
        if (nearest) {
          setActiveStationId(nearest.id);
          setLocationStatusMsg(`🚉 Nearest station detected: ${nearest.code} (${nearest.city})`);
        } else {
          setLocationStatusMsg('Could not detect nearest station. Showing default.');
          setActiveStationId(stations[0].id);
        }
        setTimeout(() => setIsDetectingLocation(false), 3000);
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setLocationStatusMsg('Location access denied. Showing default city.');
        setActiveStationId(stations[0].id);
        setTimeout(() => setIsDetectingLocation(false), 2500);
      },
      { timeout: 8000 }
    );
  }, []); // Run once on mount

  // Auto-refresh Time every minute
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Update computed train list when rawTrains or time changes
  React.useEffect(() => {
    setTrains(filterAndSortTrains(rawTrains, currentTime));
  }, [rawTrains, currentTime]);

  // Fetch live trains when active station/city changes
  React.useEffect(() => {
    const loadLiveTrains = async () => {
      console.log(`[NETWORK] Starting fetch for city: ${activeStation.city}`);
      setIsLoading(true);
      
      try {
        if (!activeStation.city) {
          setIsLoading(false);
          return;
        }
        
        const responseData = await fetchTrainsForCity(activeStation.city);
        
        if (responseData && responseData.length > 0) {
          console.log(`[NETWORK] SUCCESS: Received ${responseData.length} trains from API`);
          
          const liveTrains: Train[] = responseData.map((apiResponse: any) => {
            const trainData = apiResponse.data;
            const trainNo = parseInt(trainData.train_no, 10);
            
            const arrivalTime = trainData.from_time || '--:--';
            const departureTime = trainData.to_time || '--:--';
            
            // Limit to valid platforms for the active station
            const maxPlatforms = activeStation.platforms?.length || 1;
            const assignedPlatform = (trainNo % maxPlatforms) + 1;

            return {
              id: `api_${trainData.train_no}_${Date.now()}_${Math.random()}`,
              number: trainData.train_no || 'N/A',
              name: trainData.train_name || 'Unknown Train',
              arrivalTime: arrivalTime,
              departureTime: departureTime,
              platform: assignedPlatform,
              status: 'ON_TIME',
              delayInMinutes: 0
            };
          });
          
          setRawTrains(liveTrains);
          setIsLiveData(true);
        } else {
          throw new Error("Empty response from API server");
        }
      } catch (err: any) {
        const errorMsg = err.message || "Connection failed";
        console.error(`[NETWORK] API FAILED: ${errorMsg}. Falling back to mock data.`);
        
        // Use fallback ONLY in catch block as requested
        const fallbackTrains = MOCK_TRAINS_BY_CITY[activeStation.city] || MOCK_TRAINS;
        setRawTrains(fallbackTrains);
        setIsLiveData(false);
      } finally {
        setIsLoading(false);
        console.log(`[NETWORK] Fetch sequence completed for ${activeStation.city}`);
      }
    };

    loadLiveTrains();
  }, [activeStation.city, activeStation.code]);

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
    <div className="flex items-center justify-center py-10 sm:py-20 px-4 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden p-6 sm:p-10 border border-gray-200 dark:border-slate-800">
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
      case 'dashboard': return <Dashboard activeStation={activeStation} trains={trains} onNavigate={() => setCurrentView('navigation')} onViewAllTrains={() => setCurrentView('schedule')} />;
      case 'locator': return <Locator activeStation={activeStation} />;
      case 'navigation': return <Assistant activeStation={activeStation} />;
      case 'schedule': return <Schedule activeStation={activeStation} trains={trains} isLiveData={isLiveData} isLoading={isLoading} />;
      case 'map': return <StationMap station={activeStation} />;
      case 'admin': return <AdminPanel stations={stations} setStations={setStations} trains={trains} setTrains={setTrains} />;
      case 'login': return renderLoginView();
      default: return <Dashboard activeStation={activeStation} trains={trains} onNavigate={() => setCurrentView('navigation')} onViewAllTrains={() => setCurrentView('schedule')} />;
    }
  };

  if (currentView === 'home') {
    return (
      <>
        {isDetectingLocation && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className={`p-2 rounded-full ${locationStatusMsg.includes('📍') ? 'bg-blue-500/20 text-blue-400 animate-pulse' : locationStatusMsg.includes('denied') ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              <MapPin size={18} />
            </div>
            <p className="text-sm font-semibold tracking-wide">{locationStatusMsg}</p>
          </div>
        )}
        <Home
          onExplore={() => setCurrentView('dashboard')}
          onOpenAssistant={() => setCurrentView('navigation')}
          toggleTheme={toggleTheme}
          isDark={isDark}
        />
      </>
    );
  }

  return (
    <>
      {isDetectingLocation && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className={`p-2 rounded-full ${locationStatusMsg.includes('📍') ? 'bg-blue-500/20 text-blue-400 animate-pulse' : locationStatusMsg.includes('denied') ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            <MapPin size={18} />
          </div>
          <p className="text-sm font-semibold tracking-wide">{locationStatusMsg}</p>
        </div>
      )}
      <Layout
        user={user}
        stations={stations}
        activeStation={activeStation}
        onStationChange={(s) => setActiveStationId(s.id)}
        onLogout={handleLogout}
        currentView={currentView}
        onViewChange={setCurrentView}
        toggleTheme={toggleTheme}
        isDark={isDark}
      >
        {renderView()}
      </Layout>
    </>
  );
};

export default App;
