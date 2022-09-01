import { ListAttributeSettings } from "./ListAttributeSettings";
import { Editor, Element, Node, Path, Range, Transforms } from "slate";
import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";

export const listDefinition: IArticleBlockDefinition<any> = {
  name: "List",
  icon: <i className="fa-solid fa-list" aria-hidden/>,
  buttonInstantiable: true,
  render: ({ attributes, element, children }) => (
    element.ordered ? (
      <ol {...attributes}>{children}</ol>
    ):(
      <ul {...attributes}>{children}</ul>
    )
  ),
  hasUtilityWrapper: true,
  instanciateElement: () => ({
    type: "list",
    ordered: false,
    spread: false,
    children: [{
      type: "listItem",
      children: [{
        text: ""
      }]
    }]
  }),
  editAttributeComp: ListAttributeSettings,
}

export const listItemDefinition: IArticleBlockDefinition<any> = {
  name: "List Item",
  icon: <i className="fa-solid fa-list" aria-hidden/>,
  render: ({ attributes, element, children }) => (
    <li {...attributes}>
      {element.checked === true ? (
        <input type="checkbox" readOnly checked />
      ) : element.checked === false ? (
        <input type="checkbox" readOnly />
      ) : null}
      {children}
    </li>
  ),
  insertBreakBehavior: (editor, element) => {
    const { selection } = editor;
    if (selection && !Range.isCollapsed(selection)) return true;
    const [nodeListItem, pathListItem] = element;
    const text = Node.string(nodeListItem);
    if (text) return true;
    const parentList = Editor.above(editor, {
      at: pathListItem,
      match: n =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === 'list',
      mode: 'lowest',
    })
    if (!parentList) return true;
    const [, pathParentList] = parentList
    const next = Path.next(pathParentList);
    Transforms.setNodes(editor, { type: 'paragraph' }, {
      at: pathListItem,
    })
    Transforms.moveNodes(editor, {
      at: pathListItem,
      to: next,
    })
  },
  hasUtilityWrapper: false,
}
