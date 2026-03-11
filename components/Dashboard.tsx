
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Station, Train } from '../types';
// Fixed error: Added Navigation2 to the lucide-react import list
import { Train as TrainIcon, Map, Users, Clock, AlertCircle, ArrowUpRight, Navigation2, Cloud, Droplets, Wind } from 'lucide-react';
import { fetchWeather } from '../services/weatherService';

interface DashboardProps {
  activeStation: Station;
  trains: Train[];
  onNavigate: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeStation, trains, onNavigate }) => {
  const { t } = useTranslation();
  const [weather, setWeather] = React.useState<any>(null);

  React.useEffect(() => {
    const loadWeather = async () => {
      if (activeStation && activeStation.city) {
        const data = await fetchWeather(activeStation.city);
        if (data) setWeather(data);
      }
    };
    loadWeather();
  }, [activeStation]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <span className="text-blue-700 dark:text-blue-400 uppercase">{activeStation.city}</span> {t('dashboard.division_control')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{t('dashboard.official_dashboard_for')} {activeStation.name}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {weather && (
            <div className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded shadow-sm text-sm font-semibold flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-blue-500">
                <Cloud size={16} /> {Math.round(weather.main.temp)}°C
              </span>
              <span className="w-px h-4 bg-gray-300 dark:bg-slate-600 block"></span>
              <span className="flex items-center gap-1 text-gray-400 capitalize text-xs">
                {weather.weather[0].description}
              </span>
            </div>
          )}
          <button className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded shadow-sm text-sm font-semibold transition-all flex items-center gap-2">
            <Clock size={16} />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })}
          </button>
          <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-sm text-sm font-semibold transition-all">
            {t('dashboard.generate_report')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('dashboard.active_trains'), value: '24', icon: TrainIcon, color: 'text-blue-700 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800' },
          { label: t('dashboard.total_platforms'), value: activeStation.platforms.length.toString(), icon: Map, color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800' },
          { label: t('dashboard.est_footfall'), value: '45.2k', icon: Users, color: 'text-orange-700 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-900/30', border: 'border-orange-200 dark:border-orange-800' },
          { label: t('dashboard.avg_delay'), value: `4 ${t('dashboard.mins')}`, icon: Clock, color: 'text-indigo-700 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/30', border: 'border-indigo-200 dark:border-indigo-800' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white dark:bg-slate-900 p-6 rounded border ${stat.border} shadow-sm flex items-center gap-4 hover:shadow-md transform hover:scale-[1.02] transition-all duration-300 cursor-default`}>
            <div className={`${stat.bg} ${stat.color} p-3 rounded-full border border-current border-opacity-10 dark:border-opacity-20`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Train Updates */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between bg-gray-50 dark:bg-slate-950/50">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide flex items-center gap-2">
              <TrainIcon size={16} className="text-blue-700 dark:text-blue-400" />
              {t('dashboard.live_train_status')}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{t('dashboard.live_feed')}</span>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-950 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-200 dark:border-slate-800">
                  <th className="px-6 py-3">{t('dashboard.train_no_name')}</th>
                  <th className="px-6 py-3">{t('dashboard.eta_etd')}</th>
                  <th className="px-6 py-3 text-center">{t('dashboard.platform')}</th>
                  <th className="px-6 py-3">{t('dashboard.current_status')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800/50">
                {trains.map((train) => (
                  <tr key={train.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <p className="font-bold text-blue-800 dark:text-blue-300">{train.number}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{train.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-gray-200">{train.arrivalTime}</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-500 uppercase">{t('dashboard.scheduled')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-block w-8 h-8 leading-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-bold border border-gray-200 dark:border-slate-700 text-xs">
                        {train.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {train.status === 'ON_TIME' ? (
                        <div className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded border border-emerald-200 dark:border-emerald-800/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {t('dashboard.on_time')}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-red-700 dark:text-red-400 text-xs font-bold bg-red-50 dark:bg-red-950/30 px-2.5 py-1 rounded border border-red-200 dark:border-red-800/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          {t('dashboard.delay')} {train.delayInMinutes}{t('dashboard.mins')}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950/50 text-center">
            <button className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline uppercase tracking-wide">
              {t('dashboard.view_all_trains')}
            </button>
          </div>
        </div>

        {/* Quick Notices & AI Promo */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded border border-gray-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <h2 className="text-sm font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2 uppercase tracking-wide">
              <AlertCircle size={18} className="text-orange-500" />
              {t('dashboard.official_notices')}
            </h2>
            <div className="space-y-4">
              <div className="p-3 rounded bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
                <p className="text-[10px] font-bold text-orange-700 dark:text-orange-400 uppercase mb-1">{t('dashboard.infrastructure')}</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{t('dashboard.pf_maintenance')}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.closed_repair')}</p>
              </div>
              <div className="p-3 rounded bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase mb-1">{t('dashboard.passenger_amenity')}</p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{t('dashboard.new_waiting_hall')}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t('dashboard.ac_waiting_hall')}</p>
              </div>
            </div>
          </div>


          <div className="bg-blue-800 text-white p-6 rounded shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white/10 p-2 rounded">
                  <Navigation2 size={20} className="text-white" />
                </div>
                <h2 className="text-lg font-bold">Need help?</h2>
              </div>
              <p className="text-blue-100 text-xs mb-6 leading-relaxed">
                Use AI assistance
              </p>
              <button
                onClick={onNavigate}
                className="w-full bg-white text-blue-900 py-3 rounded text-sm font-bold shadow hover:bg-gray-50 transition-colors"
              >
                {t('dashboard.start_navigation')}
              </button>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <TrainIcon size={150} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
