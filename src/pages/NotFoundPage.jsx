import { Link } from "react-router-dom";
import StateMessage from "../components/StateMessage";

export default function NotFoundPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <StateMessage tone="error" title="الصفحة غير موجودة" hint="ربما الرابط غير صحيح.">
        <Link to="/" className="mt-2 font-semibold text-sos hover:underline">
          العودة إلى الرئيسية
        </Link>
      </StateMessage>
    </section>
  );
}
