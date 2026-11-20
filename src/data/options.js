// خيارات ثابتة تستخدمها الواجهة
export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// الحد الأقصى لجهات الاتصال الشخصية (لتبقى القائمة سريعة الوصول)
export const MAX_PERSONAL_CONTACTS = 5;

// أسماء أنواع الإجراءات في سجل الطوارئ
export const LOG_LABELS = {
  call: "اتصال",
  sms: "رسالة",
  share: "مشاركة",
  checkin: "أنا بخير؟",
  copy: "نسخ رقم",
};

// روابط التنقل الرئيسية: تُستخدم في الشريط السفلي (هاتف) والرأس (حاسوب)
export const NAV_ITEMS = [
  { to: "/", label: "الرئيسية", icon: "home", end: true },
  { to: "/sos", label: "الطوارئ", icon: "alert" },
  { to: "/checkin", label: "أنا بخير؟", icon: "clock" },
  { to: "/contacts", label: "جهاتي", icon: "user" },
];

// مدد مؤقت "أنا بخير؟" بالدقائق
export const CHECKIN_PRESETS = [5, 15, 30, 60];
export const CHECKIN_EXTEND_MINUTES = 15;
