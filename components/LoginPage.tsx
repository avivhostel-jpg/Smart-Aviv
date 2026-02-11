
import React, { useState } from 'react';
import { StaffRole } from '../types';
import { ROLE_CODES, STAFF_ROLES, BRAND_SIGNATURE, APP_NAME, BRAND_TAGLINE } from '../constants';

interface LoginPageProps {
  onLogin: (name: string, role: StaffRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<StaffRole | ''>('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('אנא בחר איש צוות');
      return;
    }
    
    const roleFromCode = ROLE_CODES[code];
    if (roleFromCode === selectedRole) {
      onLogin(selectedRole, selectedRole);
    } else {
      setError('קוד גישה שגוי לתפקיד הנבחר');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 animate-fade-in pb-20">
      <div className="bg-white/90 backdrop-blur-2xl p-14 rounded-[4rem] border border-white luxury-shadow relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-sky-400 via-indigo-600 to-sky-400 animate-gradient-x"></div>
        
        <div className="mb-14">
          <div className="inline-block px-4 py-1 rounded-full bg-sky-50 border border-sky-100 mb-4">
             <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">Secure Access Protocol</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter drop-shadow-sm">{APP_NAME}</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-2 italic opacity-60">Management OS Integration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right ml-3">בחר איש צוות מורשה</label>
            <div className="relative">
              <select 
                required
                className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all font-black text-center appearance-none cursor-pointer text-slate-800 shadow-inner"
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as StaffRole)}
              >
                <option value="" disabled>--- בחר זהות מרשימה ---</option>
                {STAFF_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none text-sky-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right ml-3">קוד אימות מוצפן</label>
            <input 
              type="password" 
              required
              maxLength={4}
              className="w-full px-8 py-5 rounded-[2rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-4 focus:ring-sky-100 transition-all font-black text-center text-2xl tracking-[1.5em] text-indigo-900 shadow-inner"
              placeholder="••••"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            {error && (
              <div className="flex items-center justify-center gap-2 text-rose-500 text-xs font-black animate-bounce mt-2">
                 <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
                 {error}
              </div>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl hover:bg-sky-600 transition-all shadow-2xl shadow-slate-200 group flex items-center justify-center gap-4 active:scale-95"
          >
            <span>אימות זהות</span>
            <svg className="h-6 w-6 transition-all duration-500 group-hover:-translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M11 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-100">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">צוות מקצועי מורשה</h4>
           <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-600">
              <span>עמית שטיינברג - מנהל</span>
              <span>שרית דהן - מזכירה</span>
              <span>מוחמד אבו עבשה - רכז</span>
              <span>נעה נתיב - תומכת עו"ס</span>
           </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50">
          <div className="flex flex-col items-center">
             <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center mb-3">
                <svg className="h-5 w-5 text-slate-300" fill="currentColor" viewBox="0 0 20 20">
                   <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
             </div>
             <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em] mb-2">Licensed & Created by Professional Engineer</span>
             <h3 className="text-xl font-black text-slate-900 tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
                {BRAND_SIGNATURE}
             </h3>
             <p className="text-[8px] font-bold text-sky-400 mt-1 uppercase tracking-widest">{BRAND_TAGLINE}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
