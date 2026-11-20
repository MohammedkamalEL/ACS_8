import { useLocalStorage } from "./useLocalStorage";

const MAX_ENTRIES = 30;

const makeId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export function useActivityLog() {
  const [log, setLog] = useLocalStorage("sos.log", []);

  const record = (type, label) =>
    setLog((list) => [{ id: makeId(), type, label, at: Date.now() }, ...list].slice(0, MAX_ENTRIES));

  const clear = () => setLog([]);

  return { log, record, clear };
}
