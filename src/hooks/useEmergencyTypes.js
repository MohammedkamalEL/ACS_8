import { useEffect, useState } from "react";
import { getCachedEmergencyTypes, getEmergencyType, getEmergencyTypes } from "../api";

// كل أنواع الطوارئ: loading ثم ready أو error. تبدأ ready فوراً إن كانت البيانات جاهزة.
export function useEmergencyTypes() {
  const [state, setState] = useState(() => {
    const cached = getCachedEmergencyTypes();
    return cached ? { status: "ready", data: cached } : { status: "loading", data: [] };
  });

  useEffect(() => {
    let alive = true;
    getEmergencyTypes()
      .then((data) => alive && setState({ status: "ready", data }))
      .catch(() => alive && setState((s) => (s.status === "ready" ? s : { status: "error", data: [] })));
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

// نوع طوارئ واحد: loading ثم ready أو notfound أو error
export function useEmergencyType(id) {
  const [state, setState] = useState(() => {
    const found = getCachedEmergencyTypes()?.find((t) => t.id === id);
    return found ? { status: "ready", data: found } : { status: "loading", data: null };
  });

  useEffect(() => {
    let alive = true;
    getEmergencyType(id)
      .then((data) => alive && setState({ status: data ? "ready" : "notfound", data }))
      .catch(() => alive && setState({ status: "error", data: null }));
    return () => {
      alive = false;
    };
  }, [id]);

  return state;
}
