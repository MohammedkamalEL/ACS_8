import { NavLink } from "react-router-dom";
import Icon from "./Icon";
import { cx } from "../utils";
import { NAV_ITEMS } from "../data/options";

export default function BottomNav() {
  return (
    <nav
      aria-label="التنقل الرئيسي"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cx(
                  "flex h-16 flex-col items-center justify-center gap-1 border-t-2 text-[11px] ",
                  isActive ? "border-sos font-bold text-sos" : "border-transparent text-gray-600"
                )
              }
            >
              <Icon name={item.icon} className="size-6" />
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
