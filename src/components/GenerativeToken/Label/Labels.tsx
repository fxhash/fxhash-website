import style from "./Labels.module.scss"
import cs from "classnames"
import { useMemo } from "react"
import { getGenTokLabelDefinitions } from "../../../utils/generative-token"
import { Label } from "./Label"

interface Props {
  labels: number[]
}
export function Labels({ labels }: Props) {
  const defs = useMemo(() => {
    return getGenTokLabelDefinitions(labels)
  }, [labels])

  return defs.length > 0 ? (
    <div className={cs(style.root)}>
      {defs.map((def, idx) => (
        <Label key={idx} definition={def} />
      ))}
    </div>
  ) : null
}
