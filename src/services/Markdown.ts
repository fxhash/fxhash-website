import rehypeFormat from "rehype-format"
import rehypeSlug from "rehype-slug"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

export async function mdToHtml(markdown: string) {
  const processed = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown)
  return processed.toString()
}
