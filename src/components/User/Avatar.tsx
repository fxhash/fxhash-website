import style from "./Avatar.module.scss"
import effect from "../../styles/Effects.module.scss"
import cs from "classnames"
import { ipfsGatewayUrl } from "../../services/Ipfs"

interface Props {
  uri: string | null | undefined
  className?: string
  isInline?: boolean
}

export function Avatar({ uri, className, isInline }: Props) {
  const url = ipfsGatewayUrl(uri)
  const Container = isInline ? "span" : "div"
  return (
    <Container
      className={cs(style.container, effect["drop-shadow-small"], className)}
      style={{
        backgroundImage: url && `url(${url})`,
      }}
    />
  )
}
