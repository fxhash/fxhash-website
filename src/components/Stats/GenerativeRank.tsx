import style from "./GenerativeRank.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { getUserName } from "../../utils/user"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { PropsWithChildren } from "react"

interface Props {
  token: GenerativeToken
}
export function GenerativeRank({
  token,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className={cs(style.root)}>
      <div 
        className={cs(style.icon)}
        style={{
          backgroundImage: `url(${ipfsGatewayUrl(token.metadata.thumbnailUri, "pinata-fxhash")})`
        }}
      />
      <div className={cs(style.details)}>
        <strong>{ token.name }</strong>
        <span className={cs(colors.gray)}>{ getUserName(token.author, 15) }</span>
      </div>
      <div>{ children }</div>
    </div>
  )
}