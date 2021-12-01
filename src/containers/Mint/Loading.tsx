import style from "./Mint.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { Loader } from "../../components/Utils/Loader"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { Spacing } from "../../components/Layout/Spacing"


interface Props {
  message: string
}

export function MintLoading({
  message
}: Props) {
  return (
    <>
      <LoaderBlock textPos="bottom">
        <span className={cs(style['loading-message'])}>{message}</span>
      </LoaderBlock>

      <Spacing size="large"/>

      <h2>Your token is being minted</h2>
      <strong className={cs(colors.secondary)}>You will soon be able to see your uniquely-generated NFT !</strong>

      <Spacing size="large"/>

      <em className={cs(colors.gray)}>
        Please be patient, it sometimes can take up to a few minutes
      </em>
    </>
  )
}