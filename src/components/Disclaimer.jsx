import Icon from "./Icon";

// تنبيه ثابت: هذه النسخة تجريبية وأرقامها وهمية.
// compact: نسخة مختصرة تظهر في شاشات الاتصال حتى لا يُظن أن الأرقام حقيقية.
export default function Disclaimer({ compact = false }) {
  return (
    <p
      className={`flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 ${
        compact ? "p-3 text-xs leading-5" : "mt-8 p-4 text-sm leading-6"
      }`}
    >
      <Icon name="alert" className={compact ? "mt-0.5 size-4 shrink-0" : "mt-1 size-4 shrink-0"} />
      <span>
        {compact
          ? "نسخة تجريبية: الأرقام وهمية ولا تعمل كأرقام طوارئ حقيقية."
          : "هذه نسخة تجريبية للعرض. الأرقام والإرشادات وهمية ولا تعني أن الخدمة مفعّلة أو أن الأرقام مستخدمة في أي منطقة."}
      </span>
    </p>
  );
}
