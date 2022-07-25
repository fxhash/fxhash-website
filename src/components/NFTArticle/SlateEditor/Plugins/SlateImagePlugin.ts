import { Editor, Transforms, Element, Node, Text } from "slate";
import { FxEditor } from "../../../../types/ArticleEditor/Editor";
import { ALL_TEXT_FORMATS } from "../index";
import { isFormatActive } from '../utils';

function insertImage(editor: Editor, url: string) {
  Transforms.insertNodes(editor, {
    type: "figure",
    children: [{
      type: "image",
      url: url,
      children: [{
        text: ""
      }],
    }, {
      type: "figcaption",
      children: [{
        text: ""
      }]
    }]
  })
}

/**
 * Wraps the `insertData` method to add support for processing image files
 */
export const withImages = (
  editor: FxEditor
) => {
  const { insertData, isVoid, normalizeNode } = editor

  // make image nodes void nodes
  editor.isVoid = element => 
    element.type === "image" ? true : isVoid(element)

  // when some content is inserted (including drag & drop, we check if the
  // content is an image and if so a custom figure element is inserted)
  editor.insertData = (data) => {
    // if we have at least 1 file in there
    if (data.files?.length > 0) {
      for (const file of data.files) {
        // check if the file is an image
        if (file.type.split("/")[0] === "image") {
          // create a link to the image stored locally
          const url = URL.createObjectURL(file)
          insertImage(editor, url)
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
      if (!node.children.find((node: Node) => node.type === "image")
      || !node.children.find((node: Node) => node.type === "figcaption")) {
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
	    // for the fitst node we want to remove any formatting from the string
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
      }
    }

    // fallback to regular normalization
    normalizeNode(entry)
  }

  return editor
}
