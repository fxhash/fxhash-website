import { MintProgressMessage } from "../types/Responses"

export function getMintProgressMessage(progress: MintProgressMessage): string {
  switch (progress) {
    case MintProgressMessage.GET_TOKEN_DATA:
    case MintProgressMessage.GET_TOKEN_METADATA:
    case MintProgressMessage.GET_GENERATIVE_TOKEN_CONTENTS:
    case MintProgressMessage.ADD_CONTENT_IPFS:
    case MintProgressMessage.AUTHENTICATE_TOKEN:
      return "Generating unique token"
    case MintProgressMessage.GENERATE_PREVIEW:
      return "Generating image preview"
  }
}
