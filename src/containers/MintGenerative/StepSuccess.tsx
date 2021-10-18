import style from "./StepSuccess.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { Spacing } from "../../components/Layout/Spacing"
import { useContext } from "react"
import { UserContext } from "../UserProvider"
import Link from "next/link"
import { getUserProfileLink } from "../../utils/user"
import { Button } from "../../components/Button"


export const StepSuccess: StepComponent = ({ state, onNext }) => {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!
  
  return (
    <div className={cs(style.container)}>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <h3>
        <span>🎉</span>
        <span>
          Your Generative Token is now on the blockchain<br/>
          May it have a happy life
        </span>
        <span>🎉</span>
      </h3>
      
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>

      <Link href={getUserProfileLink(user)} passHref>
        <Button
          isLink
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
          iconSide="right"
          size="large"
        >
          Go to your profile
        </Button>
      </Link>
    </div>
  )
}