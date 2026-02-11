
import React from 'react';
import { House, ResidentReport, TaskStatus, Resident } from '../types';
import { APP_SUBTITLE, GOLD_GRADIENT, METALLIC_GRADIENT, BRAND_SIGNATURE, BRAND_SIGNATURE_EN } from '../constants';

interface DashboardProps {
  houses: Record<string, House>;
  reports: ResidentReport[];
  residents: Resident[];
  onSelectHouse: (id: string) => void;
  onViewAllTasks: (filter: string) => void;
  onSelectResident: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ houses, reports, residents, onSelectHouse, onViewAllTasks, onSelectResident }) => {
  const openTasks = reports.filter(r => r.status === TaskStatus.OPEN);
  const inProgressTasks = reports.filter(r => r.status === TaskStatus.IN_PROGRESS);
  const completedTasks = reports.filter(r => r.status === TaskStatus.COMPLETED);

  const exportPerformanceReport = () => {
    try {
      const headers = ['תאריך', 'בית', 'שם דייר', 'מהות ההתערבות', 'סטטוס', 'צוות מדווח', 'תפקיד', 'פירוט המקרה', 'פעולות שננקטו', 'מסקנות ולקחים', 'הערות נוספות'];
      const rows = reports.map(r => {
        const res = residents.find(rs => rs.id === r.residentId);
        const name = res ? `${res.firstName} ${res.lastName}` : 'לא ידוע';
        return [
          r.date, 
          r.houseName, 
          name, 
          `"${r.essence.replace(/"/g, '""')}"`, 
          r.status, 
          r.staffName, 
          r.staffRole, 
          `"${(r.caseDetails || '').replace(/"/g, '""')}"`, 
          `"${(r.actionsTaken || '').replace(/"/g, '""')}"`, 
          `"${(r.conclusions || '').replace(/"/g, '""')}"`,
          `"${(r.notes || '').replace(/"/g, '""')}"`
        ];
      });

      const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `דוח_ביצועים_אביב_PRO_${new Date().toLocaleDateString('he-IL').replace(/\./g, '-')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      alert("שגיאה בהפקת הדוח. וודא שהנתונים תקינים ונסה שוב.");
    }
  };

  return (
    <div className="animate-fade-in space-y-12 max-w-7xl mx-auto pb-20">
      <header className={`relative bg-navy-gradient p-14 rounded-[5rem] border border-white/10 shadow-2xl overflow-hidden`}>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12 text-white text-right">
          <div className="text-center lg:text-right">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-4">מרכז שליטה פנורמי</h2>
            <p className="text-sky-300 font-bold text-xl opacity-90">{APP_SUBTITLE}</p>
            
            <div className="mt-10 flex items-center gap-5 bg-white/5 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/5 w-fit mx-auto lg:mr-0 shadow-2xl">
               <div className="h-10 w-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 text-xl">⚡</div>
               <div className="text-right">
                  <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest block leading-none mb-1.5">Developed & Managed By</span>
                  <span className="text-base font-black text-white italic">{BRAND_SIGNATURE}</span>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-auto">
            <div onClick={() => onViewAllTasks('הכל')} className="bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10 text-center cursor-pointer hover:bg-white/10 transition-all shadow-2xl group">
               <div className="text-5xl font-black group-hover:scale-110 transition-transform">{reports.length}</div>
               <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">סה"כ תיעודים</div>
            </div>
            <div onClick={() => onViewAllTasks(TaskStatus.OPEN)} className="bg-rose-500/10 backdrop-blur-xl p-10 rounded-[3rem] border border-rose-500/20 text-center cursor-pointer hover:bg-rose-500/20 transition-all shadow-2xl group">
               <div className="text-5xl font-black text-rose-500 group-hover:scale-110 transition-transform">{openTasks.length}</div>
               <div className="text-[11px] font-black text-rose-300 uppercase tracking-[0.2em] mt-2">משימות פתוחות</div>
            </div>
            <div onClick={() => onViewAllTasks(TaskStatus.IN_PROGRESS)} className="bg-amber-500/10 backdrop-blur-xl p-10 rounded-[3rem] border border-amber-500/20 text-center cursor-pointer hover:bg-amber-500/20 transition-all shadow-2xl group">
               <div className="text-5xl font-black text-amber-500 group-hover:scale-110 transition-transform">{inProgressTasks.length}</div>
               <div className="text-[11px] font-black text-amber-300 uppercase tracking-[0.2em] mt-2">בטיפול פעיל</div>
            </div>
            <div onClick={() => onViewAllTasks(TaskStatus.COMPLETED)} className={`bg-gradient-to-br ${GOLD_GRADIENT} p-10 rounded-[3rem] text-center shadow-2xl cursor-pointer hover:scale-110 transition-all group`}>
               <div className="text-5xl font-black text-white group-hover:scale-110 transition-transform">{completedTasks.length}</div>
               <div className="text-[11px] font-black text-white/90 uppercase tracking-[0.2em] mt-2">משימות שנסגרו</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {Object.values(houses).map((house: House) => (
          <div 
            key={house.id}
            onClick={() => onSelectHouse(house.id)}
            className="group bg-white p-12 rounded-[4rem] luxury-shadow hover:shadow-2xl hover:scale-105 transition-all cursor-pointer text-center relative overflow-hidden border border-sky-50"
          >
            <div className={`absolute top-0 right-0 h-2 w-full ${house.color}`}></div>
            <div className="text-8xl mb-8 group-hover:rotate-12 transition-transform duration-500">{house.icon}</div>
            <h3 className="text-3xl font-black text-slate-900">בית {house.name}</h3>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic opacity-70">{house.location}</p>
            <div className="mt-10 pt-8 border-t border-slate-50 flex justify-center items-center gap-3">
               <span className="text-3xl font-black text-slate-800">{residents.filter(r => r.houseName === house.name).length}</span>
               <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">דיירים במצבת</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-10 bg-white/60 backdrop-blur-md p-14 rounded-[5rem] border border-white luxury-shadow relative overflow-hidden">
        <div className="flex-grow w-full">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 text-right pr-6 border-r-4 border-sky-500">צוות ניהול ומקצועי מורשה - AVIV PRO SYSTEM</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
             <div className="text-right border-r-2 border-slate-100 pr-6">
               <div className="text-lg font-black text-slate-900 leading-tight">עמית שטיינברג</div>
               <div className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">מנהל הדיור</div>
             </div>
             <div className="text-right border-r-2 border-slate-100 pr-6">
               <div className="text-lg font-black text-slate-900 leading-tight">שרית דהן</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">מזכירה ניהולית</div>
             </div>
             <div className="text-right border-r-2 border-slate-100 pr-6">
               <div className="text-lg font-black text-slate-900 leading-tight">מוחמד אבו עבשה</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">רכז דירות</div>
             </div>
             <div className="text-right border-r-2 border-slate-100 pr-6">
               <div className="text-lg font-black text-slate-900 leading-tight">נעה נתיב</div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">תומכת עו"ס</div>
             </div>
          </div>
        </div>

        <button 
          onClick={exportPerformanceReport}
          className="bg-navy-gradient text-white px-14 py-8 rounded-[3rem] font-black text-xl shadow-3xl hover:scale-105 transition-all flex items-center gap-6 group border-b-8 border-slate-800 active:border-b-0 active:translate-y-2 shrink-0"
        >
          <span className="text-4xl group-hover:rotate-12 transition-transform">📊</span>
          <span className="whitespace-nowrap">ייצוא דוח ביצועים ארגוני</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
