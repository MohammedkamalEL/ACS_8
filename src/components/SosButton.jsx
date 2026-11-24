import { Link } from "react-router-dom";


export default function SosButton() {
  return (
    <Link
      to="/sos"
      aria-label="SOS: فتح شاشة الطوارئ والاتصال فوراً"
      className="mx-auto my-10 flex size-48 flex-col items-center justify-center rounded-full bg-sos text-white shadow-[0_0_0_10px_rgba(220,38,38,0.14),0_0_0_22px_rgba(220,38,38,0.07),0_12px_45px_rgba(220,38,38,0.5)] active:scale-95"
    >
      <span className="text-5xl font-black leading-none">SOS</span>
      <span className="mt-2 text-sm text-red-100">اضغط للاتصال</span>
    </Link>
  );
}
