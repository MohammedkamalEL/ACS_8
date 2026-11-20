import Icon from "./Icon";
import { cx } from "../utils";

// شعار التطبيق: مربع أحمر بأيقونة الدرع مع الاسم
export default function Brand({ className }) {
  return (
    <div className={cx("flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-sos text-white shadow-sm">
        <Icon name="shield" className="size-5" />
      </span>
      <span className="text-lg font-black tracking-tight text-stone-900">ساعدني</span>
    </div>
  );
}
