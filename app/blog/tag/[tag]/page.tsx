import { formatDate, getAllTags, getPostsByTag } from "app/blog/utils";
import { Tag } from "app/components/tag";
import Link from "next/link";

export async function generateStaticParams() {
  let tags = getAllTags();
  return tags.map((tag) => ({
    tag,
  }));
}

export function generateMetadata({ params }) {
  const decodedTag = decodeURIComponent(params.tag);
  return {
    title: `文章标签: ${decodedTag}`,
    description: `查看所有带有 "${decodedTag}" 标签的文章`,
  };
}

export default function TagPage({ params }) {
  const decodedTag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(decodedTag);
  const allTags = getAllTags();
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-4 tracking-tighter">Tag: {decodedTag}</h1>
      <div className="flex flex-wrap mb-8">
        {allTags.map((t) => (
          <Tag key={t} tag={t} isActive={t === decodedTag} />
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="text-neutral-600 dark:text-neutral-400">没有找到带有此标签的文章。</p>
      ) : (
        <div>
          {posts
            .sort((a, b) => {
              if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
                return -1;
              }
              return 1;
            })
            .map((post) => (
              <Link
                key={post.slug}
                className="flex flex-col space-y-1 mb-4"
                href={`/blog/${post.slug}`}
              >
                <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                  <p className="text-neutral-600 dark:text-neutral-400 w-[150px] tabular-nums">
                    {formatDate(post.metadata.publishedAt, false)}
                  </p>
                  <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                    {post.metadata.title}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          href="/blog"
          className="text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          ← Back
        </Link>
      </div>
    </section>
  );
}
