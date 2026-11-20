import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useEmergencyTypes } from "../hooks/useEmergencyTypes";
import { usePersonalContacts, useMedicalProfile } from "../hooks/usePersonalData";
import { useActivityLog } from "../hooks/useActivityLog";
import Icon from "../components/Icon";
import StateMessage from "../components/StateMessage";
import Disclaimer from "../components/Disclaimer";
import { useGeolocation } from "../hooks/useGeolocation";
import { buildEmergencyMessage, shareText, smsLink, toTel } from "../utils";

// الاتصالات الرسمية المباشرة: كل زر يتصل بضغطة واحدة
const DIRECT_CALLS = [
  { typeId: "health", label: "الإسعاف", icon: "heart", tone: "bg-rose-600 hover:bg-rose-700" },
  { typeId: "security", label: "الشرطة", icon: "shield", tone: "bg-sky-700 hover:bg-sky-800" },
  { typeId: "fire", label: "الإطفاء", icon: "flame", tone: "bg-orange-600 hover:bg-orange-700" },
];

const GEO_FEEDBACK = {
  loading: "جارٍ تحديد موقعك...",
  denied: "لم يُسمح بالوصول للموقع. اكتب موقعك بالكلمات بدلاً من ذلك.",
  timeout: "استغرق تحديد الموقع وقتاً طويلاً. اكتب موقعك بالكلمات أو حاول مرة أخرى.",
  unavailable: "تعذّر تحديد الموقع على هذا الجهاز. اكتب موقعك بالكلمات.",
};

const SHARE_FEEDBACK = {
  copied: "تم نسخ رسالة الطوارئ، الصقها في أي تطبيق للمراسلة",
  failed: "تعذّر نسخ الرسالة، حاول مرة أخرى",
};

