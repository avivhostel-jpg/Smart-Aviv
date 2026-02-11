
import React from 'react';
import { BRAND_SIGNATURE, BRAND_SIGNATURE_EN, APP_NAME, APP_SUBTITLE, METALLIC_GRADIENT } from '../constants';

const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-4 animate-fade-in relative overflow-hidden py-12">
      <div className="mb-10 relative group shrink-0">
        <div className="absolute -inset-16 bg-sky-400/10 rounded-full blur-[80px] opacity-40"></div>
        <div className={`relative h-28 w-28 bg-gradient-to-br ${METALLIC_GRADIENT} rounded-[2.5rem] flex items-center justify-center text-white font-black text-7xl shadow-2xl border-4 border-white/20`}>
          א
        </div>
      </div>
      
      <div className="space-y-6 mb-12 relative max-w-5xl">
        <div className="flex flex-col items-center gap-3">
           <span className="text-[11px] font-black text-sky-600 uppercase tracking-[0.4em] bg-sky-50 px-6 py-2 rounded-full border border-sky-100 shadow-sm mb-4 animate-pulse">
             Elite Clinical Management OS
           </span>
           <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1]">
            {APP_NAME}
          </h1>
        </div>
        <p className="text-2xl md:text-3xl font-bold text-sky-700 tracking-tight italic opacity-80">
          {APP_SUBTITLE}
        </p>
      </div>

      <button 
        onClick={onStart}
        className={`group relative inline-flex items-center justify-center px-16 py-7 font-black text-white transition-all duration-500 bg-gradient-to-br ${METALLIC_GRADIENT} rounded-[2.5rem] shadow-2xl hover:scale-105 active:scale-95 overflow-hidden`}
      >
        <span className="text-2xl relative z-10 tracking-tight">כניסה למערכת הבקרה</span>
        <svg className="w-6 h-6 mr-4 transition-transform group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      {/* Professional Staff Footer */}
      <div className="mt-16 w-full max-w-4xl bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/60 p-8 luxury-shadow">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 text-center">צוות ניהול ומקצועי מוביל</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           <div className="text-center">
             <div className="text-sm font-black text-slate-900 leading-tight">עמית שטיינברג</div>
             <div className="text-[10px] font-bold text-sky-600 uppercase">מנהל הדיור</div>
           </div>
           <div className="text-center">
             <div className="text-sm font-black text-slate-900 leading-tight">שרית דהן</div>
             <div className="text-[10px] font-bold text-sky-600 uppercase">מזכירה ניהולית</div>
           </div>
           <div className="text-center">
             <div className="text-sm font-black text-slate-900 leading-tight">מוחמד אבו עבשה</div>
             <div className="text-[10px] font-bold text-sky-600 uppercase">רכז דירות</div>
           </div>
           <div className="text-center">
             <div className="text-sm font-black text-slate-900 leading-tight">נעה נתיב</div>
             <div className="text-[10px] font-bold text-sky-600 uppercase">תומכת עו"ס</div>
           </div>
        </div>
      </div>

      <div className="mt-12 relative py-4 px-10 bg-white/60 backdrop-blur-md rounded-full border border-white luxury-shadow flex items-center gap-6">
          <div className="text-right border-l border-slate-200 pl-6">
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] mb-1 block">Architecture by</span>
             <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                {BRAND_SIGNATURE_EN}
             </h2>
          </div>
          <div className="text-right">
             <span className="text-[9px] font-black text-sky-600 uppercase tracking-[0.5em] mb-1 block">System Status</span>
             <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-800">Secure Cloud Synced</span>
             </div>
          </div>
      </div>
    </div>
  );
};

export default LandingPage;
