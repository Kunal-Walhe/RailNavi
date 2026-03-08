
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Station, ServiceType } from '../types';
import { Search, MapPin, Coffee, Utensils, Briefcase, HeartPulse, CreditCard, Info, Map as MapIcon, ArrowRight } from 'lucide-react';

const serviceIcons: Record<string, React.ElementType> = {
  [ServiceType.FOOD]: Utensils,
  [ServiceType.RESTROOM]: Coffee,
  [ServiceType.TICKET]: Briefcase,
  [ServiceType.MEDICAL]: HeartPulse,
  [ServiceType.ATM]: CreditCard,
  [ServiceType.CLOAKROOM]: Briefcase,
  [ServiceType.WAITING]: Info,
};

interface LocatorProps {
  activeStation: Station;
}

const Locator: React.FC<LocatorProps> = ({ activeStation }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<ServiceType | 'ALL'>('ALL');

  const allFacilities = activeStation.platforms.flatMap(p => p.facilities);

  const filteredFacilities = allFacilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `platform ${f.platform}`.includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || f.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t('locator.facility_hub')}</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">{t('locator.locate_amenities')} <b>{allFacilities.length}</b> {t('locator.terminal')} {activeStation.name}</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest shadow-lg">
          <MapPin size={14} className="text-blue-500" /> {activeStation.city} {t('locator.terminal')}
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-2xl space-y-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${activeFilter === 'ALL'
              ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20'
              : 'bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-slate-500 border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-300'
              }`}
          >
            {t('locator.all_categories')}
          </button>
          {Object.values(ServiceType).map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${activeFilter === type
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/20'
                : 'bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-slate-500 border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-300'
                }`}
            >
              {t(`services.${type}`)}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder={t('locator.search_placeholder')}
            className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 outline-none transition-all text-sm text-gray-900 dark:text-slate-100 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Facility Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map(facility => {
          const Icon = serviceIcons[facility.type] || Info;
          return (
            <div key={facility.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-7 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl hover:border-blue-600/30 hover:shadow-blue-900/10 transition-all group relative overflow-hidden cursor-pointer">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={120} className="dark:text-white text-black" />
              </div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="bg-gray-50 dark:bg-slate-950 text-gray-400 dark:text-slate-400 p-4 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all border border-gray-200 dark:border-slate-800 shadow-inner">
                  <Icon size={26} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-1.5">{t('locator.platform')}</span>
                  <div className="bg-gray-100 dark:bg-white text-gray-900 dark:text-slate-950 w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                    {facility.platform}
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{facility.name}</h3>
                <p className="text-[10px] font-bold text-gray-500 dark:text-slate-500 uppercase tracking-widest mb-6">{t(`services.${facility.type}`)}</p>

                <div className="flex items-start gap-3.5 p-5 bg-gray-50 dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 group-hover:border-gray-300 dark:group-hover:border-slate-700 transition-all">
                  <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-gray-600 dark:text-slate-400 leading-relaxed">{facility.locationDetails}</span>
                </div>

                <button className="w-full mt-8 flex items-center justify-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 py-4 bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-800 rounded-2xl hover:bg-blue-600 hover:text-white transition-all group-hover:shadow-lg">
                  <MapIcon size={16} />
                  {t('locator.start_path_navigation')} <ArrowRight size={14} className="ml-1 opacity-50" />
                </button>
              </div>
            </div>
          );
        })}
        {filteredFacilities.length === 0 && (
          <div className="col-span-full py-28 text-center bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-800 shadow-inner">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-950 text-slate-600 rounded-full mb-8 border border-slate-800">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white">{t('locator.no_matches')}</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">{t('locator.try_broadening')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Locator;
