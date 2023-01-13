import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "../../Display/DisplayTezos"

const ActionListingArticle: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <>
      listed <strong>{action.metadata.amount}</strong> editions{" "}
      {verbose && (
        <>
          of <strong>{action.article!.title}</strong>
        </>
      )}{" "}
      for
    </>
    <span className={cs(style.price)}>
      <DisplayTezos
        formatBig={false}
        mutez={action.numericValue}
        tezosSize="regular"
      />
    </span>
    <span> each</span>
  </>
)

export const ActionListingV3: TActionComp = (props) => {
  // todo: when add support for gentks, add a filter upfront to pick right comp.
  return ActionListingArticle(props)
}
