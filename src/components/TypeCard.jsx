import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function TypeCard({ type }) {
  return (
    <li className="border-b border-gray-300">
      <Link to={`/emergency/${type.id}`} className="flex min-h-16 items-center gap-3 px-1 py-3 hover:bg-gray-50">
        <Icon name={type.icon} className="size-6 shrink-0 text-gray-700" />
        <span className="min-w-0 flex-1">
          <span className="block font-bold">{type.title}</span>
          <span className="block text-sm text-gray-600">{type.description}</span>
        </span>
        <Icon name="chevron" className="size-4 shrink-0 text-gray-400" />
      </Link>
    </li>
  );
}
