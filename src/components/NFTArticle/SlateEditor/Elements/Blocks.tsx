import Embed from "../../elements/Embed/Embed"
import style from '../../NFTArticle.module.scss';
import { FigureElement } from "../../elements/Figure/FigureEditor"
import { FigcaptionElement } from "../../elements/Figure/FigcaptionEditor"
import { ImageEditor } from "../../elements/Image/ImageEditor"
import { Editor, Element, Node, Path, Transforms, Range } from "slate"
import { HeadingAttributeSettings } from "./AttributeSettings/HeadingAttributeSettings"
import { ListAttributeSettings } from "./AttributeSettings/ListAttributeSettings"
import { BlockquoteElement } from "../../elements/Blockquote"
import { ImageAttributeSettings } from "../../elements/Image/ImageAttributeSettings"
import { BlockParamsModal } from "../Utils/BlockParamsModal"
import { TezosStorageSettings } from "./AttributeSettings/TezosStorageSettings"
import { BlockKatexEditor } from "../../elements/BlockKatex/BlockKatexEditor";
import { TableEditor } from "../../elements/Table/TableEditor";
import { TableCell } from "../../elements/Table/TableCell";
import { SlateTable } from "../Plugins/SlateTablePlugin";
import TezosStorageEditor from "./TezosStorageEditor";
import { CodeAttributeSettings } from "./AttributeSettings/CodeAttributeSettings";
import { CodeEditorElement } from "./CodeEditorElement";
import { ThematicBreak } from "../../elements/ThematicBreak";
import { EBreakBehavior } from "../Plugins/SlateBreaksPlugin";
import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";
import { videoDefinition } from "../../elements/Video/VideoDefinition";
import { figcaptionDefinition, figureDefinition } from "../../elements/Figure/FigureDefinition";
import { imageDefinition } from "../../elements/Image/ImageDefinition";

export enum EArticleBlocks {
  "embed-media" = "embed-media",
  "tezos-storage" = "tezos-storage",
  "paragraph" = "paragraph",
  "heading" = "heading",
  "thematicBreak" = "thematicBreak",
  "blockquote" = "blockquote",
  "list" = "list",
  "listItem" = "listItem",
  "table" = "table",
  "tableRow" = "tableRow",
  "tableCell" = "tableCell",
  "html" = "html",
  "inlineMath" = "inlineMath",
  "math" = "math",
  "code" = "code",
  "yaml" = "yaml",
  "toml" = "toml",
  "break" = "break",
  "link" = "link",
  "figure" = "figure",
  "figcaption" = "figcaption",
  "image" = "image",
  "video" = "video"
}

export const ArticleBlocksList: (keyof EArticleBlocks)[] = Object.keys(
  EArticleBlocks
) as (keyof EArticleBlocks)[]

export const InstantiableArticleBlocksList: EArticleBlocks[] = [
  EArticleBlocks.paragraph,
  EArticleBlocks.heading,
  EArticleBlocks.thematicBreak,
  EArticleBlocks["tezos-storage"],
  EArticleBlocks.image,
  EArticleBlocks.video,
  EArticleBlocks["embed-media"],
  EArticleBlocks.math,
  EArticleBlocks.table,
  EArticleBlocks.list,
  EArticleBlocks.code,
  EArticleBlocks.blockquote,
]

