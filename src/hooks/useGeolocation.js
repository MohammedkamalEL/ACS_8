import { useCallback, useState } from "react";


export function useGeolocation() {
  const [state, setState] = useState({ status: "idle", coords: null });

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState({ status: "unavailable", coords: null });
      return;
    }
    setState({ status: "loading", coords: null });
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          status: "ok",
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: Math.round(pos.coords.accuracy) },
        }),
      (err) =>
        setState({
          status: err.code === 1 ? "denied" : err.code === 3 ? "timeout" : "unavailable",
          coords: null,
        }),
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 }
    );
  }, []);

  const clear = useCallback(() => setState({ status: "idle", coords: null }), []);

  return { ...state, request, clear };
}
