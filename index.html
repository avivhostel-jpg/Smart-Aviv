
import React, { useState, useEffect } from 'react';
import { 
  AppState, 
  Resident, 
  ResidentReport, 
  TaskStatus, 
  StaffRole 
} from './types';
import { 
  HOUSES, 
  APP_NAME, 
  APP_SUBTITLE, 
  BRAND_SIGNATURE, 
  BRAND_SIGNATURE_EN,
  METALLIC_GRADIENT,
  STATUS_COLORS,
  STAFF_ROLES,
  ROLE_CODES,
  BRAND_TAGLINE,
  generateInitialResidents
} from './constants';

import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import HouseView from './components/HouseView';
import ResidentProfile from './components/ResidentProfile';
import GlobalTasksBoard from './components/GlobalTasksBoard';

const firebase = (window as any).firebase;
let db: any = null;

try {
  if (firebase && !firebase.apps.length) {
    firebase.initializeApp({
      apiKey: process.env.API_KEY || "aviv-pro-secure",
      authDomain: "aviv-pro.firebaseapp.com",
      projectId: "aviv-pro"
    });
  }
  db = firebase.firestore();
  db.enablePersistence().catch((err: any) => console.warn("Persistence Issue:", err.code));
} catch (e) {
  console.error("Firebase Error:", e);
}

