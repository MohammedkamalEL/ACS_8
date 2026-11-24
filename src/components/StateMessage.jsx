import { cx } from "../utils";

export default function StateMessage({ tone = "info", title, hint, children }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cx("border p-4", tone === "error" ? "border-red-300 bg-red-50 text-red-900" : "border-gray-300 text-gray-700")}
    >
      <p className="font-bold">{title}</p>
      {hint && <p className="mt-1 text-sm">{hint}</p>}
      {children}
    </div>
  );
}
