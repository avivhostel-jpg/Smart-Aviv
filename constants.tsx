
import { House, TaskStatus, StaffRole, Resident } from './types';

export const APP_NAME = "אביב בקהילה - רמלה ראשל\"צ";
export const APP_SUBTITLE = "מערכת חכמה לניהול ובקרה טיפולית מתקדמת";
export const BRAND_SIGNATURE = "עמית שטיינברג";
export const BRAND_SIGNATURE_EN = "AMIT SHTINBERG";
export const BRAND_TAGLINE = "Elite Clinical Infrastructure • System Monitoring";

export const METALLIC_BLUE = "bg-slate-900";
export const METALLIC_GRADIENT = "from-[#0F172A] via-[#1E293B] to-[#334155]";
export const GOLD_GRADIENT = "from-amber-400 via-amber-500 to-amber-600";
export const BRAND_WHITE = "text-white";

export const ROLE_CODES: Record<string, StaffRole> = {
  "0001": "מנהל",
  "0002": 'עו"ס',
  "0003": "רכז דירות",
  "0005": "מזכירה מנהלית",
  "0000": "בעלים"
};

export const STAFF_ROLES: StaffRole[] = ['מנהל', 'עו"ס', 'רכז דירות', 'מזכירה מנהלית', 'בעלים'];

export const HOUSES: Record<string, House> = {
  'shikma': {
    id: 'shikma',
    name: 'שיקמה',
    residentCount: 24,
    icon: '🏢',
    color: 'bg-indigo-600',
    location: 'הוסטל ותיקים'
  },
  'marzuk': {
    id: 'marzuk',
    name: 'מרזוק',
    residentCount: 6,
    icon: '🏠',
    color: 'bg-blue-600',
    location: 'דירת קהילה'
  },
  'savyon': {
    id: 'savyon',
    name: 'סביון',
    residentCount: 10,
    icon: '🏡',
    color: 'bg-cyan-600',
    location: 'דירת מעבר'
  },
  'revadim': {
    id: 'revadim',
    name: 'רבדים',
    residentCount: 13,
    icon: '🏛️',
    color: 'bg-emerald-600',
    location: 'ראשון לציון'
  }
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.OPEN]: 'bg-rose-500 text-white border-rose-600',
  [TaskStatus.IN_PROGRESS]: 'bg-amber-500 text-white border-amber-600',
  [TaskStatus.COMPLETED]: 'bg-sky-600 text-white border-sky-700',
};

