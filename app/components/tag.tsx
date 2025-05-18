import Link from "next/link";

interface TagProps {
  tag: string;
  isActive?: boolean;
}

// 标签组件
export function Tag({ tag, isActive = false }: TagProps) {
  return (
    <Link
      href={`/blog/tag/${encodeURI(tag)}`}
      className={`text-xs mr-2 px-2 py-1 rounded-md transition-colors ${
        isActive
          ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-800"
          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
      }`}
    >
      {tag}
    </Link>
  );
}
