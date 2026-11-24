import { Link, useParams } from "react-router-dom";
import { useEmergencyType } from "../hooks/useEmergencyTypes";
import Icon from "../components/Icon";
import ContactCard from "../components/ContactCard";
import { useActivityLog } from "../hooks/useActivityLog";
import StateMessage from "../components/StateMessage";
import { toTel } from "../utils";

export default function CategoryPage() {
  const { typeId } = useParams();
  const { status, data: type } = useEmergencyType(typeId);
  const { record } = useActivityLog();

  const backLink = (
    <Link
      to="/"
      className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-sos"
    >
      <Icon name="chevron" className="size-4" />
      رجوع إلى الخيارات
    </Link>
  );

  if (status === "loading") {
    return (
      <section className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-gray-200/70" />
        <div className="h-40 animate-pulse rounded-2xl bg-gray-200/70" />
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

  const primary = type.contacts.find((c) => c.number);
  const others = type.contacts.filter((c) => c !== primary);

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      {backLink}

      <header>
        <h1 className="text-2xl font-black">{type.title}</h1>
        <p className="text-sm text-gray-600">{type.description}</p>
      </header>

      {primary && (
        <a
          href={toTel(primary.number)}
          onClick={() => record("call", primary.name)}
          aria-label={`اتصل بـ${primary.name} على الرقم ${primary.number}`}
          className="flex min-h-20 items-center justify-between gap-4 rounded-2xl bg-sos px-6 py-4 text-white hover:bg-sos-dark focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-red-200"
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

      <div>
        <h2 className="mb-2 font-bold">إرشادات سريعة</h2>
        <ol className="list-decimal space-y-2 border-t border-gray-300 pt-3 ps-6 leading-7 text-gray-800">
          {type.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {others.length > 0 && (
        <div>
          <h2 className="mb-2 font-bold">
            {primary ? "جهات أخرى" : "جهات الاتصال"}
          </h2>
          <ul className="space-y-3">
            {others.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </ul>
        </div>
      )}

    </section>
  );
}
