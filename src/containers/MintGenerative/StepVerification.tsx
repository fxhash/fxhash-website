import style from "./StepCheckFiles.module.scss"
import styleSteps from "./Steps.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { ArtworkIframe } from "../../components/Artwork/PreviewIframe"
import { getIpfsIoUrl } from "../../utils/ipfs"
import { ArtworkPreview } from "../../components/Artwork/Preview"
import { Spacing } from "../../components/Layout/Spacing"
import Link from "next/link"
import { Button } from "../../components/Button"


export const StepVerification: StepComponent = ({
  onNext,
  state
}) => {
  return (
    <>
      <p>Last occasion to check your project.</p>

      <Spacing size="3x-large"/>

      <div className={cs(style.container)}>
        <div className={cs(style.artwork, styleSteps['artwork-link-cont'])}>
          <h5>Generative Artwork</h5>
          <Spacing size="regular"/>
          <div className={cs(style['preview-cont'])}>
            <div className={cs(style['preview-wrapper'])}>
              <ArtworkIframe
                url={getIpfsIoUrl(state.cidFixedHash!)}
                textWaiting="looking for content on IPFS"
              />
            </div>
          </div>
          <Spacing size="small"/>
          <Link href={getIpfsIoUrl(state.cidFixedHash!)} passHref>
            <Button
              isLink
              // @ts-ignore
              target="_blank"
              size="small"
              iconComp={<i aria-hidden className="fas fa-external-link-alt"/>}
              iconSide="right"
              className={cs(styleSteps.center)}
            >
              open in new tab
            </Button>
          </Link>
        </div>

        <div className={cs(style.artwork, styleSteps['artwork-link-cont'])}>
          <h5>Preview image</h5>
          <Spacing size="regular"/>
          <div className={cs(style['preview-cont'])}>
            <div className={cs(style['preview-wrapper'])}>
              <ArtworkPreview
                url={getIpfsIoUrl(state.cidPreview!)}
              />
            </div>
          </div>
          <Spacing size="small"/>
          <Link href={getIpfsIoUrl(state.cidPreview!)} passHref>
            <Button
              isLink
              // @ts-ignore
              target="_blank"
              size="small"
              iconComp={<i aria-hidden className="fas fa-external-link-alt"/>}
              iconSide="right"
              className={cs(styleSteps.center)}
            >
              open in new tab
            </Button>
          </Link>
        </div>
      </div>

      <Spacing size="6x-large"/>

      <section className={cs(styleSteps.bottom)}>
        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
          iconSide="right"
          size="large"
          onClick={() => onNext({})}
        >
          Next step
        </Button>
      </section>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
    </>
  )
}