export const generateInitialResidents = (): Resident[] => {
  const residents: Resident[] = [];

  const createRes = (houseId: string, fName: string, lName: string, tz: string, dob: string, entry: string, tariff: string, framework: string): Resident => ({
    id: `${houseId.substring(0,2).toUpperCase()}-${tz.slice(-4)}`,
    tz, firstName: fName, lastName: lName, houseName: HOUSES[houseId].name,
    dob, entryDate: entry, tariffCode: tariff, frameworkCode: framework,
    description: `תיק דייר מקצועי - ${fName} ${lName}.`,
    phone: '050-0000000', guardian: 'טרם הוזן', riskManagement: 'אין מידע חריג',
    promotionPlan: 'תכנית קידום אישית בבניה', workplace: 'תעסוקה מוגנת', medicalInfo: 'תקין', recommendedTreatment: 'ליווי צוות שבועי',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tz}`,
    attachments: []
  });

  // מרזוק
  residents.push(createRes('marzuk', 'סופיה', 'עלין', '320697436', '1978-09-29', '2007-11-20', '362', '2303'));
  residents.push(createRes('marzuk', 'דוד', 'קוגל', '027407816', '1974-07-02', '2003-09-01', '364', '2303'));
  residents.push(createRes('marzuk', 'קובי', 'לנקרי', '039492624', '1984-01-28', '2009-11-01', '362', '2303'));
  residents.push(createRes('marzuk', 'שירה', 'חרצק', '032167751', '1975-03-17', '2003-01-06', '362', '2303'));
  residents.push(createRes('marzuk', 'נורית', 'הוט', '57775603', '1975-10-16', '2007-02-28', '364', '2303'));
  residents.push(createRes('marzuk', 'אביבה', 'נאצו פטפטה', '310970793', '1990-04-01', '2022-11-10', '363', '2303'));

  // סביון
  residents.push(createRes('savyon', 'אלירן', 'דוידוב', '301138038', '1987-09-06', '2008-09-21', '362', '2303'));
  residents.push(createRes('savyon', 'אולגה', 'פולבדין', '317419539', '1972-10-04', '2005-06-14', '362', '2303'));
  residents.push(createRes('savyon', 'דיאנה', 'רוזיליו', '29721057', '1972-09-22', '2003-06-08', '362', '2303'));
  residents.push(createRes('savyon', 'רחמים', 'פנחס', '38740205', '1983-05-17', '2008-12-01', '362', '5178'));
  residents.push(createRes('savyon', 'יורי', 'אברמוב', '303771059', '1980-12-15', '2005-06-01', '363', '2303'));
  residents.push(createRes('savyon', 'סיוון', 'דביר', '27404763', '1974-06-11', '2006-05-15', '363', '2303'));
  residents.push(createRes('savyon', 'אלכסנדר', 'סנדלר', '321377616', '1965-10-25', '2018-02-19', '363', '2303'));
  residents.push(createRes('savyon', 'דניאל', 'קופרשמיד', '309183291', '1971-09-19', '2015-05-25', '363', '2303'));
  residents.push(createRes('savyon', 'ליטל', 'סמסון', '301535712', '1988-03-12', '2018-08-21', '363', '5178'));
  residents.push(createRes('savyon', 'אלירן', 'שרון', '201435708', '1990-05-31', '2014-05-26', '363', '5178'));

  // רבדים
  residents.push(createRes('revadim', 'ערן', 'וינשטוק', '029383114', '1972-05-01', '2012-12-03', '363', '5178'));
  residents.push(createRes('revadim', 'ניר', 'לוי', '032493066', '1986-06-10', '2017-12-04', '363', '5178'));
  residents.push(createRes('revadim', 'דוד', 'בן ציון', '56106495', '1959-11-02', '2022-08-08', '363', '2303'));
  residents.push(createRes('revadim', 'דן', 'אחרן', '037458148', '1980-05-16', '2012-12-03', '363', '5178'));
  residents.push(createRes('revadim', 'שירלי', 'בן דוד', '040360190', '1980-11-29', '2002-01-01', '372', '5178'));
  residents.push(createRes('revadim', 'רבקה', 'טביב', '021698576', '1985-08-14', '2024-02-04', '362', '2303'));
  residents.push(createRes('revadim', 'יאיר', 'ספצ\'ק', '037042678', '1985-05-31', '2013-01-20', '363', '5178'));
  residents.push(createRes('revadim', 'יניב', 'גת רימון', '21605167', '1985-08-24', '2011-05-31', '363', '5178'));
  residents.push(createRes('revadim', 'רווית', 'רגב', '33558214', '1976-11-18', '2012-12-03', '363', '5178'));
  residents.push(createRes('revadim', 'יעקב', 'עובדיה', '040852949', '1981-05-30', '2012-07-02', '363', '5178'));
  residents.push(createRes('revadim', 'ארז', 'סמל', '39980164', '1983-05-01', '2018-06-26', '372', '5178'));
  residents.push(createRes('revadim', 'נילי', 'שמול', '21924204', '1986-05-29', '2025-01-01', '362', '2303'));
  residents.push(createRes('revadim', 'אורית', 'פרוג', '21474986', '1980-01-05', '2025-07-27', '363', '5178'));

  // שקמה
  residents.push(createRes('shikma', 'לבנה', 'בן ישעיהו', '31695364', '1978-05-21', '2023-12-03', '362', '2303'));
  residents.push(createRes('shikma', 'נורית', 'צריקר', '38322418', '1976-02-26', '2013-10-13', '363', '5178'));
  residents.push(createRes('shikma', 'לאה', 'דבח', '24269227', '1969-08-14', '2005-05-15', '362', '2303'));
  residents.push(createRes('shikma', 'שמחה', 'דבי', '57213787', '1961-06-25', '2002-03-28', '362', '2303'));
  residents.push(createRes('shikma', 'הילה', 'מסיקה', '40321176', '1980-05-20', '2006-04-23', '362', '2303'));
  residents.push(createRes('shikma', 'יוגב', 'אביני', '60868940', '1982-09-25', '2019-11-26', '363', '2303'));
  residents.push(createRes('shikma', 'נאור', 'אביני', '30106794', '1987-10-28', '2006-08-01', '363', '2303'));
  residents.push(createRes('shikma', 'אילן', 'דאודי', '58638537', '1964-02-20', '2006-12-25', '363', '2303'));
  residents.push(createRes('shikma', 'שמחה', 'דנדקר', '23982440', '1968-12-19', '2011-04-06', '363', '2303'));
  residents.push(createRes('shikma', 'איציק', 'ואנונו', '23543549', '1968-06-13', '2003-08-03', '363', '2303'));
  residents.push(createRes('shikma', 'תהילה', 'יפרח', '205659535', '1994-09-10', '2015-05-10', '363', '2303'));
  residents.push(createRes('shikma', 'רחמים', 'מורדוך', '56030281', '1959-06-16', '2002-02-04', '363', '2303'));
  residents.push(createRes('shikma', 'יעל', 'מזרחי בגדדי', '22102784', '1967-09-20', '2001-08-15', '363', '2303'));
  residents.push(createRes('shikma', 'נטלי', 'נבאתי', '37721412', '1983-11-15', '2003-07-06', '363', '2303'));
  residents.push(createRes('shikma', 'ברוך', 'סייהו', '10346237', '1950-04-09', '2015-02-01', '363', '2303'));
  residents.push(createRes('shikma', 'אדיסו', 'סלומון', '309613792', '1968-01-01', '2013-02-17', '363', '5178'));
  residents.push(createRes('shikma', 'גילת', 'דיין', '36904910', '1985-04-05', '2020-11-18', '372', '5178'));
  residents.push(createRes('shikma', 'משה', 'חברון', '206579070', '1999-12-31', '2021-07-04', '372', '5178'));
  residents.push(createRes('shikma', 'גיל', 'חיימוביץ\'', '302580907', '1984-03-31', '2019-06-05', '372', '5178'));
  residents.push(createRes('shikma', 'ברוך', 'כהן', '28010999', '1970-09-11', '2021-11-28', '372', '5178'));
  residents.push(createRes('shikma', 'נתנאל', 'מימון', '207070731', '1996-02-19', '2016-02-15', '372', '5178'));
  residents.push(createRes('shikma', 'שלום', 'עוזיאל', '24005902', '1968-08-21', '2022-02-16', '372', '5178'));
  residents.push(createRes('shikma', 'רן', 'קשנובסקי', '209511443', '1998-08-08', '2020-02-03', '372', '5178'));
  residents.push(createRes('shikma', 'אלעד', 'קחלון', '205988330', '1994-09-16', '2023-10-09', '362', '2303'));

  return residents;
};
