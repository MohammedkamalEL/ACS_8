import { useState } from "react";
import { usePersonalContacts, useMedicalProfile } from "../hooks/usePersonalData";
import Icon from "../components/Icon";
import { MAX_PERSONAL_CONTACTS, BLOOD_TYPES, LOG_LABELS } from "../data/options";
import { isValidPhone, toTel, formatDateTime } from "../utils";
import { useActivityLog } from "../hooks/useActivityLog";

const INPUT =
  "h-12 w-full rounded-xl border border-stone-300 bg-white px-4 text-stone-900 placeholder:text-stone-500 focus:border-sos focus:outline-none focus:ring-4 focus:ring-rose-100";
const TEXTAREA =
  "min-h-20 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-500 focus:border-sos focus:outline-none focus:ring-4 focus:ring-rose-100";

const EMPTY_DRAFT = { name: "", relation: "", phone: "" };

export default function ContactsPage() {
  const { contacts, addContact, removeContact } = usePersonalContacts();
  const { profile, saveProfile } = useMedicalProfile();
  const { log, clear: clearLog } = useActivityLog();

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [error, setError] = useState("");

  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (contacts.length >= MAX_PERSONAL_CONTACTS) {
      setError(`الحد الأقصى ${MAX_PERSONAL_CONTACTS} جهات`);
      return;
    }
    if (!draft.name.trim()) {
      setError("اكتب اسم الشخص");
      return;
    }
    if (!isValidPhone(draft.phone)) {
      setError("اكتب رقم هاتف صحيح");
      return;
    }
    addContact({
      name: draft.name.trim(),
      relation: draft.relation.trim(),
      phone: draft.phone.trim(),
    });
    setDraft(EMPTY_DRAFT);
    setError("");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveProfile(form);
    setSaved(true);
  };

  const updateForm = (key) => (e) => {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  return (
    <section className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <header>
        <h1 className="text-3xl font-black text-stone-900">جهاتي</h1>
        {/* <p className="mt-1 text-stone-600">
          بياناتك محفوظة على هذا الجهاز فقط، ولا تُرسل إلى أي جهة.
        </p> */}
      </header>

      {/* جهات الطوارئ الشخصية */}
      <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="font-bold text-stone-900">أشخاص تثق بهم</h2>
          <p className="text-sm text-stone-600">
            تظهر أولاً في شاشة الطوارئ ({contacts.length} من {MAX_PERSONAL_CONTACTS})
          </p>
        </div>

        {contacts.length > 0 && (
          <ul className="divide-y divide-stone-100">
            {contacts.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate font-bold text-stone-900">
                    {c.name}
                    {c.relation && <span className="ms-2 text-sm font-normal text-stone-600">({c.relation})</span>}
                  </p>
                  <p dir="ltr" className="font-mono text-sm text-stone-700">{c.phone}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={toTel(c.phone)}
                    aria-label={`اتصل بـ${c.name}`}
                    className="inline-flex size-11 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
                  >
                    <Icon name="phone" className="size-5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeContact(c.id)}
                    aria-label={`حذف ${c.name}`}
                    className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xl border border-stone-300 text-stone-700 hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-200"
                  >
                    <Icon name="trash" className="size-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {contacts.length < MAX_PERSONAL_CONTACTS && (
          <form onSubmit={handleAdd} noValidate className="grid gap-3 border-t border-stone-100 pt-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">الاسم</span>
              <input className={INPUT} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="مثال: أمي" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">صلة القرابة (اختياري)</span>
              <input className={INPUT} value={draft.relation} onChange={(e) => setDraft({ ...draft, relation: e.target.value })} placeholder="مثال: الأم" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-stone-700">رقم الهاتف</span>
              <input
                className={INPUT}
                dir="ltr"
                inputMode="tel"
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                placeholder="+249 ..."
              />
            </label>
            {error && (
              <p role="alert" className="text-sm font-semibold text-rose-700 sm:col-span-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-stone-900 font-bold text-white hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-300 sm:col-span-2"
            >
              <Icon name="plus" className="size-5" />
              إضافة الشخص
            </button>
          </form>
        )}
      </div>

      {/* سجل الإجراءات على هذا الجهاز */}
      <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-stone-900">سجل الطوارئ على هذا الجهاز</h2>
          {log.length > 0 && (
            <button
              type="button"
              onClick={clearLog}
              className="cursor-pointer text-sm font-semibold text-rose-700 hover:underline"
            >
              مسح السجل
            </button>
          )}
        </div>
        {log.length === 0 ? (
          <p className="text-sm text-stone-600">لا توجد إجراءات مسجّلة بعد.</p>
        ) : (
          <ul className="divide-y divide-stone-100">
            {log.slice(0, 10).map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="font-semibold text-stone-900">
                  {LOG_LABELS[entry.type] ?? entry.type}: {entry.label}
                </span>
                <time dateTime={new Date(entry.at).toISOString()} className="shrink-0 text-xs text-stone-600">
                  {formatDateTime(entry.at)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="font-bold text-stone-900">بطاقتي الطبية</h2>
          <p className="text-sm text-stone-600">تُعرض للمسعفين في شاشة الطوارئ. اكتب ما تعرفه فقط، والباقي اختياري.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">الاسم الكامل</span>
            <input className={INPUT} value={form.name} onChange={updateForm("name")} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">فصيلة الدم</span>
            <select className={INPUT} value={form.bloodType} onChange={updateForm("bloodType")}>
              <option value="">غير معروفة</option>
              {BLOOD_TYPES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">الحساسية</span>
            <textarea className={TEXTAREA} value={form.allergies} onChange={updateForm("allergies")} placeholder="مثال: البنسلين، المكسرات" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">حالات مزمنة</span>
            <textarea className={TEXTAREA} value={form.conditions} onChange={updateForm("conditions")} placeholder="مثال: السكري، الضغط" />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-stone-700">أدوية مستمرة</span>
            <textarea className={TEXTAREA} value={form.medications} onChange={updateForm("medications")} placeholder="مثال: الإنسولين صباحًا" />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-sos px-6 font-bold text-white hover:bg-sos-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
          >
            <Icon name="save" className="size-5" />
            حفظ البطاقة
          </button>
          {saved && (
            <span role="status" className="text-sm font-semibold text-emerald-700">
              تم الحفظ
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
