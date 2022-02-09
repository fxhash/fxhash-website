import style from "./GenerativeRank.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { getUserName } from "../../utils/user"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { PropsWithChildren } from "react"
import Link from "next/link"
import { getGenerativeTokenMarketplaceUrl, getGenerativeTokenUrl } from "../../utils/generative-token"

interface Props {
  token: GenerativeToken
}
export function GenerativeRank({
  token,
  children,
}: PropsWithChildren<Props>) {
  return (
    <Link href={getGenerativeTokenMarketplaceUrl(token)} passHref>
      <a className={cs(style.root)}>
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
        <div className={cs(style.metric)}>{ children }</div>
      </a>
    </Link>
  )
}