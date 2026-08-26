import Link from "next/link";
import { formatDate } from "lib/blog";
import type { BlogPost } from "lib/blog";

export function BlogPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug} className="mb-6">
          <Link
            className="flex flex-col space-y-1 mb-2"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col md:flex-row md:space-x-2 justify-between">
              <p className="text-neutral-900 tracking-tight line-clamp-2">
                {post.metadata.title}
              </p>
              <p className="text-neutral-600 min-w-[150px] text-right tabular-nums">
                {formatDate(post.metadata.publishedAt)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
