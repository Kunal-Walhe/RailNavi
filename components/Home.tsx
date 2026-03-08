import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { MOCK_STATIONS } from '../mockData';

interface HomeProps {
    onExplore: () => void;
    onOpenAssistant: () => void;
}

const Home: React.FC<HomeProps> = ({ onExplore, onOpenAssistant }) => {
    const { t } = useTranslation();

    return (
        <div className="relative min-h-screen w-full overflow-hidden font-sans">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transform scale-105 animate-in fade-in duration-1000"
                style={{
                    backgroundImage: `url('/background.jpg')`,
                }}
            >
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-screen justify-center px-8 md:px-20 max-w-7xl mx-auto">

                {/* Header/Logo */}
                <div className="absolute top-8 left-8 md:left-20 flex items-center gap-4 animate-in slide-in-from-top-10 duration-700">

                    <div>
                        <p className="text-blue-200 text-xs font-bold uppercase tracking-[0.2em] mb-0.5 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{t('common.ministry_of_railways')}</p>
                        <h3 className="text-white text-xl font-bold tracking-tight drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">{t('common.railnavi_portal')}</h3>
                    </div>
                </div>

                {/* Hero Text */}
                <div className="space-y-8 max-w-3xl">
                    <div className="space-y-4 animate-in slide-in-from-left-10 duration-1000 delay-100">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm text-blue-200 text-xs font-bold uppercase tracking-wider mb-2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            {t('home.next_gen_intelligence')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1] drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
                            {t('home.experience_future')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{t('home.rail_travel')}</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-100 font-bold leading-relaxed max-w-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                            {t('home.real_time_tracking')}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <button
                            onClick={onExplore}
                            className="group relative bg-white text-blue-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-3 overflow-hidden"
                        >
                            <span className="relative z-10">{t('common.explore_system')}</span>
                            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>


                    </div>
                </div>

                {/* Footer Stats */}
                <div className="absolute bottom-10 left-0 right-0 px-8 md:px-20 border-t border-white/10 pt-8 flex flex-wrap gap-12 md:gap-24 animate-in fade-in duration-1000 delay-500">
                    {[
                        { label: t('home.active_stations'), value: MOCK_STATIONS.length.toString().padStart(2, '0') },
                        { label: t('home.daily_trains'), value: '120+' },
                        { label: 'Virtual Guide', value: 'AI Chat Bot', action: onOpenAssistant }
                    ].map((stat, i) => (
                        <div key={i} className={stat.action ? "cursor-pointer group flex gap-4 items-center" : ""} onClick={stat.action}>
                            <div>
                                <p className={`text-4xl font-black mb-1 transition-colors drop-shadow-[0_3px_3px_rgba(0,0,0,1)] ${stat.action ? 'text-blue-400 group-hover:text-blue-300' : 'text-white'}`}>{stat.value}</p>
                                <p className="text-sm font-bold text-blue-100 uppercase tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
