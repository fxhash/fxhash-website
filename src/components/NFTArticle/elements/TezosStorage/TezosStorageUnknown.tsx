import style from "./TezosStorageUnknown.module.scss"
import cs from "classnames"
import { TezosStorageRenderer } from "./TezosStorageFactory"
import { ITezosStoragePointer } from "../../../../types/TezosStorage"
import { useMemo } from "react"

interface Props {
  pointer: ITezosStoragePointer
}
export const TezosStorageUnknown: TezosStorageRenderer<Props> = ({
  pointer,
}) => {
  const keys = useMemo(() => {
    const k: string[] = []
    for (const K in pointer) {
      if (pointer[K as keyof ITezosStoragePointer]) {
        k.push(K)
      }
    }
    return k
  }, [pointer])

  return (
    <div className={cs(style.root)}>
      <i className="fa-solid fa-bug" aria-hidden/>
      unsupported tezos storage content
      <div className={cs(style.pointer)}>
        {keys.map((key) => (
          <div key={key}>
            <strong>{key}</strong>: {pointer[key as keyof ITezosStoragePointer]}
          </div>
        ))}
      </div>
    </div>
  )
}

// fallback, always matches
TezosStorageUnknown.matches = () => true
// no props
TezosStorageUnknown.getPropsFromPointer = pointer => ({ pointer })