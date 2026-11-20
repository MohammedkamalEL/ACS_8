import Icon from "./Icon";

export default function StateMessage({ tone = "info", title, hint, children }) {
  const styles = {
    info: "border-stone-200 bg-white text-stone-600",
    error: "border-rose-200 bg-rose-50 text-rose-700",
  };

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`flex flex-col items-center gap-2 rounded-2xl border p-8 text-center ${styles[tone]}`}
    >
      <Icon name={tone === "error" ? "alert" : "info"} className="size-7" />
      <p className="font-bold">{title}</p>
      {hint && <p className="text-sm opacity-80">{hint}</p>}
      {children}
    </div>
  );
}
