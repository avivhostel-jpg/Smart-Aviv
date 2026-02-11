
import React, { useState } from 'react';
import { House, Resident, ResidentReport, TaskStatus, StaffRole } from '../types';
import { STATUS_COLORS, BRAND_SIGNATURE } from '../constants';

interface HouseViewProps {
  house: House;
  residents: Resident[];
  reports: ResidentReport[];
  onBack: () => void;
  onSelectResident: (id: string) => void;
  onAddResident: (res: Omit<Resident, 'id' | 'attachments'>) => void;
  onAddReport: (report: Omit<ResidentReport, 'id' | 'timestamp'>) => void;
  onUpdateReport: (report: ResidentReport) => void;
  onDeleteReport: (id: string) => void;
  currentUser: { name: string, role: StaffRole };
}

const HouseView: React.FC<HouseViewProps> = ({ 
  house, residents, reports, onBack, onSelectResident, onAddResident, 
  onAddReport, onUpdateReport, onDeleteReport, currentUser 
}) => {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHouseTaskForm, setShowHouseTaskForm] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [closureText, setClosureText] = useState('');

  const [newRes, setNewRes] = useState({
    firstName: '', lastName: '', houseName: house.name,
    description: '', dob: '', entryDate: new Date().toISOString().split('T')[0],
    phone: '', guardian: '', riskManagement: '', promotionPlan: '',
    workplace: '', medicalInfo: '', recommendedTreatment: '',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`
  });

  const [newHouseTask, setNewHouseTask] = useState<Omit<ResidentReport, 'id' | 'timestamp' | 'houseName' | 'date' | 'staffName' | 'staffRole'>>({
    essence: '', reportingSource: '', caseDetails: '', actionsTaken: '',
    teamInvolved: '', conclusions: '', recommendedIntervention: '',
    status: TaskStatus.OPEN, tasksDetails: '', notes: ''
  });

  const filtered = residents.filter(r => 
    `${r.firstName} ${r.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  const houseLevelTasks = reports.filter(r => !r.residentId && r.houseName === house.name);

  const hasOpenTasks = (residentId: string) => {
    return reports.some(r => r.residentId === residentId && r.status === TaskStatus.OPEN);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddResident(newRes);
    setShowAddForm(false);
  };

  const handleHouseTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReport({
      ...newHouseTask,
      houseName: house.name,
      date: new Date().toLocaleDateString('he-IL'),
      staffName: currentUser.name,
      staffRole: currentUser.role
    });
    setShowHouseTaskForm(false);
    setNewHouseTask({ 
        essence: '', reportingSource: '', caseDetails: '', actionsTaken: '',
        teamInvolved: '', conclusions: '', recommendedIntervention: '',
        status: TaskStatus.OPEN, tasksDetails: '', notes: ''
    });
  };

  const handleCloseTask = (report: ResidentReport) => {
    if (!closureText.trim()) return;
    onUpdateReport({
        ...report,
        status: TaskStatus.COMPLETED,
        closureSummary: closureText
    });
    setExpandedTaskId(null);
    setClosureText('');
  };

  return (
    <div className="animate-fade-in space-y-12">
      {/* House Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-10 bg-white p-10 rounded-[4rem] border border-sky-50 luxury-shadow">
        <div className="flex items-center gap-8 w-full lg:w-auto">
          <button onClick={onBack} className="h-16 w-16 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all text-slate-400 shadow-sm">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-4 mb-2">
               <span className="text-5xl">{house.icon}</span>
               <h2 className="text-5xl font-black text-slate-900 tracking-tight">בית {house.name}</h2>
            </div>
            <p className="text-[14px] font-black text-slate-400 uppercase tracking-widest italic opacity-70 pr-2">{house.location} • {residents.length} דיירים במצבת</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="relative flex-grow lg:w-80">
            <input 
              type="text" 
              placeholder="חיפוש דייר..."
              className="w-full px-16 py-5 rounded-[2.5rem] bg-slate-50 border border-slate-100 focus:outline-none focus:ring-8 focus:ring-sky-50 transition-all font-bold text-right"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="absolute right-6 top-5 text-slate-300 text-xl">🔍</div>
          </div>
          <button 
            onClick={() => setShowHouseTaskForm(true)}
            className="h-16 px-10 rounded-[2rem] bg-indigo-600 text-white font-black text-xs hover:bg-indigo-700 transition-all shadow-xl flex items-center gap-4"
          >
            <span className="text-2xl">⚡</span>
            דיווח התערבות כללית לבית
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="h-16 px-10 rounded-[2rem] bg-slate-900 text-white font-black text-xs hover:bg-sky-600 transition-all shadow-xl flex items-center gap-4"
          >
            <span className="text-2xl">+</span>
            הוספת דייר חדש
          </button>
        </div>
      </div>

      {/* Resident Grid */}
      <div className="space-y-6">
        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4 justify-end pr-6">
           <span className="h-1 w-20 bg-sky-500 rounded-full"></span>
           תיקי דיירים פעילים
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map(res => {
            const open = hasOpenTasks(res.id);
            return (
              <div 
                key={res.id}
                onClick={() => onSelectResident(res.id)}
                className="group bg-white p-10 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 h-2 w-full ${house.color}`}></div>
                {open && (
                  <div className="absolute top-6 left-6 h-12 w-12 bg-rose-500 rounded-[1.2rem] flex items-center justify-center text-white shadow-xl animate-pulse z-10">
                    <span className="text-2xl font-black">⚡</span>
                  </div>
                )}
                <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden mb-8 border-4 border-slate-50 shadow-inner group-hover:scale-110 transition-transform relative bg-slate-100">
                  <img src={res.avatar} className="h-full w-full object-cover" alt="Profile" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">{res.firstName} {res.lastName}</h4>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">תיק מס׳: {res.id}</p>
                <div className="mt-10 pt-8 border-t border-slate-50 w-full flex justify-center text-slate-300 group-hover:text-sky-600 transition-colors">
                  <span className="text-xs font-black uppercase tracking-widest">צפייה בתיק קליני</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* House General Tasks Section */}
      <div className="space-y-10 pt-10">
         <div className="flex justify-between items-center pr-6">
           <span className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">{houseLevelTasks.length} תיעודים מוסדיים</span>
           <h3 className="text-2xl font-black text-indigo-900 flex items-center gap-4">
              <span className="h-1 w-20 bg-indigo-500 rounded-full"></span>
              יומן התערבויות מוסדי - בית {house.name}
           </h3>
         </div>

         <div className="space-y-8">
            {houseLevelTasks.length === 0 ? (
               <div className="bg-indigo-50/50 p-20 rounded-[4rem] border-2 border-dashed border-indigo-100 text-center">
                  <span className="text-6xl mb-6 block opacity-20">📋</span>
                  <p className="text-indigo-400 font-black text-lg">אין משימות מוסדיות פתוחות כרגע</p>
               </div>
            ) : (
              houseLevelTasks.map((report, idx) => (
                <div key={report.id} className="bg-white p-12 rounded-[4rem] border border-indigo-50 luxury-shadow relative overflow-hidden group hover:bg-indigo-50/20 transition-all duration-500 text-right">
                  <div className={`absolute top-0 right-0 h-full w-4 ${STATUS_COLORS[report.status].split(' ')[0]}`}></div>
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                    <div className="flex items-center gap-12 w-full lg:w-auto">
                      <div className="h-24 w-24 bg-indigo-900 text-white rounded-[2.5rem] flex items-center justify-center font-black text-4xl shadow-xl group-hover:rotate-6 transition-transform">{idx + 1}</div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-5 mb-4 justify-end md:justify-start">
                           <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{report.date}</span>
                           <span className="h-2.5 w-2.5 rounded-full bg-indigo-200"></span>
                           <span className="text-[12px] font-black text-indigo-600 uppercase tracking-widest italic">{report.staffName} ({report.staffRole})</span>
                        </div>
                        <h5 className="text-4xl font-black text-slate-900 tracking-tight group-hover:text-indigo-700 transition-colors">{report.essence}</h5>
                        <p className="text-slate-400 font-bold mt-2 italic">גורם מדווח: {report.reportingSource}</p>
                      </div>
                    </div>
                    <div className="flex gap-6 w-full lg:w-auto justify-end">
                      <span className={`px-10 py-5 rounded-[2rem] text-[14px] font-black border uppercase tracking-widest shadow-xl h-fit ${STATUS_COLORS[report.status]}`}>{report.status}</span>
                      <div className="flex gap-5 h-fit">
                        <button 
                          onClick={() => setExpandedTaskId(expandedTaskId === report.id ? null : report.id)}
                          className="h-16 w-16 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-indigo-600 transition-all shadow-md hover:shadow-2xl"
                        >
                           <svg className={`h-10 w-10 transform transition-transform duration-500 ${expandedTaskId === report.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        <button 
                          onClick={() => onDeleteReport(report.id)}
                          className="h-16 w-16 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center text-slate-200 hover:text-rose-500 transition-all shadow-md"
                        >
                           <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {expandedTaskId === report.id && (
                    <div className="pt-16 mt-12 border-t-2 border-slate-50 space-y-16 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                            <div className="space-y-10">
                                <div className="p-12 bg-slate-50 rounded-[4rem] border border-slate-100 shadow-inner">
                                  <span className="text-[14px] font-black text-slate-400 uppercase block mb-6 tracking-widest">פירוט המקרה המלא</span>
                                  <p className="text-lg font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{report.caseDetails}</p>
                                </div>
                                <div className="p-12 bg-indigo-50 rounded-[4rem] border border-indigo-100">
                                  <span className="text-[14px] font-black text-indigo-500 uppercase block mb-6 tracking-widest">למידה ומסקנות מוסדיות</span>
                                  <p className="text-lg font-bold text-indigo-900 italic leading-relaxed">" {report.conclusions || 'טרם הוזנו מסקנות'} "</p>
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="p-12 bg-indigo-50/50 rounded-[4rem] border border-indigo-100 shadow-inner">
                                  <span className="text-[14px] font-black text-indigo-400 uppercase block mb-6 tracking-widest">אופן טיפול מומלץ והנחיות</span>
                                  <p className="text-lg font-black text-indigo-900 leading-relaxed">{report.recommendedIntervention || 'במעקב צוות ניהולי'}</p>
                                  <div className="mt-8 pt-8 border-t border-indigo-100">
                                     <span className="text-[12px] font-black text-indigo-300 block mb-3 uppercase">פעולות שננקטו:</span>
                                     <p className="text-base text-indigo-700">{report.actionsTaken || 'אין דיווח פעולות'}</p>
                                  </div>
                                </div>
                                <div className="p-12 bg-slate-900 text-white rounded-[4rem] shadow-2xl">
                                  <span className="text-[14px] font-black text-sky-400 uppercase block mb-6 tracking-widest">צוות מורכב למשימה זו</span>
                                  <p className="text-lg font-black">{report.teamInvolved || 'כלל הצוות'}</p>
                                </div>
                            </div>
                        </div>

                        {report.status !== TaskStatus.COMPLETED ? (
                            <div className="pt-16 border-t-2 border-slate-50 space-y-10">
                              <h6 className="text-xl font-black text-emerald-600 uppercase tracking-[0.5em] flex items-center gap-6 justify-end">
                                  תיעוד השלמת התערבות וסגירת המשימה המוסדית
                                  <span className="h-5 w-5 rounded-full bg-emerald-500 shadow-2xl shadow-emerald-100"></span>
                              </h6>
                              <textarea 
                                className="w-full p-12 bg-white border border-emerald-100 rounded-[4rem] text-lg font-bold outline-none focus:ring-12 focus:ring-emerald-50 transition-all shadow-inner text-right" 
                                placeholder="פרט את סיכום ההתערבות לסיום המשימה וסגירתה..."
                                value={closureText}
                                onChange={e => setClosureText(e.target.value)}
                              />
                              <div className="flex justify-end">
                                  <button 
                                    onClick={() => handleCloseTask(report)}
                                    className="bg-emerald-500 text-white px-28 py-7 rounded-[3rem] font-black text-xl shadow-2xl hover:bg-emerald-600 transition-all active:scale-95"
                                  >
                                    סגירת משימה מוסדית וסנכרון ענן
                                  </button>
                              </div>
                            </div>
                        ) : report.closureSummary && (
                            <div className="p-14 bg-emerald-50 rounded-[5rem] border-2 border-emerald-100 shadow-inner relative overflow-hidden text-right">
                                <div className="absolute top-0 right-0 w-4 h-full bg-emerald-500"></div>
                                <span className="text-[14px] font-black text-emerald-500 uppercase block mb-6 tracking-widest">סיכום טיפול מוסדי מוגמר</span>
                                <p className="text-2xl font-bold text-emerald-900 italic leading-relaxed whitespace-pre-wrap">" {report.closureSummary} "</p>
                            </div>
                        )}
                    </div>
                  )}
                </div>
              ))
            )}
         </div>
      </div>

      {/* House Task Form Modal */}
      {showHouseTaskForm && (
        <div className="fixed inset-0 z-[110] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-6 text-right" dir="rtl">
           <form onSubmit={handleHouseTaskSubmit} className="bg-white p-14 rounded-[5rem] shadow-3xl w-full max-w-5xl space-y-10 animate-fade-in max-h-[90vh] overflow-y-auto no-scrollbar relative">
              <div className="absolute top-0 right-0 w-full h-4 bg-indigo-600"></div>
              <div className="flex justify-between items-center">
                <h3 className="text-4xl font-black text-slate-900 flex items-center gap-6">
                  <span className="h-20 w-20 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl">⚡</span>
                  דיווח התערבות מוסדית - בית {house.name}
                </h3>
                <button type="button" onClick={() => setShowHouseTaskForm(false)} className="text-slate-300 text-6xl hover:text-rose-500 transition-colors">&times;</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <div>
                      <label className="text-[13px] font-black text-slate-400 uppercase block mb-3 tracking-widest">מהות המשימה (כותרת)</label>
                      <input required className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-lg font-black outline-none focus:ring-8 focus:ring-indigo-50 text-right shadow-inner" value={newHouseTask.essence} onChange={e => setNewHouseTask(p => ({ ...p, essence: e.target.value }))} placeholder="מה קרה בבית?" />
                    </div>
                    <div>
                      <label className="text-[13px] font-black text-slate-400 uppercase block mb-3 tracking-widest">פירוט נרחב (Institutional Case Details)</label>
                      <textarea required rows={6} className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-base font-medium outline-none text-right shadow-inner" value={newHouseTask.caseDetails} onChange={e => setNewHouseTask(p => ({ ...p, caseDetails: e.target.value }))} placeholder="תיאור מלא של האירוע או המשימה המוסדית..." />
                    </div>
                 </div>
                 
                 <div className="space-y-8">
                    <div>
                      <label className="text-[13px] font-black text-slate-400 uppercase block mb-3 tracking-widest">גורם מדווח</label>
                      <input required className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-base font-bold outline-none text-right shadow-inner" value={newHouseTask.reportingSource} onChange={e => setNewHouseTask(p => ({ ...p, reportingSource: e.target.value }))} placeholder="מדווח האירוע..." />
                    </div>
                    <div>
                      <label className="text-[13px] font-black text-slate-400 uppercase block mb-3 tracking-widest">צוות מעורב</label>
                      <input className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-base font-bold outline-none text-right shadow-inner" value={newHouseTask.teamInvolved} onChange={e => setNewHouseTask(p => ({ ...p, teamInvolved: e.target.value }))} placeholder="מי מעורב בטיפול?" />
                    </div>
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                          <label className="text-[13px] font-black text-emerald-600 uppercase block mb-3 tracking-widest">לקחים ומסקנות</label>
                          <textarea rows={3} className="w-full p-6 bg-emerald-50/20 rounded-[2rem] border border-emerald-50 text-base font-bold outline-none italic text-right shadow-inner" value={newHouseTask.conclusions} onChange={e => setNewHouseTask(p => ({ ...p, conclusions: e.target.value }))} placeholder="מה למדנו מערכתית?" />
                        </div>
                    </div>
                 </div>
              </div>

              <div className="flex justify-end pt-10 border-t border-slate-100">
                <button type="submit" className="bg-indigo-600 text-white px-28 py-7 rounded-[3rem] font-black text-2xl shadow-3xl hover:bg-indigo-700 hover:scale-105 transition-all active:scale-95">שיגור דיווח מוסדי למערכת</button>
              </div>
           </form>
        </div>
      )}

      {/* Add Resident Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6 text-right" dir="rtl">
           <form onSubmit={handleAddSubmit} className="bg-white p-14 rounded-[5rem] shadow-3xl w-full max-w-3xl space-y-8 animate-fade-in relative">
              <div className="absolute top-0 right-0 w-full h-4 bg-slate-900"></div>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-4xl font-black text-slate-900">הקמת תיק דייר חדש - {house.name}</h3>
                <button type="button" onClick={() => setShowAddForm(false)} className="text-slate-300 text-6xl hover:text-rose-500 transition-colors">&times;</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <input required className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 font-bold outline-none text-right shadow-inner" placeholder="שם פרטי" value={newRes.firstName} onChange={e => setNewRes(p => ({...p, firstName: e.target.value}))} />
                 <input required className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 font-bold outline-none text-right shadow-inner" placeholder="שם משפחה" value={newRes.lastName} onChange={e => setNewRes(p => ({...p, lastName: e.target.value}))} />
                 <input className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 font-bold outline-none text-right shadow-inner" placeholder="טלפון" value={newRes.phone} onChange={e => setNewRes(p => ({...p, phone: e.target.value}))} />
                 <input className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 font-bold outline-none text-right shadow-inner" placeholder="אפוטרופוס" value={newRes.guardian} onChange={e => setNewRes(p => ({...p, guardian: e.target.value}))} />
              </div>
              <textarea className="w-full p-8 bg-slate-50 rounded-[3rem] border border-slate-100 font-medium outline-none text-right shadow-inner" rows={4} placeholder="תיאור קליני ראשוני..." value={newRes.description} onChange={e => setNewRes(p => ({...p, description: e.target.value}))} />
              <button type="submit" className="w-full py-7 bg-slate-900 text-white rounded-[3rem] font-black text-2xl shadow-3xl hover:bg-sky-600 transition-all active:scale-95">פתיחת תיק במערכת אביב PRO</button>
           </form>
        </div>
      )}
    </div>
  );
};

export default HouseView;
