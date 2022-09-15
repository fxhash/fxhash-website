import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "../../Display/DisplayTezos"


const ActionListingArticleCancelledV3: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      cancelled listing of <strong>{action.metadata.amount}</strong> editions {verbose && <>on <strong>{action.article!.title}</strong></>} of{' '}
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.metadata.price}
          tezosSize="regular"
        />
      </span>
      <span> each</span>
    </span>
  </>
)

export const ActionListingCancelledV3: TActionComp = (props) => {
  // todo: when add support for gentks, add a filter upfront to pick right comp.
  return ActionListingArticleCancelledV3(props)
}