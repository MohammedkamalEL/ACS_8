import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function TypeCard({ type }) {
return (
  <li>
    <Link
      to={`/emergency/${type.id}`}
      className="flex h-full flex-col gap-2 rounded-xl border border-gray-300 p-4 hover:border-sos"
    >
      <Icon name={type.icon} className="size-7 text-sos" />
      <span className="font-bold">{type.title}</span>
      <span className="text-sm text-gray-600">{type.description}</span>
    </Link>
  </li>
);
}
