import style from "./StepHome.module.scss"
import cs from "classnames"
import Link from "next/link"
import { Button } from "../../components/Button"
import { Spacing } from "../../components/Layout/Spacing"
import { StepComponent } from "../../types/Steps"
import { LinkGuide } from "../../components/Link/LinkGuide"
import { Checkbox } from "../../components/Input/Checkbox"
import { useState } from "react"

export const StepHome: StepComponent = ({ onNext }) => {
  const [confirm, setConfirm] = useState(false)
  return (
    <>
      <p className={cs(style.presentation)}>
        <span>
          Before minting a generative token on the blockchain, please read our{" "}
        </span>
        <LinkGuide href="/doc/artist/guide-publish-generative-token">
          Guide to build a Generative Token
        </LinkGuide>
        <span> and test your zip file in the </span>
        <Link href="/sandbox">
          <a>sandbox</a>
        </Link>
        <span>.</span>
      </p>

      <p className={cs(style.presentation)}>
        Please also take a look at fxhash{" "}
        <LinkGuide href="/doc/artist/code-of-conduct">
          Code of Conduct
        </LinkGuide>
        . If your token does not follow the code, it may get moderated by our
        team
      </p>

      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" sm="regular" />

      <div className={cs(style["button-cont"])}>
        <Checkbox onChange={setConfirm} value={confirm} paddingLeft={false}>
          I have carefully checked my .zip file.
        </Checkbox>
        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right" />}
          iconSide="right"
          size="very-large"
          className={style.button}
          disabled={!confirm}
          onClick={() => onNext({})}
        >
          <span>Time to MINT</span>
        </Button>
      </div>
      <Spacing size="3x-large" sm="large" />
    </>
  )
}
