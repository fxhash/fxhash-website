import style from "./Action.module.scss"
import effects from "../../styles/Effects.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { Action as ActionType, TokenActionType } from "../../types/entities/Action"
import { UserBadge } from "../User/UserBadge"
import { FunctionComponent, useMemo } from "react"
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { displayMutez, displayRoyalties } from "../../utils/units"
import Link from "next/link"
import { PropsWithChildren } from "react-router/node_modules/@types/react"
import { DisplayTezos } from "../Display/DisplayTezos"


interface Props {
  action: ActionType
  verbose: boolean
}

type TActionComp = FunctionComponent<Props>

const getTokenIdx = (name: string) => '#' + name.split("#").pop()

export const DateDistance = ({ timestamptz, append = false }: { timestamptz: string, append?: boolean }) => {
  const dist = useMemo(() => formatDistance(new Date(timestamptz), new Date(), { addSuffix: true,  }), [])
  return <span>{ dist }</span>
}

export const ActionReference = ({ action }: { action: ActionType }) => {
  return (
    <a
      className={cs(style.date)}
      href={`https://tzkt.io/${action.opHash}`}
      target="_blank"
    >
      <DateDistance timestamptz={action.createdAt}/>
      <i aria-hidden className="fas fa-external-link-square"/>
    </a>
  )
}

const IconTransfer = () => (
  <i
    aria-hidden
    className={cs(
      "fa-regular fa-arrow-right-arrow-left",
      colors.success,
      style.icon,
    )}
  />
)

const IconSend = () => (
  <i
    aria-hidden
    className={cs(
      "fa-regular fa-arrow-turn-up",
      colors.success,
      style.icon,
    )}
  />
)

const IconRefresh = () => (
  <i
    aria-hidden
    className={cs(
      "fa-solid fa-arrow-rotate-right",
      colors.warning,
      style.icon,
    )}
  />
)

const IconBurn = () => (
  <i
    aria-hidden
    className={cs(
      "fa-solid fa-fire",
      colors.warning,
      style.icon,
    )}
  />
)

const IconCreate = () => (
  <i
    aria-hidden
    className={cs(
      "fa-solid fa-sparkles",
      colors.success,
      style.icon,
    )}
  />
)

const IconCreateGentok = () => (
  <i
    aria-hidden
    className={cs(
      "fa-solid fa-user-robot",
      colors.success,
      style.icon,
    )}
  />
)

const IconSignGentok = () => (
  <i
    aria-hidden
    className={cs(
      "fa-solid fa-signature",
      colors.success,
      style.icon,
    )}
  />
)

const IconCheck = () => (
  <i
    aria-hidden
    className={cs(
      "fas fa-check-circle",
      colors.success,
      style.icon,
    )}
  />
)

const IconCancel = () => (
  <i
    aria-hidden
    className={cs(
      "fa-solid fa-xmark",
      colors.error,
      style.icon,
    )}
  />
)

/**
 * MINT OPERATIONS
 */

const ActionMinted: FunctionComponent<Props> = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      published <strong>{ action.token!.name }</strong>
    </span>
  </>
)

const ActionMintedFrom: FunctionComponent<Props> = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      <span>minted </span>
      {verbose ? (
        <strong>{action.objkt!.name}</strong>
      ):(
        <strong>#{action.objkt!.iteration}</strong>
      )}
    </span>
  </>
)

const ActionSigned: FunctionComponent<Props> = ({ action, verbose }) => (
  <>
    <span>
      metadata was signed by fxhash
    </span>
  </>
)

const ActionTransfered: FunctionComponent<Props> = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      transfered <strong>#{verbose ? action.objkt!.name : action.objkt!.iteration}</strong> to
    </span>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.target!}
      size="small"
    />
  </>
)

/**
 * TOKEN UPDATES
 */

 const ActionUpdatePrice: TActionComp = ({ action }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      updated price:
    </span>
    <span>
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.metadata.from.price}
          tezosSize="regular"
        />
      </span>
      <span>{" -> "}</span>
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.metadata.to.price}
          tezosSize="regular"
        />
      </span>
    </span>
  </>
)

