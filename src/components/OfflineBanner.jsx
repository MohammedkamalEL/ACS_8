import { useOnlineStatus } from "../hooks/useOnlineStatus";

// شريط يظهر عند انقطاع الإنترنت ليطمئن المستخدم أن الأساسيات متاحة
export default function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div role="status" className="bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-900">
      أنت غير متصل بالإنترنت. الإرشادات وجهات الاتصال متاحة على جهازك.
    </div>
  );
}
