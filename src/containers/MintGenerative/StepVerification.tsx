import style from "./StepCheckFiles.module.scss"
import styleSteps from "./Steps.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { ArtworkIframe } from "../../components/Artwork/PreviewIframe"
import { getIpfsIoUrl, ipfsUrlWithHash } from "../../utils/ipfs"
import { ArtworkPreview } from "../../components/Artwork/Preview"
import { Spacing } from "../../components/Layout/Spacing"
import Link from "next/link"
import { Button } from "../../components/Button"
import { ArtworkFrame } from "../../components/Artwork/ArtworkFrame"


export const StepVerification: StepComponent = ({
  onNext,
  state
}) => {
  return (
    <>
      <p>The preview image should match the Generative Artwork</p>

      <Spacing size="3x-large"/>

      <div className={cs(style.container)}>
        <div className={cs(style.artwork, styleSteps['artwork-link-cont'])}>
          <h5>Generative Artwork</h5>
          <Spacing size="regular"/>
          <div className={cs(style['preview-cont'])}>
            <div className={cs(style['preview-wrapper'])}>
              <ArtworkFrame>
                <ArtworkIframe
                  url={ipfsUrlWithHash(state.cidUrlParams!, state.previewHash!)}
                  textWaiting="looking for content on IPFS"
                />
              </ArtworkFrame>
            </div>
          </div>
          <Spacing size="small"/>
          <Link href={ipfsUrlWithHash(state.cidUrlParams!, state.previewHash!)} passHref>
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
                loading={true}
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
          next step
        </Button>
      </section>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
    </>
  )
}