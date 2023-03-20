import style from "./Labels.module.scss"
import cs from "classnames"
import { useMemo } from "react"
import { getGenTokLabelDefinitions } from "../../../utils/generative-token"
import { Label } from "./Label"
import {
  GenerativeToken,
  GenTokLabel_Params,
} from "types/entities/GenerativeToken"

interface Props {
  token: GenerativeToken
  className?: string
}
export function Labels({ className, token }: Props) {
  const defs = useMemo(() => {
    // process token native labels
    const out = getGenTokLabelDefinitions(token.labels || [])
    // add "Params" label if params-enabled
    if (token.inputBytesSize > 0) {
      out.unshift(GenTokLabel_Params)
    }
    return out
  }, [token])

  return defs.length > 0 ? (
    <div className={cs(style.root, className)}>
      {defs.map((def, idx) => (
        <Label key={idx} definition={def} />
      ))}
    </div>
  ) : null
}
