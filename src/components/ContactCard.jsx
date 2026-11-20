import { useEffect, useState } from "react";
import Icon from "./Icon";
import { copyText, toTel } from "../utils";
import { useActivityLog } from "../hooks/useActivityLog";

// جهة اتصال واحدة: اتصال مباشر عند توفر الرقم، ونسخ، ورسالة واضحة عند غيابه
export default function ContactCard({ contact }) {
  const [copied, setCopied] = useState(false);
  const { record } = useActivityLog();
  const hasNumber = Boolean(contact.number);

  // إعادة حالة النسخ بعد ثانيتين
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    if (await copyText(contact.number)) {
      setCopied(true);
      record("copy", contact.name);
    }
  };

  return (
    <li className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div>
        <p className="text-lg font-bold text-stone-900">{contact.name}</p>
        <p className="mt-0.5 text-sm text-stone-600">{contact.note}</p>
      </div>

      {hasNumber ? (
        <div className="mt-4 space-y-3">
          <p dir="ltr" className="font-mono text-2xl font-bold tabular-nums tracking-wide text-stone-900">
            {contact.number}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={toTel(contact.number)}
              onClick={() => record("call", contact.name)}
              aria-label={`اتصل بـ${contact.name}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-sos font-bold text-white shadow-sm transition hover:bg-sos-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
            >
              <Icon name="phone" className="size-5" />
              اتصل الآن
            </a>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-200"
            >
              <Icon name={copied ? "check" : "copy"} className="size-4" />
              {copied ? "تم النسخ" : "نسخ الرقم"}
            </button>
          </div>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? `تم نسخ رقم ${contact.name}` : ""}
          </span>
        </div>
      ) : (
        <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          <Icon name="info" className="mt-0.5 size-4 shrink-0" />
          لا يتوفر رقم مباشر، اتبع الإرشادات أعلاه.
        </p>
      )}
    </li>
  );
}
