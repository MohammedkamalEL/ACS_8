import { cx } from "../utils";

export default function Brand({ className }) {
  return (
    <span className={cx("flex items-baseline gap-2 text-lg font-bold text-gray-900", className)}>
      ساعدني
      <span dir="ltr" className="font-mono text-sm text-sos">
        sos
      </span>
    </span>
  );
}
