import { useState } from "react";
import { useEmergencyTypes } from "../hooks/useEmergencyTypes";
import SosButton from "../components/SosButton";
import TypeCard from "../components/TypeCard";
import StateMessage from "../components/StateMessage";
import Icon from "../components/Icon";
import InstallButton from "../components/InstallButton";
import { Link } from "react-router-dom";
import { usePersonalContacts, useMedicalProfile } from "../hooks/usePersonalData";
import { matchesQuery } from "../utils";

export default function HomePage() {
  const { status, data } = useEmergencyTypes();
  const [query, setQuery] = useState("");

  const { contacts } = usePersonalContacts();
  const { profile } = useMedicalProfile();

  const filtered = data.filter((t) => matchesQuery(t, query));

  const hasMedical = Boolean(profile.bloodType || profile.allergies || profile.conditions || profile.medications);
  const needsSetup = contacts.length === 0 || !hasMedical;

  return (
    <>
      <section className="mx-auto max-w-3xl px-4 pb-8 pt-8">
        <h1 className="text-3xl font-black">ساعدني | SOS</h1>
        <p className="mt-1 text-gray-600">الوصول السريع للمساعدة وقت الطوارئ</p>
        <SosButton />
        <InstallButton />
      </section>

      {needsSetup && (
        <p className="mx-auto mb-6 max-w-3xl px-4 text-sm text-gray-700">
          {contacts.length === 0 ? "لم تضف جهة طوارئ بعد. " : "بطاقتك الطبية فارغة. "}
          <Link to="/contacts" className="text-sos underline">
            افتح «جهاتي»
          </Link> وأكمل بياناتك قبل أن تحتاجها.
        </p>
      )}

      <section id="types" className="mx-auto max-w-3xl scroll-mt-20 px-4 pb-14">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold">ما نوع الطوارئ؟</h2>
          <label className="relative block sm:w-64">
            <span className="sr-only">ابحث عن نوع الطوارئ</span>
            <Icon name="search" className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-500" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث، مثل: حريق"
              className="h-11 w-full rounded-lg border border-gray-400 bg-white ps-10 pe-4 text-gray-900 placeholder:text-gray-500 focus:border-sos focus:outline-none focus:ring-4 focus:ring-red-100"
            />
          </label>
        </div>

        {status === "loading" && (
          <ul className="border-t border-gray-300" aria-label="جاري التحميل">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className="h-16 animate-pulse border-b border-gray-300 bg-gray-100" />
            ))}
          </ul>
        )}

        {status === "error" && (
          <StateMessage tone="error" title="تعذّر تحميل خيارات الطوارئ" hint="حاول تحديث الصفحة." />
        )}

        {status === "ready" && filtered.length > 0 && (
          <ul className="border-t border-gray-300">
            {filtered.map((type) => (
              <TypeCard key={type.id} type={type} />
            ))}
          </ul>
        )}

        {status === "ready" && filtered.length === 0 && (
          <StateMessage title="لا توجد نتائج مطابقة" hint="جرّب كلمة أخرى، أو اضغط SOS للاتصال السريع." />
        )}

      </section>
    </>
  );
}
