import style from "./InputSplits.module.scss"
import cs from "classnames"
import { ISplit } from "../../types/entities/Split"
import { InputSearchUser } from "./InputSearchUser"
import { useState } from "react"
import { isTezosAddress } from "../../utils/strings"
import { Button } from "../Button"
import { Spacing } from "../Layout/Spacing"
import { UserFromAddress } from "../User/UserFromAddress"
import { UserBadge } from "../User/UserBadge"
import { InputText } from "./InputText"
import { transformSplitsEqual, TSplitsTransformer } from "../../utils/transformers/splits"
import { ButtonDelete } from "../Button/ButtonDelete"


interface Props {
  value: ISplit[]
  onChange: (value: ISplit[]) => void
  unremoveableAddresses?: string[]
  sharesTransformer?: TSplitsTransformer
  textShares?: string
}

/**
 * A component to define a list of splits (basically a list of (address, nat))
 * They are mostly used to define the primary/secondary splits for Generative
 * Tokens but it can also be used to define the collaboration contract shares.
 */
export function InputSplits({
  value,
  onChange,
  unremoveableAddresses = [],
  sharesTransformer = transformSplitsEqual,
  textShares = "Shares"
}: Props) {
  // the pkh of the input
  const [pkh, setPkh] = useState<string>("")

  // updates the split and forces the shares to match, if defined
  const update = (splits: ISplit[]) => {
    onChange(splits.map((split, idx) => ({
      address: split.address,
      pct: sharesTransformer(splits.length, idx),
    })))
  }

  const add = () => {
    if (!value.find(split => split.address === pkh)) {
      update([
        ...value,
        {
          address: pkh,
          pct: 0,
        }
      ])
    }
    setPkh("")
  }

  const remove = (address: string) => {
    update(value.filter(split => split.address !== address))
  }

  const updateShare = (address: string, share: number) => {
    const nsplits = [...value]
    const target = nsplits.find(split => split.address === address)
    if (target) {
      target.pct = share
      onChange(nsplits)
    }
  }

  return (
    <>
      <table className={cs(style.splits)}>
        <thead>
          <tr>
            <td>User</td>
            <td className={cs(style.share_cell)}>{textShares}</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {value.map(split => (
            <tr key={split.address}>
              <td className={cs(style.user_cell)}>
                <UserFromAddress
                  address={split.address}
                >
                  {({ user }) => (
                    <UserBadge
                      size="small"
                      user={user}
                      hasLink={false}
                      displayAddress
                    />
                  )}
                </UserFromAddress>
              </td>
              <td className={cs(style.share_cell)}>
                <InputText
                  value={split.pct}
                  onChange={
                    evt => updateShare(split.address, evt.target.value as any)
                  }
                  type="number"
                  min={1}
                  max={1000}
                  step={1}
                />
              </td>
              <td width={107}>
                {!unremoveableAddresses.includes(split.address) && (
                  <ButtonDelete
                    onClick={() => remove(split.address)}
                  />
                )}
              </td>
            </tr>
          ))}

          <tr>
            <td className={cs(style.input_cell)} colSpan={3}>
              <div className={cs(style.add_container)}>
                <InputSearchUser
                  value={pkh}
                  onChange={setPkh}
                  className={style.address_input}
                  classNameResults={style.search_results}
                />
                <Button
                  size="regular"
                  type="button"
                  color="transparent"
                  iconComp={<i aria-hidden className="fa-solid fa-circle-plus"/>}
                  disabled={!isTezosAddress(pkh)}
                  onClick={add}
                >
                  add
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}