import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type UseIdleLogoutOpts = {
  timeoutMs?: number;     
  warnMs?: number;       
  onLogout: () => void | Promise<void>;
};

const LS_KEY = 'idle.lastActiveAt';
const CHANNEL_NAME = 'idle-logout';

export function useIdleLogout({
  timeoutMs = 60 * 60 * 1000,
  warnMs = 60 * 1000,
  onLogout,
}: UseIdleLogoutOpts) {
  const [now, setNow] = useState(() => Date.now());
  const [isWarning, setIsWarning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const bcRef = useRef<BroadcastChannel | null>(null);

  const markActivity = useCallback(() => {
    const ts = Date.now();
    localStorage.setItem(LS_KEY, String(ts));
    if (bcRef.current) bcRef.current.postMessage({ type: 'activity', ts });
    setIsWarning(false);
    setNow(ts);
  }, []);

  const lastActive = useMemo(() => Number(localStorage.getItem(LS_KEY)) || Date.now(), [now]);
  const diff = useMemo(() => Date.now() - lastActive, [lastActive, now]);
  const timeLeftMs = Math.max(0, timeoutMs - diff);

  useEffect(() => {
    if (!localStorage.getItem(LS_KEY)) {
      localStorage.setItem(LS_KEY, String(Date.now()));
    }
    try {
      bcRef.current = new BroadcastChannel(CHANNEL_NAME);
      bcRef.current.onmessage = (e) => {
        if (e?.data?.type === 'activity' && typeof e.data.ts === 'number') {
          setNow(e.data.ts);
        }
      };
    } catch {  }

    const onAnyActivity = () => markActivity();
    const onVisibility = () => { if (document.visibilityState === 'visible') markActivity(); };

    const opts: AddEventListenerOptions | boolean = { passive: true };
    window.addEventListener('mousemove', onAnyActivity, opts);
    window.addEventListener('mousedown', onAnyActivity, opts);
    window.addEventListener('keydown', onAnyActivity);
    window.addEventListener('scroll', onAnyActivity, opts);
    window.addEventListener('touchstart', onAnyActivity, opts);
    document.addEventListener('visibilitychange', onVisibility);

   
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === LS_KEY && ev.newValue) setNow(Number(ev.newValue));
    };
    window.addEventListener('storage', onStorage);

    intervalRef.current = window.setInterval(() => {
      const last = Number(localStorage.getItem(LS_KEY)) || Date.now();
      const passed = Date.now() - last;

      if (passed >= timeoutMs) {
        Promise.resolve(onLogout()).catch(() => {});
        return;
      }
      setIsWarning(passed >= timeoutMs - warnMs);
      setNow(Date.now());
    }, 1000) as unknown as number;

    return () => {
      window.removeEventListener('mousemove', onAnyActivity);
      window.removeEventListener('mousedown', onAnyActivity);
      window.removeEventListener('keydown', onAnyActivity);
      window.removeEventListener('scroll', onAnyActivity);
      window.removeEventListener('touchstart', onAnyActivity);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('storage', onStorage);
      if (intervalRef.current) clearInterval(intervalRef.current);
      try { bcRef.current?.close(); } catch {}
    };
  }, [markActivity, onLogout, timeoutMs, warnMs]);

  return {
    isWarning,
    timeLeftMs,
    markActivity, 
  };
}
