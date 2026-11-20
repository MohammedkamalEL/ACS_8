import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

// تخزين محلي متزامن بين كل أجزاء التطبيق:
// أي تغيير يظهر فوراً في كل مكوّن يقرأ نفس المفتاح (وبين تبويبات المتصفح أيضاً).
// كان كل مكوّن يحتفظ بنسخة خاصة، فيضيع السجل لو سجّل مكوّنان في نفس الصفحة.

const listeners = new Set();
const memory = new Map(); // احتياطي إن كان التخزين ممتلئاً أو معطّلاً: تبقى البيانات طوال الجلسة

const notify = () => listeners.forEach((l) => l());
window.addEventListener("storage", notify);

const subscribe = (cb) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const readRaw = (key) => {
  if (memory.has(key)) return memory.get(key);
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeRaw = (key, raw) => {
  try {
    localStorage.setItem(key, raw);
    memory.delete(key);
  } catch {
    memory.set(key, raw);
  }
  notify();
};

const parse = (raw, fallback) => {
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

// حالة مرتبطة بـ localStorage: تُقرأ عند البداية وتُحفظ وتُبثّ عند كل تغيير
export function useLocalStorage(key, initialValue) {
  const [initial] = useState(initialValue);
  const raw = useSyncExternalStore(subscribe, () => readRaw(key));
  const value = useMemo(() => parse(raw, initial), [raw, initial]);

  const update = useCallback(
    (next) => {
      // نحسب القيمة الجديدة من آخر نسخة محفوظة، لا من نسخة قديمة في هذا المكوّن
      const prev = parse(readRaw(key), initial);
      const resolved = typeof next === "function" ? next(prev) : next;
      writeRaw(key, JSON.stringify(resolved));
    },
    [key, initial]
  );

  return [value, update];
}
