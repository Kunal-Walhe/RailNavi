
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Station, ServiceType } from '../types';
import {
  MapPin,
  Navigation,
  Info,
  Layers,
  Activity,
  Search,
  Sparkles,
  CheckCircle2,
  Utensils,
  Ticket,
  CircleUser,
  HeartPulse,
  CreditCard,
  Clock,
  AlertTriangle,
  Armchair,
  Luggage,
  TrendingUp,
  AlertCircle,
  Cloud
} from 'lucide-react';
import { fetchWeather } from '../services/weatherService';

// Refined icon mapping for more appropriate and distinct visual representation
const serviceIcons: Record<string, React.ElementType> = {
  [ServiceType.FOOD]: Utensils,
  [ServiceType.RESTROOM]: CircleUser,
  [ServiceType.TICKET]: Ticket,
  [ServiceType.MEDICAL]: HeartPulse,
  [ServiceType.ATM]: CreditCard,
  [ServiceType.CLOAKROOM]: Luggage,
  [ServiceType.WAITING]: Armchair,
};

// Facility status configuration
type FacilityStatus = 'OPEN' | 'BUSY' | 'MAINTENANCE';
const statusConfig: Record<FacilityStatus, { label: string; color: string; bgColor: string; dotColor: string; icon: React.ElementType }> = {
  OPEN: { label: 'Available', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', dotColor: 'bg-emerald-500', icon: CheckCircle2 },
  BUSY: { label: 'Busy', color: 'text-amber-400', bgColor: 'bg-amber-500/10', dotColor: 'bg-amber-500', icon: Clock },
  MAINTENANCE: { label: 'Service', color: 'text-rose-400', bgColor: 'bg-rose-500/10', dotColor: 'bg-rose-500', icon: AlertTriangle },
};

interface StationMapProps {
  station: Station;
}

interface PlatformMetrics {
  hasAlert: boolean;
  trafficLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  busyCount: number;
  maintenanceCount: number;
}

const StationMap: React.FC<StationMapProps> = ({ station }) => {
  const { t } = useTranslation();
  const [selectedPlatform, setSelectedPlatform] = useState<number>(1);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [weather, setWeather] = useState<any>(null);

  // Real-time status state mapping facility IDs to their current status
  const [facilityStatuses, setFacilityStatuses] = useState<Record<string, FacilityStatus>>({});

  const selectedPlatformData = useMemo(() => {
    return station.platforms.find(p => p.number === selectedPlatform) || station.platforms[0] || { number: 1, facilities: [] };
  }, [station, selectedPlatform]);

  const platformNumbers = useMemo(() => {
    return station.platforms.map(p => p.number).sort((a, b) => a - b);
  }, [station]);

  // Derive platform-level metrics from current facility statuses
  const platformMetrics = useMemo(() => {
    const metrics: Record<number, PlatformMetrics> = {};

    station.platforms.forEach(platform => {
      const facilities = platform.facilities;
      const maintenanceCount = facilities.filter(f => facilityStatuses[f.id] === 'MAINTENANCE').length;
      const busyCount = facilities.filter(f => facilityStatuses[f.id] === 'BUSY').length;

      const busyRatio = facilities.length > 0 ? busyCount / facilities.length : 0;

      metrics[platform.number] = {
        hasAlert: maintenanceCount > 0,
        maintenanceCount,
        busyCount,
        trafficLevel: busyRatio > 0.6 ? 'HIGH' : (busyRatio > 0.2 ? 'MEDIUM' : 'LOW')
      };
    });

    return metrics;
  }, [station.platforms, facilityStatuses]);

  // Initial state setup and live simulation effect
  useEffect(() => {
    // Initial assignment
    const initialStatuses: Record<string, FacilityStatus> = {};
    station.platforms.flatMap(p => p.facilities).forEach(f => {
      const hash = f.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      initialStatuses[f.id] = hash % 7 === 0 ? 'MAINTENANCE' : (hash % 3 === 0 ? 'BUSY' : 'OPEN');
    });
    setFacilityStatuses(initialStatuses);

    const interval = setInterval(() => {
      setFacilityStatuses(prev => {
        const next = { ...prev };
        const ids = Object.keys(next);
        if (ids.length === 0) return prev;

        // Pick 1-2 random facilities to flip status
        const numToChange = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < numToChange; i++) {
          const randomId = ids[Math.floor(Math.random() * ids.length)];
          const current = next[randomId];

          // Weighted transition: Open -> Busy (common), Busy -> Open (common), Maintenance -> Open (rare)
          const rand = Math.random();
          if (current === 'OPEN') next[randomId] = rand > 0.8 ? 'MAINTENANCE' : 'BUSY';
          else if (current === 'BUSY') next[randomId] = rand > 0.9 ? 'MAINTENANCE' : 'OPEN';
          else if (current === 'MAINTENANCE') next[randomId] = 'OPEN';
        }
        return next;
      });
    }, 6000); // Update every 6 seconds

    return () => clearInterval(interval);
  }, [station]);

  useEffect(() => {
    const loadWeather = async () => {
      if (station && station.city) {
        const data = await fetchWeather(station.city);
        if (data) setWeather(data);
      }
    };
    loadWeather();
  }, [station]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>

          <div className="flex items-center gap-3 mb-3">
            <span className="bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">{t('station_map.spatial_view')}</span>
            <span className="text-gray-400 dark:text-slate-800">|</span>
            <span className="text-gray-500 dark:text-slate-400 text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin size={14} className="text-blue-500" /> {station.city} {t('station_map.metropolitan_hub')}
            </span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{station.name} {t('station_map.digital_twin')}</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium max-w-2xl leading-relaxed">
            {t('station_map.select_platform_instruction')}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {weather && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
              <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20">
                <Cloud size={20} className="text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">{t('station_map.weather') || 'Local Weather'}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(weather.main.temp)}°C</p>
                  <span className="text-[10px] text-gray-500 capitalize">({weather.weather[0].description})</span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
            <div className="bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <Activity size={20} className="text-emerald-500 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">{t('station_map.global_status')}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{t('station_map.active_node')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Schematic & Geographic Map View */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Interactive Schematic Layout */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Sparkles size={20} className="text-blue-500" />
                {t('station_map.terminal_schematic')}
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('station_map.active_alerts')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('station_map.high_traffic')}</span>
                </div>
              </div>
            </div>

            <div className="relative w-full h-[400px] bg-gray-50 dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-slate-800 flex flex-col p-8 gap-4 overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="h-px w-full bg-black dark:bg-slate-100 mb-6" />
                ))}
              </div>

              <div className="relative z-10 w-full h-full flex flex-col items-center gap-3 overflow-y-auto custom-scrollbar pr-2">
                {platformNumbers.map((num) => {
                  const metrics = platformMetrics[num];
                  const isSelected = selectedPlatform === num;

                  return (
                    <button
                      key={num}
                      onClick={() => setSelectedPlatform(num)}
                      className={`shrink-0 relative w-full max-w-2xl h-12 rounded-xl transition-all duration-300 flex items-center justify-between px-6 border group overflow-hidden ${isSelected
                        ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_25px_rgba(37,99,235,0.4)] scale-[1.03] z-20'
                        : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-500 hover:border-gray-300 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-black uppercase tracking-[0.2em]">{t('schedule.pf')} {num}</span>
                        {/* Traffic Indicator */}
                        {metrics.trafficLevel !== 'LOW' && (
                          <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-tighter ${metrics.trafficLevel === 'HIGH'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                            }`}>
                            <TrendingUp size={10} />
                            {metrics.trafficLevel} Flow
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-5">
                        {/* Maintenance Alert Indicator */}
                        {metrics.hasAlert && (
                          <div className="flex items-center gap-1.5 text-rose-500 animate-in fade-in zoom-in duration-300">
                            <AlertCircle size={16} className="animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">{t('station_map.incident')}</span>
                          </div>
                        )}

                        <div className="flex gap-1">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-300 dark:bg-slate-700'}`} />
                          ))}
                        </div>
                        {isSelected && (
                          <CheckCircle2 size={16} className="text-white animate-in zoom-in" />
                        )}
                      </div>

                      {/* Interaction Shimmer */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                      )}

                      {/* Background "Alert" Glow for non-selected platforms with maintenance */}
                      {!isSelected && metrics.hasAlert && (
                        <div className="absolute inset-0 bg-rose-500/5 pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Satellite Map Component */}
          <div className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-500 relative group ${isMapExpanded ? 'h-[600px]' : 'h-[350px]'}`}>
            <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
              <div className="bg-white/90 dark:bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xl">
                <p className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-1">{t('station_map.live_feed')}</p>
                <p className="text-xs font-black text-gray-900 dark:text-white font-mono tracking-tight">{t('station_map.coordinates').replace('LAT', 'LAT').replace('LNG', 'LNG')}: {station.coordinates.lat.toFixed(4)} {station.coordinates.lng.toFixed(4)}</p>
              </div>
            </div>

            <iframe
              title="Station Location"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${station.coordinates.lat},${station.coordinates.lng}&hl=en;z=17&output=embed`}
            ></iframe>

            <div className="absolute bottom-6 right-6 z-10 flex gap-3">
              <button
                onClick={() => setIsMapExpanded(!isMapExpanded)}
                className="bg-white/90 dark:bg-slate-950/80 backdrop-blur-md text-gray-700 dark:text-white p-4 rounded-2xl border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
              >
                <Layers size={20} />
              </button>
              <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-2xl flex items-center gap-3 hover:bg-blue-500 transition-all hover:scale-105 active:scale-95">
                <Navigation size={20} /> {t('station_map.launch_real_world')}
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Detail Panel */}
        <div className="lg:col-span-4 space-y-6 flex flex-col h-full">
          {/* Selected Platform Detail */}
          <div className="bg-white/80 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-2xl flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Info size={22} className="text-blue-500" />
                {t('station_map.platform_details')}
              </h2>
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 dark:bg-white text-gray-900 dark:text-slate-950 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                  {selectedPlatform}
                </div>
              </div>
            </div>

            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {/* Platform Quick Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                <div className={`p-4 rounded-2xl border transition-colors ${platformMetrics[selectedPlatform].hasAlert ? 'bg-rose-500/5 border-rose-500/20' : 'bg-gray-50 dark:bg-slate-950 border-gray-200 dark:border-slate-800'}`}>
                  <p className="text-[9px] font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-1">{t('station_map.safety_status')}</p>
                  <p className={`text-xs font-bold ${platformMetrics[selectedPlatform].hasAlert ? 'text-rose-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
                    {platformMetrics[selectedPlatform].hasAlert ? t('station_map.active_incident') : t('station_map.clear')}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-[9px] font-black text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-1">{t('station_map.density')}</p>
                  <p className={`text-xs font-bold ${platformMetrics[selectedPlatform].trafficLevel === 'HIGH' ? 'text-amber-500 dark:text-amber-400' : 'text-gray-400 dark:text-slate-200'}`}>
                    {platformMetrics[selectedPlatform].trafficLevel}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">{t('station_map.available_assets')}</p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">{t('station_map.live_sync')}</span>
                  </div>
                </div>

                {selectedPlatformData.facilities.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {selectedPlatformData.facilities.map(f => {
                      const FacilityIcon = serviceIcons[f.type] || Activity;
                      const status = facilityStatuses[f.id] || 'OPEN';
                      const config = statusConfig[status];

                      return (
                        <div key={f.id} className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl flex items-center justify-between group/item hover:border-blue-500/30 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-50 dark:bg-slate-950 rounded-xl flex items-center justify-center group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">
                              <FacilityIcon size={18} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">{f.name}</p>
                              <p className="text-[10px] text-gray-500 dark:text-slate-500 font-medium">{t(`services.${f.type}`)}</p>
                            </div>
                          </div>

                          {/* Real-time Status Indicator with localized transitions */}
                          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/5 ${config.bgColor} ${config.color} text-[9px] font-bold uppercase tracking-wider transition-all duration-500 animate-in fade-in zoom-in-95`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${status === 'OPEN' ? 'animate-pulse' : ''} transition-colors duration-500`} />
                            {config.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <div className="w-12 h-12 bg-gray-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 flex items-center justify-center mx-auto mb-4 text-gray-400 dark:text-slate-700">
                      <Search size={24} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-500 font-medium italic">{t('station_map.no_assets')}</p>
                  </div>
                )}
              </div>

              {/* Status Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mb-1">{t('station_map.signal_status')}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{t('station_map.nominal')}</p>
                </div>
                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl">
                  <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-1">{t('station_map.commuter_flow')}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{t('station_map.moderate')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Access Points Card */}
          <div className="bg-white/80 dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-2xl group hover:border-blue-500/30 transition-all">
            <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
              <Activity size={20} className="text-blue-500" />
              {t('station_map.access_hubs')}
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {station.entryPoints.map((entry, i) => (
                  <span key={i} className="text-[10px] font-bold bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-slate-300 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-default">
                    {entry}
                  </span>
                ))}
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest">{t('station_map.regional_hub')}</p>
                <p className="text-xs font-black text-blue-500 uppercase">{station.city} Central</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default StationMap;
