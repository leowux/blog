import {
  getAllTags,
  getPostsByTag,
  paginateBlogPosts,
} from "lib/blog";
import type { PageParam } from "lib/blog";
import { Tag } from "app/components/tag";
import { BlogPosts } from "app/components/posts";
import { Pagination } from "app/components/pagination";
import Link from "next/link";

type TagPageProps = {
  params: {
    tag: string;
  };
  searchParams?: {
    page?: PageParam;
  };
};

export async function generateStaticParams() {
  let tags = getAllTags();
  return tags.map((tag) => ({
    tag,
  }));
}

export function generateMetadata({ params }: TagPageProps) {
  const decodedTag = decodeURIComponent(params.tag);
  return {
    title: `文章标签: ${decodedTag}`,
    description: `查看所有带有 "${decodedTag}" 标签的文章`,
  };
}

export default function TagPage({ params, searchParams }: TagPageProps) {
  const decodedTag = decodeURIComponent(params.tag);
  const taggedPosts = getPostsByTag(decodedTag);
  const { posts, currentPage, totalPages } = paginateBlogPosts(
    taggedPosts,
    searchParams?.page,
  );
  const allTags = getAllTags();
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-4 tracking-tighter">Tag: {decodedTag}</h1>
      <div className="flex flex-wrap mb-8">
        {allTags.map((t) => (
          <Tag key={t} tag={t} isActive={t === decodedTag} />
        ))}
      </div>

      {taggedPosts.length === 0 ? (
        <p className="text-neutral-600">没有找到带有此标签的文章。</p>
      ) : (
        <>
          <BlogPosts posts={posts} />
          <Pagination
            basePath={`/blog/tag/${encodeURIComponent(decodedTag)}`}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </>
      )}

      <div className="mt-8">
        <Link href="/blog" className="text-neutral-700 hover:text-neutral-900">
          ← Back
        </Link>
      </div>
    </section>
  );
}
