import { Link, useLocation } from "react-router-dom";
import { useCheckIn } from "../hooks/useCheckIn";
import Icon from "./Icon";

export default function CheckInBanner() {
  const { expired, confirm } = useCheckIn({ notify: true });
  const { pathname } = useLocation();

  if (!expired || pathname === "/checkin") return null;

  return (
    <div role="alert" className="bg-rose-600 px-4 py-3 text-white">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-bold">
          <Icon name="alert" className="size-5 shrink-0" />
          انتهى مؤقت «أنا بخير؟» ولم تؤكد سلامتك
        </p>
        <div className="flex gap-2">
          <Link
            to="/checkin"
            className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold text-rose-700 hover:bg-rose-50"
          >
            التفاصيل
          </Link>
          <button
            type="button"
            onClick={confirm}
            className="cursor-pointer rounded-lg border border-white/70 px-3 py-1.5 text-sm font-bold hover:bg-rose-700"
          >
            أنا بخير
          </button>
        </div>
      </div>
    </div>
  );
}
