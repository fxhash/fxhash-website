import { defaultSchema } from "rehype-sanitize"
import { Schema } from "hast-util-sanitize/lib"
import { tezosStorageProcessor } from "../elements/TezosStorage/TezosStorageProcessor"
import { embedProcessor } from "../elements/Embed/EmbedProcessor"
import { mentionProcessor } from "../elements/Mention/MentionProcessor"

export const articleSchemaSanitize: Schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "embed-media",
    "tezos-storage-pointer",
    "mention",
    "video",
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": ["className"],
    img: [...(defaultSchema.attributes?.img || []), "alt"],
    video: [...(defaultSchema.attributes?.video || []), "src", "alt"],
    th: [...(defaultSchema.attributes?.th || []), "align"],
    "embed-media": embedProcessor.htmlAttributes!,
    "tezos-storage-pointer": tezosStorageProcessor.htmlAttributes!,
    mention: mentionProcessor.htmlAttributes!,
  },
  protocols: {
    ...defaultSchema.protocols,
    href: [...(defaultSchema.protocols?.href || []), "ipfs"],
    src: [...(defaultSchema.protocols?.src || []), "ipfs"],
  },
}
