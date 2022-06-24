import { FunctionComponent, ReactNode } from "react"
import cs from "classnames"
import { RenderElementProps } from "slate-react"
import Embed from "../../elements/Embed"
import TezosStorage from "../../elements/TezosStorage"
// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex'
import { FigureElement } from "../../elements/Figure"
import { FigcaptionElement } from "../../elements/Figcaption"
import { ImageElement } from "../../elements/ImageElement"
import { Element } from "slate"
import { ContextualMenuItems } from "../../../Menus/ContextualMenuItems"

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
    editAttributeComp: ({ element, onEdit }) => {
      return (
        <ContextualMenuItems>
          {[...Array(6)].map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onEdit({
                depth: idx+1
              })}
              className={cs({
                selected: element.depth === idx+1
              })}
            >
              <i className={`fa-regular fa-h${idx+1}`} aria-hidden/>
              <span>Heading {idx+1}</span>
            </button>
          ))}
        </ContextualMenuItems>
      )
    }
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
    render: ({ attributes, element, children }) => (
      <blockquote {...attributes}>{children}</blockquote>
    ),
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
    })
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
      <table>
        <tbody {...attributes}>{children}</tbody>
      </table>
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
    render: ({ attributes, element, children }) => (
      <tr {...attributes}>{children}</tr>
    ),
    hasUtilityWrapper: false,
  },
  "tableCell": {
    name: "Table cell",
    icon: <i className="fa-regular fa-table" aria-hidden/>,
    render: ({ attributes, element, children }) => (
      <td {...attributes}>{children}</td>
    ),
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
        <InlineMath math={element.data.math}/>
        {children}
      </span>
    ),
    hasUtilityWrapper: false,
  },
  "math": {
    name: "Math",
    icon: <i className="fa-solid fa-function" aria-hidden/>,
    buttonInstantiable: true,
    render: ({ attributes, element, children }) => (
      <span contentEditable={false}>
        <BlockMath math={element.data.math}/>
        {children}
      </span>
    ),
    hasUtilityWrapper: true,
    // todo: void math element
    instanciateElement: () => ({
      type: "math",
      data: {
        math: ""
      },
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
    hasUtilityWrapper: true,
  },
  "figure": {
    name: "Image",
    icon: <i className="fa-solid fa-image" aria-hidden/>,
    buttonInstantiable: true,
    render: FigureElement,
    hasUtilityWrapper: true,
    // todo: set a TEMP image
    instanciateElement: () => ({
      type: "figure",
      children: [{
        type: "image",
        url: "https://google.com",
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