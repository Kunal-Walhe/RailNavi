import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Save, PlusCircle, Shield, Database, Layout as LayoutIcon, X, ArrowLeft } from 'lucide-react';
import { Station, Train, ServiceType, Facility, Platform } from '../types';

interface AdminPanelProps {
  stations: Station[];
  setStations: React.Dispatch<React.SetStateAction<Station[]>>;
  trains: Train[];
  setTrains: React.Dispatch<React.SetStateAction<Train[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ stations, setStations, trains, setTrains }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'STATIONS' | 'TRAINS' | 'FACILITIES'>('STATIONS');

  // Station Editing
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Station>>({});

  // Spatial Management
  const [managingStationId, setManagingStationId] = useState<string | null>(null);
  const [editingFacilityId, setEditingFacilityId] = useState<string | null>(null);
  const [facEditForm, setFacEditForm] = useState<Partial<Facility>>({});

  // --- STATIONS ACTIONS ---
  const handleAddStation = () => {
    const newId = `s_new_${Date.now()}`;
    const newStation: Station = {
      id: newId,
      name: 'New Station',
      code: 'NEW',
      city: 'Unknown',
      coordinates: { lat: 0, lng: 0 },
      platforms: [],
      entryPoints: [],
      exitPoints: []
    };
    setStations(prev => [newStation, ...prev]);
    setEditingStationId(newId);
    setEditForm(newStation);
  };

  const handleDeleteStation = (id: string) => {
    if (confirm('Are you sure you want to delete this station?')) {
      setStations(prev => prev.filter(s => s.id !== id));
    }
  };

  const saveStationEdit = () => {
    if (editingStationId && editForm) {
      setStations(prev => prev.map(s => s.id === editingStationId ? { ...s, ...editForm } as Station : s));
    }
    setEditingStationId(null);
  };