const STORAGE_RESIDENTS = 'AVIV_PRO_RESIDENTS_V5';
const STORAGE_REPORTS = 'AVIV_PRO_REPORTS_V5';
const STORAGE_SESSION = 'AVIV_PRO_SESSION_V5';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_SESSION);
    return saved ? JSON.parse(saved) : { view: 'landing', selectedHouseId: null, selectedResidentId: null, currentUser: null, initialTaskFilter: 'הכל' };
  });

  const [residents, setResidents] = useState<Resident[]>(() => {
    const saved = localStorage.getItem(STORAGE_RESIDENTS);
    return saved ? JSON.parse(saved) : generateInitialResidents();
  });

  const [reports, setReports] = useState<ResidentReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_REPORTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error' | 'local'>('synced');

  useEffect(() => {
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem(STORAGE_RESIDENTS, JSON.stringify(residents));
  }, [residents]);

  useEffect(() => {
    if (!db) { setSyncStatus('local'); setLoading(false); return; }
    
    const initializeApp = async () => {
      setSyncStatus('syncing');
      try {
        const resSnap = await db.collection('residents').get();
        if (resSnap.empty) {
          console.log("Cloud is empty. Provisioning initial residents...");
          const initial = generateInitialResidents();
          const batch = db.batch();
          initial.forEach(r => {
            const { id, ...data } = r;
            batch.set(db.collection('residents').doc(id), data);
          });
          await batch.commit();
        }

        db.collection('residents').onSnapshot((snap: any) => {
          const list: Resident[] = [];
          snap.forEach((doc: any) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          if (list.length > 0) {
            setResidents(list);
          }
          setLoading(false);
          setSyncStatus('synced');
        }, (err: any) => setSyncStatus('local'));

        db.collection('reports').orderBy('timestamp', 'desc').onSnapshot((snap: any) => {
          const list: ResidentReport[] = [];
          snap.forEach((doc: any) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setReports(list);
        });

      } catch (e) {
        console.error("Initialization Failed:", e);
        setSyncStatus('local');
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleUpdateResident = async (updated: Resident) => {
    setResidents(prev => prev.map(r => r.id === updated.id ? updated : r));
    if (db) {
      try {
        const { id, ...data } = updated;
        await db.collection('residents').doc(id).set(data, { merge: true });
      } catch (e) {
        console.error("Cloud Sync Error:", e);
      }
    }
  };

  const handleAddResident = async (res: Omit<Resident, 'id' | 'attachments'>) => {
    const newId = `${res.houseName.substring(0,2).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newRes: Resident = { ...res, id: newId, attachments: [] };
    setResidents(prev => [...prev, newRes]);
    if (db) await db.collection('residents').doc(newId).set(newRes);
  };

  const handleAddReport = async (report: Omit<ResidentReport, 'id' | 'timestamp'>) => {
    const tempId = `REP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newReportLocal = { ...report, id: tempId, timestamp: Date.now() } as ResidentReport;
    setReports(prev => [newReportLocal, ...prev]);
    if (db) await db.collection('reports').doc(tempId).set(newReportLocal);
  };

  const handleUpdateReport = async (updated: ResidentReport) => {
    setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
    if (db) {
      const { id, ...data } = updated;
      await db.collection('reports').doc(id).set(data, { merge: true });
    }
  };

  const handleDeleteReport = async (id: string) => {
    const authRoles: StaffRole[] = ['בעלים', 'מנהל', 'עו"ס', 'רכז דירות', 'מזכירה מנהלית'];
    if (!state.currentUser || !authRoles.includes(state.currentUser.role)) {
      return alert('הרשאת מנהל/רכז/עו"ס נדרשת למחיקת תיעוד מהמערכת');
    }

    if (confirm('מחיקה מאובטחת: האם אתה בטוח שברצונך למחוק לצמיתות את הדיווח?')) {
      setReports(prev => prev.filter(r => r.id !== id));
      if (db) {
        try {
          await db.collection('reports').doc(id).delete();
        } catch (e) {
          console.error("Delete Error:", e);
        }
      }
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_SESSION);
    setState({ view: 'landing', selectedHouseId: null, selectedResidentId: null, currentUser: null });
  };

  if (loading && residents.length === 0) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0F172A] text-white">
        <div className="h-24 w-24 border-8 border-sky-500 border-t-transparent rounded-full animate-spin mb-10"></div>
        <h2 className="text-3xl font-black uppercase tracking-[0.5em] animate-pulse text-sky-400 text-center px-6">AVIV PRO | Clinical Data Restoration...</h2>
      </div>
    );
  }

  const currentRes = residents.find(r => r.id === state.selectedResidentId);

  return (
    <div className="min-h-screen flex flex-col font-['Assistant'] transition-all duration-700" dir="rtl">
      {state.view !== 'landing' && state.view !== 'login' && (
        <Navbar state={state} setState={setState} logout={logout} syncStatus={syncStatus as any} />
      )}

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {state.view === 'landing' && <LandingPage onStart={() => setState(p => ({ ...p, view: 'login' }))} />}
        {state.view === 'login' && <LoginPage onLogin={(n, r) => setState(p => ({ ...p, view: 'dashboard', currentUser: { name: n, role: r } }))} />}
        {state.view === 'dashboard' && (
          <Dashboard 
            houses={HOUSES} 
            reports={reports} 
            residents={residents}
            onSelectHouse={id => setState(p => ({ ...p, view: 'house', selectedHouseId: id }))}
            onViewAllTasks={f => setState(p => ({ ...p, view: 'tasks-board', initialTaskFilter: f }))}
            onSelectResident={id => setState(p => ({ ...p, view: 'resident', selectedResidentId: id }))}
          />
        )}
        {state.view === 'house' && state.selectedHouseId && (
          <HouseView 
            house={HOUSES[state.selectedHouseId]} 
            residents={residents.filter(r => r.houseName === HOUSES[state.selectedHouseId!].name)}
            reports={reports}
            onBack={() => setState(p => ({ ...p, view: 'dashboard', selectedHouseId: null }))}
            onSelectResident={id => setState(p => ({ ...p, view: 'resident', selectedResidentId: id }))}
            onAddResident={handleAddResident}
            onAddReport={handleAddReport}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleDeleteReport}
            currentUser={state.currentUser!}
          />
        )}
        {state.view === 'resident' && currentRes && (
          <ResidentProfile 
            resident={currentRes}
            reports={reports.filter(r => r.residentId === state.selectedResidentId)}
            onBack={() => setState(p => ({ ...p, view: 'house' }))}
            onAddReport={handleAddReport}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleDeleteReport}
            onUpdateResident={handleUpdateResident}
            currentUser={state.currentUser!}
          />
        )}
        {state.view === 'tasks-board' && (
          <GlobalTasksBoard 
            residents={residents}
            reports={reports}
            initialFilter={state.initialTaskFilter}
            onUpdateReport={handleUpdateReport}
            onDeleteReport={handleDeleteReport}
          />
        )}
      </main>

      <footer className="mt-auto py-12 bg-slate-900 text-white text-center border-t border-sky-900/50">
        <div className="container mx-auto px-6">
          <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.5em] mb-4 block italic">
            {BRAND_TAGLINE} • Architecture by {BRAND_SIGNATURE}
          </span>
          <div className="flex items-center justify-center gap-3">
             <div className={`h-2 w-2 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500 shadow-xl shadow-emerald-500/50' : 'bg-amber-500 animate-pulse'}`}></div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
               Secure Clinical Cloud Protocol: {syncStatus === 'synced' ? 'ACTIVE & PROTECTED' : 'SYNCHRONIZING...'}
             </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
