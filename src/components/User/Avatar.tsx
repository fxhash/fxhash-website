import style from "./Avatar.module.scss"
import effect from "../../styles/Effects.module.scss"
import cs from "classnames"
import { ipfsDisplayUrl } from "../../services/Ipfs"

interface Props {
  uri: string|null|undefined
  className?: string
}

export function Avatar({ 
  uri,
  className
}: Props) {
  const url = ipfsDisplayUrl(uri)
  return (
    <div 
      className={cs(style.container, effect['drop-shadow-small'], className)}
      style={{
        backgroundImage: url && `url(${url})`
      }}
    />
  )
}