
import React from 'react';
import { AppState } from '../types';
import { BRAND_SIGNATURE, METALLIC_GRADIENT } from '../constants';

interface NavbarProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  logout: () => void;
  syncStatus: 'synced' | 'syncing' | 'error';
}

const Navbar: React.FC<NavbarProps> = ({ state, setState, logout, syncStatus }) => {
  const isOwner = state.currentUser?.role === 'בעלים';

  return (
    <nav className="sticky top-0 z-[60] bg-white/80 backdrop-blur-3xl border-b border-slate-100 px-6 py-3">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setState(p => ({ ...p, view: 'dashboard', selectedHouseId: null, selectedResidentId: null }))}
            className={`h-10 w-10 rounded-xl bg-gradient-to-br ${METALLIC_GRADIENT} flex items-center justify-center text-white font-black text-2xl shadow-lg cursor-pointer hover:scale-105 transition-all border border-white/20`}
          >
            א
          </div>
          
          <div className="hidden md:flex flex-col text-right">
             <div className="flex items-center gap-2">
               <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest leading-none">Aviv Pro System</span>
               <div className={`h-1.5 w-1.5 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} title={syncStatus}></div>
             </div>
             <h2 className="text-base font-black text-slate-900 tracking-tighter leading-none mt-1">אביב בקהילה - מערך מגורים</h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {isOwner && (
            <div className="hidden lg:flex items-center gap-2 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100">
               <span className="text-xs">🔑</span>
               <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Admin Control Active</span>
            </div>
          )}

          <div className="flex items-center gap-4 bg-slate-50 px-4 py-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-right">
              <div className="text-[8px] font-black text-sky-600 leading-none uppercase tracking-widest mb-1">{state.currentUser?.role}</div>
              <div className="text-sm font-black text-slate-800 leading-none">{state.currentUser?.name}</div>
            </div>
            <button 
              onClick={logout}
              className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-slate-300 hover:text-rose-600 transition-all border border-slate-100 shadow-sm"
              title="התנתקות בטוחה"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