  // --- PLATFORM ACTIONS ---
  const handleAddPlatform = (stationId: string) => {
    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        const newPlatformNumber = s.platforms.length > 0 ? Math.max(...s.platforms.map(p => p.number)) + 1 : 1;
        return {
          ...s,
          platforms: [...s.platforms, { number: newPlatformNumber, facilities: [] }]
        };
      }
      return s;
    }));
  };

  const handleDeletePlatform = (stationId: string, platformNum: number) => {
    if (confirm(`Delete Platform ${platformNum}?`)) {
      setStations(prev => prev.map(s => {
        if (s.id === stationId) {
          return { ...s, platforms: s.platforms.filter(p => p.number !== platformNum) };
        }
        return s;
      }));
    }
  };

  // --- FACILITY ACTIONS ---
  const handleAddFacility = (stationId: string, platformNum: number) => {
    const newFacId = `f_new_${Date.now()}`;
    const newFac: Facility = { id: newFacId, name: 'New Facility', type: ServiceType.OTHER, platform: platformNum, locationDetails: '' };
    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        return {
          ...s,
          platforms: s.platforms.map(p => p.number === platformNum ? { ...p, facilities: [...p.facilities, newFac] } : p)
        };
      }
      return s;
    }));
    setEditingFacilityId(newFacId);
    setFacEditForm(newFac);
  };

  const saveFacilityEdit = (stationId: string, platformNum: number) => {
    if (editingFacilityId && facEditForm) {
      setStations(prev => prev.map(s => {
        if (s.id === stationId) {
          return {
            ...s,
            platforms: s.platforms.map(p => p.number === platformNum ? {
              ...p,
              facilities: p.facilities.map(f => f.id === editingFacilityId ? { ...f, ...facEditForm } as Facility : f)
            } : p)
          };
        }
        return s;
      }));
    }
    setEditingFacilityId(null);
  };

  const handleDeleteFacility = (stationId: string, platformNum: number, facilityId: string) => {
    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        return {
          ...s,
          platforms: s.platforms.map(p => p.number === platformNum ? {
            ...p,
            facilities: p.facilities.filter(f => f.id !== facilityId)
          } : p)
        };
      }
      return s;
    }));
  };

  // --- TRAIN ACTIONS ---
  const handleTrainUpdate = (trainId: string, updates: Partial<Train>) => {
    setTrains(prev => prev.map(t => t.id === trainId ? { ...t, ...updates } : t));
  };


  const renderStationCard = (station: Station) => {
    const isEditing = editingStationId === station.id;

    if (isEditing) {
      return (
        <div key={station.id} className="p-8 border-2 border-blue-500 rounded-3xl bg-blue-50/50 dark:bg-slate-900/80 transition-all shadow-lg ring-4 ring-blue-500/20">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Edit Station</h3>
            <div className="flex gap-2">
              <button onClick={saveStationEdit} className="p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md">
                <Save size={18} />
              </button>
              <button onClick={() => setEditingStationId(null)} className="p-2 text-gray-500 hover:text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-all">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Name</label>
              <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-bold outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Code</label>
              <input type="text" value={editForm.code || ''} onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-bold outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">City</label>
              <input type="text" value={editForm.city || ''} onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))} className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-bold outline-none focus:border-blue-500" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lat</label>
                <input type="number" step="any" value={editForm.coordinates?.lat || 0} onChange={(e) => setEditForm(prev => ({ ...prev, coordinates: { lat: parseFloat(e.target.value) || 0, lng: prev.coordinates?.lng || 0 } }))} className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-bold outline-none focus:border-blue-500" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lng</label>
                <input type="number" step="any" value={editForm.coordinates?.lng || 0} onChange={(e) => setEditForm(prev => ({ ...prev, coordinates: { lat: prev.coordinates?.lat || 0, lng: parseFloat(e.target.value) || 0 } }))} className="w-full mt-1 px-3 py-2 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 font-bold outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={station.id} className="p-8 border border-gray-200 dark:border-slate-800 rounded-3xl bg-gray-50 dark:bg-slate-950/30 hover:border-blue-500/30 transition-all group flex flex-col justify-between">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">{station.name}</h3>
            <p className="text-blue-500 font-black text-xs mt-1 uppercase tracking-widest">{station.code} • {station.city}</p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => { setEditingStationId(station.id); setEditForm(station); }}
              className="p-2.5 text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-800">
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => handleDeleteStation(station.id)}
              className="p-2.5 text-gray-400 dark:text-slate-500 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-800">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
            <p className="text-[9px] text-gray-500 dark:text-slate-500 font-black uppercase tracking-widest mb-1">{t('admin.platforms')}</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">{station.platforms.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 sm:col-span-2 flex flex-col justify-center">
            <p className="text-[9px] text-gray-500 dark:text-slate-500 font-black uppercase tracking-widest mb-1">{t('admin.coordinates')}</p>
            <p className="text-sm font-bold text-gray-500 dark:text-slate-400 truncate">{station.coordinates.lat.toFixed(4)}, {station.coordinates.lng.toFixed(4)}</p>
          </div>
        </div>
        <div className="mt-auto space-y-3">
          <button onClick={() => setManagingStationId(station.id)} className="w-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/50 py-4 rounded-2xl transition-all shadow-sm">
            <LayoutIcon size={16} /> Manage Spatial Details
          </button>
        </div>
      </div>
    );
  };

  const renderSpatialManagement = () => {
    const station = stations.find(s => s.id === managingStationId);
    if (!station) return null;

    return (
      <div className="animate-in slide-in-from-right-8 duration-500">
        <div className="p-8 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-4">
            <button onClick={() => setManagingStationId(null)} className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:bg-gray-100 transition-all text-gray-600 dark:text-slate-400 shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <LayoutIcon size={20} className="text-emerald-500" /> {station.name} Spatial Data
              </h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{station.platforms.length} Platforms</p>
            </div>
          </div>
          <button onClick={() => handleAddPlatform(station.id)} className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20">
            <Plus size={18} /> Add Platform
          </button>
        </div>
        <div className="p-8 space-y-8">
          {station.platforms.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-slate-500 font-bold uppercase tracking-widest text-sm bg-gray-50 dark:bg-slate-950/30 rounded-3xl border border-dashed border-gray-300 dark:border-slate-800">
              No Platforms Added
            </div>
          ) : (
            station.platforms.sort((a, b) => a.number - b.number).map((platform, i) => (
              <div key={i} className="bg-white dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                <div className="bg-gray-100 dark:bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-slate-800">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Platform {platform.number}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleAddFacility(station.id, platform.number)} className="flex items-center gap-2 bg-white dark:bg-slate-950 text-blue-600 dark:text-blue-400 font-bold text-[10px] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-800 hover:bg-gray-50 uppercase tracking-wide">
                      <Plus size={14} /> Add Facility
                    </button>
                    <button onClick={() => handleDeletePlatform(station.id, platform.number)} className="p-1.5 text-gray-500 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-950 rounded-lg transition-all border border-transparent hover:border-gray-200 dark:hover:border-slate-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {platform.facilities.length === 0 ? (
                    <p className="text-xs text-center text-gray-500 dark:text-slate-500 font-bold uppercase tracking-wider py-4">No Facilities defined</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {platform.facilities.map(facility => (
                        editingFacilityId === facility.id ? (
                          <div key={facility.id} className="border-2 border-emerald-500 rounded-xl p-4 bg-emerald-50/50 dark:bg-slate-900 ring-2 ring-emerald-500/20">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Edit Facility</span>
                              <button onClick={() => saveFacilityEdit(station.id, platform.number)} className="bg-emerald-500 text-white p-1.5 rounded-lg shadow-sm hover:bg-emerald-600"><Save size={14} /></button>
                            </div>
                            <input type="text" value={facEditForm.name || ''} onChange={e => setFacEditForm(p => ({ ...p, name: e.target.value }))} placeholder="Facility Name" className="w-full mb-2 px-3 py-1.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded text-xs font-bold" />
                            <select value={facEditForm.type || ServiceType.OTHER} onChange={e => setFacEditForm(p => ({ ...p, type: e.target.value as ServiceType }))} className="w-full mb-2 px-3 py-1.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded text-xs font-bold">
                              {Object.values(ServiceType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <input type="text" value={facEditForm.locationDetails || ''} onChange={e => setFacEditForm(p => ({ ...p, locationDetails: e.target.value }))} placeholder="Location Details" className="w-full px-3 py-1.5 bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-700 rounded text-xs font-bold" />
                          </div>
                        ) : (
                          <div key={facility.id} className="border border-gray-200 dark:border-slate-800 rounded-xl p-4 flex justify-between items-start hover:border-emerald-500/50 transition-colors group bg-white dark:bg-slate-950/50">
                            <div>
                              <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{facility.name}</p>
                              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-0.5">{facility.type}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{facility.locationDetails}</p>
                            </div>
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingFacilityId(facility.id); setFacEditForm(facility); }} className="p-1.5 text-gray-500 hover:text-blue-500 bg-gray-50 dark:bg-slate-900 rounded-md border border-gray-200 dark:border-slate-700"><Edit2 size={14} /></button>
                              <button onClick={() => handleDeleteFacility(station.id, platform.number, facility.id)} className="p-1.5 text-gray-500 hover:text-rose-500 bg-gray-50 dark:bg-slate-900 rounded-md border border-gray-200 dark:border-slate-700"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
            {t('admin.terminal_control')} <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-rose-500/20">{t('admin.authorized_only')}</span>
          </h1>
          <p className="text-gray-500 dark:text-slate-400 mt-2 font-medium">{t('admin.modify_params')}</p>
        </div>
        {!managingStationId && (
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-gray-200 dark:border-slate-800 rounded-2xl p-1.5 flex flex-wrap gap-2 shadow-2xl">
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
        )}
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-[2.5rem] border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden relative">
        {managingStationId ? (
          renderSpatialManagement()
        ) : activeTab === 'STATIONS' && (
          <div>
            <div className="p-8 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-950/20">
              <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-3">
                <Database size={20} className="text-blue-500" /> {t('admin.infrastructure_nodes')}
              </h2>
              <button onClick={handleAddStation} className="flex items-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20">
                <Plus size={18} /> Provision Station
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {stations.map(renderStationCard)}
            </div>
          </div>
        )}

        {!managingStationId && activeTab === 'TRAINS' && (
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
                        <select
                          value={train.platform}
                          onChange={(e) => handleTrainUpdate(train.id, { platform: Number(e.target.value) })}
                          className="bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-slate-100 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 shadow-inner"
                        >
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
                        <select
                          value={train.status}
                          onChange={(e) => {
                            const status = e.target.value as 'ON_TIME' | 'DELAYED' | 'CANCELLED';
                            handleTrainUpdate(train.id, {
                              status,
                              delayInMinutes: status === 'DELAYED' ? 15 : undefined
                            });
                          }}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border outline-none ${train.status === 'ON_TIME' ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/5 text-rose-500 border-rose-500/20'
                            }`}
                        >
                          <option value="ON_TIME" className="bg-white text-emerald-600">ON TIME</option>
                          <option value="DELAYED" className="bg-white text-rose-600">DELAYED</option>
                          <option value="CANCELLED" className="bg-white text-slate-600">CANCELLED</option>
                        </select>
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

        {!managingStationId && activeTab === 'FACILITIES' && (
          <div className="p-10 md:p-24 text-center">
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
