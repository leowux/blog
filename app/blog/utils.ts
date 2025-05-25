import fs from "fs";
import path from "path";

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tags?: string[];
};

function parseFrontmatter(fileContent: string) {
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  let match = frontmatterRegex.exec(fileContent);
  let frontMatterBlock = match![1];
  let content = fileContent.replace(frontmatterRegex, "").trim();
  let frontMatterLines = frontMatterBlock.trim().split("\n");
  let metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(": ");
    let value = valueArr.join(": ").trim();
    value = value.replace(/^['"](.*)['"]$/, "$1"); // Remove quotes

    // 特殊处理标签数组
    if (key.trim() === "tags") {
      try {
        // 尝试解析JSON格式的标签数组
        let tagsValue = value
          .replace(/^\[|\]$/g, "")
          .split(",")
          .map((tag) => tag.trim());
        metadata.tags = tagsValue.filter((tag) => tag !== "");
      } catch {
        // 如果解析失败，设置为空数组
        metadata.tags = [];
      }
    } else {
      metadata[key.trim() as keyof Metadata] = value as any;
    }
  });

  return { metadata: metadata as Metadata, content };
}

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, "utf-8");
  return parseFrontmatter(rawContent);
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir);
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file));
    let slug = path.basename(file, path.extname(file));

    return {
      metadata,
      slug,
      content,
    };
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "posts"));
}

export function formatDate(date: string) {
  if (!date.includes("T")) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  // 只保留 yyyy-mm-dd 格式
  let yyyy = targetDate.getFullYear();
  let mm = String(targetDate.getMonth() + 1).padStart(2, '0');
  let dd = String(targetDate.getDate()).padStart(2, '0');
  let fullDate = `${yyyy}-${mm}-${dd}`;

  return fullDate;
}

// 添加一个按标签过滤文章的函数
export function getPostsByTag(tag: string) {
  const allPosts = getBlogPosts();
  return allPosts.filter(
    (post) => post.metadata.tags && post.metadata.tags.includes(tag)
  );
}

// 获取所有标签的函数
export function getAllTags() {
  const allPosts = getBlogPosts();
  const tagsSet = new Set<string>();

  allPosts.forEach((post) => {
    if (post.metadata.tags) {
      post.metadata.tags.forEach((tag) => tagsSet.add(tag));
    }
  });

  return Array.from(tagsSet);
}
