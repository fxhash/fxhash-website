import { Button } from "components/Button"
import classes from "./Content.module.scss"
import cx from 'classnames';
import Image from "next/image"
import FxFullLogoBlackTransparentBg from "../../../public/fxhash-press-kit/png/Black full logo on transparent background.png"
import FxFullLogoWhiteTransparentBg from "../../../public/fxhash-press-kit/png/White full logo on transparent background.png"
import FxFullLogoBlackWhiteBg from "../../../public/fxhash-press-kit/png/Black full logo on white background.png"
import FxFullLogoWhiteBlackBg from "../../../public/fxhash-press-kit/png/White full logo on dark background.png"
import FxSquareLogoBlackTransparentBg from "../../../public/fxhash-press-kit/png/Black square logo on transparent background.png"
import FxSquareLogoWhiteTransparentBg from "../../../public/fxhash-press-kit/png/White square logo on transparent background.png"
import FxSquareLogoBlackWhiteBg from "../../../public/fxhash-press-kit/png/Black square logo on white background.png"
import FxSquareLogoWhiteBlackBg from "../../../public/fxhash-press-kit/png/White square logo on dark background.png"
import FxFullLogoClearSpace from "../../../public/fxhash-press-kit/fxhash_full_min-clear-spacing.png"
import FxSquareLogoClearSpace from "../../../public/fxhash-press-kit/fxhash_square_min-clear-spacing.png"

interface LogoBoxProps {
  caption?: string
  assetId?: string
  img: StaticImageData
}

function LogoBox(props: LogoBoxProps) {
  const { caption, assetId, img } = props
  return (
    <div className={cx(classes.logoBox, classes.root)}>
      <Image
        className={classes.img}
        src={img}
        placeholder="blur"
        objectFit="contain"
        height={260}
        title={caption}
        alt={caption}
      />
      {assetId && (
        <div className={classes.buttons}>
          <Button
            title={`Download ${caption} svg`}
            size="very-small"
            isLink
            // @ts-ignore
            href={`/fxhash-press-kit/svg/${assetId}.svg`}
            download
          >
            Download svg
          </Button>
          <Button
            title={`Download ${caption} png`}
            size="very-small"
            isLink
            // @ts-ignore
            href={`/fxhash-press-kit/png/${assetId}.png`}
            download
          >
            Download png
          </Button>
        </div>
      )}
      {caption && <p>{caption}</p>}
    </div>
  )
}

export function ContentLogo() {
  return (
    <div className={classes.rootLogo}>
      <h2>full logo</h2>
      <article>
        <section>
          <LogoBox
            img={FxFullLogoBlackTransparentBg}
            assetId="Black full logo on transparent background"
            caption="Black logo on transparent background"
          />
          <LogoBox
            img={FxFullLogoWhiteTransparentBg}
            assetId="White full logo on transparent background"
            caption="White logo on transparent background"
          />
        </section>
        <section>
          <LogoBox
            img={FxFullLogoBlackWhiteBg}
            assetId="Black full logo on white background"
            caption="Black logo on white background"
          />
          <LogoBox
            img={FxFullLogoWhiteBlackBg}
            assetId="White full logo on dark background"
            caption="White logo on dark background"
          />
        </section>
      </article>
      <h2>square logo</h2>
      <article>
        <section>
          <LogoBox
            img={FxSquareLogoBlackTransparentBg}
            assetId="Black square logo on transparent background"
            caption="Black logo on transparent background"
          />
          <LogoBox
            img={FxSquareLogoWhiteTransparentBg}
            assetId="White square logo on transparent background"
            caption="White logo on transparent background"
          />
        </section>
        <section>
          <LogoBox
            img={FxSquareLogoBlackWhiteBg}
            assetId="Black square logo on white background"
            caption="Black logo on white background"
          />
          <LogoBox
            img={FxSquareLogoWhiteBlackBg}
            assetId="White square logo on dark background"
            caption="White logo on dark background"
          />
        </section>
      </article>
      <h2>clearspace</h2>
      <article>
        <section className={classes.nobg}>
          <LogoBox img={FxFullLogoWhiteBlackBg} />
          <LogoBox img={FxSquareLogoWhiteBlackBg} />
        </section>
      </article>
    </div>
  )
}
