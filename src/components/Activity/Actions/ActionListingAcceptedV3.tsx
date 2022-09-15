import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { DisplayTezos } from "../../Display/DisplayTezos"

const ActionListingArticleAccepted: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      bought <strong>{action.metadata.amountCollected}</strong> editions{" "}
      {verbose && (
        <>
          of <strong>{action.article!.title}</strong>
        </>
      )}{" "}
      from
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
          mutez={action.metadata.pricePerItem}
          tezosSize="regular"
        />
      </span>
      <span> each</span>
    </span>
  </>
)

const ActionListingObjktAccepted: TActionComp = ({ action, verbose }) => (
  <>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.issuer!}
      size="small"
    />
    <span>
      bought{" "}
      <strong>
        {verbose ? action.objkt!.name : `#${action.objkt!.iteration}`}
      </strong>{" "}
      from
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
          mutez={action.metadata.pricePerItem}
          tezosSize="regular"
        />
      </span>
    </span>
  </>
)

export const ActionListingAcceptedV3: TActionComp = (props) => {
  // todo: when add support for gentks, add a filter upfront to pick right comp.
  return ActionListingArticleAccepted(props)
}
