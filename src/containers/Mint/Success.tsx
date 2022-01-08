import style from "./Mint.module.scss"
import colors from "../../styles/Colors.module.css"
import text from "../../styles/Text.module.css"
import cs from "classnames"
import { MintResponse } from "../../types/Responses"
import { Spacing } from "../../components/Layout/Spacing"
import Link from "next/link"
import { Button } from "../../components/Button"
import { ConnectedUser } from "../../types/entities/User"
import { getUserProfileLink } from "../../utils/user"


interface Props {
  mintData: MintResponse
  user: ConnectedUser
}

export function MintSuccess({ mintData, user }: Props) {
  return (
    <>
      <h1 className={cs(colors.success)}>
        Congratulations !
      </h1>
      <Spacing size="2x-small"/>
      <h5>
        Your token was successfully minted
      </h5>

      <Spacing size="3x-large"/>

      <Link href={`/preview-mint?cidLive=${mintData.cidGenerative}&cidPreview=${mintData.cidPreview}`} passHref>
        <Button
          isLink
          iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
          iconSide="right"
          color="secondary"
          size="large"
        >
          discover your unique token
        </Button>
      </Link>

      <Spacing size="2x-small"/>

      <Link href={`${getUserProfileLink(user)}/collection`}>
        <a className={cs(text.small)}>visit your collection &gt;</a>
      </Link>
    </>
  )
}