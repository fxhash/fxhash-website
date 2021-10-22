import style from "./Action.module.scss"
import effects from "../../styles/Effects.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { Action as ActionType } from "../../types/entities/Action"
import { UserBadge } from "../User/UserBadge"
import { FunctionComponent, useMemo } from "react"
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { displayMutez, displayRoyalties } from "../../utils/units"
import Link from "next/link"
import { PropsWithChildren } from "react-router/node_modules/@types/react"


interface Props {
  action: ActionType
  verbose: boolean
}

const getTokenIdx = (name: string) => '#' + name.split("#").pop()

const DateDistance = ({ timestamptz, append = false }: { timestamptz: string, append?: boolean }) => {
  const dist = useMemo(() => formatDistance(new Date(timestamptz), new Date(), { addSuffix: true }), [])
  return <span className={cs(style.date)}> — { dist }{ append && ' —'}</span>
}

const ActionMinted: FunctionComponent<Props> = ({ action, verbose }) => (
  <>
    <UserBadge className={cs(style.user)} hasLink={false} user={(action.issuer||action.target)!} size="regular" />
    <span>
     🤖 created
      {verbose ? (
        <> generative <strong>{action.token?.name}</strong></>
      ):(
        <strong> generative token 🤖</strong>
      )}
    </span>
    <DateDistance timestamptz={action.createdAt}/>
  </>
)

const ActionMintedFrom: FunctionComponent<Props> = ({ action, verbose }) => (
  <>
    <UserBadge className={cs(style.user)} hasLink={false} user={(action.issuer||action.target)!} size="regular" />
    <span>
     ✨ minted 
      {verbose ? (
        <> token <strong>{action.objkt?.name}</strong></>
      ):(
        <strong> token {getTokenIdx(action.objkt?.name!)}</strong> 
      )}
    </span>
    <DateDistance timestamptz={action.createdAt}/>
  </>
)

const ActionTransfered: FunctionComponent<Props> = ({ action, verbose }) => (
  <>
    <UserBadge className={cs(style.user)} hasLink={false} user={(action.issuer||action.target)!} size="regular" />
    <span>
      ⬅️ received 
      {verbose ? (
        <> token <strong>{action.objkt?.name}</strong></>
      ):(
        <strong> token {getTokenIdx(action.objkt?.name!)}</strong> 
      )}
    </span>
    <DateDistance timestamptz={action.createdAt}/>
  </>
)

const ActionOffer: FunctionComponent<Props> = ({ action, verbose }) => (
  <>
    <UserBadge className={cs(style.user)} hasLink={false} user={(action.issuer||action.target)!} size="regular" />
    <span>
      🟢 placed an offer for 
      {verbose ? (
        <> <strong>{action.objkt?.name}</strong></>
      ):(
        <strong> {getTokenIdx(action.objkt?.name!)}</strong> 
      )}
    </span>
    <DateDistance timestamptz={action.createdAt} append/>
    <span className={cs(style.price)}>{displayMutez(action.metadata.price)} tez</span>
  </>
)

const ActionOfferAccepted: FunctionComponent<Props> = ({ action }) => (
  <>
    <UserBadge className={cs(style.user)} hasLink={false} user={(action.issuer||action.target)!} size="regular" />
    <span>🔄 traded its <strong>token {getTokenIdx(action.objkt?.name!)}</strong></span>
    <DateDistance timestamptz={action.createdAt} append/>
    <span className={cs(style.price)}>{displayMutez(action.metadata.price)} tez</span>
  </>
)

const ActionOfferCancelled: FunctionComponent<Props> = ({ action }) => (
  <>
    <UserBadge className={cs(style.user)} hasLink={false} user={(action.issuer||action.target)!} size="regular" />
    <span>⛔ <strong className={cs(colors.error)}>cancelled</strong> its offer on <strong>token {getTokenIdx(action.objkt?.name!)}</strong></span>
    <DateDistance timestamptz={action.createdAt} append/>
  </>
)

const ActionUpdateState: FunctionComponent<Props> = ({ action }) => {
  const changes = action.metadata.changes
  return (
    <>
      <UserBadge className={cs(style.user)} hasLink={false} user={(action.issuer||action.target)!} size="regular" />
      <span>
        updated generative:
        {changes.enabled !== undefined && (
          <><strong className={cs(changes.enabled ? colors.success : colors.error)}> { changes.enabled ? "enabled" : "disabled" }</strong>, </>
        )}
        {changes.price !== undefined && (
          <><strong className={cs(style.price)}>{displayMutez(changes.price)} tez</strong>, </>
        )}
        {changes.royalties !== undefined && (
          <><strong className={cs(style.price)}>{displayRoyalties(changes.royalties)}</strong> royalties</>
        )}
      </span>
      <DateDistance timestamptz={action.createdAt} append/>
    </>
  )
}

const ActionCompleted: FunctionComponent<Props> = ({ action }) => (
  <>
    <span className={cs(style.align)}>
      <strong className={cs(colors.success, style.align)}>
        <i aria-hidden className={cs(style.icon, "fas", "fa-check-circle")}/> completed
      </strong> 
      — Generative Token fully minted
    </span>
    <DateDistance timestamptz={action.createdAt} append/>
  </>
)

const ActionMapComponent: Record<string, FunctionComponent<Props>> = {
  MINTED:           ActionMinted,
  MINTED_FROM:      ActionMintedFrom,
  TRANSFERED:       ActionTransfered,
  OFFER:            ActionOffer,
  OFFER_ACCEPTED:   ActionOfferAccepted,
  OFFER_CANCELLED:  ActionOfferCancelled,
  UPDATE_STATE:     ActionUpdateState,
  COMPLETED:        ActionCompleted
}

const actionMapLink: Record<string, (action: ActionType) => string|null> = {
  MINTED: (action: ActionType) => `/generative/${action.token?.id}`,
  MINTED_FROM: (action: ActionType) => `/objkt/${action.objkt?.id}`,
  TRANSFERED: (action: ActionType) => `/objkt/${action.objkt?.id}`,
  OFFER: (action: ActionType) => `/objkt/${action.objkt?.id}`,
  OFFER_ACCEPTED: (action: ActionType) => `/objkt/${action.objkt?.id}`,
  OFFER_CANCELLED: (action: ActionType) => `/objkt/${action.objkt?.id}`,
  UPDATE_STATE: (action: ActionType) => `/objkt/${action.objkt?.id}`,
  COMPLETED: (action: ActionType) => `/generative/${action.token?.id}`,
}

// some actions may have a link to a page - which requires some tricky logic
function LinkWrapper({ action, children }: PropsWithChildren<{ action: ActionType }>) {
  const link = actionMapLink[action.type] && actionMapLink[action.type](action)
  return link 
    ? (<Link href={link}><a className={cs(style.container, effects['drop-shadow-big'], style.link)}>{ children }</a></Link>)
    : (<article className={cs(style.container, effects['drop-shadow-big'])}>{ children }</article>)
}

export function Action({ action, verbose }: Props) {
  const ActionComponent = ActionMapComponent[action.type]

  return (
    <LinkWrapper action={action}>
      <ActionComponent action={action} verbose={verbose} />
    </LinkWrapper>
  )
}