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
    <>
      bought <strong>{action.metadata.amountCollected}</strong> editions{" "}
      {verbose && (
        <>
          of <strong>{action.article!.title}</strong>
        </>
      )}{" "}
      from
    </>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.target!}
      size="small"
    />
    <>
      <>for </>
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.metadata.pricePerItem}
          tezosSize="regular"
        />
      </span>
      <> each</>
    </>
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
    <>
      bought{" "}
      <strong>
        {verbose ? action.objkt!.name : `#${action.objkt!.iteration}`}
      </strong>{" "}
      from
    </>
    <UserBadge
      className={cs(style.user)}
      hasLink={true}
      user={action.target!}
      size="small"
    />
    <>
      <span>for </span>
      <span className={cs(style.price)}>
        <DisplayTezos
          formatBig={false}
          mutez={action.metadata.pricePerItem}
          tezosSize="regular"
        />
      </span>
    </>
  </>
)

export const ActionListingAcceptedV3: TActionComp = (props) => {
  // todo: when add support for gentks, add a filter upfront to pick right comp.
  return ActionListingArticleAccepted(props)
}
