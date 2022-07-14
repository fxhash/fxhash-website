import { BaseOperation, Descendant, Editor, Node, Transforms } from "slate"
import { FxEditor } from "../../../../types/ArticleEditor/Editor";
import { IEditorMediaFile } from "../../../../types/ArticleEditor/Image";
import { arrayRemoveDuplicates } from "../../../../utils/array";

// a list of operation types which can mutate the list of medias
const mediaMutableOperations: BaseOperation["type"][] = [
  "insert_node",
  "remove_node",
  "set_node"
]

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
export function withMediaSupport(
  editor: Editor,
  onMediasUpdate: (medias: IEditorMediaFile[]) => void
): FxEditor {
  const mediaTypes = ["image", "figure"];
  const { apply } = editor

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
      if (mediaTypes.includes(node.type)) {
        // we parse the whole editor to find the whole media list
        const medias = getEditorMedias(editor)
        // propagate the media update
        onMediasUpdate(medias)
      }
    }
  }

  // can be called to replace the URI of a media by another URI
  // this is useful for replacing local files by their IPFS uri
  editor.updateMediaUrl = (target, uri) => {
    // go through each node to find the one to replace
    const nodes = Node.descendants(editor)
    for (const [node, path] of nodes) {
      // if the node is found, trigger an update
      if (node.type === target.type && node.url === target.uri) {
        Transforms.setNodes(editor, {
          url: uri
        }, {
          at: path
        })
      }
    }
  }

  // collect all medias uploaded
  editor.getUploadedMedias = () => getEditorMedias(editor)

  return editor
}
