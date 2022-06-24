import { ReactNode } from "react"
import { RenderElementProps } from "slate-react"
import Embed from "../../elements/Embed"
import TezosStorage from "../../elements/TezosStorage"
// @ts-ignore
import { InlineMath, BlockMath } from 'react-katex'
import { FigureElement } from "../../elements/Figure"
import { FigcaptionElement } from "../../elements/Figcaption"
import { ImageElement } from "../../elements/ImageElement"

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
  "definition" = "definition",
  "footnoteDefinition" = "footnoteDefinition",
  "break" = "break",
  "link" = "link",
  "figure" = "figure",
  "figcaption" = "figcaption",
  "image" = "image",
  "linkReference" = "linkReference",
  "imageReference" = "imageReference",
  "footnote" = "footnote",
  "footnoteReference" = "footnoteReference"
}

interface IArticleBlockDefinition {
  render: (props: RenderElementProps) => ReactNode
  hasUtilityWrapper: boolean
}

export const BlockDefinitions: Record<EArticleBlocks, IArticleBlockDefinition> = {
  "embed-media": {
    render: ({ attributes, element, children }) => (
      <Embed 
        {...attributes}
        href={element.href}
      />
    ),
    hasUtilityWrapper: true,
  },
  "tezos-storage": {
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
  },
  "paragraph": {
    render: ({ attributes, element, children }) => (
      <p {...attributes}>{children}</p>
    ),
    hasUtilityWrapper: true,
  },
  "heading": {
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
  },
  "thematicBreak": {
    render: ({ attributes, element, children }) => (
      <hr {...attributes}/>
    ),
    hasUtilityWrapper: false,
  },
  "blockquote": {
    render: ({ attributes, element, children }) => (
      <blockquote {...attributes}>{children}</blockquote>
    ),
    hasUtilityWrapper: true,
  },
  "list": {
    render: ({ attributes, element, children }) => (
      element.ordered ? (
        <ol {...attributes}>{children}</ol>
      ):(
        <ul {...attributes}>{children}</ul>
      )
    ),
    hasUtilityWrapper: true,
  },
  "listItem": {
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
    render: ({ attributes, element, children }) => (
      <table>
        <tbody {...attributes}>{children}</tbody>
      </table>
    ),
    hasUtilityWrapper: true,
  },
  "tableRow": {
    render: ({ attributes, element, children }) => (
      <tr {...attributes}>{children}</tr>
    ),
    hasUtilityWrapper: false,
  },
  "tableCell": {
    render: ({ attributes, element, children }) => (
      <td {...attributes}>{children}</td>
    ),
    hasUtilityWrapper: false,
  },
  "html": {
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
    render: ({ attributes, element, children }) => (
      <span contentEditable={false}>
        <InlineMath math={element.data.math}/>
        {children}
      </span>
    ),
    hasUtilityWrapper: false,
  },
  "math": {
    render: ({ attributes, element, children }) => (
      <span contentEditable={false}>
        <BlockMath math={element.data.math}/>
        {children}
      </span>
    ),
    hasUtilityWrapper: true,
  },
  "code": {
    render: ({ attributes, element, children }) => (
      <code {...attributes}>
        {children}
      </code>
    ),
    hasUtilityWrapper: true,
  },
  "yaml": {
    render: ({ attributes, element, children }) => (
      <pre>
        <code {...attributes}>{children}</code>
      </pre>
    ),
    hasUtilityWrapper: true,
  },
  "toml": {
    render: ({ attributes, element, children }) => (
      <pre>
        <code {...attributes}>{children}</code>
      </pre>
    ),
    hasUtilityWrapper: true,
  },
  "definition": {
    render: ({ attributes, element, children }) => null,
    hasUtilityWrapper: true,
  },
  "footnoteDefinition": {
    render: ({ attributes, element, children }) => null,
    hasUtilityWrapper: true,
  },
  "break": {
    render: ({ attributes, element, children }) => (
      <br/>
    ),
    hasUtilityWrapper: false,
  },
  "link": {
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
    render: FigureElement,
    hasUtilityWrapper: true,
  },
  "figcaption": {
    render: FigcaptionElement,
    hasUtilityWrapper: false,
  },
  "image": {
    render: ImageElement,
    hasUtilityWrapper: false,
  },
  "linkReference": {
    render: ({ attributes, element, children }) => null,
    hasUtilityWrapper: true,
  },
  "imageReference": {
    render: ({ attributes, element, children }) => null,
    hasUtilityWrapper: true,
  },
  "footnote": {
    render: ({ attributes, element, children }) => null,
    hasUtilityWrapper: true,
  },
  "footnoteReference": {
    render: ({ attributes, element, children }) => null,
    hasUtilityWrapper: true
  },
}

export const DefaultBlockDefinition: IArticleBlockDefinition = {
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