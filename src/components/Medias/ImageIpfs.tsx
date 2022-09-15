// import style from "./ImageIpfs.module.scss"
import cs from "classnames"
import { HTMLAttributes } from "react"
import { EGatewayIpfs, ipfsGatewayUrl } from "../../services/Ipfs"

interface Props extends HTMLAttributes<HTMLImageElement> {
  src: string
  hasPlaceholder?: boolean
  gateway?: EGatewayIpfs
}
export function ImageIpfs({
  src,
  hasPlaceholder = false,
  gateway = EGatewayIpfs.FXHASH_SAFE,
  ...props
}: Props) {
  return (
    <img
      {...props}
      src={ipfsGatewayUrl(src, gateway)}
    />
  )
}