import style from "./StepCheckFiles.module.scss"
import styleSteps from "./Steps.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { ArtworkIframe } from "../../components/Artwork/PreviewIframe"
import { ipfsUrlWithHash, ipfsUrlWithHashAndParams } from "../../utils/ipfs"
import { ArtworkPreview } from "../../components/Artwork/Preview"
import { Spacing } from "../../components/Layout/Spacing"
import Link from "next/link"
import { Button } from "../../components/Button"
import { ArtworkFrame } from "../../components/Artwork/ArtworkFrame"
import { ipfsGatewayUrl } from "../../services/Ipfs"

export const StepVerification: StepComponent = ({ onNext, state }) => {
  return (
    <>
      <p>The preview image should match the Generative Artwork</p>

      <Spacing size="3x-large" sm="regular" />

      <div className={cs(style.container)}>
        <div className={cs(style.artwork, styleSteps["artwork-link-cont"])}>
          <h5>Generative Artwork</h5>
          <Spacing size="regular" />
          <div className={cs(style["preview-cont"])}>
            <div className={cs(style["preview-wrapper"])}>
              <ArtworkFrame>
                <ArtworkIframe
                  url={ipfsUrlWithHashAndParams(state.cidUrlParams!, {
                    fxhash: state.previewHash!,
                    fxiteration: state.previewIteration!,
                    fxminter: state.previewMinter!,
                    fxparams: state.previewInputBytes!,
                  })}
                  textWaiting="looking for content on IPFS"
                />
              </ArtworkFrame>
            </div>
          </div>
          <Spacing size="small" />
          <Link
            href={ipfsUrlWithHashAndParams(state.cidUrlParams!, {
              fxhash: state.previewHash!,
              fxiteration: state.previewIteration!,
              fxminter: state.previewMinter!,
              fxparams: state.previewInputBytes!,
            })}
            passHref
          >
            <Button
              isLink
              // @ts-ignore
              target="_blank"
              size="small"
              iconComp={<i aria-hidden className="fas fa-external-link-alt" />}
              iconSide="right"
              className={cs(styleSteps.center, style.button)}
            >
              open in new tab
            </Button>
          </Link>
        </div>

        <div className={cs(style.artwork, styleSteps["artwork-link-cont"])}>
          <h5>Preview image</h5>
          <Spacing size="regular" />
          <div className={cs(style["preview-cont"])}>
            <div className={cs(style["preview-wrapper"])}>
              <ArtworkPreview
                url={ipfsGatewayUrl(state.cidPreview!)}
                loading={true}
              />
            </div>
          </div>
          <Spacing size="small" />
          <Link href={ipfsGatewayUrl(state.cidPreview!)} passHref>
            <Button
              isLink
              // @ts-ignore
              target="_blank"
              size="small"
              iconComp={<i aria-hidden className="fas fa-external-link-alt" />}
              iconSide="right"
              className={cs(styleSteps.center, style.button)}
            >
              open in new tab
            </Button>
          </Link>
        </div>
      </div>

      <Spacing size="6x-large" sm="x-large" />

      <section className={cs(styleSteps.bottom)}>
        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right" />}
          iconSide="right"
          size="large"
          onClick={() => onNext({})}
          className={style.button}
        >
          next step
        </Button>
      </section>

      <Spacing size="3x-large" />
      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />
    </>
  )
}
