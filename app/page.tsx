import { BlogPosts } from "app/components/posts";
import { TagCloud } from "./components/tag-cloud";

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Leo's Blog
      </h1>
      <p className="mb-4">我是 Leo，一名程序员，这是我的博客集。</p>
      <div className="my-8">
        <BlogPosts />
        <TagCloud />
      </div>
    </section>
  );
}
