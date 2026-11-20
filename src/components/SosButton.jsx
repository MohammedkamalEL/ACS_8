import { Link } from "react-router-dom";

export default function SosButton() {
  return (
    <Link
      to="/sos"
      aria-label="زر SOS: فتح شاشة الطوارئ والاتصال فوراً"
      className="group relative mx-auto mt-8 flex size-44 items-center justify-center rounded-full bg-sos text-white shadow-[0_20px_50px_-10px_rgba(220,38,38,.6)] transition hover:scale-105 focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-rose-200 active:scale-95"
    >
      <span aria-hidden="true" className="motion-safe:animate-ping absolute inset-0 rounded-full bg-sos/30" />
      <span className="relative text-center">
        <span className="block text-4xl font-black tracking-wider">SOS</span>
        <span className="mt-1 block text-xs font-semibold text-white">اضغط للاتصال فوراً</span>
      </span>
    </Link>
  );
}
