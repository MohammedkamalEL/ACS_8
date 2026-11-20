import { Component } from "react";
import { EMERGENCY_TYPES } from "../data/emergencyTypes";
import { toTel } from "../utils";
// import Disclaimer from "./Disclaimer";

// خط الدفاع الأخير: لو انهارت أي شاشة بسبب خطأ برمجي، يبقى للمستخدم
// زر اتصال مباشر بالجهات الأساسية بدل صفحة بيضاء وقت الطوارئ.
const FALLBACK_IDS = ["health", "security", "fire"];

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;

    const calls = FALLBACK_IDS.map((id) => {
      const type = EMERGENCY_TYPES.find((t) => t.id === id);
      const contact = type?.contacts.find((c) => c.number);
      return contact ? { id, name: contact.name, number: contact.number } : null;
    }).filter(Boolean);

    return (
      <section role="alert" className="mx-auto max-w-3xl space-y-4 px-4 py-10">
        <h1 className="text-2xl font-black text-sos">حدث خطأ غير متوقع</h1>
        <p className="text-stone-700">يمكنك الاتصال مباشرة من هنا، أو إعادة تحميل الصفحة.</p>
        <ul className="grid gap-3">
          {calls.map((c) => (
            <li key={c.id}>
              <a
                href={toTel(c.number)}
                className="flex min-h-16 items-center justify-between rounded-2xl bg-sos px-5 py-4 text-lg font-black text-white"
              >
                <span>اتصل بـ{c.name}</span>
                <span dir="ltr" className="font-mono">{c.number}</span>
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => window.location.assign("/")}
          className="h-12 w-full cursor-pointer rounded-xl border border-stone-300 bg-white font-bold text-stone-800"
        >
          إعادة تحميل التطبيق
        </button>
        {/* <Disclaimer compact /> */}
      </section>
    );
  }
}