const ActionUpdateState: FunctionComponent<Props> = ({ action }) => {
  const changes = action.metadata.changes
  return (
    <>
      <UserBadge
        className={cs(style.user)}
        hasLink={true}
        user={action.issuer!}
        size="small"
      />
      <span>
        updated state:
      </span>
      <span>
        {changes.enabled !== undefined && (
          <span>
            <strong className={cs(changes.enabled ? colors.success : colors.error)}>
              {changes.enabled ? "enabled" : "disabled"}
            </strong>
            {changes.royalties !== undefined ? ", " : ""}
          </span>
        )}
        {changes.royalties !== undefined && (
          <span>
            <strong className={cs(style.price)}>
              {displayRoyalties(changes.royalties)}
            </strong> royalties
          </span>
        )}
      </span>
    </>
  )
}

const ActionBurnSupply: FunctionComponent<Props> = ({ action }) => {
  const metadata = action.metadata
  return (
    <>
      <UserBadge
        className={cs(style.user)}
        hasLink={true}
        user={action.issuer!}
        size="small"
      />
      <span>
        burnt some supply:
      </span>
      <span>
        <strong className={cs(colors.secondary)}>{metadata.from}</strong>{" -> "}<strong className={cs(colors.secondary)}>{metadata.to}</strong>
      </span>
    </>
  )
}

/**
 * LISTINGS
 */

const ActionListing: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      listed <strong>{verbose ? action.objkt!.name : `#${action.objkt!.iteration}`}</strong> for
    </span>
    <span className={cs(style.price)}>
      <DisplayTezos
        formatBig={false}
        mutez={action.numericValue}
        tezosSize="regular"
      />
    </span>
  </>
)

const ActionListingAccepted: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      bought <strong>{verbose ? action.objkt!.name : `#${action.objkt!.iteration}`}</strong> from
    </span>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.target!}
      size="small"
    />
    <span>
      <span>for </span>
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.numericValue}
          tezosSize="regular"
        />
      </span>
    </span>
  </>
)

const ActionListingCancelled: TActionComp = ({ action }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      cancelled their listing on <strong>#{action.objkt!.iteration}</strong>
    </span>
  </>
)

/**
 * OFFERS (on single gentks)
 */

const ActionOffer: FunctionComponent<Props> = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>offered</span>
    <span className={cs(style.price)}>
      <DisplayTezos
        formatBig={false}
        mutez={action.numericValue}
        tezosSize="regular"
      />
    </span>
    <span>for {verbose ? action.objkt!.name : `#${action.objkt!.iteration}`}</span>
  </>
)


const ActionCompleted: FunctionComponent<Props> = ({ action }) => (
  <>
    <strong className={cs(colors.success)}>completed</strong>
    <span>—</span>
    <span>Generative Token fully minted</span>
  </>
)

const ActionTODO: TActionComp = ({ action }) => null

const ActionMapComponent: Record<TokenActionType, FunctionComponent<Props>> = {
  MINTED:                         ActionMinted,
  MINTED_FROM:                    ActionMintedFrom,
  TRANSFERED:                     ActionTransfered,
  GENTK_SIGNED:                   ActionSigned,

  LISTING_V1:                     ActionListing,
  LISTING_V1_ACCEPTED:            ActionListingAccepted,
  LISTING_V1_CANCELLED:           ActionListingCancelled,
  LISTING_V2:                     ActionListing,
  LISTING_V2_ACCEPTED:            ActionListingAccepted,
  LISTING_V2_CANCELLED:           ActionListingCancelled,

  OFFER:                          ActionOffer,

  UPDATE_PRICING:                 ActionUpdatePrice,
  UPDATE_STATE:                   ActionUpdateState,

  BURN_SUPPLY:                    ActionBurnSupply,
  COMPLETED:                      ActionCompleted,

  // TODO
  NONE:                           ActionTODO,
  OFFER_CANCELLED:                ActionTODO,
  OFFER_ACCEPTED:                 ActionTODO,
  COLLECTION_OFFER:               ActionTODO,
  COLLECTION_OFFER_CANCELLED:     ActionTODO,
  COLLECTION_OFFER_ACCEPTED:      ActionTODO,
  AUCTION:                        ActionTODO,
  AUCTION_BID:                    ActionTODO,
  AUCTION_CANCELLED:              ActionTODO,
  AUCTION_FULFILLED:              ActionTODO,
}

