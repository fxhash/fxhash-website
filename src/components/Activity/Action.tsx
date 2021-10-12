import style from "./Action.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { Action as ActionType } from "../../types/entities/Action"
import { UserBadge } from "../User/UserBadge"
import { FunctionComponent, useMemo } from "react"
import { format, formatDistance, formatRelative, subDays } from 'date-fns'
import { displayMutez } from "../../utils/units"


interface Props {
  action: ActionType
}

const getTokenIdx = (name: string) => '#' + name.split("#").pop()

const DateDistance = ({ timestamptz, append = false }: { timestamptz: string, append?: boolean }) => {
  const dist = useMemo(() => formatDistance(new Date(timestamptz), new Date(), { addSuffix: true }), [])
  return <span className={cs(style.date)}> — { dist }{ append && ' —'}</span>
}

const ActionMinted: FunctionComponent<Props> = ({ action }) => (
  <>
    <UserBadge user={(action.issuer||action.target)!} size="regular" />
    <strong>minted the generative token 🤖</strong>
    <DateDistance timestamptz={action.createdAt}/>
  </>
)

const ActionMintedFrom: FunctionComponent<Props> = ({ action }) => (
  <>
    <UserBadge user={(action.issuer||action.target)!} size="regular" />
    <span>minted <strong>token {getTokenIdx(action.objkt?.name!)}</strong> </span>
    <DateDistance timestamptz={action.createdAt}/>
  </>
)

const ActionTransfered: FunctionComponent<Props> = ({ action }) => (
  <>
    <UserBadge user={(action.issuer||action.target)!} size="regular" />
    <span>received <strong>token {getTokenIdx(action.objkt?.name!)}</strong> </span>
    <DateDistance timestamptz={action.createdAt}/>
  </>
)

const ActionOffer: FunctionComponent<Props> = ({ action }) => (
  <>
    <UserBadge user={(action.issuer||action.target)!} size="regular" />
    <span>placed an offer for <strong>token {getTokenIdx(action.objkt?.name!)}</strong> </span>
    <DateDistance timestamptz={action.createdAt} append/>
    <span className={cs(style.price)}>{displayMutez(action.metadata.price)} tez</span>
  </>
)

const ActionOfferAccepted: FunctionComponent<Props> = ({ action }) => (
  <>
    <UserBadge user={(action.issuer||action.target)!} size="regular" />
    <span>traded its <strong>token {getTokenIdx(action.objkt?.name!)}</strong></span>
    <DateDistance timestamptz={action.createdAt} append/>
    <span className={cs(style.price)}>{displayMutez(action.metadata.price)} tez</span>
  </>
)

const ActionMapComponent: Record<string, FunctionComponent<Props>> = {
  MINTED:         ActionMinted,
  MINTED_FROM:    ActionMintedFrom,
  TRANSFERED:     ActionTransfered,
  OFFER:          ActionOffer,
  OFFER_ACCEPTED: ActionOfferAccepted,
}

export function Action({ action }: Props) {
  const ActionComponent = ActionMapComponent[action.type]

  return (
    <article className={cs(style.container, effects['drop-shadow-big'])}>
      {ActionComponent ? (
          <ActionComponent action={action}/>
      ):(
        <>
          <UserBadge user={(action.issuer||action.target)!} size="regular" />
          {action.type}
          {action.objkt?.name}
        </>
      )}
    </article>
  )
}