import { Link, NavLink } from "react-router-dom";
import Brand from "./Brand";
import { NAV_ITEMS } from "../data/options";
import { cx } from "../utils";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-300 bg-canvas">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link to="/" aria-label="الصفحة الرئيسية">
          <Brand />
        </Link>
        <nav aria-label="التنقل الرئيسي" className="hidden h-full items-stretch gap-5 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cx(
                  "flex items-center border-b-2 text-sm",
                  isActive ? "border-sos font-bold text-gray-900" : "border-transparent text-gray-600 hover:text-gray-900"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/sos" className="bg-sos px-3 py-1.5 text-sm font-bold text-white hover:bg-sos-dark md:hidden">
          SOS
        </Link>
      </div>
    </header>
  );
}
