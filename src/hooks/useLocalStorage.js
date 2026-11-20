import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

const listeners = new Set();
const memory = new Map();


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

export function useLocalStorage(key, initialValue) {
  const [initial] = useState(initialValue);
  const raw = useSyncExternalStore(subscribe, () => readRaw(key));
  const value = useMemo(() => parse(raw, initial), [raw, initial]);

  const update = useCallback(
    (next) => {
      const prev = parse(readRaw(key), initial);
      const resolved = typeof next === "function" ? next(prev) : next;
      writeRaw(key, JSON.stringify(resolved));
    },
    [key, initial]
  );

  return [value, update];
}