const actionMapLink: Record<TokenActionType, (action: ActionType) => string|null> = {
  MINTED: (action: ActionType) => `/generative/${action.token?.id}`,
  MINTED_FROM: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  GENTK_SIGNED: (action: ActionType) => null,
  TRANSFERED: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  LISTING_V1: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  LISTING_V1_ACCEPTED: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  LISTING_V1_CANCELLED: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  LISTING_V2: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  LISTING_V2_ACCEPTED: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  LISTING_V2_CANCELLED: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  OFFER: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  OFFER_ACCEPTED: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  OFFER_CANCELLED: (action: ActionType) => `/gentk/${action.objkt?.id}`,
  UPDATE_STATE: (action: ActionType) => `/generative/${action.token?.id}`,
  UPDATE_PRICING: (action: ActionType) => `/generative/${action.token?.id}`,
  BURN_SUPPLY: (action: ActionType) => `/gentk/${action.token?.id}`,
  COMPLETED: (action: ActionType) => `/generative/${action.token?.id}`,
  // TODO
  NONE: (action: ActionType) => null,
  COLLECTION_OFFER: (action: ActionType) => null,
  COLLECTION_OFFER_CANCELLED: (action: ActionType) => null,
  COLLECTION_OFFER_ACCEPTED: (action: ActionType) => null,
  AUCTION: (action: ActionType) => null,
  AUCTION_BID: (action: ActionType) => null,
  AUCTION_CANCELLED: (action: ActionType) => null,
  AUCTION_FULFILLED: (action: ActionType) => null,
}

const ActionMapIcon: Record<TokenActionType, FunctionComponent> = {
  MINTED:                         IconCreateGentok,
  MINTED_FROM:                    IconCreate,
  GENTK_SIGNED:                   IconSignGentok,
  COMPLETED:                      IconCheck,
  TRANSFERED:                     IconTransfer,
  LISTING_V1:                     IconSend,
  LISTING_V1_ACCEPTED:            IconTransfer,
  LISTING_V1_CANCELLED:           IconCancel,
  LISTING_V2:                     IconSend,
  LISTING_V2_ACCEPTED:            IconTransfer,
  LISTING_V2_CANCELLED:           IconCancel,
  UPDATE_PRICING:                 IconRefresh,
  UPDATE_STATE:                   IconRefresh,
  BURN_SUPPLY:                    IconBurn,
  OFFER:                          IconSend,
  OFFER_ACCEPTED:                 IconTransfer,
  OFFER_CANCELLED:                IconCancel,
  // TODO
  NONE:                           IconCancel,
  COLLECTION_OFFER:               IconCancel,
  COLLECTION_OFFER_CANCELLED:     IconCancel,
  COLLECTION_OFFER_ACCEPTED:      IconCancel,
  AUCTION:                        IconCancel,
  AUCTION_BID:                    IconCancel,
  AUCTION_CANCELLED:              IconCancel,
  AUCTION_FULFILLED:              IconCancel,
}

// some actions may have a link to a page - which requires some tricky logic

function LinkWrapper({ action, children }: PropsWithChildren<{ action: ActionType }>) {
  const link = actionMapLink[action.type] && actionMapLink[action.type](action)
  return link
    ? (
      <article className={cs(style.container, style.is_link)}>
        <Link href={link}>
          <a className={cs(style.link_wrapper)}/>
        </Link>
        { children }
      </article>
    ):(
      <article className={cs(style.container)}>{ children }</article>
    )
}

export function Action({ action, verbose }: Props) {
  const ActionComponent = ActionMapComponent[action.type]
  const ActionIcon = ActionMapIcon[action.type]

  if (!ActionComponent) {
    return <div>todo {action.type}</div>
  }

  return (
    <LinkWrapper action={action}>
      <div className={cs(style.content)}>
        <div className={cs(style.details)}>
          <ActionIcon />
          <div className={cs(style.details_content)}>
            <ActionComponent action={action} verbose={verbose} />
          </div>
        </div>
        <ActionReference action={action}/>
      </div>
    </LinkWrapper>
  )
}
