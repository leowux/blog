import { BlogPosts } from "app/components/posts";
import { Pagination } from "app/components/pagination";
import { TagCloud } from "app/components/tag-cloud";
import { getBlogPosts, paginateBlogPosts } from "lib/blog";
import type { PageParam } from "lib/blog";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

type PageProps = {
  searchParams?: {
    page?: PageParam;
  };
};

export default function Page({ searchParams }: PageProps) {
  const { posts, currentPage, totalPages } = paginateBlogPosts(
    getBlogPosts(),
    searchParams?.page,
  );

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        Blog Posts
      </h1>
      <BlogPosts posts={posts} />
      <Pagination
        basePath="/blog"
        currentPage={currentPage}
        totalPages={totalPages}
      />
      <TagCloud />
    </section>
  );
}
