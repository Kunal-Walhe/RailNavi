
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Station, Train } from '../types';
import { Search, RefreshCw, Clock, ArrowRight, Share2, Info, MapPin, Navigation } from 'lucide-react';

interface ScheduleProps {
  activeStation: Station;
  trains: Train[];
}

const Schedule: React.FC<ScheduleProps> = ({ activeStation, trains }) => {
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const filteredTrains = trains.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.number.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-2 text-[10px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 uppercase tracking-widest">
              <Navigation size={12} /> {activeStation.city} {t('schedule.division')}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('schedule.train_operations')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">{t('schedule.live_tracking')} {activeStation.name}.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-700 dark:group-focus-within:text-blue-400 transition-colors" size={16} />
            <input
              type="text"
              placeholder={t('schedule.search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded shadow-sm outline-none focus:ring-2 focus:ring-blue-800/10 focus:border-blue-700 dark:focus:border-blue-500 text-sm text-gray-900 dark:text-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={refreshData}
            className={`bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 p-2.5 rounded text-gray-500 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all shadow-sm ${isRefreshing ? 'animate-spin' : ''}`}
            title={t('schedule.refresh_feed')}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTrains.map((train) => (
          <div key={train.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 hover:scale-[1.01] transition-all duration-300 overflow-hidden flex flex-col md:flex-row group cursor-pointer relative">
            <div className={`w-2 md:w-2 ${train.status === 'ON_TIME' ? 'bg-emerald-500' : 'bg-red-500'}`} />

            {/* Info Section */}
            <div className="flex-1 p-5 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-full md:w-56 shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-slate-700 rounded text-[10px] font-bold uppercase tracking-wider">{train.number}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{train.name}</h3>
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-6 w-full md:border-l border-gray-100 dark:border-slate-800 md:pl-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-700/80 dark:text-blue-400">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t('schedule.arrival')}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{train.arrivalTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-700/80 dark:text-blue-400">
                    <ArrowRight size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t('schedule.departure')}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{train.departureTime}</p>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                  <div className="w-10 h-10 rounded border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 flex flex-col items-center justify-center">
                    <span className="text-[7px] uppercase font-bold text-gray-400">{t('schedule.pf')}</span>
                    <span className="text-lg font-bold text-gray-800 dark:text-gray-200 leading-none">{train.platform}</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">{t('schedule.status')}</p>
                    <p className={`text-xs font-bold ${train.status === 'ON_TIME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {train.status === 'ON_TIME' ? t('schedule.on_time') : `${t('schedule.delay')} ${train.delayInMinutes}M`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto flex items-center justify-between md:justify-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-slate-800">
                <div className="md:hidden">
                  <p className={`text-xs font-bold ${train.status === 'ON_TIME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {train.status === 'ON_TIME' ? t('schedule.on_time') : `${t('schedule.delay')} ${train.delayInMinutes}M`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all">
                    <Share2 size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all">
                    <Info size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
