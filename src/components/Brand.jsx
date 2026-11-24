import { cx } from "../utils";

export default function Brand({ className }) {
  return (
    <span className={cx("flex items-center gap-2.5", className)}>
      <span
        dir="ltr"
        className="grid size-9 place-items-center rounded-full bg-sos text-[11px] font-black text-white ring-4 ring-red-100"
      >
        SOS
      </span>
      <span className="text-lg font-black text-gray-900">ساعدني</span>
    </span>
  );
}
