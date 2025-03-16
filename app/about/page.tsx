export const metadata = {
  title: "About",
  description: "About me.",
};

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">About Me</h1>
      <p className="mb-4">我是 Leo，一名程序员，这是我的博客集。</p>
    </section>
  );
}
