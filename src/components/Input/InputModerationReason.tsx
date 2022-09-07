import style from "./InputModerationReason.module.scss"
import cs from "classnames"
import { InputProps } from "../../types/Inputs"
import { useQuery } from "@apollo/client"
import { Qu_moderationReasons } from "../../queries/moderation-reason"
import { ModerationReason } from "../../types/entities/ModerationReason"
import { useMemo } from "react"
import { IOptions, Select } from "./Select"

interface Props extends InputProps<number> {
  moderationContract: "token"|"user"|"article"
}
export function InputModerationReason({
  value,
  onChange,
  moderationContract,
}: Props) {
  // get reasons currently indexed
  const { data, loading } = useQuery(Qu_moderationReasons)
  const reasons: ModerationReason[]|null = data?.moderationReasons || null

  // filter the reasons
  const options = useMemo(
    () => {
      const opt: IOptions[] = [
        {
          label: "NONE",
          value: -1,
        }
      ]
      if (!reasons) return opt
      const filtered = reasons.filter(
        reason => {
          const split = reason.id.split("-")
          return split[1] === moderationContract
        }
      ).map(reason => ({
        id: reason.id.split("-")[0],
        reason: reason.reason,
      }))
      return [
        ...opt,
        ...filtered.map(reason => ({
          value: reason.id,
          label: reason.reason,
        }))
      ]
    },
    [reasons]
  )

  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
    />
  )
}