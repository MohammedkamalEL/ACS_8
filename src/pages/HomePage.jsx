import { useState } from "react";
import { useEmergencyTypes } from "../hooks/useEmergencyTypes";
import SosButton from "../components/SosButton";
import TypeCard from "../components/TypeCard";
import Disclaimer from "../components/Disclaimer";
import StateMessage from "../components/StateMessage";
import Icon from "../components/Icon";
import InstallButton from "../components/InstallButton";
import { Link } from "react-router-dom";
import { usePersonalContacts, useMedicalProfile } from "../hooks/usePersonalData";
import { matchesQuery } from "../utils";

// الصفحة الرئيسية: زر SOS، ثم بحث وخيارات الطوارئ
export default function HomePage() {
  const { status, data } = useEmergencyTypes();
  const [query, setQuery] = useState("");

  const { contacts } = usePersonalContacts();
  const { profile } = useMedicalProfile();

  // البحث يتجاهل الهمزات والتشكيل ويشمل كلمات مفتاحية (مثل: عقرب، موتر، نار)
  const filtered = data.filter((t) => matchesQuery(t, query));

  // تذكير بالتجهيز المسبق: لا تُفيد الميزات الشخصية إلا إن أُعدّت قبل الطوارئ
  const hasMedical = Boolean(profile.bloodType || profile.allergies || profile.conditions || profile.medications);
  const needsSetup = contacts.length === 0 || !hasMedical;

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-10 pt-10 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-72 max-w-xl rounded-full bg-rose-200/40 blur-3xl"
        />
        <div className="relative">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-sos shadow-sm ring-1 ring-stone-200">
            <span className="size-1.5 rounded-full bg-sos" />
            تحدٍّ واقعي من السودان
          </p>
          <h1 className="mt-4 text-4xl font-black text-stone-900 sm:text-5xl">ساعدني | SOS</h1>
          <p className="mt-2 text-stone-600">الوصول السريع للمساعدة وقت الطوارئ</p>
          <SosButton />
          <p className="mt-6 text-sm text-stone-600">اضغط الزر لفتح الاتصال السريع بالإسعاف والشرطة والإطفاء</p>
          <InstallButton />
        </div>
      </section>

      {needsSetup && (
        <section className="mx-auto max-w-3xl px-4 pb-6">
          <Link
            to="/contacts"
            className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 transition hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
          >
            <Icon name="user" className="size-6 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block font-bold">جهّز نفسك قبل أن تحتاج</span>
              <span className="block text-sm">
                أضف شخصًا تثق به{!hasMedical && " وبطاقتك الطبية"}؛ يأخذ دقيقة، ويوفّر وقتك وقت الطوارئ.
              </span>
            </span>
            <Icon name="chevron" className="size-5 shrink-0" />
          </Link>
        </section>
      )}

      <section id="types" className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-14">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-stone-900">ما نوع الطوارئ؟</h2>
          <label className="relative block sm:w-64">
            <span className="sr-only">ابحث عن نوع الطوارئ</span>
            <Icon name="search" className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث، مثل: حريق"
              className="h-11 w-full rounded-xl border border-stone-300 bg-white ps-10 pe-4 text-stone-900 placeholder:text-stone-500 focus:border-sos focus:outline-none focus:ring-4 focus:ring-rose-100"
            />
          </label>
        </div>

        {status === "loading" && (
          <ul className="grid gap-3 sm:grid-cols-2" aria-label="جاري التحميل">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="h-20 animate-pulse rounded-2xl bg-stone-200/70" />
            ))}
          </ul>
        )}

        {status === "error" && (
          <StateMessage tone="error" title="تعذّر تحميل خيارات الطوارئ" hint="حاول تحديث الصفحة." />
        )}

        {status === "ready" && filtered.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {filtered.map((type) => (
              <TypeCard key={type.id} type={type} />
            ))}
          </ul>
        )}

        {status === "ready" && filtered.length === 0 && (
          <StateMessage title="لا توجد نتائج مطابقة" hint="جرّب كلمة أخرى، أو اضغط SOS للاتصال السريع." />
        )}

        <Disclaimer />
      </section>
    </>
  );
}
