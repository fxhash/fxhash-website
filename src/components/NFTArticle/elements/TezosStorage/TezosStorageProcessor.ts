import { IArticleElementProcessor } from "../../../../types/ArticleEditor/Processor"
import {
  ITezosStoragePointer,
  OptionalTezosStoragePointerKeys,
} from "../../../../types/TezosStorage"

export const tezosStorageProcessor: IArticleElementProcessor = {
  htmlTagName: "tezos-storage-pointer",
  htmlAttributes: ["contract", "path", ...OptionalTezosStoragePointerKeys],
  transformMdhastToComponent: (node, properties) => {
    const props: Partial<ITezosStoragePointer> = {
      contract: properties.contract,
      path: properties.path,
    }
    for (const K of OptionalTezosStoragePointerKeys) {
      if (properties[K]) {
        props[K] = properties[K]
      }
    }
    return props as any
  },
}
