import { BlogPosts } from "app/components/posts";
import { TagCloud } from "app/components/tag-cloud";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">
        Blog Posts
      </h1>
      <BlogPosts />
      <TagCloud />
    </section>
  );
}
