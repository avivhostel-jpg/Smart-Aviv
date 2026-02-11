
import React, { useState, useRef, useEffect } from 'react';
import { Resident, ResidentReport, TaskStatus, StaffRole, FileAttachment } from '../types';
import { STATUS_COLORS, BRAND_SIGNATURE, BRAND_TAGLINE, METALLIC_GRADIENT } from '../constants';

interface ResidentProfileProps {
  resident: Resident;
  reports: ResidentReport[];
  onBack: () => void;
  onAddReport: (report: Omit<ResidentReport, 'id' | 'timestamp'>) => void;
  onUpdateReport: (report: ResidentReport) => void;
  onDeleteReport: (id: string) => void;
  onUpdateResident: (resident: Resident) => void;
  currentUser: { name: string, role: StaffRole };
}

const ResidentProfile: React.FC<ResidentProfileProps> = ({ resident, reports, onBack, onAddReport, onUpdateReport, onDeleteReport, onUpdateResident, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'tasks' | 'archive'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [closureText, setClosureText] = useState('');
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const fileAttachmentRef = useRef<HTMLInputElement>(null);
  const [pendingFileType, setPendingFileType] = useState<'כללי' | 'רפואי' | 'תפקודי' | null>(null);
  
  const [editData, setEditData] = useState<Resident>(resident);

  useEffect(() => {
    setEditData(resident);
  }, [resident]);

  const calculateAge = (dobString: string) => {
    if (!dobString) return 'N/A';
    try {
      const today = new Date();
      const birthDate = new Date(dobString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return isNaN(age) ? 'N/A' : age;
    } catch (e) { return 'N/A'; }
  };

  const [newTask, setNewTask] = useState<Omit<ResidentReport, 'id' | 'timestamp' | 'residentId' | 'houseName' | 'date' | 'staffName' | 'staffRole'>>({
    essence: '', 
    reportingSource: '',
    caseDetails: '', 
    actionsTaken: '',
    teamInvolved: '',
    conclusions: '',
    recommendedIntervention: '',
    status: TaskStatus.OPEN, 
    tasksDetails: '', 
    notes: ''
  });

  const handleSaveProfile = () => {
    onUpdateResident(editData);
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        const updated = { ...editData, avatar: base64 };
        setEditData(updated);
        if (!isEditing) onUpdateResident(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReport({
      ...newTask,
      residentId: resident.id,
      houseName: resident.houseName,
      date: new Date().toLocaleDateString('he-IL'),
      staffName: currentUser.name,
      staffRole: currentUser.role
    });
    setShowTaskForm(false);
    setNewTask({ 
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

  const handleFileUploadTrigger = (type: 'כללי' | 'רפואי' | 'תפקודי') => {
    setPendingFileType(type);
    fileAttachmentRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && pendingFileType) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64Data = ev.target?.result as string;
        const newAttachment: FileAttachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: pendingFileType,
          url: base64Data, 
          date: new Date().toLocaleDateString('he-IL')
        };
        const updatedResident = {
          ...resident,
          attachments: [...resident.attachments, newAttachment]
        };
        onUpdateResident(updatedResident);
      };
      reader.readAsDataURL(file);
      setPendingFileType(null);
    }
  };

  const handleDeleteFile = (id: string) => {
    // Permissive roles for high-level management
    const authRoles: StaffRole[] = ['בעלים', 'מנהל', 'עו"ס', 'רכז דירות', 'מזכירה מנהלית'];
    if (!currentUser || !authRoles.includes(currentUser.role)) {
      return alert('הרשאת מנהל/רכז/עו"ס נדרשת למחיקת מסמכים מהארכיון');
    }

    if (confirm('מחיקה מאובטחת: האם אתה בטוח שברצונך למחוק מסמך זה לצמיתות מהתיק?')) {
      const updatedResident = {
        ...resident,
        attachments: resident.attachments.filter(a => a.id !== id)
      };
      onUpdateResident(updatedResident);
      if (isEditing) {
        setEditData(prev => ({
          ...prev,
          attachments: prev.attachments.filter(a => a.id !== id)
        }));
      }
    }
  };

  const viewFile = (url: string) => {
    if (!url || url === '#') return;
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>AVIV PRO | Secure View</title></head>
          <body style="margin:0; background:#f8fafc; font-family:sans-serif; display:flex; flex-direction:column; height:100vh;">
            <div style="background:#0F172A; color:white; padding:15px 30px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:800; letter-spacing:1px;">אביב PRO | תצוגת מסמך מאובטחת</span>
              <button onclick="window.close()" style="background:#ef4444; border:0; color:white; padding:10px 25px; border-radius:12px; cursor:pointer; font-weight:800;">סגור חלון</button>
            </div>
            <iframe src="${url}" frameborder="0" style="flex-grow:1; width:100%; border:0;" allowfullscreen></iframe>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto pb-20">
      <div className={`bg-navy-gradient p-10 rounded-[4rem] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 h-full w-4 bg-sky-500/40"></div>
        
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="h-48 w-48 rounded-[3.5rem] overflow-hidden border-4 border-white/20 shadow-2xl group relative bg-slate-800">
            <img src={isEditing ? editData.avatar : resident.avatar} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Profile" />
            {isEditing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => avatarInputRef.current?.click()} className="h-14 w-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-3xl border border-white/40 shadow-xl">📸</button>
              </div>
            )}
          </div>
          <div className="mt-5 bg-white/10 backdrop-blur-md px-8 py-2 rounded-full border border-white/10 shadow-lg">
             <span className="text-white font-black text-base">גיל: {calculateAge(isEditing ? editData.dob : resident.dob)}</span>
          </div>
          <input type="file" ref={avatarInputRef} hidden accept="image/*" onChange={handleAvatarUpload} />
        </div>

        <div className="flex-grow w-full text-right">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-8">
            <div className="text-white">
              {isEditing ? (
                <div className="flex gap-4">
                   <input className="bg-white/10 border border-white/20 p-5 rounded-2xl text-white font-black text-4xl w-64 outline-none focus:ring-4 focus:ring-sky-500 text-right shadow-inner" value={editData.firstName} onChange={e => setEditData(p => ({ ...p, firstName: e.target.value }))} placeholder="שם פרטי" />
                   <input className="bg-white/10 border border-white/20 p-5 rounded-2xl text-white font-black text-4xl w-64 outline-none focus:ring-4 focus:ring-sky-500 text-right shadow-inner" value={editData.lastName} onChange={e => setEditData(p => ({ ...p, lastName: e.target.value }))} placeholder="משפחה" />
                </div>
              ) : (
                <h2 className="text-7xl font-black text-white leading-none drop-shadow-md tracking-tighter">{resident.firstName} {resident.lastName}</h2>
              )}
              <div className="text-[14px] font-black text-sky-400 mt-5 uppercase tracking-[0.4em] italic opacity-90">
                {BRAND_SIGNATURE} • Institutional Clinical Record • {resident.tz}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={() => { setIsEditing(!isEditing); if(!isEditing) setEditData(resident); }} className={`px-12 py-5 rounded-[2rem] font-black text-sm transition-all border shadow-xl ${isEditing ? 'bg-rose-500 text-white border-rose-400 hover:bg-rose-600' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}>
                {isEditing ? 'ביטול שינויים' : '⚙️ ניהול תיק'}
              </button>
              <button onClick={() => { setActiveTab('tasks'); setShowTaskForm(true); }} className={`bg-sky-500 text-white px-14 py-5 rounded-[2rem] font-black text-sm shadow-2xl hover:bg-sky-600 hover:scale-105 transition-all flex items-center gap-4 border-b-4 border-sky-700 active:border-b-0 active:translate-y-1`}>
                <span className="text-3xl">⚡</span>
                דיווח התערבות חדשה
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'תעודת זהות', val: isEditing ? <input className="w-full bg-transparent outline-none text-white text-[15px] font-bold text-right" value={editData.tz} onChange={e => setEditData(p => ({ ...p, tz: e.target.value }))} /> : resident.tz },
              { label: 'תאריך לידה', val: isEditing ? <input type="date" className="w-full bg-transparent outline-none text-white text-[15px] font-bold text-right" value={editData.dob} onChange={e => setEditData(p => ({ ...p, dob: e.target.value }))} /> : resident.dob },
              { label: 'מקום עבודה', val: isEditing ? <input className="w-full bg-transparent outline-none text-white text-[15px] font-bold text-right" value={editData.workplace} onChange={e => setEditData(p => ({ ...p, workplace: e.target.value }))} /> : resident.workplace },
              { label: 'תאריך קליטה', val: isEditing ? <input type="date" className="w-full bg-transparent outline-none text-white text-[15px] font-bold text-right" value={editData.entryDate} onChange={e => setEditData(p => ({ ...p, entryDate: e.target.value }))} /> : resident.entryDate },
              { label: 'סמל תעריף', val: isEditing ? <input className="w-full bg-transparent outline-none text-white text-[15px] font-bold text-right" value={editData.tariffCode} onChange={e => setEditData(p => ({ ...p, tariffCode: e.target.value }))} /> : resident.tariffCode },
              { label: 'סמל מסגרת', val: isEditing ? <input className="w-full bg-transparent outline-none text-white text-[15px] font-bold text-right" value={editData.frameworkCode} onChange={e => setEditData(p => ({ ...p, frameworkCode: e.target.value }))} /> : resident.frameworkCode },
              { label: 'אפוטרופוס', val: isEditing ? <input className="w-full bg-transparent outline-none text-white text-[15px] font-bold text-right" value={editData.guardian} onChange={e => setEditData(p => ({ ...p, guardian: e.target.value }))} /> : resident.guardian },
              { label: 'טלפון', val: isEditing ? <input className="w-full bg-transparent outline-none text-white text-[15px] font-bold text-right" value={editData.phone} onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))} /> : resident.phone }
            ].map((st, i) => (
              <div key={i} className="bg-white/5 px-6 py-4 rounded-[2rem] border border-white/10 flex flex-col group hover:bg-white/10 transition-colors shadow-sm">
                <span className="text-[11px] font-black text-sky-400 uppercase tracking-widest mb-1.5">{st.label}</span>
                <span className="text-[16px] font-bold text-white tracking-tight">{st.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex flex-wrap gap-4 p-2 bg-white/80 backdrop-blur-md rounded-[3rem] border border-sky-100 shadow-xl w-fit mx-auto md:mx-0">
          <button onClick={() => setActiveTab('info')} className={`px-14 py-5 rounded-[2rem] text-[13px] font-black transition-all ${activeTab === 'info' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'text-slate-500 hover:bg-slate-50'}`}>מידע מקצועי וקליני</button>
          <button onClick={() => setActiveTab('tasks')} className={`px-14 py-5 rounded-[2rem] text-[13px] font-black transition-all ${activeTab === 'tasks' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'text-slate-500 hover:bg-slate-50'}`}>יומן התערבויות ({reports.length})</button>
          <button onClick={() => setActiveTab('archive')} className={`px-14 py-5 rounded-[2rem] text-[13px] font-black transition-all ${activeTab === 'archive' ? 'bg-slate-900 text-white shadow-2xl scale-105' : 'text-slate-500 hover:bg-slate-50'}`}>ארכיון מסמכים וקבצים</button>
        </div>

        {activeTab === 'info' && (
          <div className="space-y-8 animate-fade-in">
             <div className="bg-white p-14 rounded-[4rem] border border-sky-50 luxury-shadow space-y-10 text-right">
                <h5 className="text-[14px] font-black text-sky-700 uppercase tracking-[0.5em] border-b border-sky-50 pb-6 flex items-center gap-6 justify-end">
                  תיאור כללי ותהליך שיקומי
                  <span className="h-5 w-5 rounded-full bg-sky-500 shadow-xl shadow-sky-200"></span>
                </h5>
                {isEditing ? <textarea rows={10} className="w-full p-10 bg-slate-50 rounded-[3rem] border border-slate-100 text-lg font-bold outline-none focus:ring-8 focus:ring-sky-50 transition-all text-right shadow-inner" value={editData.description} onChange={e => setEditData(p => ({ ...p, description: e.target.value }))} /> : <p className="text-lg font-medium text-slate-700 leading-relaxed bg-slate-50/50 p-12 rounded-[4rem] italic border border-slate-100 shadow-inner text-right">{resident.description}</p>}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
                <div className="bg-rose-50/60 p-12 rounded-[4rem] border border-rose-100 shadow-md">
                  <label className="text-[12px] font-black text-rose-500 uppercase block mb-5 tracking-widest">ניהול סיכונים קריטי</label>
                  {isEditing ? <textarea className="w-full bg-white p-6 rounded-3xl text-base font-bold text-right border border-rose-100 shadow-sm" value={editData.riskManagement} onChange={e => setEditData(p => ({ ...p, riskManagement: e.target.value }))} /> : <p className="text-base font-black text-rose-900 leading-relaxed">{resident.riskManagement}</p>}
                </div>
                <div className="bg-sky-50/60 p-12 rounded-[4rem] border border-sky-100 shadow-md">
                  <label className="text-[12px] font-black text-sky-600 uppercase block mb-5 tracking-widest">פרופיל רפואי וטיפול</label>
                  {isEditing ? <textarea className="w-full bg-white p-6 rounded-3xl text-base font-bold text-right border border-sky-100 shadow-sm" value={editData.medicalInfo} onChange={e => setEditData(p => ({ ...p, medicalInfo: e.target.value }))} /> : <p className="text-base font-black text-sky-900 leading-relaxed">{resident.medicalInfo}</p>}
                </div>
                <div className="bg-emerald-50/60 p-12 rounded-[4rem] border border-emerald-100 shadow-md">
                  <label className="text-[12px] font-black text-emerald-600 uppercase block mb-5 tracking-widest">תכנית קידום דייר</label>
                  {isEditing ? <textarea className="w-full bg-white p-6 rounded-3xl text-base font-bold text-right border border-emerald-100 shadow-sm" value={editData.promotionPlan} onChange={e => setEditData(p => ({ ...p, promotionPlan: e.target.value }))} /> : <p className="text-base font-black text-emerald-900 leading-relaxed">{resident.promotionPlan}</p>}
                </div>
                <div className="bg-indigo-50/60 p-12 rounded-[4rem] border border-indigo-100 shadow-md">
                  <label className="text-[12px] font-black text-indigo-600 uppercase block mb-5 tracking-widest">אופן טיפול מומלץ</label>
                  {isEditing ? <textarea className="w-full bg-white p-6 rounded-3xl text-base font-bold text-right border border-indigo-100 shadow-sm" value={editData.recommendedTreatment} onChange={e => setEditData(p => ({ ...p, recommendedTreatment: e.target.value }))} /> : <p className="text-base font-black text-indigo-900 leading-relaxed">{resident.recommendedTreatment}</p>}
                </div>
             </div>
             
             {isEditing && (
              <div className="flex justify-end pt-10">
                 <button onClick={handleSaveProfile} className={`bg-slate-900 text-white px-28 py-6 rounded-[2.5rem] text-lg font-black shadow-2xl hover:bg-sky-600 transition-all active:scale-95`}>עדכון נתוני תיק וסנכרון ענן</button>
              </div>
             )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-10 animate-fade-in text-right">
            {showTaskForm && (
              <form onSubmit={handleTaskSubmit} className="bg-white p-14 rounded-[4rem] border-4 border-sky-50 shadow-2xl space-y-10 animate-fade-in relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-full h-4 bg-navy-gradient`}></div>
                <div className="flex justify-between items-center">
                  <h4 className="text-3xl font-black text-slate-900 flex items-center gap-6">
                    <span className="h-16 w-16 bg-sky-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-xl">⚡</span>
                    תיעוד התערבות ניהולית חדשה
                  </h4>
                  <button type="button" onClick={() => setShowTaskForm(false)} className="h-14 w-14 bg-slate-50 rounded-2xl text-slate-300 hover:text-rose-500 transition-colors text-4xl">×</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                  <div className="space-y-8">
                    <div>
                      <label className="text-[13px] font-black text-slate-400 uppercase block mb-3 tracking-widest">מהות המשימה (פירוט המקרה)</label>
                      <input required className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-base font-black outline-none focus:ring-8 focus:ring-sky-50 text-right shadow-inner" value={newTask.essence} onChange={e => setNewTask(p => ({ ...p, essence: e.target.value }))} placeholder="מה קרה?" />
                    </div>
                    <div>
                      <label className="text-[13px] font-black text-slate-400 uppercase block mb-3 tracking-widest">פירוט נרחב (Case Details)</label>
                      <textarea required rows={5} className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-base font-medium outline-none text-right shadow-inner" value={newTask.caseDetails} onChange={e => setNewTask(p => ({ ...p, caseDetails: e.target.value }))} placeholder="תיאור מלא ומפורט..." />
                    </div>
                    <div>
                      <label className="text-[13px] font-black text-indigo-400 uppercase block mb-3 tracking-widest">אופן טיפול מומלץ להתערבות</label>
                      <textarea rows={3} className="w-full p-6 bg-indigo-50/20 rounded-[2rem] border border-indigo-50 text-base font-bold outline-none text-right shadow-inner" value={newTask.recommendedIntervention} onChange={e => setNewTask(p => ({ ...p, recommendedIntervention: e.target.value }))} placeholder="המלצה מקצועית..." />
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div>
                      <label className="text-[13px] font-black text-slate-400 uppercase block mb-3 tracking-widest">גורם מדווח (מנהל/עו"ס/רכז/מדריך)</label>
                      <input required className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-base font-bold outline-none text-right shadow-inner" value={newTask.reportingSource} onChange={e => setNewTask(p => ({ ...p, reportingSource: e.target.value }))} placeholder="מי המדווח?" />
                    </div>
                    <div>
                      <label className="text-[13px] font-black text-slate-400 uppercase block mb-3 tracking-widest">צוות שיש לערב להצלחת הטיפול</label>
                      <input className="w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-base font-bold outline-none text-right shadow-inner" value={newTask.teamInvolved} onChange={e => setNewTask(p => ({ ...p, teamInvolved: e.target.value }))} placeholder="אנשי צוות מעורבים..." />
                    </div>
                    <div>
                      <label className="text-[13px] font-black text-sky-500 uppercase block mb-3 tracking-widest">אילו פעולות ננקטו</label>
                      <textarea rows={2} className="w-full p-6 bg-sky-50/20 rounded-[2rem] border border-sky-50 text-base font-bold outline-none italic text-right shadow-inner" value={newTask.actionsTaken} onChange={e => setNewTask(p => ({ ...p, actionsTaken: e.target.value }))} placeholder="מה בוצע בפועל?" />
                    </div>
                    <div>
                      <label className="text-[13px] font-black text-emerald-600 uppercase block mb-3 tracking-widest">למידה ומסקנות</label>
                      <textarea rows={2} className="w-full p-6 bg-emerald-50/10 rounded-[2rem] border border-emerald-50 text-base font-bold outline-none italic text-right shadow-inner" value={newTask.conclusions} onChange={e => setNewTask(p => ({ ...p, conclusions: e.target.value }))} placeholder="מה למדנו מהאירוע?" />
                    </div>

                    <div className="flex justify-between items-end gap-10 pt-8 border-t border-slate-50">
                      <div className="flex gap-5">
                        {Object.values(TaskStatus).map(s => (
                          <button key={s} type="button" onClick={() => setNewTask(p => ({ ...p, status: s }))} className={`px-10 py-5 rounded-[2rem] text-[14px] font-black border transition-all ${newTask.status === s ? STATUS_COLORS[s] + ' shadow-2xl scale-110' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}>{s}</button>
                        ))}
                      </div>
                      <button type="submit" className={`bg-slate-900 text-white px-20 py-6 rounded-[2.5rem] font-black text-lg shadow-2xl hover:bg-sky-600 transition-all active:scale-95`}>שיגור דיווח למערכת</button>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {reports.map((report, idx) => (
              <div key={report.id} className="bg-white p-12 rounded-[4rem] border border-sky-50 luxury-shadow relative overflow-hidden group hover:bg-slate-50/50 transition-all duration-500">
                <div className={`absolute top-0 right-0 h-full w-4 ${STATUS_COLORS[report.status].split(' ')[0]}`}></div>
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                  <div className="flex items-center gap-12">
                    <div className="h-24 w-24 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-900 font-black text-4xl border-2 border-slate-50 shadow-inner group-hover:rotate-6 transition-transform">{idx + 1}</div>
                    <div className="text-right">
                      <div className="flex items-center gap-5 mb-4 justify-end md:justify-start">
                         <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{report.date}</span>
                         <span className="h-2.5 w-2.5 rounded-full bg-sky-200"></span>
                         <span className="text-[12px] font-black text-sky-600 uppercase tracking-widest italic">{report.staffName} ({report.staffRole})</span>
                      </div>
                      <h5 className="text-4xl font-black text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors">{report.essence}</h5>
                      <p className="text-slate-400 font-bold mt-2">גורם מדווח: {report.reportingSource}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <span className={`px-10 py-5 rounded-[2rem] text-[14px] font-black border uppercase tracking-widest shadow-xl ${STATUS_COLORS[report.status]}`}>{report.status}</span>
                    <div className="flex gap-5">
                      <button 
                        onClick={() => setExpandedTaskId(expandedTaskId === report.id ? null : report.id)}
                        className="h-16 w-16 rounded-[1.5rem] bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:text-sky-600 transition-all shadow-md hover:shadow-2xl"
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
                  <div className="pt-16 mt-12 border-t-2 border-slate-50 space-y-16 animate-fade-in text-right">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
                          <div className="space-y-10">
                              <div className="p-12 bg-slate-50 rounded-[4rem] border border-slate-100 shadow-inner">
                                <span className="text-[14px] font-black text-slate-400 uppercase block mb-6 tracking-widest">פירוט המקרה המלא</span>
                                <p className="text-lg font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{report.caseDetails}</p>
                              </div>
                              <div className="p-12 bg-sky-50 rounded-[4rem] border border-sky-100">
                                <span className="text-[14px] font-black text-sky-500 uppercase block mb-6 tracking-widest">למידה ומסקנות מקצועיות</span>
                                <p className="text-lg font-bold text-sky-900 italic leading-relaxed">" {report.conclusions || 'טרם הוזנו מסקנות'} "</p>
                              </div>
                          </div>
                          <div className="space-y-10">
                              <div className="p-12 bg-indigo-50/50 rounded-[4rem] border border-indigo-100 shadow-inner">
                                <span className="text-[14px] font-black text-indigo-400 uppercase block mb-6 tracking-widest">אופן טיפול מומלץ והנחיות</span>
                                <p className="text-lg font-black text-indigo-900 leading-relaxed">{report.recommendedIntervention || 'במעקב צוות'}</p>
                                <div className="mt-8 pt-8 border-t border-indigo-100">
                                   <span className="text-[12px] font-black text-indigo-300 block mb-3 uppercase">פעולות שננקטו:</span>
                                   <p className="text-base text-indigo-700">{report.actionsTaken || 'אין דיווח פעולות'}</p>
                                </div>
                              </div>
                              <div className="p-12 bg-slate-900 text-white rounded-[4rem] shadow-2xl">
                                <span className="text-[14px] font-black text-sky-400 uppercase block mb-6 tracking-widest">צוות מעורב לטיפול</span>
                                <p className="text-lg font-black">{report.teamInvolved || 'כלל הצוות'}</p>
                              </div>
                          </div>
                      </div>

                      {report.status !== TaskStatus.COMPLETED ? (
                          <div className="pt-16 border-t-2 border-slate-50 space-y-10">
                            <h6 className="text-xl font-black text-emerald-600 uppercase tracking-[0.5em] flex items-center gap-6 justify-end">
                                תיעוד טיפול התערבות וסגירת המשימה
                                <span className="h-5 w-5 rounded-full bg-emerald-500 shadow-2xl shadow-emerald-100"></span>
                            </h6>
                            <textarea 
                              className="w-full p-12 bg-white border border-emerald-100 rounded-[4rem] text-lg font-bold outline-none focus:ring-12 focus:ring-emerald-50 transition-all shadow-inner text-right" 
                              placeholder="פרט את סיכום ההתערבות לסיום המשימה הפתוחה וסגירתה..."
                              value={closureText}
                              onChange={e => setClosureText(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <button 
                                  onClick={() => handleCloseTask(report)}
                                  className="bg-emerald-500 text-white px-28 py-7 rounded-[3rem] font-black text-xl shadow-2xl hover:bg-emerald-600 transition-all active:scale-95"
                                >
                                  סגירת משימה פתוחה וסנכרון ענן
                                </button>
                            </div>
                          </div>
                      ) : report.closureSummary && (
                          <div className="p-14 bg-emerald-50 rounded-[5rem] border-2 border-emerald-100 shadow-inner group/closure relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-4 h-full bg-emerald-500"></div>
                              <span className="text-[14px] font-black text-emerald-500 uppercase block mb-6 tracking-widest">סיכום טיפול מוגמר וסגירת משימה מלאה</span>
                              <p className="text-2xl font-bold text-emerald-900 italic leading-relaxed whitespace-pre-wrap">" {report.closureSummary} "</p>
                          </div>
                      )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'archive' && (
          <div className="animate-fade-in space-y-10 text-right">
             <div className="bg-white p-16 rounded-[5rem] border border-sky-50 luxury-shadow space-y-14">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10 border-b border-sky-50 pb-10">
                   <div className="text-right">
                      <h5 className="text-[16px] font-black text-sky-700 uppercase tracking-[0.5em] flex items-center gap-6 justify-end mb-4">
                        ארכיון מסמכים וקבצים אישיים מקצועיים
                        <span className="h-5 w-5 rounded-full bg-sky-500 shadow-2xl shadow-sky-200"></span>
                      </h5>
                      <p className="text-slate-400 font-bold text-sm uppercase tracking-widest italic opacity-70">Clinical Digital Vault • Managed Architecture</p>
                   </div>
                   <div className="flex flex-wrap justify-center gap-6">
                      <button onClick={() => handleFileUploadTrigger('כללי')} className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] text-[13px] font-black shadow-2xl hover:bg-sky-600 transition-all">העלאת מסמך כללי</button>
                      <button onClick={() => handleFileUploadTrigger('רפואי')} className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] text-[13px] font-black shadow-2xl hover:bg-indigo-700 transition-all">העלאת מסמך רפואי</button>
                      <button onClick={() => handleFileUploadTrigger('תפקודי')} className="bg-emerald-600 text-white px-12 py-5 rounded-[2rem] text-[13px] font-black shadow-2xl hover:bg-emerald-700 transition-all">העלאת מסמך תפקודי</button>
                   </div>
                </div>

                <input type="file" ref={fileAttachmentRef} hidden onChange={handleFileChange} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                   {(['כללי', 'רפואי', 'תפקודי'] as const).map(type => {
                     const typeAttachments = resident.attachments.filter(a => a.type === type);
                     return (
                       <div key={type} className="bg-slate-50/50 p-10 rounded-[4rem] border border-slate-100 flex flex-col min-h-[500px] shadow-sm">
                          <div className="flex justify-between items-center mb-10 border-b-2 border-slate-200 pb-6">
                             <span className="bg-sky-100 text-sky-700 px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-widest">{typeAttachments.length} פריטים</span>
                             <h6 className="text-2xl font-black text-slate-800">מסמכי {type}</h6>
                          </div>

                          <div className="space-y-6 flex-grow overflow-y-auto no-scrollbar pr-4">
                             {typeAttachments.length === 0 ? (
                               <div className="h-full flex flex-col items-center justify-center opacity-20 italic text-slate-400">
                                  <span className="text-6xl mb-6">📂</span>
                                  <span className="text-sm font-black uppercase tracking-widest">ריק</span>
                               </div>
                             ) : (
                               typeAttachments.map(att => (
                                 <div key={att.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-2xl hover:border-sky-100 transition-all animate-fade-in hover:-translate-y-1">
                                    <div className="flex items-center gap-5">
                                       <button 
                                         onClick={() => handleDeleteFile(att.id)}
                                         className="h-12 w-12 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm"
                                         title="מחיקה מהמערכת"
                                       >
                                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                       </button>
                                       <div className="text-right">
                                          <div className="text-[13px] font-black text-slate-800 truncate max-w-[150px]">{att.name}</div>
                                          <div className="text-[10px] font-bold text-slate-300 italic uppercase mt-1">{att.date}</div>
                                       </div>
                                    </div>
                                    <button 
                                      onClick={() => viewFile(att.url)}
                                      className="h-14 w-14 bg-sky-50 text-sky-400 hover:text-white hover:bg-sky-500 rounded-2xl flex items-center justify-center transition-all shadow-inner text-2xl"
                                    >
                                       📄
                                    </button>
                                 </div>
                               ))
                             )}
                          </div>
                       </div>
                     );
                   })}
                </div>
             </div>
          </div>
        )}
      </div>

      <div className={`p-14 bg-navy-gradient rounded-[5rem] text-center border border-white/10 shadow-2xl relative overflow-hidden mx-auto max-w-2xl mt-10`}>
          <div className="absolute top-0 left-0 w-full h-2 bg-sky-500/50"></div>
          <span className="text-[12px] font-black text-sky-400 uppercase tracking-[0.7em] block mb-6 opacity-80 italic">Aviv Clinical Infrastructure Architecture</span>
          <span className="text-4xl font-black text-white tracking-tight drop-shadow-2xl">{BRAND_SIGNATURE}</span>
          <p className="text-[10px] font-bold text-sky-300 mt-4 uppercase tracking-[0.4em]">{BRAND_TAGLINE}</p>
      </div>
    </div>
  );
};

export default ResidentProfile;
