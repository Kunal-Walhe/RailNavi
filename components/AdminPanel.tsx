
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_STATIONS, MOCK_TRAINS } from '../mockData';
import { Plus, Edit2, Trash2, Save, PlusCircle, Shield, Database, Layout as LayoutIcon } from 'lucide-react';
import { Station, Train } from '../types';

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const [stations] = useState<Station[]>(MOCK_STATIONS);
  const [trains] = useState<Train[]>(MOCK_TRAINS);
  const [activeTab, setActiveTab] = useState<'STATIONS' | 'TRAINS' | 'FACILITIES'>('STATIONS');

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>

          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
            {t('admin.terminal_control')} <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-rose-500/20">{t('admin.authorized_only')}</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">{t('admin.modify_params')}</p>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 rounded-2xl p-1.5 flex shadow-2xl">
          {(['STATIONS', 'TRAINS', 'FACILITIES'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-gray-500 dark:text-slate-500 hover:text-gray-800 dark:hover:text-slate-300'
                }`}
            >
              {t(`admin.${tab.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {activeTab === 'STATIONS' && (
          <div>
            <div className="p-8 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-950/20">
              <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-3">
                <Database size={20} className="text-blue-500" /> {t('admin.infrastructure_nodes')}
              </h2>
              <button className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20">
                <Plus size={18} /> {t('admin.provision_station')}
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {stations.map(station => (
                <div key={station.id} className="p-8 border border-gray-200 dark:border-slate-800 rounded-3xl bg-gray-50 dark:bg-slate-950/30 hover:border-blue-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">{station.name}</h3>
                      <p className="text-blue-500 font-black text-xs mt-1 uppercase tracking-widest">{station.code}</p>
                    </div>
                    <div className="flex gap-2.5">
                      <button className="p-2.5 text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-800">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2.5 text-gray-400 dark:text-slate-500 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-800">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
                      <p className="text-[9px] text-gray-500 dark:text-slate-500 font-black uppercase tracking-widest mb-1">{t('admin.platforms')}</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">{station.platforms.length}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 col-span-2">
                      <p className="text-[9px] text-gray-500 dark:text-slate-500 font-black uppercase tracking-widest mb-1">{t('admin.coordinates')}</p>
                      <p className="text-sm font-bold text-gray-500 dark:text-slate-400 truncate">{station.coordinates.lat.toFixed(4)}, {station.coordinates.lng.toFixed(4)}</p>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800 py-4 rounded-2xl transition-all">
                    <LayoutIcon size={16} /> {t('admin.manage_spatial')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'TRAINS' && (
          <div>
            <div className="p-8 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-950/20">
              <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-3">
                <Shield size={20} className="text-emerald-500" /> {t('admin.operational_matrix')}
              </h2>
              <button className="flex items-center gap-3 bg-white text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl">
                <PlusCircle size={18} /> {t('admin.add_movement')}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-slate-950/50 text-gray-500 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-200 dark:border-slate-800">
                  <tr>
                    <th className="px-8 py-5">{t('admin.vehicle_id')}</th>
                    <th className="px-8 py-5">{t('admin.track_assign')}</th>
                    <th className="px-8 py-5">{t('admin.schedule')}</th>
                    <th className="px-8 py-5">{t('admin.status_override')}</th>
                    <th className="px-8 py-5">{t('admin.commits')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-800 text-sm">
                  {trains.map(train => (
                    <tr key={train.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 group transition-all">
                      <td className="px-8 py-6">
                        <span className="font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{train.number}</span>
                        <p className="text-xs text-gray-500 dark:text-slate-500 font-medium">{train.name}</p>
                      </td>
                      <td className="px-8 py-6">
                        <select defaultValue={train.platform} className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 shadow-inner">
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{t('locator.platform')} {num}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-200">{train.arrivalTime}</span>
                          <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">{t('admin.estimated')}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${train.status === 'ON_TIME' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/5 text-rose-500 border-rose-500/20'
                          }`}>
                          {train.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex gap-1.5">
                          <button className="p-3 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl transition-all border border-slate-800 hover:border-blue-600"><Save size={18} /></button>
                          <button className="p-3 text-slate-500 hover:text-rose-500 hover:bg-slate-950 rounded-xl transition-all border border-slate-800 hover:border-rose-900/50"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'FACILITIES' && (
          <div className="p-24 text-center">
            <div className="w-24 h-24 bg-slate-950 border border-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Plus size={40} className="text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">{t('admin.provision_amenity')}</h3>
            <p className="max-w-md mx-auto mt-4 text-slate-500 font-medium leading-relaxed">{t('admin.map_new_units')}</p>
            <button className="mt-10 bg-white text-slate-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-2xl active:scale-95">
              {t('admin.launch_provisioning')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
