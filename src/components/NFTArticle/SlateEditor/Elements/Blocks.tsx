import { FunctionComponent, ReactNode } from "react"
import cs from "classnames"
import { RenderElementProps } from "slate-react"
import Embed from "../../elements/Embed"
import TezosStorage from "../../elements/TezosStorage"
import style from '../../NFTArticle.module.scss';
import { FigureElement } from "../../elements/Figure"
import { FigcaptionElement } from "../../elements/Figcaption"
import { ImageElement } from "../../elements/ImageElement"
import { Editor, Element, Node, Path, Transforms } from "slate"
import { ContextualMenuItems } from "../../../Menus/ContextualMenuItems"
import { HeadingAttributeSettings } from "./AttributeSettings/HeadingAttributeSettings"
import { ListAttributeSettings } from "./AttributeSettings/ListAttributeSettings"
import { BlockquoteElement } from "../../elements/Blockquote"
import { ImageAttributeSettings } from "./AttributeSettings/ImageAttributeSettings"
import { TAttributesEditorWrapper } from "../../../../types/ArticleEditor/ArticleEditorBlocks"
import { BlockParamsModal } from "../Utils/BlockParamsModal"
import { TEditNodeFnFactory } from "../../../../types/ArticleEditor/Transforms"
import { BlockKatexEditor } from "../../elements/BlockKatex/BlockKatexEditor";
import { Katex } from "../../elements/BlockKatex/Katex";
import { TableEditor } from "../../elements/Table/TableEditor";
import { TableCell } from "../../elements/Table/TableCell";

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
}

export const ArticleBlocksList: (keyof EArticleBlocks)[] = Object.keys(
  EArticleBlocks
) as (keyof EArticleBlocks)[]

export const InstantiableArticleBlocksList: EArticleBlocks[] = [
  EArticleBlocks.paragraph,
  EArticleBlocks.heading,
  EArticleBlocks["tezos-storage"],
  EArticleBlocks.figure,
  EArticleBlocks.list,
  EArticleBlocks["embed-media"],
  EArticleBlocks.math,
  EArticleBlocks.table,
  EArticleBlocks.code,
  EArticleBlocks.blockquote,
]

/**
 * The Instanciation Component can be displayed to enter informations about a
 * block, so that non-empty blocks aren't inserted by default
 */
export interface IEditAttributeProps {
  element: any
  onEdit: (element: any) => void
}
export type TEditAttributeComp = FunctionComponent<IEditAttributeProps>

export interface IArticleBlockDefinition {
  name: string
  icon: ReactNode
  buttonInstantiable?: boolean
  render: (props: RenderElementProps) => ReactNode
  hasUtilityWrapper: boolean
  instanciateElement?: () => Element
  editAttributeComp?: TEditAttributeComp
  editAttributeWrapper?: TAttributesEditorWrapper
  // the definition can specify a function which can be called to output a
  // function which will be called to update a node. This is useful if the
  // default editNode function doesn't support certain edge cases
  onEditNodeFactory?: TEditNodeFnFactory
  // should the settings menu be hidden after node is update
  hideSettingsAfterUpdate?: boolean
}

export const BlockDefinitions: Record<EArticleBlocks, IArticleBlockDefinition> = {
  "embed-media": {
    name: "Embed media",
    icon: <i className="fa-brands fa-youtube" aria-hidden/>,
    buttonInstantiable: true,
    render: ({ attributes, element, children }) => (
      <Embed
        {...attributes}
        href={element.href}
      />
    ),
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "embed-media",
      href: "",
      children: [{
        text: ""
      }],
    })
  },
  "tezos-storage": {
    name: "Tezos content",
    icon: <i className="fa-solid fa-hexagon-vertical-nft" aria-hidden/>,
    buttonInstantiable: true,
    render: ({ attributes, element, children }) => (
      <TezosStorage
        {...attributes}
        pKey={element.pKey}
        address={element.address}
        metadataSpec={element.metadataSpec}
        bigmap={element.bigmap}
        value={element.value}
      >
        {children}
      </TezosStorage>
    ),
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "tezos-storage",
      pKey: "",
      address: "",
      metadataSpec: "",
      bigmap: "",
      value: "",
      children: [{
        text: ""
      }]
    })
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
    render: ({ attributes, element, children }) => (
      <hr {...attributes}/>
    ),
    hasUtilityWrapper: false,
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
    instanciateElement: () => ({
      type: "table",
      children: [{
        type: "tableRow",
        children: [{
          type: "tableCell",
          children: [{
            text: ""
          }]
        }, {
          type: "tableCell",
          children: [{
            text: ""
          }]
        }]
      }]
    })
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
      <div className={style.article_wrapper_container}>
        <BlockKatexEditor slateAttributes={attributes} slateElement={element}>
          {children}
        </BlockKatexEditor>
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
    render: ({ attributes, element, children }) => (
      <code {...attributes}>
        {children}
      </code>
    ),
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "code",
      language: "js",
      children: [{
        text: ""
      }]
    }),
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
  "figure": {
    name: "Image",
    icon: <i className="fa-solid fa-image" aria-hidden/>,
    buttonInstantiable: true,
    render: FigureElement,
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "figure",
      children: [{
        type: "image",
        url: "",  // if "", will display the "add image" component
        children: [{
          text: ""
        }]
      }, {
        type: "figcaption",
        children: [{
          text: ""
        }]
      }]
    }),
    editAttributeComp: ImageAttributeSettings,
    editAttributeWrapper: BlockParamsModal,
    // when the ImageAttributeSettings fires onEdit, we need to update the Image
    // child component instead of the figure element
    onEditNodeFactory: (editor, element, path) => (update) => {
      const children = Node.elements(element)
      for (const [child, childPath] of children) {
        if (child.type === "image") {
          Transforms.setNodes(editor, update, {
            at: path.concat(childPath)
          })
          return
        }
      }
    },
    hideSettingsAfterUpdate: true,
  },
  "figcaption": {
    name: "Caption",
    icon: null,
    render: FigcaptionElement,
    hasUtilityWrapper: false,
  },
  "image": {
    name: "Image",
    icon: null,
    render: ImageElement,
    hasUtilityWrapper: false,
  },
}

export const DefaultBlockDefinition: IArticleBlockDefinition = {
  name: "NONE",
  icon: null,
  render: ({ attributes, element, children }) => (
    <div {...attributes}>{children}</div>
  ),
  hasUtilityWrapper: false
}

/**
 * Given the type of an element, outputs their corresponding BlockDefinition or
 * the default one if the one is not defined.
 */
export function getArticleBlockDefinition(type: string): IArticleBlockDefinition {
  return BlockDefinitions[type as EArticleBlocks] || DefaultBlockDefinition
}
