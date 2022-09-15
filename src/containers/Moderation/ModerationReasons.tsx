import style from "./ModerationReasons.module.scss"
import text from "../../styles/Text.module.css"
import cs from "classnames"
import { useQuery } from "@apollo/client"
import { Qu_moderationReasons } from "../../queries/moderation-reason"
import { ModerationReason } from "../../types/entities/ModerationReason"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { useMemo } from "react"
import { Spacing } from "../../components/Layout/Spacing"

interface Props {
  moderationContract: "token"|"user"|"article"
}
export function ModerationReasons({
  moderationContract,
}: Props) {
  // get reasons currently indexed
  const { data, loading } = useQuery(Qu_moderationReasons)
  const reasons: ModerationReason[]|null = data?.moderationReasons || null

  // filter the reasons
  const filtered = useMemo(
    () => {
      if (!reasons) return null
      return reasons.filter(
        reason => {
          const split = reason.id.split("-")
          return split[1] === moderationContract
        }
      ).map(reason => ({
        id: reason.id.split("-")[0],
        reason: reason.reason,
      }))
    },
    [reasons]
  )

  return (
    <>
      <h5>List of existing reasons</h5>
      {loading && (
        <LoaderBlock
          size="small"
          height="100px"
        />
      )}
      {filtered && (
        filtered.length === 0 ? (
          <p className={cs(text.info)}>
            No moderation reason yet
          </p>
        ):(
          <ul>
            {filtered.map(reason => (
              <li key={reason.id}>
                {reason.reason}
              </li>
            ))}
          </ul>
        )
      )}
    </>
  )
}