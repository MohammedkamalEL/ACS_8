import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

// مؤقت "أنا بخير": يحفظ موعد الانتهاء، فيبقى المؤقت بعد إعادة تحميل الصفحة.
// notify: عند true يهتز الجهاز ويتغيّر عنوان التبويب لحظة الانتهاء (يُفعَّل مرة واحدة في App).
export function useCheckIn({ notify = false } = {}) {
  const [deadline, setDeadline] = useLocalStorage("sos.checkin", null);
  const [now, setNow] = useState(() => Date.now());

  // تحديث الوقت كل ثانية فقط عندما يكون مؤقت نشطًا
  useEffect(() => {
    if (!deadline) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const start = (minutes) => {
    setNow(Date.now());
    setDeadline(Date.now() + minutes * 60_000);
  };
  const confirm = () => setDeadline(null);
  // تمديد المؤقت (من الآن إن كان قد انتهى، أو من موعده إن كان جارياً)
  const extend = (minutes) => {
    setNow(Date.now());
    setDeadline((d) => Math.max(d ?? 0, Date.now()) + minutes * 60_000);
  };

  const remainingMs = deadline ? deadline - now : null;
  const expired = deadline !== null && remainingMs <= 0;

  useEffect(() => {
    if (!notify || !expired) return;
    const previousTitle = document.title;
    navigator.vibrate?.([400, 200, 400, 200, 800]);
    document.title = "⚠ لم تؤكد سلامتك | ساعدني";
    return () => {
      document.title = previousTitle;
    };
  }, [notify, expired]);

  return { deadline, remainingMs, expired, start, confirm, extend };
}
