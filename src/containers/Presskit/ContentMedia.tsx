import React, { ReactNode, useState } from "react"
import classes from "./Content.module.scss"
import cx from "classnames"
import Image, { ImageProps } from "next/image"
import bm1 from "./images/Bright Moment01.png"
import bm2 from "./images/Bright Moment02.png"
import bm3 from "./images/Bright Moment03.png"
import bm4 from "./images/Bright Moment04.png"
import dk1 from "./images/Dekabinett01.png"
import dk2 from "./images/Dekabinett02.png"
import dk3 from "./images/Dekabinett03.png"
import abb1 from "./images/abb01.png"
import abb2 from "./images/abb02.png"
import abb3 from "./images/abb03.png"
import abb4 from "./images/abb04.png"
import abp1 from "./images/abp01.jpeg"
import abmb1 from "./images/abmb01.jpg"
import abmb2 from "./images/abmb02.jpg"
import abmb3 from "./images/abmb03.png"
import nftnyc1 from "./images/nftnyc01.jpg"
import nftnyc2 from "./images/nftnyc02.jpg"
import nftnyc3 from "./images/nftnyc03.jpeg"
import nfclsb1 from "./images/nfclsb01.png"
import abhk1 from "./images/abhk01.png"
import { Spacing } from "components/Layout/Spacing"

interface MediaGridProps {
  children: ReactNode
}

function MediaGrid(props: MediaGridProps) {
  return <div className={classes.mediaGrid}>{props.children}</div>
}

interface GridItemProps {
  full?: boolean
  src: string | StaticImageData
  className?: string
}

function GridItemImg(props: GridItemProps) {
  const { full = false, className, src, ...rest } = props
  return (
    <figure className={cx(className, { full })}>
      <Image placeholder="blur" objectFit="cover" src={src} alt="" {...rest} />
    </figure>
  )
}

