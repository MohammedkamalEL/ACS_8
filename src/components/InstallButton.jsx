import Icon from "./Icon";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

// زر تثبيت التطبيق على الشاشة الرئيسية للهاتف، يظهر فقط عندما يكون التثبيت متاحاً
export default function InstallButton() {
  const { canInstall, install } = useInstallPrompt();
  if (!canInstall) return null;

  return (
    <button
      type="button"
      onClick={install}
      className="mt-5 inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 text-sm font-semibold text-stone-800 shadow-sm transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-200"
    >
      <Icon name="download" className="size-4" />
      ثبّت التطبيق على هاتفك
    </button>
  );
}
