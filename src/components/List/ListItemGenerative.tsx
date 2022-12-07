import style from "./ListItemGenerative.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Image } from "../Image"

interface Props {
  token: GenerativeToken
}
export function ListItemGenerative({ token }: Props) {
  return (
    <div className={cs(style.root)}>
      <div className={style.icon}>
        <Image
          ipfsUri={token.metadata.thumbnailUri}
          image={token.captureMedia}
          alt=""
        />
      </div>
      <span>{token.name}</span>
    </div>
  )
}