function GridItemYoutube(props: GridItemProps) {
  const { full = false, src, className } = props
  return (
    <div className={cx(classes.embed, props.className, { full })}>
      <iframe
        src={props.src as string}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

interface NewsLinkProps {
  children: string
  href: string
  noListItem?: boolean
}

function NewsLink(props: NewsLinkProps) {
  const { href, noListItem = false, children } = props
  const Wrapper = noListItem ? React.Fragment : "li"
  return (
    <Wrapper>
      <a
        className={classes.link}
        target="_blank"
        rel="noopener nofollow noreferrer"
        href={href}
      >
        {children}
        <i className="fa-solid fa-arrow-up-right-from-square" />
      </a>
    </Wrapper>
  )
}

interface EventProps {
  title: string
  children: ReactNode
}

function Event(props: EventProps) {
  const { title, children } = props
  const [isOpen, setIsOpen] = useState<boolean>()
  const toggleIsOpen = () => {
    setIsOpen(!isOpen)
  }
  return (
    <section>
      <div className={classes.eventHeader}>
        <h4 onClick={toggleIsOpen}>{title}</h4>
        <i
          className={cx("fa-regular", {
            "fa-angle-down": !isOpen,
            "fa-angle-up": isOpen,
          })}
        />
      </div>
      <div className={classes.eventContent}>{isOpen && children}</div>
    </section>
  )
}

interface EventSectionProps {
  title: string
  children: ReactNode
}

function EventSection(props: EventSectionProps) {
  const { title, children } = props
  return (
    <section className={classes.eventSection}>
      <h3>{title}</h3>
      {children}
    </section>
  )
}

export function ContentMedia() {
  return (
    <div className={cx(classes.rootMedia, classes.root)}>
      <aside>
        <h2>fxhash in the news</h2>
        <ul>
          <NewsLink href="https://www.fxhash.xyz/article/what-is-generative-art">
            What is Generative Art
          </NewsLink>
          <NewsLink href="https://www.theartnewspaper.com/2022/06/24/art-basel-is-not-just-an-art-fair-it-is-a-technology-platform">
            fxhash at Art Basel
          </NewsLink>
          <NewsLink href="https://artouch.com/artouch-column/yszhang-column/content-88510.html ">
            fxhash (Chinese Article)
          </NewsLink>
        </ul>
      </aside>
      <section>
        <h2>past event showcase</h2>
        <EventSection title="Galleries/Museums">
          <Event title="Bright Moments - Venice, USA">
            <p>
              A Year of Rapid Innovation in Generative Art: a gallery show
              curated by Tender at Bright Moments Venice Beach, coinciding with
              the live minting of Piter Pasma’s new fx(hash) release Industrial
              Devolution. The exhibition text below sets the context for those
              just introduced to fxhash, and shares an evolutionary narrative
              about the leaps of innovation continuing to release on the
              platform.
            </p>
            <MediaGrid>
              <GridItemImg src={bm1} />
              <GridItemImg src={bm2} />
              <GridItemImg src={bm3} />
              <GridItemImg src={bm4} />
            </MediaGrid>
          </Event>
          <Event title="Dekabinett - Berlin, Germany">
            <p>
              fxhash is an open platform for generative art Tezos blockchain.
              Generative art bridges the gap between artists and collectors: the
              artist lays the foundation of future artwork by creating a
              generative token, and collectors create unique pieces from this
              token by minting NFTs. This exhibition celebrates generative art
              and the power of the connection that it embodies.{" "}
            </p>
            <ul>
              <li>bridging the gap between the artists and collector </li>
              <li>bridging the gap between the traditional and new</li>
              <li>bridging the gap between the enthusiasts and doubters</li>
              <li>bridging the gap between fxhash and the world</li>
            </ul>
            <MediaGrid>
              <GridItemImg src={dk1} />
              <GridItemImg src={dk2} />
              <GridItemImg src={dk3} />
            </MediaGrid>
          </Event>
        </EventSection>
        <EventSection title="Artist Interview Series">
          <Event title="Piter Pasma">
            <p>
              Get to know @piterpasma in the first of our artist interview
              series ✨ In this teaser, Pasma discusses 'Industrial Devolution'
              - his new generative art collection being Live Minted today at 6
              PM during the @brtmoments presents fx(hash) event!
            </p>
            <ul>
              <NewsLink href="https://twitter.com/fx_hash_/status/1578082605399883776?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed&ref_url=https%3A%2F%2Fwww.notion.so%2Ffxhash%2FPast-Event-Showcase-a23c42d2a25648f6b4a7b56609a52ecf">
                Watch on twitter
              </NewsLink>
            </ul>
          </Event>
        </EventSection>
        <EventSection title="Art Basel">
          <Event title="Art Basel Hongkong">
            <p>
              Pioneering Asian and global generative NFT artists are set to
              illuminate Art Basel Hong Kong 2022 at a 250m² Tezos NFT
              exhibition. With a dedicated 250m² exhibition space located at
              Hall 1A of Hong Kong’s Convention & Exhibition Centre, ‘NFTs + The
              Ever-Evolving World of Art’ will see numerous projected works by
              leading generative and NFT artists hailing from the region across
              Brunei, China, Malaysia, Philippines, Singapore, and South Korea.
              The exhibition will also see global representation, with artists
              from North America and Europe, specifically Bulgaria, Canada,
              France, Poland, Serbia, Switzerland, and the United States. Below,
              we profile each of the artists, their inspirations, and their
              work. TZ APAC hosted a first-of-its-kind interactive live minting
              showcase in collaboration with fx(hash), the leading generative
              art platform on Tezos, where visitors will be able to mint their
              own NFT artwork on-site.
            </p>
            <h5>Projects released at ABHK</h5>
            <ul>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/mythologic">
                Mythologic by Jinyao Lin
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/chaos-culture">
                Chaos Culture by ileivoivm
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/microgravity">
                Microgravity by iRyanBell
              </NewsLink>

              <NewsLink href="https://www.fxhash.xyz/generative/slug/herbarium">
                Herbarium by Aleksandra
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/gestalt">
                Gestalt by Yazid
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/el-inefable-momento">
                el inefable
              </NewsLink>
            </ul>
            <MediaGrid>
              <GridItemImg src={abhk1} full />
            </MediaGrid>
          </Event>
          <Event title="Art Basel Basel">
            <p>
              The Tezos art exhibition encourages visitors to immerse themselves
              in this environment and learn first-hand about the importance of
              NFTs in the arts and beyond. The generative art platform fx(hash)
              is at the heart of the show. It is a one-of-a-kind tool in the
              field of NFT art, allowing collectors to interact with generative
              art in a whole new way via the blockchain technology. The
              interactive aspect of the exhibit, powered by fx(hash), allows
              visitors to scan a QR code to start the process of producing a new
              artwork created autonomously by one of the artist's algorithms.
              Each contact with the exhibit is a chance encounter; an
              opportunity to initiate the development of a new generative
              artwork that is instantly minted as an NFT and given to visitors.
            </p>
            <h5>Projects released at Art Basel</h5>
            <ul>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/lucky-oracles">
                Lucky Oracles by Eko33
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/balancium">
                Balancium by Aleksandra
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/bored-computer-screen">
                Bored Computer Screen by Sam Tsao
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/dreamcatcher-forest">
                Dreamcatcher Forest by iRyanBell
              </NewsLink>
            </ul>
            <MediaGrid>
              <GridItemImg src={abb1} />
              <GridItemImg src={abb2} />
              <GridItemImg src={abb3} />
              <GridItemImg src={abb4} />
              <GridItemYoutube src="https://www.youtube.com/embed/Ea3hodV8iq4" />
              <GridItemYoutube src="https://www.youtube.com/embed/DWCLkwk-kkM" />
              <GridItemYoutube
                full
                src="https://www.youtube.com/embed/X9nQORXlmA4"
              />
            </MediaGrid>
          </Event>
          <Event title="Art Basel Paris">
            <p>
              The Tezos exhibition will bring together three components of the
              digital art world - curation, ownership and exhibition. It will
              feature four framed prints from renowned generative artists Zancan
              and William Mapan. Mapan's project, Dragons, was created by
              exploring unexpected outputs from an earlier piece of code, while
              the Garden, Monoliths iteration on display is a regenerated
              version of the original artwork crafted by Zancan specifically for
              this show. These pieces highlight the malleable nature of
              generative art with an element of surprise. At the core of the
              exhibition is fx(hash), a generative art platform built on the
              Tezos blockchain. fx(hash) is unique in the NFT art world because
              it empowers artists, collectors, and curators with open tools for
              creating, collecting, and sharing generative art alongside a
              bustling integrated marketplace. fx(hash) will power the
              interactive live minting experience of the installation, where
              visitors will scan a QR code to set in motion the process of
              creating an entirely new, unique artwork autonomously rendered by
              the artist's code. Once rendered, the unique artwork is minted as
              an NFT, displayed on-screen in the installation, and gifted to the
              visitor's corresponding wallet in real-time.
            </p>
            <h5>Projects Released at Paris+</h5>
            <ul>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/inlim:in">
                Eliza SJ - inlim:in
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/allegories-booleennes">
                Allégories booléennes - Julien Espagnon
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/klyft">
                Klyft - Ada Ada Ada
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/three-dead-trees-on-earth">
                Three dead trees on earth - Olivier Bodini
              </NewsLink>
            </ul>
            <MediaGrid>
              <GridItemImg className="full" src={abp1} />
              <GridItemYoutube
                className="full"
                src="https://www.youtube.com/embed/H9j61asNRiA"
              />
            </MediaGrid>
          </Event>
          <Event title="Art Basel Miami Beach">
            <p>
              In 2021, the Tezos exhibition made headlines as the first
              interactive NFT exhibition in the history of Art Basel Miami and
              introduced fairgoers to a powerful experience at the intersection
              of human behavior and generative algorithms. This year,
              the Performance in Code: Deciphering Value in Generative Art will
              invite attendees to scan a QR code to claim an NFT instantly and
              observe the live gallery space evolving in real-time as visitors
              mint more pieces. Performance in Code will pull back the curtain
              on how generative art is created and reveal the rarity value
              associated with each NFT, immersing visitors in a collaborative
              art experience. The interactive gallery will feature work by
              cutting-edge generative artists: Tyler Boswell, DistCollective,
              and Ivona Tau. In addition to the live gallery experience, the
              exhibit will feature 13 other artists: Lars Wander, Studio
              Yorktown, Yazid, Volatile Moods, jeres, ykxotkx, Jinyao Lin, Aluan
              Wang, Ella, Toxi, Amy Goodchild, IskraVelitchkova and Zach
              Lieberman.
            </p>
            <p>
              Central to the experience is a collaboration with fxhash, which
              will power the interactive live minting experience of the
              installation, where visitors scan a QR code to set in motion the
              process of creating an entirely new, unique artwork autonomously
              rendered by the artists’ code. Once rendered, the unique artwork
              is minted as an NFT, displayed on-screen in the installation, and
              gifted to the visitor's wallet in real-time. The NFT is then
              assigned a rarity value expressed as a percentage, and attendees
              will see this value change throughout the course of the
              exhibition.
            </p>
            <h5>Gallery showcased</h5>
            <NewsLink href="https://abmb-curated.vercel.app/" noListItem>
              https://abmb-curated.vercel.app/
            </NewsLink>
            <Spacing size="large" />
            <h5>Projects released at ABMB</h5>
            <ul>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/whispers-(in-code)">
                WHISPERS (in code) - Ivona Tau
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/stepping-stones">
                Stepping Stones - Tyler Boswell
              </NewsLink>
              <NewsLink href="https://www.fxhash.xyz/generative/slug/udne">
                Udnē - DistCollective
              </NewsLink>
            </ul>
            <MediaGrid>
              <GridItemYoutube
                src="https://www.youtube.com/embed/JErFZZ6fe1w"
                full
              />
              <GridItemYoutube
                src="https://www.youtube.com/embed/OyXFZDZ36Bc"
                full
              />
              <GridItemImg src={abmb1} />
              <GridItemImg src={abmb3} />
              <GridItemImg src={abmb2} full />
            </MediaGrid>
          </Event>
        </EventSection>
        <EventSection title="NFT Events">
          <Event title="NFT.NYC">
            <MediaGrid>
              <GridItemImg src={nftnyc1} full />
              <GridItemImg src={nftnyc2} full />
              <GridItemImg src={nftnyc3} full />
            </MediaGrid>
          </Event>
          <Event title="TezDev paris">
            <p>
              TezDev Paris is a hub where ideas flow freely, connecting a
              community of Tezos blockchain enthusiasts. Register today to join
              us for deep-dive workshops and conversations with leaders from
              across the ecosystem.
            </p>
            <MediaGrid>
              <GridItemYoutube
                src="https://www.youtube.com/embed/5U4sc8HLhgs"
                full
              />
            </MediaGrid>
          </Event>
          <Event title="NFC Lisbon">
            <p>
              NFC Lisbon was our first official conference we attended. We used
              our speaking slot to showcase what we build in our beta and gave
              an overview of our future plans.
            </p>
            <MediaGrid>
              <GridItemYoutube
                src="https://www.youtube.com/embed/X7BJ3iH20MM"
                full
              />
              <GridItemImg src={nfclsb1} full />
            </MediaGrid>
          </Event>
        </EventSection>
      </section>
    </div>
  )
}
