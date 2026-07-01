const DEFAULT_MAXIMUM = 3000;
const POSTS_FILE_PATTERN = /(^|\/)posts\/.+\.mdx?$/;
const CJK_CHARACTER_PATTERN = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
const WORD_PATTERN = /[A-Za-z0-9]+(?:['_-][A-Za-z0-9]+)*/g;

function stripFrontMatter(lines) {
  if (lines[0]?.trim() !== "---") {
    return lines;
  }

  const closingIndex = lines.slice(1).findIndex((line) => line.trim() === "---");

  return closingIndex === -1 ? lines : lines.slice(closingIndex + 2);
}

function stripFencedCode(lines) {
  let fence = null;

  return lines.map((line) => {
    const fenceMatch = /^( {0,3})(`{3,}|~{3,})/.exec(line);

    if (fenceMatch) {
      const marker = fenceMatch[2][0];

      if (!fence) {
        fence = marker;
      } else if (fence === marker) {
        fence = null;
      }

      return "";
    }

    return fence ? "" : line;
  });
}

function countWords(text) {
  const cjkCharacters = text.match(CJK_CHARACTER_PATTERN) ?? [];
  const textWithoutCjk = text.replace(CJK_CHARACTER_PATTERN, " ");
  const words = textWithoutCjk.match(WORD_PATTERN) ?? [];

  return cjkCharacters.length + words.length;
}

function normalizeMarkdownText(lines) {
  return stripFencedCode(stripFrontMatter(lines))
    .join("\n")
    .replace(/`[^`\n]+`/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>\n]+>/g, " ");
}

module.exports = {
  names: ["custom/posts-max-words", "posts-max-words"],
  description: "Posts should not exceed the configured word count",
  tags: ["posts", "word-count"],
  parser: "none",
  function: (params, onError) => {
    const fileName = params.name.replaceAll("\\", "/");

    if (!POSTS_FILE_PATTERN.test(fileName)) {
      return;
    }

    const maximum = Number(params.config?.maximum ?? DEFAULT_MAXIMUM);
    const wordCount = countWords(normalizeMarkdownText(params.lines));

    if (wordCount > maximum) {
      onError({
        lineNumber: 1,
        detail: `Expected ${maximum} words or fewer; found ${wordCount}.`
      });
    }
  }
};
