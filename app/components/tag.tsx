import Link from "next/link";

interface TagProps {
  tag: string;
  isActive?: boolean;
}

// 标签组件
export function Tag({ tag, isActive = false }: TagProps) {
  return (
    <Link
      href={`/blog/tag/${encodeURIComponent(tag)}`}
      className={`text-xs mr-2 px-2 py-1 rounded-md transition-colors ${
        isActive
          ? "bg-neutral-800 text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      }`}
    >
      {tag}
    </Link>
  );
}
