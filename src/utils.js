// دمج أسماء الكلاسات بشكل آمن
export const cx = (...classes) => classes.filter(Boolean).join(" ");

// ألوان كل نوع طوارئ (كاملة الأسماء حتى يلتقطها Tailwind)
export const TONE_CLASSES = {
  rose: { chip: "bg-rose-50 text-rose-600 ring-rose-100", bar: "group-hover:border-rose-300" },
  orange: { chip: "bg-orange-50 text-orange-600 ring-orange-100", bar: "group-hover:border-orange-300" },
  sky: { chip: "bg-sky-50 text-sky-600 ring-sky-100", bar: "group-hover:border-sky-300" },
  violet: { chip: "bg-violet-50 text-violet-600 ring-violet-100", bar: "group-hover:border-violet-300" },
  emerald: { chip: "bg-emerald-50 text-emerald-600 ring-emerald-100", bar: "group-hover:border-emerald-300" },
  amber: { chip: "bg-amber-50 text-amber-600 ring-amber-100", bar: "group-hover:border-amber-300" },
  lime: { chip: "bg-lime-50 text-lime-700 ring-lime-100", bar: "group-hover:border-lime-300" },
};

// توحيد النص العربي للبحث: يتجاهل التشكيل والهمزات والتاء المربوطة والألف المقصورة
export const normalizeArabic = (text = "") =>
  text
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();

// هل يطابق نوع الطوارئ كلمة البحث؟ (العنوان والوصف والكلمات المفتاحية)
export const matchesQuery = (type, query) => {
  const term = normalizeArabic(query);
  if (!term) return true;
  return normalizeArabic(`${type.title} ${type.description} ${type.keywords ?? ""}`).includes(term);
};

// رابط خريطة نصي من الإحداثيات (بدون أي مفتاح أو خدمة مدفوعة)
export const mapsLink = ({ lat, lng }) => `https://maps.google.com/?q=${lat.toFixed(5)},${lng.toFixed(5)}`;

// رابط اتصال مباشر: يُبقي + والأرقام فقط
export const toTel = (number) => `tel:${number.replace(/[^\d+]/g, "")}`;

// رابط رسالة نصية مع نص جاهز
export const smsLink = (number, body) =>
  `sms:${number.replace(/[^\d+]/g, "")}?body=${encodeURIComponent(body)}`;

// تحقق بسيط من رقم الهاتف: من 6 إلى 15 رقمًا مع + اختيارية
export const isValidPhone = (value) => {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  return /^\+?[\d\s-]+$/.test(trimmed) && digits.length >= 6 && digits.length <= 15;
};

// نص رسالة الطوارئ: الموقع المكتوب + رابط الموقع الدقيق (إن وُجد) + البيانات الطبية المختصرة
export function buildEmergencyMessage({ name, location, coords, profile }) {
  const lines = ["حالة طوارئ!"];
  if (name) lines.push(`الاسم: ${name}`);
  lines.push(`الموقع: ${location.trim() || "غير محدد"}`);
  if (coords) lines.push(`الموقع على الخريطة: ${mapsLink(coords)}`);
  if (profile?.bloodType) lines.push(`فصيلة الدم: ${profile.bloodType}`);
  if (profile?.allergies) lines.push(`الحساسية: ${profile.allergies}`);
  if (profile?.conditions) lines.push(`حالات مزمنة: ${profile.conditions}`);
  if (profile?.medications) lines.push(`أدوية مستمرة: ${profile.medications}`);
  lines.push("أرسلت من تطبيق ساعدني.");
  return lines.join("\n");
}

// تنسيق العد التنازلي: mm:ss أو h:mm:ss
export function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

// تاريخ ووقت مختصران بالأرقام اللاتينية
export const formatDateTime = (ms) =>
  new Intl.DateTimeFormat("ar-SD-u-nu-latn", { dateStyle: "medium", timeStyle: "short" }).format(new Date(ms));

// نسخ نص للحافظة، ويعيد true عند النجاح
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// مشاركة النص عبر تطبيقات الهاتف إن أمكن، وإلا نسخه.
// تعيد: "shared" أو "copied" أو "cancelled" أو "failed"
export async function shareText(text) {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch {
      return "cancelled";
    }
  }
  return (await copyText(text)) ? "copied" : "failed";
}
