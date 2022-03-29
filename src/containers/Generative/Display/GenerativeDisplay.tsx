import style from "./GenerativeDisplay.module.scss"
import layout from "../../../styles/Layout.module.scss"
import text from "../../../styles/Text.module.css"
import cs from "classnames"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { UserBadge } from "../../../components/User/UserBadge"
import { Spacing } from "../../../components/Layout/Spacing"
import ClientOnly from "../../../components/Utils/ClientOnly"
import { UserGuard } from "../../../components/Guards/UserGuard"
import { EditTokenSnippet } from "../../Token/EditTokenSnippet"
import { MintProgress } from "../../../components/Artwork/MintProgress"
import { MintController } from "../../../components/GenerativeToken/MintController"
import Link from "next/link"
import { getGenerativeTokenMarketplaceUrl } from "../../../utils/generative-token"
import { Button } from "../../../components/Button"
import { GenerativeExtraActions } from "../ExtraActions"
import { format } from "date-fns"
import nl2br from "react-nl2br"
import { displayMutez, displayRoyalties } from "../../../utils/units"
import { ipfsGatewayUrl } from "../../../services/Ipfs"
import { GenerativeArtwork } from "../../../components/GenerativeToken/GenerativeArtwork"
import { ListSplits } from "../../../components/List/ListSplits"
import { EntityBadge } from "../../../components/User/EntityBadge"
import { GenerativePricing } from "../../../components/GenerativeToken/GenerativePricing"

/**
 * This is the Core component resposible for the display logic of a Generative
 * Token. It can be tweakde so that certain sections are not displayed in case
 * this module is used in specific parts of the application (such as within a
 * collaboration proposal viewer)
 */

interface Props {
  token: GenerativeToken
  offlineMode?: boolean
}
export function GenerativeDisplay({
  token,
  offlineMode = false,
}: Props) {
  return (
    <>
      <div className={cs(style.artwork_header_mobile, layout.break_words)}>
        <EntityBadge
          user={token.author}
          size="regular"
        />
        <Spacing size="2x-small"/>
        <h3>{ token.name }</h3>
        <Spacing size="x-large"/>
      </div>

      <div 
        className={cs(
          style.presentation, layout.cols2, layout['responsive-reverse']
        )
      }>
        <div className={cs(style.presentation_details)}>
          <div className={cs(style.artwork_header)}>
            <EntityBadge 
              user={token.author}
              size="big"
              toggeable
            />
            <Spacing size="x-large"/>
            <h3>{ token.name }</h3>
          </div>

          <Spacing size="x-large"/>

          {!offlineMode && (
            <ClientOnly>
              <UserGuard forceRedirect={false}>
                <EditTokenSnippet token={token} />
              </UserGuard>
            </ClientOnly>
          )}

          <div className={cs(style.artwork_details)}>
            <MintProgress
              balance={token.balance}
              supply={token.supply}
              originalSupply={token.originalSupply}
            />
          </div>

          <Spacing size="x-large"/>
          
          <MintController
            token={token}
          >
            <Link href={getGenerativeTokenMarketplaceUrl(token)} passHref>
              <Button
                isLink={true}
                size="regular"
                disabled={offlineMode}
              >
                open marketplace 
              </Button>
            </Link>
          </MintController>

          <Spacing size="4x-large"/>

          <div className={cs(style.multilines)}>
            <div className={cs(layout.buttons_inline)}>
              <strong>Project #{token.id}</strong>
              {!offlineMode && (
                <ClientOnly>
                  <UserGuard forceRedirect={false}>
                    <GenerativeExtraActions token={token} />
                  </UserGuard>
                </ClientOnly>
              )}
            </div>
            <span className={cs(text.info)}>
              Published on { format(new Date(token.createdAt), "MMMM d, yyyy' at 'HH:mm") }
            </span>
          </div>

          <Spacing size="large"/>

          <p>{ nl2br(token.metadata?.description) }</p>

          <Spacing size="2x-large"/>

          <div className={cs(
            style.multilines,
            layout.break_words,
            style.extra_details,
          )}>
            <GenerativePricing
              token={token}
            />
            <ListSplits
              name="Primary split"
              splits={token.splitsPrimary}
            />
            <span>
              <strong>Royalties: </strong>
              {displayRoyalties(token.royalties)}
            </span>
            <ListSplits
              name="Royalties split"
              splits={token.splitsSecondary}
            />
            <span>
              <strong>Tags: </strong>
              {token.tags?.join(", ") || "/"}
            </span>
            <span>
              <strong>Metadata: </strong>
              <a 
                target="_blank"
                referrerPolicy="no-referrer"
                href={ipfsGatewayUrl(token.metadataUri)}
              >
                view on IPFS <i className="fas fa-external-link-square" aria-hidden/>
              </a>
            </span>
          </div>
        </div>

        <div className={cs(style.presentation_artwork)}>
          <GenerativeArtwork
            token={token}
          />
        </div>
      </div>
    </>
  )
}