export const BlockDefinitions: Record<EArticleBlocks, IArticleBlockDefinition<any>> = {
  "embed-media": {
    name: "Embed media",
    icon: <i className="fa-brands fa-youtube" aria-hidden/>,
    buttonInstantiable: true,
    render: ({ attributes, element, children }) => (
      <div className={style.article_wrapper_container}>
        <Embed
          slateElement={element}
          slateAttributes={attributes}
          href={element.href}
          editable
        >
          {children}
        </Embed>
      </div>
    ),
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "embed-media",
      href: "",
      children: [{
        text: ""
      }],
    }),
    preventAutofocusTrigger: true,
  },
  "tezos-storage": {
    name: "Tezos content",
    icon: <i className="fa-solid fa-hexagon-vertical-nft" aria-hidden/>,
    buttonInstantiable: true,
    render: ({ attributes, element, children }) => (
      <TezosStorageEditor
        {...attributes}
        element={element}
        contract={element.contract}
        path={element.path}
        storage_type={element.storage_type}
        spec={element.spec}
        data_spec={element.data_spec}
        value_path={element.value_path}
      >
        {children}
      </TezosStorageEditor>
    ),
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "tezos-storage",
      contract: undefined,
      path: undefined,
      storage_type: undefined,
      spec: undefined,
      data_spec: undefined,
      value_path: undefined,
      children: [{
        text: ""
      }]
    }),
    editAttributeComp: TezosStorageSettings,
    editAttributeWrapper: BlockParamsModal,
    hideSettingsAfterUpdate: true,
    preventAutofocusTrigger: true,
  },
  "paragraph": {
    name: "Paragraph",
    icon: <i className="fa-solid fa-paragraph" aria-hidden/>,
    buttonInstantiable: true,
    render: ({ attributes, element, children }) => (
      <p {...attributes}>{children}</p>
    ),
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "paragraph",
      children: [{
        text: ""
      }]
    }),
  },
  "heading": {
    name: "Heading",
    icon: <i className="fa-solid fa-heading" aria-hidden/>,
    buttonInstantiable: true,
    render: ({ attributes, element, children }) => {
      switch (element.depth) {
        case 1:
          return <h1 {...attributes}>{children}</h1>;
          case 2:
            return <h2 {...attributes}>{children}</h2>;
        case 3:
          return <h3 {...attributes}>{children}</h3>;
          case 4:
            return <h4 {...attributes}>{children}</h4>;
        case 5:
          return <h5 {...attributes}>{children}</h5>;
          case 6:
          return <h6 {...attributes}>{children}</h6>;
          default:
            break;
          }
    },
    insertBreakBehavior: EBreakBehavior.insertParagraph,
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "heading",
      depth: 1,
      children: [{
        text: ""
      }]
    }),
    editAttributeComp: HeadingAttributeSettings,
  },
  "thematicBreak": {
    name: "Horizontal break",
    icon: <i className="fa-solid fa-horizontal-rule" aria-hidden/>,
    render: ThematicBreak,
    instanciateElement: () => ({
      type: "thematicBreak",
      children: [{
        text: ""
      }],
    }),
    buttonInstantiable: true,
    hasUtilityWrapper: true,
  },
  "blockquote": {
    name: "Quote",
    icon: <i className="fa-solid fa-quotes" aria-hidden/>,
    buttonInstantiable: true,
    render: BlockquoteElement,
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "blockquote",
      children: [{
        text: ""
      }]
    })
  },
  "list": {
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
  },
  "listItem": {
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
  },
  "table": {
    name: "Table",
    icon: <i className="fa-regular fa-table" aria-hidden/>,
    buttonInstantiable: true,
    render: ({ attributes, element, children }) => (
      <TableEditor slateAttributes={attributes} slateElement={element}>
        {children}
      </TableEditor>
    ),
    hasUtilityWrapper: true,
    instanciateElement: () => SlateTable.createTable(2, 2),
    preventAutofocusTrigger: true,
  },
  "tableRow": {
    name: "Table row",
    icon: <i className="fa-regular fa-table" aria-hidden/>,
    render: ({ attributes, element, children }) => {
      return (
        <tr {...attributes}>{children}</tr>
      );
    },
    hasUtilityWrapper: false,
  },
  "tableCell": {
    name: "Table cell",
    icon: <i className="fa-regular fa-table" aria-hidden/>,
    render: TableCell,
    hasUtilityWrapper: false,
    inlineMenu: ['strong', 'emphasis'],
  },
  "html": {
    name: "HTML",
    icon: <i className="fa-brands fa-html5" aria-hidden/>,
    render: ({ attributes, element, children }) => (
      <div
        {...attributes}
        dangerouslySetInnerHTML={{
          __html: element.children[0].text as string,
        }}
      />
    ),
    hasUtilityWrapper: true,
  },
  "inlineMath": {
    name: "Math",
    icon: <i className="fa-solid fa-function" aria-hidden/>,
    render: ({ attributes, element, children }) => (
      <span contentEditable={false}>
        inline math
      </span>
    ),
    hasUtilityWrapper: false,
  },
  "math": {
    name: "Math",
    icon: <i className="fa-solid fa-function" aria-hidden/>,
    buttonInstantiable: true,
    render: ({ attributes, element, children }) => (
      <div className={style.article_wrapper_container} {...attributes}>
	      {children}
        <BlockKatexEditor slateElement={element}/>
      </div>
    ),
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "math",
      math: "",
      children: [{
        text: ""
      }]
    })
  },
  "code": {
    name: "Code",
    icon: <i className="fa-solid fa-code" aria-hidden/>,
    buttonInstantiable: true,
    render: CodeEditorElement,
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "code",
      lang: "js",
      children: [{
        text: ""
      }]
    }),
    editAttributeComp: CodeAttributeSettings,
  },
  "yaml": {
    name: "YAML",
    icon: <i className="fa-solid fa-code" aria-hidden/>,
    render: ({ attributes, element, children }) => (
      <pre>
        <code {...attributes}>{children}</code>
      </pre>
    ),
    hasUtilityWrapper: true,
  },
  "toml": {
    name: "TOML",
    icon: <i className="fa-solid fa-code" aria-hidden/>,
    render: ({ attributes, element, children }) => (
      <pre>
        <code {...attributes}>{children}</code>
      </pre>
    ),
    hasUtilityWrapper: true,
  },
  "break": {
    name: "Break",
    icon: null,
    render: ({ attributes, element, children }) => (
      <br/>
    ),
    hasUtilityWrapper: false,
  },
  "link": {
    name: "Link",
    icon: <i className="fa-solid fa-link" aria-hidden/>,
    render: ({ attributes, element, children }) => (
      <a
        {...attributes}
        href={element.url as string}
        title={element.title as string}
      >
        {children}
      </a>
    ),
    hasUtilityWrapper: false,
  },
  "figure": figureDefinition,
  "figcaption": figcaptionDefinition,
  "image": imageDefinition,
  "video": videoDefinition
}

export const DefaultBlockDefinition: IArticleBlockDefinition<null> = {
  name: "NONE",
  icon: null,
  render: ({ attributes, element, children }) => (
    <div {...attributes}>{children}</div>
  ),
  hasUtilityWrapper: false,
  insertBreakBehavior: EBreakBehavior.default,
}

/**
 * Given the type of an element, outputs their corresponding BlockDefinition or
 * the default one if the one is not defined.
 */
export function getArticleBlockDefinition(type: string): IArticleBlockDefinition<any> {
  return BlockDefinitions[type as EArticleBlocks] || DefaultBlockDefinition
}
