import { Link } from "react-router-dom";
import Icon from "./Icon";
import { TONE_CLASSES, cx } from "../utils";

// بطاقة نوع طوارئ واحدة: ضغطة واحدة تنقل إلى الإرشادات وأرقام الاتصال
export default function TypeCard({ type }) {
  const tone = TONE_CLASSES[type.tone] ?? TONE_CLASSES.sky;

  return (
    <li>
      <Link
        to={`/emergency/${type.id}`}
        className={cx(
          "group flex min-h-20 items-center gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100",
          tone.bar
        )}
      >
        <span className={cx("grid size-12 shrink-0 place-items-center rounded-xl ring-1", tone.chip)}>
          <Icon name={type.icon} className="size-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-bold text-stone-900">{type.title}</span>
          <span className="mt-0.5 block text-sm text-stone-600">{type.description}</span>
        </span>
        <Icon name="chevron" className="size-5 shrink-0 text-stone-300 transition group-hover:text-stone-500" />
      </Link>
    </li>
  );
}
