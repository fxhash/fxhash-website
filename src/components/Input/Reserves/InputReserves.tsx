import style from "./InputReserves.module.scss"
import cs from "classnames"
import { InputProps } from "../../../types/Inputs"
import { EReserveMethod, IReserve } from "../../../types/entities/Reserve"
import { Button } from "../../Button"
import { IOptions, Select } from "../Select"
import { useState } from "react"
import { InputReserve } from "./InputReserve"
import { FormikErrors } from "formik"


const MethodOptions: IOptions[] = [
  {
    label: "Access list",
    value: EReserveMethod.WHITELIST,
  }
]

interface Props extends InputProps<IReserve<string>[]> {
  maxSize: number
  errors: FormikErrors<IReserve[]>
}
export function InputReserves({
  maxSize,
  value,
  onChange,
  errors,
}: Props) {
  const [method, setMethod] = useState<EReserveMethod>()

  const addReserve = () => {
    if (method) {
      onChange([
        ...value,
        {
          method: method,
          data: [],
          amount: "0",
        }
      ])
      setMethod(undefined)
    }
  }

  const updateReserve = (reserve: IReserve<string>, index: number) => {
    const nval = [...value]
    nval[index] = reserve
    onChange(nval)
  }

  const removeReserve = (index: number) => {
    const nval = [...value]
    nval.splice(index, 1)
    onChange(nval)
  }

  // given the index of a reserve, outputs the error if any
  const getReserveError = (idx: number) => {
    if (!errors || typeof errors === "string") return undefined
    const err = errors[idx]
    return err || undefined 
  }

  return (
    <div className={cs(style.root)}>
      {value.map((reserve, idx) => (
        <InputReserve
          key={idx}
          maxSize={maxSize}
          value={reserve}
          onChange={value => updateReserve(value, idx)}
          onRemove={() => removeReserve(idx)}
          errors={getReserveError(idx)}
        />
      ))}
      <div className={cs(style.select_method_root)}>
        <Select
          placeholder="Select the type of reserve"
          options={MethodOptions}
          value={method || ""}
          onChange={setMethod}
          classNameRoot={cs(style.select)}
          className={cs(style.select_btn)}
        />
        <Button
          type="button"
          size="regular"
          iconComp={<i className="fa-solid fa-plus" aria-hidden/>}
          onClick={addReserve}
          disabled={!method}
        >
          add a new reserve
        </Button>
      </div>
    </div>
  )
}