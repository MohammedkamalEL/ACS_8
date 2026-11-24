export default function Disclaimer({ compact = false }) {
  return (
    <p className={`border border-dashed border-gray-400 text-gray-700 ${compact ? "p-2 text-xs" : "mt-8 p-3 text-sm"}`}>
      <b>نسخة تجريبية.</b> الأرقام والإرشادات وهمية، ولا تعمل كأرقام طوارئ حقيقية.
    </p>
  );
}
