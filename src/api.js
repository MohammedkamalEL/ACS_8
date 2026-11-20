import { EMERGENCY_TYPES } from "./data/emergencyTypes";
const API_URL = import.meta.env.VITE_API_URL;
const TIMEOUT_MS = 5000;

const STORAGE_KEY = "sos.types";

let cache = null;

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

export async function getEmergencyType(id) {
  const all = await getEmergencyTypes();
  return all.find((t) => t.id === id) ?? null;
}
