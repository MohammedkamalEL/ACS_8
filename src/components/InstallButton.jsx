import Icon from "./Icon";
import { useInstallPrompt } from "../hooks/useInstallPrompt";

export default function InstallButton() {
  const { canInstall, install } = useInstallPrompt();
  if (!canInstall) return null;

  return (
    <button
      type="button"
      onClick={install}
      className="mt-5 inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-200"
    >
      <Icon name="download" className="size-4" />
      ثبّت التطبيق على هاتفك
    </button>
  );
}
