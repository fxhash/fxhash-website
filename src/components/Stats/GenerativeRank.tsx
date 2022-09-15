import style from "./GenerativeRank.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { getUserName } from "../../utils/user"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { PropsWithChildren } from "react"
import Link from "next/link"
import { getGenerativeTokenMarketplaceUrl, getGenerativeTokenUrl } from "../../utils/generative-token"
import { UserType, Collaboration } from "../../types/entities/User"

interface Props {
  token: GenerativeToken
}
export function GenerativeRank({
  token,
  children,
}: PropsWithChildren<Props>) {


  const author = token.author.type === UserType.COLLAB_CONTRACT_V1 ?
    (token.author as Collaboration ).collaborators.map(c => getUserName(c)).join(', ') :
    getUserName(token.author)
  return (
    <Link href={getGenerativeTokenMarketplaceUrl(token)} passHref>
      <a className={cs(style.root)}>
        <div 
          className={cs(style.icon)}
          style={{
            backgroundImage: `url(${ipfsGatewayUrl(token.metadata.thumbnailUri)})`
          }}
        />
        <div className={cs(style.details)}>
          <strong>{ token.name }</strong>
          <span className={cs(colors.gray)}>{ author }</span>
        </div>
        <div className={cs(style.metric)}>{ children }</div>
      </a>
    </Link>
  )
}
