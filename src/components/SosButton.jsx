import { Link } from "react-router-dom";

export default function SosButton() {
  return (
    <Link
      to="/sos"
      aria-label="SOS: فتح شاشة الطوارئ والاتصال فوراً"
      className="mt-6 block bg-sos px-5 py-7 text-white hover:bg-sos-dark"
    >
      <span className="block text-5xl font-black">SOS</span>
      <span className="mt-1 block text-sm">اتصال سريع بالإسعاف أو الشرطة أو الإطفاء</span>
    </Link>
  );
}
