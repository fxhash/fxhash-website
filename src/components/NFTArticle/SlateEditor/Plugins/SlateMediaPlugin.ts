import { BaseOperation, Descendant, Editor, Element, Node, Point, Range, Text, Transforms } from "slate"
import { EnhanceEditorWith, FxEditor } from "../../../../types/ArticleEditor/Editor";
import { IEditorMediaFile } from "../../../../types/ArticleEditor/Image";
import { arrayRemoveDuplicates } from "../../../../utils/array";
import { ALL_TEXT_FORMATS } from "../index";
import { isFormatActive, lookupElementByType } from "../utils";
import { imageDefinition } from "../../elements/Image/ImageDefinition";
import { videoDefinition } from "../../elements/Video/VideoDefinition";
import { audioDefinition } from "../../elements/Audio/AudioDefinition";

// a list of operation types which can mutate the list of medias
const mediaMutableOperations: BaseOperation["type"][] = [
  "insert_node",
  "remove_node",
  "set_node"
]
const mediaTypes = ["image", "video", "audio"];
const mediaTypesWithFigure = [...mediaTypes, "figure"];

function insertImage(editor: Editor, url: string) {
  Transforms.insertNodes(editor, imageDefinition.instanciateElement!({ url, caption: '' }))
}
function insertVideo(editor: Editor, src: string) {
  Transforms.insertNodes(editor, videoDefinition.instanciateElement!({ src, caption: '' }))
}
function insertAudio(editor: Editor, src: string) {
  Transforms.insertNodes(editor, audioDefinition.instanciateElement!({ src, caption: '' }))
}

/**
 * Given an editor, extracts a list of the medias which can be found in any
 * node
 */
function getEditorMedias(editor: FxEditor): IEditorMediaFile[] {
  const medias: IEditorMediaFile[] = []
  // loop through all the existing nodes
  const nodes = Node.descendants(editor)
  for (const [node, path] of nodes) {
    // if the node is an image, its URL is a file
    if (node.type === "image" && node.url && node.url !== "") {
      medias.push({
        uri: node.url,
        type: "image"
      })
    } else if (node.type === "video" && node.src && node.src !== "") {
      medias.push({
        uri: node.src,
        type: "video"
      })
    } else if (node.type === "audio" && node.src && node.src !== "") {
      medias.push({
        uri: node.src,
        type: "audio"
      })
    }
  }
  // return the result without the duplicates
  return arrayRemoveDuplicates(
    medias,
    (a, b) => a.uri === b.uri
  )
}

/**
 * Add utility functions to the editor to support the propagation of medias
 * manipulation to the higher order components.
 */
export const withMediaSupport: EnhanceEditorWith = (
  editor: Editor,
  onMediasUpdate: (medias: IEditorMediaFile[]) => void
): FxEditor => {
  const { insertData, isVoid, normalizeNode, apply, deleteBackward } = editor

  // make image nodes void nodes
  editor.isVoid = element =>
    mediaTypes.indexOf(element.type) > -1 ? true : isVoid(element)

  /**
   * Deleting empty figcaption don't delete the media
   */
  editor.deleteBackward = unit => {
    const { selection } = editor
    if (selection && Range.isCollapsed(selection)) {
      const element = lookupElementByType(editor, 'figcaption');
      if (element) {
        const [, elementPath] = element
        const start = Editor.start(editor, elementPath)
        if (Point.equals(selection.anchor, start)) {
          return
        }
      }
    }
    deleteBackward(unit)
  }

  // when an operation is triggered, we check if the operation may have resulted
  // in a change of the medias list, and if so we trigger an update.
  editor.apply = (operation) => {
    // first we apply the operation
    apply(operation)

    // if the operation may have resulted in the change on the media list
    if (mediaMutableOperations.includes(operation.type)) {
      // locate the node
      const node = (operation as any).node
        || Editor.node(editor, (operation as any).path)[0]

      // if the node is eventually holding a media object
      if (mediaTypesWithFigure.includes(node.type)) {
        // we parse the whole editor to find the whole media list
        const medias = getEditorMedias(editor)
        // propagate the media update
        onMediasUpdate(medias)
      }
    }
  }

  // when some content is inserted (including drag & drop, we check if the
  // content is an image and if so a custom figure element is inserted)
  editor.insertData = (data) => {
    // if we have at least 1 file in there
    if (data.files?.length > 0) {
      for (const file of data.files) {
        // check if the file is an image
        const fileType = file.type.split("/")[0]
        if (fileType === "image") {
          // create a link to the image stored locally
          const url = URL.createObjectURL(file)
          insertImage(editor, url)
        } else if (fileType === 'video') {
          const src = URL.createObjectURL(file)
          insertVideo(editor, src);
        } else if (fileType === 'audio') {
          const src = URL.createObjectURL(file)
          insertAudio(editor, src);
        }
      }
    }
    // otherwise, it's some random data
    else {
      insertData(data)
    }
  }

  // some normalization rules to ensure the correctness of the <figure> element
  // in the tree
  editor.normalizeNode = (entry) => {
    const [node, path] = entry

    if (Element.isElement(node) && node.type === "figure") {
      // if the figure node doesn't have an image node as a child, the figure
      // node gets completely removed
      if (!node.children.find((node: Node) => ["image", "video", "audio", "figcaption"].indexOf(node.type) > -1)) {
        Transforms.removeNodes(editor, {
          at: path
        })
        return
      }

      // todo bug: the current line is removed when erasing figure from
      // the line after

      // <figure> nodes can only have one <figcaption> element, if there's more
      // they get converted to a text node and moved after the <figure>
      let C: number = 0
      for (const [child, childPath] of Node.children(editor, path)) {
        if (child.type === "figcaption") {
          C++
          if(C == 1) {
            // for the first node we want to remove any formatting from the string
            if (ALL_TEXT_FORMATS.some(format => isFormatActive(editor, format, {at: childPath}))) {
              Transforms.unsetNodes(
                editor,
                ['emphasis', 'strong', 'inlineCode'],
                {
                  at: childPath,
                  match: Text.isText
                }
              );
            }
          }
          // if this is not the first figcaption node
          if (C > 1) {
            // move the figcaption after the figure
            Transforms.setNodes(editor, {
              type: "paragraph"
            }, {
              at: childPath
            })
            Transforms.liftNodes(editor, {
              at: childPath
            })
          }
        }
        else {
          // any child that is not the first image in the figure moved after the figure
          if (!(mediaTypes.indexOf(child.type) > -1 && childPath[childPath.length - 1] === 0)) {
            Transforms.liftNodes(editor, {at: childPath})
            return;
          }
        }
      }
    }

    // fallback to regular normalization
    normalizeNode(entry)
  }

  // can be called to replace the URI of a media by another URI
  // this is useful for replacing local files by their IPFS uri
  editor.updateMediaUrl = (target, uri) => {
    // go through each node to find the one to replace
    const nodes = Node.descendants(editor)
    for (const [node, path] of nodes) {
      // if the node is found, trigger an update
      if (node.type === target.type) {
        if (node.type === "image" && node.url === target.uri) {
          Transforms.setNodes(editor, {
            url: uri
          }, {
            at: path
          })
        } else if (node.type === "video" && node.src === target.uri) {
          Transforms.setNodes(editor, {
            src: uri
          }, {
            at: path
          })
        } else if (node.type === "audio" && node.src === target.uri) {
          Transforms.setNodes(editor, {
            src: uri
          }, {
            at: path
          })
        }
      }
    }
  }

  // collect all medias uploaded
  editor.getUploadedMedias = () => getEditorMedias(editor)

  return editor
}
