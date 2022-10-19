import { IArticleElementProcessor } from "../../../../types/ArticleEditor/Processor"
import { Node } from "slate"
import { convertSlateLeafDirectiveToMarkdown } from "../../processor/getMarkdownFromSlateEditorState"

const createMarkdownImageFromFigure = (nodeFigure: Node, nodeImage: Node) => {
  // create a regular image node
  const imageNode: any = {
    type: "image",
    url: nodeImage.url,
  }

  // find if there's a caption
  const caption: Node | null = nodeFigure.children.find(
    (node: Node) => node.type === ("figcaption" as any)
  )
  if (caption && caption.children?.length > 0) {
    imageNode.alt = caption.children[0].text
  }
  return imageNode
}

const createMarkdownVideoFromFigure = (nodeFigure: Node, nodeVideo: Node) => {
  const videoNode: Node = {
    type: "video",
    src: nodeVideo.src,
  }
  const caption: Node | null = nodeFigure.children.find(
    (node: Node) => node.type === ("figcaption" as any)
  )
  if (caption && caption.children?.length > 0) {
    videoNode.children = caption.children
  }
  return convertSlateLeafDirectiveToMarkdown(videoNode)
}

const createMarkdownAudioFromFigure = (nodeFigure: Node, nodeVideo: Node) => {
  const videoNode: Node = {
    type: "audio",
    src: nodeVideo.src,
  }
  const caption: Node | null = nodeFigure.children.find(
    (node: Node) => node.type === ("figcaption" as any)
  )
  if (caption && caption.children?.length > 0) {
    videoNode.children = caption.children
  }
  return convertSlateLeafDirectiveToMarkdown(videoNode)
}
const mediasConvert: Record<
  string,
  (nodeFigure: Node, nodeMedia: Node) => any
> = {
  image: createMarkdownImageFromFigure,
  video: createMarkdownVideoFromFigure,
  audio: createMarkdownAudioFromFigure,
}

export const figureProcessor: IArticleElementProcessor = {
  /**
   * Turns a figcaption element into an element which will be turned into an image or video
   * in proper markdown
   */
  transformSlateToMarkdownMdhast: (node) => {
    const mediaNode: Node | null = node.children.find(
      (node: Node) => ["image", "video", "audio"].indexOf(node.type) > -1
    )
    return mediasConvert[mediaNode.type](node, mediaNode)
  },
}
