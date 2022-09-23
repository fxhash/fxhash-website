import { BlockParamsModal } from "./UI/BlockParamsModal"
import { TezosStorageSettings } from "../elements/TezosStorage/TezosStorageSettings"
import TezosStorageEditor from "../elements/TezosStorage/TezosStorageEditor"
import { EBreakBehavior } from "./Plugins/SlateBreaksPlugin"
import { IArticleBlockDefinition } from "../../../types/ArticleEditor/BlockDefinition"
import { videoDefinition } from "../elements/Video/VideoDefinition"
import {
  figcaptionDefinition,
  figureDefinition,
} from "../elements/Figure/FigureDefinition"
import { imageDefinition } from "../elements/Image/ImageDefinition"
import { codeDefinition } from "../elements/Code/CodeDefinition"
import { blockquoteDefinition } from "../elements/Blockquote/BlockquoteDefinition"
import { linkDefinition } from "../elements/Link/LinkDefinition"
import {
  tableCellDefinition,
  tableDefinition,
  tableRowDefinition,
} from "../elements/Table/TableDefinition"
import {
  listDefinition,
  listItemDefinition,
} from "../elements/List/ListDefinition"
import { embedDefinition } from "../elements/Embed/EmbedDefinition"
import { headingDefinition } from "../elements/Heading/HeadingDefinition"
import {
  inlineMathDefinition,
  mathDefinition,
} from "../elements/Math/MathDefinition"
import { thematicBreakDefinition } from "../elements/ThematicBreak/ThematicBreakDefinition"
import { paragraphDefinition } from "../elements/Paragraph/ParagraphDefinition"
import { mentionDefinition } from "../elements/Mention/MentionDefinition"

export enum EArticleBlocks {
  "embed-media" = "embed-media",
  "tezos-storage-pointer" = "tezos-storage-pointer",
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
  "video" = "video",
  "mention" = "mention",
}

export const ArticleBlocksList: (keyof EArticleBlocks)[] = Object.keys(
  EArticleBlocks
) as (keyof EArticleBlocks)[]

export const InstantiableArticleBlocksList: EArticleBlocks[] = [
  EArticleBlocks.paragraph,
  EArticleBlocks.heading,
  EArticleBlocks.thematicBreak,
  EArticleBlocks["tezos-storage-pointer"],
  EArticleBlocks.image,
  EArticleBlocks.video,
  EArticleBlocks["embed-media"],
  EArticleBlocks.math,
  EArticleBlocks.table,
  EArticleBlocks.list,
  EArticleBlocks.code,
  EArticleBlocks.blockquote,
]

export const BlockDefinitions: Record<
  EArticleBlocks,
  IArticleBlockDefinition<any>
> = {
  "embed-media": embedDefinition,
  "tezos-storage-pointer": {
    name: "Tezos content",
    icon: <i className="fa-solid fa-hexagon-vertical-nft" aria-hidden />,
    buttonInstantiable: true,
    render: ({ attributes, element, children }) => (
      <TezosStorageEditor
        {...attributes}
        element={element}
        contract={element.contract}
        path={element.path}
        storage_type={element.storage_type}
        data_spec={element.data_spec}
        value_path={element.value_path}
      >
        {children}
      </TezosStorageEditor>
    ),
    hasUtilityWrapper: true,
    instanciateElement: () => ({
      type: "tezos-storage-pointer",
      contract: undefined,
      path: undefined,
      storage_type: undefined,
      data_spec: undefined,
      value_path: undefined,
      children: [
        {
          text: "",
        },
      ],
    }),
    editAttributeComp: TezosStorageSettings,
    editAttributeWrapper: BlockParamsModal,
    hideSettingsAfterUpdate: true,
    preventAutofocusTrigger: true,
  },
  paragraph: paragraphDefinition,
  heading: headingDefinition,
  thematicBreak: thematicBreakDefinition,
  blockquote: blockquoteDefinition,
  list: listDefinition,
  listItem: listItemDefinition,
  table: tableDefinition,
  tableRow: tableRowDefinition,
  tableCell: tableCellDefinition,
  inlineMath: inlineMathDefinition,
  math: mathDefinition,
  code: codeDefinition,
  link: linkDefinition,
  figure: figureDefinition,
  figcaption: figcaptionDefinition,
  image: imageDefinition,
  video: videoDefinition,
  mention: mentionDefinition,
  html: {
    name: "HTML",
    icon: <i className="fa-brands fa-html5" aria-hidden />,
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
  yaml: {
    name: "YAML",
    icon: <i className="fa-solid fa-code" aria-hidden />,
    render: ({ attributes, element, children }) => (
      <pre>
        <code {...attributes}>{children}</code>
      </pre>
    ),
    hasUtilityWrapper: true,
  },
  toml: {
    name: "TOML",
    icon: <i className="fa-solid fa-code" aria-hidden />,
    render: ({ attributes, element, children }) => (
      <pre>
        <code {...attributes}>{children}</code>
      </pre>
    ),
    hasUtilityWrapper: true,
  },
  break: {
    name: "Break",
    icon: null,
    render: ({ attributes, element, children }) => <br />,
    hasUtilityWrapper: false,
  },
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
export function getArticleBlockDefinition(
  type: string
): IArticleBlockDefinition<any> {
  return BlockDefinitions[type as EArticleBlocks] || DefaultBlockDefinition
}
