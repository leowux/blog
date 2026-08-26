import { BlogPosts } from "app/components/posts";
import { Pagination } from "app/components/pagination";
import { getBlogPosts, paginateBlogPosts } from "lib/blog";
import type { PageParam } from "lib/blog";
import { TagCloud } from "./components/tag-cloud";

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
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">Leo's Blog</h1>
      <p className="mb-4">我是 Leo，一名程序员，这是我的博客集。</p>
      <div className="my-8">
        <BlogPosts posts={posts} />
        <Pagination
          basePath="/"
          currentPage={currentPage}
          totalPages={totalPages}
        />
        <TagCloud />
      </div>
    </section>
  );
}
