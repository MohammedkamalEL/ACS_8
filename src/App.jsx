import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import OfflineBanner from "./components/OfflineBanner";
import CheckInBanner from "./components/CheckInBanner";
import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import SosPage from "./pages/SosPage";
import CheckInPage from "./pages/CheckInPage";
import ContactsPage from "./pages/ContactsPage";
import CategoryPage from "./pages/CategoryPage";
import NotFoundPage from "./pages/NotFoundPage";

// عنوان التبويب لكل شاشة (يفيد قارئات الشاشة وسجل المتصفح)
const TITLES = {
  "/": "ساعدني | SOS",
  "/sos": "الطوارئ الآن | ساعدني",
  "/checkin": "أنا بخير؟ | ساعدني",
  "/contacts": "جهاتي | ساعدني",
};

// الهيكل العام: رابط تخطٍّ + حالة الاتصال + تنبيه المؤقت + رأس ثابت + المحتوى + شريط تنقل للهاتف
export default function App() {
  const { pathname, hash } = useLocation();

  // عند تغيير الشاشة: ضبط العنوان والرجوع لأعلى الصفحة
  useEffect(() => {
    document.title = TITLES[pathname] ?? "ساعدني | SOS";
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-semibold text-stone-900 shadow focus:not-sr-only focus:fixed focus:start-4 focus:top-4"
      >
        تخطٍّ إلى المحتوى
      </a>
      <OfflineBanner />
      <CheckInBanner />
      <Header />
      <main id="main" tabIndex={-1} className="pb-24 outline-none md:pb-10">
        {/* key: يعيد المحاولة تلقائياً عند الانتقال لشاشة أخرى بعد أي خطأ */}
        <ErrorBoundary key={pathname}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sos" element={<SosPage />} />
            <Route path="/checkin" element={<CheckInPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/emergency/:typeId" element={<CategoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <BottomNav />
    </div>
  );
}
