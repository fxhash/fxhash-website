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
      <Spacing size="6x-large" />
      <Spacing size="3x-large" />
      <h3>
        <i className="fa-solid fa-party-horn" aria-hidden />
        {state.collaboration ? (
          <span>
            A proposal to publish this project with your collaborators has been
            made.
          </span>
        ) : (
          <span>
            Your Generative Token is now on the blockchain
            <br />
            May it have a happy life
          </span>
        )}
        <i className="fa-solid fa-party-horn" aria-hidden />
      </h3>

      <Spacing size="6x-large" />

      {state.collaboration ? (
        <Link href={`/collaborations/${state.collaboration.id}`} passHref>
          <Button
            isLink
            color="secondary"
            iconComp={<i aria-hidden className="fas fa-arrow-right" />}
            iconSide="right"
            size="large"
          >
            go to the collaboration page
          </Button>
        </Link>
      ) : (
        <Link href={getUserProfileLink(user)} passHref>
          <Button
            isLink
            color="secondary"
            iconComp={<i aria-hidden className="fas fa-arrow-right" />}
            iconSide="right"
            size="large"
          >
            go to your profile
          </Button>
        </Link>
      )}
    </div>
  )
}
