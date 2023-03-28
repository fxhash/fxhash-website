import style from "./PanelFeatures.module.scss"
import { PanelGroup } from "./PanelGroup"

interface Props {
  features: any
}

export function PanelFeatures(props: Props) {
  const { features } = props
  if (!features || features?.length === 0) return null
  return (
    <PanelGroup title="Features" description="Current features for this piece.">
      <ul className={style.featureList}>
        {features &&
          Object.entries(features).map(([key, value]: any, idx: any) => (
            <li key={idx}>
              <span>{key}</span>
              <span>{value?.toString()}</span>
            </li>
          ))}
      </ul>
    </PanelGroup>
  )
}
