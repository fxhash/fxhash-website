import style from "./ListItemGenerative.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { ipfsGatewayUrl } from "../../services/Ipfs"

interface Props {
  token: GenerativeToken
}
export function ListItemGenerative({ token }: Props) {
  return (
    <div className={cs(style.root)}>
      <div
        className={cs(style.icon)}
        style={{
          backgroundImage: `url(${ipfsGatewayUrl(
            token.metadata.thumbnailUri
          )})`,
        }}
      />
      <span>{token.name}</span>
    </div>
  )
}
