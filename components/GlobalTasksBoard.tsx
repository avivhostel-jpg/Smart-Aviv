
import React, { useState, useMemo, useEffect } from 'react';
import { Resident, ResidentReport, TaskStatus } from '../types';
import { STATUS_COLORS, BRAND_SIGNATURE, METALLIC_GRADIENT } from '../constants';

interface GlobalTasksBoardProps {
  residents: Resident[];
  reports: ResidentReport[];
  initialFilter?: string;
  onUpdateReport: (report: ResidentReport) => void;
  onDeleteReport: (id: string) => void;
}

const GlobalTasksBoard: React.FC<GlobalTasksBoardProps> = ({ residents, reports, initialFilter, onUpdateReport, onDeleteReport }) => {
  const [filter, setFilter] = useState({ house: 'כל הבתים', status: initialFilter || 'הכל', search: '' });
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [closureText, setClosureText] = useState('');
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editTaskData, setEditTaskData] = useState<ResidentReport | null>(null);

  useEffect(() => {
    if (initialFilter) {
      setFilter(prev => ({ ...prev, status: initialFilter }));
    }
  }, [initialFilter]);

  const houses = ['כל הבתים', ...Array.from(new Set(residents.map(r => r.houseName)))];
  const statuses = ['הכל', ...Object.values(TaskStatus)];

  const filteredTasks = useMemo(() => {
    return reports.filter(r => {
      const matchHouse = filter.house === 'כל הבתים' || r.houseName === filter.house;
      const matchStatus = filter.status === 'הכל' || r.status === filter.status;
      const res = r.residentId ? residents.find(res => res.id === r.residentId) : null;
      const matchSearch = r.essence.toLowerCase().includes(filter.search.toLowerCase()) || 
                          (res && (res.firstName.toLowerCase().includes(filter.search.toLowerCase()) || 
                                   res.lastName.toLowerCase().includes(filter.search.toLowerCase()))) ||
                          (!r.residentId && "כללי לבית".includes(filter.search));
      return matchHouse && matchStatus && matchSearch;
    });
  }, [reports, residents, filter]);

  const getResidentName = (id?: string) => {
    if (!id) return '⚠️ כללי לבית';
    const res = residents.find(r => r.id === id);
    return res ? `${res.firstName} ${res.lastName}` : 'לא ידוע';
  };

  const selectedTask = reports.find(t => t.id === selectedTaskId);

  const handleUpdateStatus = (task: ResidentReport, newStatus: TaskStatus) => {
    onUpdateReport({ ...task, status: newStatus });
  };

  const handleClosureSubmit = (task: ResidentReport) => {
    if (!closureText.trim()) return;
    onUpdateReport({ ...task, status: TaskStatus.COMPLETED, closureSummary: closureText });
    setClosureText('');
    setSelectedTaskId(null);
  };

  const handleSaveGlobalEdit = () => {
    if (editTaskData) {
      onUpdateReport(editTaskData);
      setIsEditingTask(false);
      setEditTaskData(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 bg-white p-10 rounded-[3.5rem] border border-sky-50 shadow-2xl">
        <div className="text-right">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">לוח מעקב גלובלי</h2>
          <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-[0.2em]">ריכוז משימות התערבות - ממותג ע״י {BRAND_SIGNATURE}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <select className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-xs font-black outline-none focus:ring-4 focus:ring-sky-100" value={filter.house} onChange={e => setFilter(p => ({ ...p, house: e.target.value }))}>
            {houses.map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <select className="px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-xs font-black outline-none focus:ring-4 focus:ring-sky-100" value={filter.status} onChange={e => setFilter(p => ({ ...p, status: e.target.value }))}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input className="px-8 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-xs font-black outline-none focus:ring-4 focus:ring-sky-100 min-w-[250px] text-right" placeholder="חיפוש חופשי (שם/מהות)..." value={filter.search} onChange={e => setFilter(p => ({ ...p, search: e.target.value }))} />
        </div>
      </header>

      {/* Detail Overlay */}
      {selectedTaskId && selectedTask && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-6 text-right" dir="rtl">
           <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl overflow-hidden relative animate-fade-in border border-sky-100">
              <div className={`h-3 w-full bg-navy-gradient`}></div>
              <div className="absolute top-8 left-8 flex gap-4 z-20">
                 <button 
                  onClick={() => { if(window.confirm('האם למחוק תיעוד זה לצמיתות?')) { onDeleteReport(selectedTask.id); setSelectedTaskId(null); } }} 
                  className="h-14 w-14 bg-rose-50 rounded-2xl text-rose-400 hover:text-rose-600 transition-colors flex items-center justify-center shadow-sm"
                 >
                   <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
                 <button onClick={() => setSelectedTaskId(null)} className="h-14 w-14 bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-600 transition-colors text-4xl font-light flex items-center justify-center shadow-sm">×</button>
              </div>
              
              <div className="p-12 space-y-10 overflow-y-auto max-h-[85vh] no-scrollbar">
                <div className="flex justify-between items-start border-b border-slate-100 pb-10 gap-10">
                   <div className="text-right flex-grow">
                      <div className="text-[11px] font-black text-sky-500 uppercase tracking-[0.3em] mb-3">{selectedTask.date} | בית {selectedTask.houseName}</div>
                      {isEditingTask ? (
                        <input className="w-full text-4xl font-black text-slate-900 bg-slate-50 p-4 rounded-2xl outline-none text-right" value={editTaskData?.essence || ''} onChange={e => setEditTaskData(p => p ? {...p, essence: e.target.value} : null)} />
                      ) : (
                        <h3 className="text-4xl font-black text-slate-900">{selectedTask.essence}</h3>
                      )}
                      <p className="text-xl font-bold text-slate-400 mt-2">יעד הדיווח: {getResidentName(selectedTask.residentId)}</p>
                   </div>
                   <div className="flex flex-col items-end gap-4 shrink-0">
                      <div className={`px-10 py-4 rounded-3xl text-[12px] font-black border uppercase tracking-widest shadow-lg ${STATUS_COLORS[selectedTask.status]}`}>
                         {selectedTask.status}
                      </div>
                      {!isEditingTask && (
                        <button onClick={() => { setIsEditingTask(true); setEditTaskData(selectedTask); }} className="bg-sky-50 text-sky-600 px-6 py-3 rounded-2xl text-[11px] font-black hover:bg-sky-100 transition-colors">עריכת נתוני תיעוד</button>
                      )}
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-8 text-right">
                      <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
                         <span className="text-[11px] font-black text-slate-400 uppercase block mb-4 tracking-widest">תיאור ופירוט האירוע</span>
                         {isEditingTask ? (
                           <textarea className="w-full bg-white p-5 rounded-2xl text-sm outline-none text-right" rows={6} value={editTaskData?.caseDetails || ''} onChange={e => setEditTaskData(p => p ? {...p, caseDetails: e.target.value} : null)} />
                         ) : (
                           <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedTask.caseDetails}</p>
                         )}
                      </div>
                   </div>
                   <div className="space-y-8 text-right">
                      <div className="p-8 bg-sky-50/50 rounded-[3rem] border border-sky-100">
                         <span className="text-[11px] font-black text-sky-500 uppercase block mb-4 tracking-widest">לקחים ומסקנות מקצועיות</span>
                         {isEditingTask ? (
                           <textarea className="w-full bg-white p-5 rounded-2xl text-sm outline-none italic text-right" rows={4} value={editTaskData?.conclusions || ''} onChange={e => setEditTaskData(p => p ? {...p, conclusions: e.target.value} : null)} />
                         ) : (
                           <p className="text-sm font-bold text-sky-900 italic leading-relaxed">" {selectedTask.conclusions || 'לא הוזנו לקחים'} "</p>
                         )}
                      </div>
                      
                      {isEditingTask ? (
                        <div className="flex justify-end gap-5 pt-6">
                           <button onClick={() => setIsEditingTask(false)} className="px-8 py-3 text-xs font-black text-slate-400">ביטול</button>
                           <button onClick={handleSaveGlobalEdit} className="bg-sky-600 text-white px-12 py-3 rounded-[1.5rem] text-xs font-black shadow-xl">שמור עדכונים</button>
                        </div>
                      ) : (
                        selectedTask.status !== TaskStatus.COMPLETED && (
                           <div className="space-y-6 pt-6">
                              <h6 className="text-[11px] font-black text-emerald-500 uppercase tracking-widest">סגירת התערבות (סיכום טיפול)</h6>
                              <textarea 
                                 className="w-full p-6 bg-white border-2 border-emerald-50 rounded-[2.5rem] text-xs font-bold outline-none focus:ring-8 focus:ring-emerald-50 text-right shadow-inner"
                                 placeholder="כיצד הושלם הטיפול?..."
                                 value={closureText}
                                 onChange={e => setClosureText(e.target.value)}
                              />
                              <button onClick={() => handleClosureSubmit(selectedTask)} className="w-full bg-emerald-500 text-white py-5 rounded-[2.5rem] font-black text-base shadow-2xl hover:bg-emerald-600 transition-all active:scale-95">סיום וסגירת התערבות</button>
                           </div>
                        )
                      )}
                   </div>
                </div>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-sky-50">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-white/50">תאריך</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-white/50">יעד</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-white/50">בית</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-white/50">מהות</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-white/50">סטטוס</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-widest text-white/50">פעולות</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredTasks.length === 0 ? (
                <tr><td colSpan={6} className="p-24 text-center text-slate-400 italic font-black uppercase tracking-widest">לא נמצאו משימות בסינון הנוכחי</td></tr>
              ) : (
                filteredTasks.map((task, idx) => (
                  <tr key={task.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'} border-b border-sky-50 group hover:bg-sky-50 transition-all`}>
                    <td className="p-8 font-mono text-[11px] font-black text-slate-400">{task.date}</td>
                    <td className="p-8 font-black text-slate-900">{getResidentName(task.residentId)}</td>
                    <td className="p-8"><span className="px-4 py-2 bg-white rounded-xl text-[10px] font-black text-sky-600 border border-sky-50 shadow-sm">{task.houseName}</span></td>
                    <td className="p-8 font-black text-indigo-700">{task.essence}</td>
                    <td className="p-8">
                      <select 
                        value={task.status} 
                        onChange={(e) => handleUpdateStatus(task, e.target.value as TaskStatus)}
                        className={`px-4 py-2 rounded-2xl text-[11px] font-black border transition-all outline-none ${STATUS_COLORS[task.status]}`}
                      >
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-8">
                       <div className="flex gap-3">
                         <button 
                           onClick={() => { setSelectedTaskId(task.id); setIsEditingTask(false); }}
                           className="bg-white h-11 px-5 rounded-2xl text-[11px] font-black border border-sky-50 text-sky-400 hover:text-sky-600 hover:border-sky-200 transition-all flex items-center gap-3 shadow-sm"
                         >
                           🔎 <span>צלילה</span>
                         </button>
                         <button 
                           onClick={() => onDeleteReport(task.id)}
                           className="h-11 w-11 flex items-center justify-center text-slate-200 hover:text-rose-500 transition-all bg-white border border-slate-50 rounded-2xl shadow-sm"
                         >
                           <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GlobalTasksBoard;