// شاشة الطوارئ: الاتصالات الرسمية، ثم جهات الطوارئ الشخصية، ثم الرسالة والبطاقة الطبية
export default function SosPage() {
  const { status, data } = useEmergencyTypes();
  const { contacts } = usePersonalContacts();
  const { profile } = useMedicalProfile();
  const { record } = useActivityLog();
  const geo = useGeolocation();
  const [location, setLocation] = useState("");
  const [feedback, setFeedback] = useState("");
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const official = DIRECT_CALLS.map((item) => {
    const type = data.find((t) => t.id === item.typeId);
    const contact = type?.contacts.find((c) => c.number);
    return { ...item, number: contact?.number ?? null };
  });

  const message = buildEmergencyMessage({ name: profile.name, location, coords: geo.coords, profile });
  const hasMedical = [profile.bloodType, profile.allergies, profile.conditions, profile.medications].some(
    (v) => v && v.trim()
  );

  const handleShare = async () => {
    const result = await shareText(message);
    if (result === "shared" || result === "copied") record("share", "رسالة الطوارئ");
    setFeedback(SHARE_FEEDBACK[result] ?? "");
  };

  return (
    <section className="mx-auto max-w-3xl space-y-7 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-black text-sos outline-none">
          الطوارئ الآن
        </h1>
        <Link
          to="/"
          className="rounded-lg px-3 py-2 text-sm font-semibold text-stone-600 transition hover:bg-stone-200/60 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-300"
        >
          إلغاء
        </Link>
      </div>

      {/* 1. الاتصالات الرسمية */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-stone-600">الجهات الرسمية</h2>
        {status === "loading" && (
          <div className="grid gap-3" aria-label="جاري التحميل">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-stone-200/70" />
            ))}
          </div>
        )}
        {status === "error" && (
          <StateMessage tone="error" title="تعذّر تحميل الاتصالات" hint="جرّب فتح خيارات الطوارئ من الرئيسية." />
        )}
        {status === "ready" && (
          <ul className="grid gap-3">
            {official.map((call) =>
              call.number ? (
                <li key={call.typeId}>
                  <a
                    href={toTel(call.number)}
                    onClick={() => record("call", call.label)}
                    aria-label={`اتصل بـ${call.label} على الرقم ${call.number}`}
                    className={`flex min-h-24 items-center justify-between gap-4 rounded-2xl px-6 py-5 text-white shadow-lg transition focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-stone-300 active:scale-[0.98] ${call.tone}`}
                  >
                    <span className="flex items-center gap-4">
                      <Icon name={call.icon} className="size-9" />
                      <span className="text-2xl font-black">اتصل بـ{call.label}</span>
                    </span>
                    <span dir="ltr" className="font-mono text-lg font-bold tabular-nums opacity-90">
                      {call.number}
                    </span>
                  </a>
                </li>
              ) : (
                <li key={call.typeId} className="rounded-2xl border border-stone-200 bg-white p-5 text-stone-600">
                  {call.label}: لا يتوفر رقم مباشر
                </li>
              )
            )}
          </ul>
        )}
      </div>

      <Link
        to="/#types"
        className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4 text-sm font-semibold text-stone-800 shadow-sm hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-200"
      >
        <span>حالة أخرى؟ حادث مروري، لدغة، شخص مفقود...</span>
        <Icon name="chevron" className="size-5 text-stone-400" />
      </Link>

      {/* 2. جهات الطوارئ الشخصية */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-600">جهات طوارئي</h2>
          <Link to="/contacts" className="text-sm font-semibold text-sos hover:underline">
            إدارة الجهات
          </Link>
        </div>
        {contacts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-5 text-center text-sm text-stone-600">
            لم تضف جهات بعد. <Link to="/contacts" className="font-semibold text-sos hover:underline">أضف شخصًا تثق به</Link>
          </p>
        ) : (
          <ul className="grid gap-3">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
                <div className="min-w-0">
                  <p className="truncate font-bold text-stone-900">{c.name}</p>
                  <p dir="ltr" className="font-mono text-sm text-stone-600">
                    {c.phone}
                    {c.relation && <span className="ms-2 font-sans text-stone-500">({c.relation})</span>}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={smsLink(c.phone, message)}
                    onClick={() => record("sms", c.name)}
                    aria-label={`أرسل رسالة طوارئ إلى ${c.name}`}
                    className="inline-flex h-11 items-center gap-2 rounded-xl border border-stone-300 bg-white px-3 text-sm font-semibold text-stone-800 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-200"
                  >
                    <Icon name="message" className="size-4" />
                    رسالة
                  </a>
                  <a
                    href={toTel(c.phone)}
                    onClick={() => record("call", c.name)}
                    aria-label={`اتصل بـ${c.name}`}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                  >
                    <Icon name="phone" className="size-4" />
                    اتصل
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 3. الرسالة والموقع */}
      <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-stone-900">أرسل موقعك للآخرين</h2>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-stone-700">موقعك باختصار</span>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="مثال: شارع الجامعة قرب الصيدلية الخضراء"
            className="h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-stone-900 placeholder:text-stone-500 focus:border-sos focus:outline-none focus:ring-4 focus:ring-rose-100"
          />
        </label>

        {/* موقع دقيق اختياري: لا يُطلب إلا بضغطة، ولا يعمل الباقي بدونه */}
        <button
          type="button"
          onClick={geo.request}
          disabled={geo.status === "loading"}
          className="inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-800 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-200 disabled:cursor-wait disabled:opacity-60"
        >
          <Icon name="pin" className="size-4" />
          {geo.status === "ok" ? "تحديث موقعي الدقيق" : "أضف موقعي الدقيق (اختياري)"}
        </button>
        {geo.status === "ok" && (
          <p role="status" className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
            <span>تمت إضافة رابط موقعك (الدقة نحو {geo.coords.accuracy} متر)</span>
            <button type="button" onClick={geo.clear} className="cursor-pointer text-xs underline">
              إزالة
            </button>
          </p>
        )}
        {GEO_FEEDBACK[geo.status] && (
          <p role="status" className="text-sm text-stone-700">
            {GEO_FEEDBACK[geo.status]}
          </p>
        )}

        {/* معاينة ما سيُرسل بالضبط */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-stone-700">الرسالة التي ستُرسل</p>
          <pre className="whitespace-pre-wrap break-words rounded-xl bg-stone-50 p-3 font-sans text-sm leading-6 text-stone-800 ring-1 ring-stone-200">
            {message}
          </pre>
        </div>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-stone-900 font-bold text-white transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-300"
        >
          <Icon name="share" className="size-5" />
          مشاركة رسالة الطوارئ
        </button>
        {feedback && (
          <p role="status" className="text-center text-sm text-stone-700">
            {feedback}
          </p>
        )}
      </div>

      {/* 4. البطاقة الطبية */}
      {hasMedical && (
        <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50/60 p-5">
          <h2 className="font-bold text-rose-800">البيانات الطبية</h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {profile.bloodType && <Field label="فصيلة الدم" value={profile.bloodType} />}
            {profile.allergies && <Field label="الحساسية" value={profile.allergies} />}
            {profile.conditions && <Field label="حالات مزمنة" value={profile.conditions} />}
            {profile.medications && <Field label="أدوية مستمرة" value={profile.medications} />}
          </dl>
        </div>
      )}

      <Disclaimer compact />
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm">
      <dt className="text-xs font-semibold text-stone-600">{label}</dt>
      <dd className="mt-0.5 font-bold text-stone-900">{value}</dd>
    </div>
  );
}
