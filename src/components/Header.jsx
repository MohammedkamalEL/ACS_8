import { Link, NavLink } from "react-router-dom";
import Brand from "./Brand";
import { NAV_ITEMS } from "../data/options";
import { cx } from "../utils";

// الرأس الثابت: الشعار يعود للرئيسية، وروابط التنقل تظهر على الحاسوب
// (على الهاتف يوجد الشريط السفلي بدلاً منها)
export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
        <Link to="/" aria-label="الصفحة الرئيسية">
          <Brand />
        </Link>
        <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cx(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
                  isActive ? "bg-rose-50 text-sos" : "text-stone-600 hover:bg-stone-200/60 hover:text-sos"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        {/* على الهاتف: اختصار مباشر لشاشة الطوارئ */}
        <Link
          to="/sos"
          className="rounded-lg bg-sos px-3 py-1.5 text-sm font-black text-white shadow-sm hover:bg-sos-dark md:hidden"
        >
          SOS
        </Link>
      </div>
    </header>
  );
}
