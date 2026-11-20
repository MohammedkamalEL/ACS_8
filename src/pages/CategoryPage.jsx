import { Link, useParams } from "react-router-dom";
import { useEmergencyType } from "../hooks/useEmergencyTypes";
import Icon from "../components/Icon";
import ContactCard from "../components/ContactCard";
import Disclaimer from "../components/Disclaimer";
import { useActivityLog } from "../hooks/useActivityLog";
import StateMessage from "../components/StateMessage";
import { TONE_CLASSES, cx, toTel } from "../utils";

// صفحة نوع الطوارئ: الإرشادات المختصرة أولاً، ثم جهات الاتصال المناسبة
export default function CategoryPage() {
  const { typeId } = useParams();
  const { status, data: type } = useEmergencyType(typeId);
  const { record } = useActivityLog();

  const backLink = (
    <Link
      to="/"
      className="inline-flex items-center gap-1 text-sm font-semibold text-stone-600 hover:text-sos"
    >
      <Icon name="chevron" className="size-4" />
      رجوع إلى الخيارات
    </Link>
  );

  if (status === "loading") {
    return (
      <section className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-stone-200/70" />
        <div className="h-40 animate-pulse rounded-2xl bg-stone-200/70" />
      </section>
    );
  }

  if (status === "notfound" || status === "error") {
    return (
      <section className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        {backLink}
        <StateMessage
          tone="error"
          title={status === "notfound" ? "نوع الطوارئ غير موجود" : "تعذّر تحميل البيانات"}
          hint="اختر نوع الطوارئ من الصفحة الرئيسية."
        />
      </section>
    );
  }

  const tone = TONE_CLASSES[type.tone] ?? TONE_CLASSES.sky;
  // أهم جهة تُعرض في أعلى الصفحة ليتصل المستخدم قبل أن يقرأ أي شيء
  const primary = type.contacts.find((c) => c.number);
  const others = type.contacts.filter((c) => c !== primary);

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {backLink}

      <header className="flex items-center gap-4">
        <span className={cx("grid size-14 shrink-0 place-items-center rounded-2xl ring-1", tone.chip)}>
          <Icon name={type.icon} className="size-7" />
        </span>
        <div>
          <h1 className="text-2xl font-black text-stone-900">{type.title}</h1>
          <p className="text-sm text-stone-500">{type.description}</p>
        </div>
      </header>

      {primary && (
        <a
          href={toTel(primary.number)}
          onClick={() => record("call", primary.name)}
          aria-label={`اتصل بـ${primary.name} على الرقم ${primary.number}`}
          className="flex min-h-20 items-center justify-between gap-4 rounded-2xl bg-sos px-6 py-4 text-white shadow-lg transition hover:bg-sos-dark focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-rose-200 active:scale-[0.98]"
        >
          <span className="flex items-center gap-3">
            <Icon name="phone" className="size-8" />
            <span className="text-xl font-black">اتصل بـ{primary.name}</span>
          </span>
          <span dir="ltr" className="font-mono text-base font-bold tabular-nums opacity-90">
            {primary.number}
          </span>
        </a>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-bold text-stone-900">إرشادات سريعة</h2>
        <ol className="space-y-3">
          {type.instructions.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm leading-6 text-stone-700">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-stone-100 text-xs font-bold text-stone-600">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {others.length > 0 && (
        <div>
          <h2 className="mb-3 text-base font-bold text-stone-900">
            {primary ? "جهات أخرى" : "جهات الاتصال"}
          </h2>
          <ul className="space-y-3">
            {others.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </ul>
        </div>
      )}

      <Disclaimer compact />
    </section>
  );
}
