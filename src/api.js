import { EMERGENCY_TYPES } from "./data/emergencyTypes";

// طبقة الوصول للبيانات (الوحيدة التي تعرف مصدر البيانات).
//
// - بدون VITE_API_URL: تُرجع البيانات المحلية فوراً (بلا تأخير مصطنع، فالسرعة مهمة وقت الطوارئ).
// - مع VITE_API_URL في ملف .env.local: تجلب من الخادم مرة واحدة وتحتفظ بالنتيجة في الذاكرة.
// - آخر رد ناجح من الخادم يُحفظ على الجهاز، فيظهر فوراً في الزيارة التالية ثم يتحدّث بهدوء.
// - إن فشل الخادم أو انقطع الإنترنت: ترجع للنسخة المحفوظة، ثم للبيانات المضمّنة في التطبيق،
//   فلا تبقى الشاشة فارغة أبداً.
//
// شكل الرد المتوقع من الخادم لـ GET {VITE_API_URL}/emergency-types:
//   [{ id, title, description, keywords?, icon, tone, instructions: [], contacts: [{ id, name, number, note }] }]

const API_URL = import.meta.env.VITE_API_URL;
const TIMEOUT_MS = 5000;

const STORAGE_KEY = "sos.types";

let cache = null; // آخر قائمة جُلبت بنجاح خلال هذه الجلسة

const readStored = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) && data.length > 0 ? data : null;
  } catch {
    return null;
  }
};

const store = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* التخزين ممتلئ أو معطّل: لا يؤثر على التطبيق */
  }
};

// يُستخدم لعرض الشاشة فوراً دون حالة تحميل إن كانت البيانات جاهزة مسبقاً
export const getCachedEmergencyTypes = () => cache ?? (API_URL ? readStored() : EMERGENCY_TYPES);

async function fetchFromServer() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${API_URL}/emergency-types`, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) throw new Error("بيانات غير صالحة");
    return data;
  } finally {
    clearTimeout(timer);
  }
}

// جلب كل أنواع الطوارئ
export async function getEmergencyTypes() {
  if (cache) return cache;
  if (!API_URL) return EMERGENCY_TYPES;
  try {
    cache = await fetchFromServer();
    store(cache);
    return cache;
  } catch {
    return readStored() ?? EMERGENCY_TYPES; // احتياطي عند أي فشل
  }
}

// جلب نوع واحد بالمعرّف، أو null إن لم يوجد
export async function getEmergencyType(id) {
  const all = await getEmergencyTypes();
  return all.find((t) => t.id === id) ?? null;
}
