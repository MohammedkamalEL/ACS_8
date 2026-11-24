import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useCheckIn } from "../hooks/useCheckIn";
import { useActivityLog } from "../hooks/useActivityLog";
import { usePersonalContacts } from "../hooks/usePersonalData";
import Icon from "../components/Icon";
import { formatCountdown, smsLink, toTel } from "../utils";
import { CHECKIN_EXTEND_MINUTES, CHECKIN_PRESETS } from "../data/options";

const ALERT_MESSAGE = "لم أؤكد سلامتي في تطبيق ساعدني بعد انتهاء المؤقت. أرجو أن تتصل بي أو تطمئن عليّ.";

export default function CheckInPage() {
  const { deadline, remainingMs, expired, start, confirm, extend } = useCheckIn();
  const { contacts } = usePersonalContacts();
  const { record } = useActivityLog();
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const handleStart = (minutes) => {
    start(minutes);
    record("checkin", `مؤقت ${minutes} دقيقة`);
  };

  const active = deadline !== null && !expired;

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-black text-gray-900 outline-none">
        أنا بخير؟
      </h1>

      {!deadline && (
        <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6">
          <p className="text-gray-700">
            عند خروجك لمكان غير مألوف أو سفر أو عمل ليلي، اختر مدة. إن لم تؤكد سلامتك قبل انتهائها، يهتز جهازك وتظهر لك جهات الاتصال فوراً.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CHECKIN_PRESETS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleStart(m)}
                className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-2xl border border-gray-300 bg-white font-bold text-gray-900 hover:border-sos hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
              >
                <span className="text-2xl">{m}</span>
                <span className="text-xs font-semibold text-gray-600">دقيقة</span>
              </button>
            ))}
          </div>
          {/* <p className="text-sm text-gray-600">
            هذا تذكير على جهازك فقط ويحتاج بقاء التطبيق مفتوحًا. لا يُرسل أي تنبيه تلقائي لأحد.
          </p> */}
        </div>
      )}

      {active && (
        <div className="space-y-5 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <p className="font-semibold text-green-800">المؤقت يعمل</p>
          <p dir="ltr" className="font-mono text-6xl font-black tabular-nums text-gray-900">
            {formatCountdown(remainingMs)}
          </p>
          <button
            type="button"
            onClick={confirm}
            className="inline-flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-green-600 text-lg font-bold text-white hover:bg-green-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
          >
            <Icon name="check" className="size-5" />
            أنا بخير، أوقف المؤقت
          </button>
          <button
            type="button"
            onClick={() => extend(CHECKIN_EXTEND_MINUTES)}
            className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-green-300 bg-white font-semibold text-green-800 hover:bg-green-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
          >
            <Icon name="plus" className="size-4" />
            تمديد {CHECKIN_EXTEND_MINUTES} دقيقة
          </button>
        </div>
      )}

      {expired && (
        <div role="alert" className="space-y-5 rounded-2xl border-2 border-red-500 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <Icon name="alert" className="mt-1 size-7 shrink-0 text-red-700" />
            <div>
              <p className="text-xl font-black text-red-800">انتهى الوقت دون تأكيد سلامتك</p>
              <p className="mt-1 text-sm text-red-900">اتصل بمن تثق بهم الآن، أو اطلب المساعدة الرسمية.</p>
            </div>
          </div>

          {contacts.length > 0 && (
            <ul className="grid gap-3">
              {contacts.map((c) => (
                <li key={c.id}>
                  <div className="flex gap-2">
                    <a
                      href={toTel(c.phone)}
                      onClick={() => record("call", c.name)}
                      aria-label={`اتصل بـ${c.name}`}
                      className="flex min-h-14 flex-1 items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 font-bold text-gray-900 ring-1 ring-red-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300"
                    >
                      <span>اتصل بـ{c.name}</span>
                      <Icon name="phone" className="size-5 text-green-700" />
                    </a>
                    <a
                      href={smsLink(c.phone, ALERT_MESSAGE)}
                      onClick={() => record("sms", c.name)}
                      aria-label={`أرسل رسالة اطمئنان إلى ${c.name}`}
                      className="inline-flex min-h-14 w-14 items-center justify-center rounded-xl bg-white text-gray-800 ring-1 ring-red-200 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300"
                    >
                      <Icon name="message" className="size-5" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/sos"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-sos font-bold text-white hover:bg-sos-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200"
            >
              الطوارئ الآن
            </Link>
            <button
              type="button"
              onClick={confirm}
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-200"
            >
              أنا بخير الآن
            </button>
            <button
              type="button"
              onClick={() => extend(CHECKIN_EXTEND_MINUTES)}
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-200 sm:col-span-2"
            >
              أحتاج {CHECKIN_EXTEND_MINUTES} دقيقة إضافية
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
