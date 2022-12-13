import style from "./RedeemTotalCost.module.scss"
import text from "styles/Text.module.css"
import cs from "classnames"
import { RedeemableDetails } from "types/entities/Redeemable"
import { DisplayTezos } from "components/Display/DisplayTezos"
import { Fragment } from "react"
import { redeemTotalCost } from "utils/entities/redeem"

interface Props {
  redeemable: RedeemableDetails
  selected: (number | null)[]
}
export function RedeemTotalCost({ redeemable, selected }: Props) {
  return (
    <div className={cs(style.root)}>
      <span className={cs(style.property)}>
        <span className={cs(style.name)}>Base cost</span>
      </span>
      <DisplayTezos mutez={redeemable.amount} className={cs(style.price)} />
      {redeemable.options.map((opt, idx) => {
        const sel =
          selected[idx] != null
            ? opt.values[selected[idx] as number]
            : undefined

        return (
          <Fragment key={idx}>
            <span className={cs(style.property)}>
              <span className={cs(style.name)}>
                {opt.label}:{" "}
                {sel ? (
                  sel.label
                ) : (
                  <span className={cs(text.info)}>Please select</span>
                )}
              </span>
            </span>
            <span className={cs(style.price)}>
              {sel ? <DisplayTezos mutez={sel.amount} /> : "/"}
            </span>
          </Fragment>
        )
      })}

      <strong className={cs(style.property, style.total)}>
        <span className={cs(style.name)}>Total</span>
      </strong>
      <DisplayTezos
        mutez={redeemTotalCost(redeemable, selected)}
        tezosSize="regular"
        className={cs(style.total, style.price)}
      />
    </div>
  )
}
