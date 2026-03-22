import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  tags?: string[]
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match![1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1')

    if (key.trim() === 'tags') {
      const tagsValue = value
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((tag) => tag.trim())
      metadata.tags = tagsValue.filter((tag) => tag !== '')
    } else {
      metadata[key.trim() as keyof Metadata] = value as never
    }
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function getMDXData(dir: string) {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))
    const slug = path.basename(file, path.extname(file))

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'posts'))
}

export function formatDate(date: string) {
  let normalized = date

  if (!normalized.includes('T')) {
    normalized = `${normalized}T00:00:00`
  }

  const targetDate = new Date(normalized)
  const yyyy = targetDate.getFullYear()
  const mm = String(targetDate.getMonth() + 1).padStart(2, '0')
  const dd = String(targetDate.getDate()).padStart(2, '0')

  return `${yyyy}-${mm}-${dd}`
}

export function getPostsByTag(tag: string) {
  const allPosts = getBlogPosts()
  return allPosts.filter((post) => post.metadata.tags?.includes(tag))
}

export function getAllTags() {
  const allPosts = getBlogPosts()
  const tagsSet = new Set<string>()

  allPosts.forEach((post) => {
    post.metadata.tags?.forEach((tag) => tagsSet.add(tag))
  })

  return Array.from(tagsSet)
}
