import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition";
import { MentionEditor } from "./MentionEditor";

interface InstanciateMentionOpts {
  tzAddress?: string
}
export const mentionDefinition: IArticleBlockDefinition<InstanciateMentionOpts> = {
  name: "Mention",
  icon: <i className="fa-solid fa-at" aria-hidden/>,
  render: MentionEditor,
  hasUtilityWrapper: false,
  inlineMenu: null,
  instanciateElement: ({ tzAddress } = { tzAddress: '' }) => ({
    type: 'mention',
    tzAddress,
    children: [{ text: '' }],
  }),
}

