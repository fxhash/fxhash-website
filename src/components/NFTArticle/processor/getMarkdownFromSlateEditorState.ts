import { Node } from "slate";
import { unified } from "unified";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import remarkUnwrapImages from "remark-unwrap-images";
import { slateToRemark } from "remark-slate-transformer";
import stringify from "remark-stringify";
import { OverridedSlateBuilders } from "remark-slate-transformer/lib/transformers/slate-to-mdast";
import { remarkFxHashCustom } from "./plugins";

function convertSlateLeafDirectiveToMarkdown(
  node: any,
) {
  const { children, type, ...attributes} = node
  return {
    type: 'leafDirective',
    name: type,
    children: [
      {
        type: 'text',
        value: children[0].text,
      }
    ],
    attributes,
  }
}

/**
 * Turns a figcaption element into an element which will be turned into an
 * image in proper markdown
 */
function figureToMarkdown(node: any, next: (children: any[]) => any) {
  // create a regular image node
  const imageNode: any = {
    type: "image"
  }

  // find if there's a caption
  const caption: Node|null = node.children.find(
    (node: Node) => node.type === ("figcaption" as any)
  )
  if (caption && caption.children?.length > 0) {
    imageNode.alt = caption.children[0].text
  }
  // now do the same for the image element
  const image: Node|null = node.children.find(
    (node: Node) => node.type === "image"
  )
  if (image) {
    imageNode.url = image.url
  }

  return imageNode
}

const slateToRemarkTransformerOverrides: OverridedSlateBuilders = {
  'tezos-storage': convertSlateLeafDirectiveToMarkdown,
  'embed-media': convertSlateLeafDirectiveToMarkdown,
  figure: figureToMarkdown,
  inlineMath: (node: any) => ({
    type: node.type,
    value: node.math,
  }),
  math: (node: any) => ({
    type: node.type,
    value: node.math,
  }),
}
export default async function getMarkdownFromSlateEditorState(slate: Node[] ) {
  try {
    const markdown = await new Promise((resolve) => {
      const processor = unified()
        .use(remarkMath)
        .use(remarkDirective)
        .use(remarkUnwrapImages)
        .use(remarkFxHashCustom)
        .use(slateToRemark, {
          overrides: slateToRemarkTransformerOverrides,
        })
        .use(stringify)
      const ast = processor.runSync({
        type: "root",
        children: slate,
      })
      const text = processor.stringify(ast)
      resolve(text)
    })
    return markdown
  }
  catch(e) {
    console.error(e)
    return null;
  }
}
