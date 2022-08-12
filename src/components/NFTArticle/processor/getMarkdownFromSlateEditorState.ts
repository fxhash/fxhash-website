import { Node } from "slate";
import { unified } from "unified";
import remarkMath from "remark-math";
import remarkDirective from "remark-directive";
import remarkUnwrapImages from "remark-unwrap-images";
import { slateToRemark } from "remark-slate-transformer";
import stringify from "remark-stringify";
import { OverridedSlateBuilders } from "remark-slate-transformer/lib/transformers/slate-to-mdast";
import { remarkFxHashCustom } from "./plugins";
import remarkGfm from "remark-gfm";

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

const createMarkdownImageFromFigure = (nodeFigure: Node, nodeImage: Node) => {
  // create a regular image node
  const imageNode: any = {
    type: "image",
    url: nodeImage.url
  }

  // find if there's a caption
  const caption: Node|null = nodeFigure.children.find(
    (node: Node) => node.type === ("figcaption" as any)
  )
  if (caption && caption.children?.length > 0) {
    imageNode.alt = caption.children[0].text
  }
  return imageNode
}

const createMarkdownVideoFromFigure = (nodeFigure: Node, nodeVideo: Node) => {
  const videoNode: Node = {
    type: 'video',
    src: nodeVideo.src
  }
  const caption: Node|null = nodeFigure.children.find(
    (node: Node) => node.type === ("figcaption" as any)
  )
  if (caption && caption.children?.length > 0) {
    videoNode.children = caption.children
  }
  return convertSlateLeafDirectiveToMarkdown(videoNode)
}
const mediasConvert: Record<string, (nodeFigure: Node, nodeMedia: Node) => any> = {
  "image": createMarkdownImageFromFigure,
  "video": createMarkdownVideoFromFigure
}
/**
 * Turns a figcaption element into an element which will be turned into an image or video
 * in proper markdown
 */
function figureToMarkdown(node: any, next: (children: any[]) => any) {
  const mediaNode: Node|null = node.children.find(
    (node: Node) => ["image", "video"].indexOf(node.type) > -1
  )
  return mediasConvert[mediaNode.type](node, mediaNode);
}

const slateToRemarkTransformerOverrides: OverridedSlateBuilders = {
  'tezos-storage': convertSlateLeafDirectiveToMarkdown,
  'embed-media': convertSlateLeafDirectiveToMarkdown,
//  'video': convertSlateLeafDirectiveToMarkdown,
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
    const processor = unified()
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkDirective)
      .use(remarkUnwrapImages)
      .use(remarkFxHashCustom)
      .use(slateToRemark, {
        overrides: slateToRemarkTransformerOverrides,
      })
      .use(stringify, { bulletOther: '-' })
    const ast = await processor.run({
      type: "root",
      children: slate,
    })
    const text = processor.stringify(ast)

    // with the current implementation, the remarkDirective middleware is not
    // properly transforming the empty string attribute value
    // in: { "contract": "erhrthrthrth", "wrong": "" }
    // out: ::dir{contract="erhrthrthrth" wrong}
    // expected: ::dir{contract="erhrthrthrth" wrong=""}
    // one fix would be to fork the remarkDirective plugin (and eventually the
    // mdast-util-directive library) to update this behavior, here I believe:
    // https://github.com/syntax-tree/mdast-util-directive/blob/ca7d8113382727154649cb6bb061d3b4a5282d06/index.js#L351
    // * fix: regex this fucker

    const directiveAttributesFixed = text.replaceAll(
      // matches tezos-storage directives & captures the alt text & the attributes
      /::tezos-storage\[([^\]]*)\]{([^}]*)}/g,
      (match, ...captures) => {
        const alt = captures[0]
        const attributes: string = captures[1]
        if (attributes) {
          // replace the atributes not followed by an equal, add equality
          const replaced = attributes.replaceAll(
            /([a-z_A-Z0-9]+)(\s|$)/g,
            (_, attribute) => {
              return `${attribute}=""`
            }
          )
          return `::tezos-storage[${alt}]{${replaced}}`
        }
        else {
          return match
        }
      }
    )

    return directiveAttributesFixed
  }
  catch(e) {
    console.error(e)
    return null;
  }
}
