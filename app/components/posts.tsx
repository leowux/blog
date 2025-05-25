import Link from "next/link";
import { formatDate, getBlogPosts } from "app/blog/utils";

export function BlogPosts() {
  let allBlogs = getBlogPosts();

  return (
    <div>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <div key={post.slug} className="mb-6">
            <Link
              className="flex flex-col space-y-1 mb-2"
              href={`/blog/${post.slug}`}
            >
              <li className="w-full flex flex-col md:flex-row md:space-x-2 justify-between">
                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {post.metadata.title}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 w-[150px] tabular-nums">
                  {formatDate(post.metadata.publishedAt)}
                </p>
              </li>
            </Link>
          </div>
        ))}
    </div>
  );
}
