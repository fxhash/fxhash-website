import style from "./StepHome.module.scss"
import cs from "classnames"
import Link from "next/link"
import { Button } from "../../components/Button"
import { Spacing } from "../../components/Layout/Spacing"
import { StepComponent } from "../../types/Steps"



export const StepHome:StepComponent = ({ onNext }) => {
  return (
    <>
      <p className={cs(style.presentation)}>
        <span>Before minting a generative token on the blockchain, please read our </span>
        <Link href="/guide">
          <a>
            <i aria-hidden className="fas fa-book"/> Guide to build a Generative Token 
          </a>
        </Link>
        <span> and test your zip file in the </span>
        <Link href="/sandbox"><a>sandbox</a></Link><span>.</span>
      </p>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>

      <div className={cs(style['button-cont'])}>
        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
          iconSide="right"
          size="very-large"
          className={style.button}
          onClick={() => onNext({})}
        >
          <span>I have carefully checked my .zip file,<br/> time to MINT</span>
        </Button>
      </div>
    </>
  )
}