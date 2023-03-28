import style from "./TezosStorageProject.module.scss"
import cs from "classnames"
import { TezosStorageRenderer } from "./TezosStorageFactory"
import { FxhashContracts } from "../../../../types/Contracts"
import { useMemo, useRef, useState } from "react"
import { useQuery } from "@apollo/client"
import { Qu_genToken } from "../../../../queries/generative-token"
import { GenerativeToken } from "../../../../types/entities/GenerativeToken"
import { ArtworkIframe, ArtworkIframeRef } from "../../../Artwork/PreviewIframe"
import Link from "next/link"
import { getGenerativeTokenUrl } from "../../../../utils/generative-token"
import { EntityBadge } from "../../../User/EntityBadge"
import { SquareContainer } from "../../../Layout/SquareContainer"
import { ArtworkFrame } from "../../../Artwork/ArtworkFrame"
import { GenerativeArtwork } from "../../../GenerativeToken/GenerativeArtwork"
import layout from "../../../../styles/Layout.module.scss"

interface Props {
  id: number
}
export const TezosStorageProject: TezosStorageRenderer<Props> = ({ id }) => {
  const [running, setRunning] = useState<boolean>(false)

  const { data } = useQuery(Qu_genToken, {
    variables: {
      id: id,
    },
  })

  const token = useMemo<GenerativeToken | null>(() => {
    return data?.generativeToken || null
  }, [data])

  const iframeRef = useRef<ArtworkIframeRef>(null)
  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.reloadIframe()
    }
  }

  return (
    <div className={cs(style.root)}>
      {token && (
        <div className={cs(style.header)}>
          <Link href={getGenerativeTokenUrl(token)}>
            <a className={cs(style.title)} target="_blank">
              {token.name}
            </a>
          </Link>
          <EntityBadge
            size="regular"
            user={token.author}
            className={cs(style.user, layout.hide_sm)}
            avatarSide="right"
            newTab
          />
          <EntityBadge
            size="regular"
            user={token.author}
            displayAvatar={false}
            className={cs(style.user, layout.show_sm)}
            toggeable
            newTab
          />
        </div>
      )}

      {token && (
        <GenerativeArtwork
          token={token}
          forceImageDisplay
          openUrl={getGenerativeTokenUrl(token)}
          openText="project"
        />
      )}
    </div>
  )
}

TezosStorageProject.matches = (pointer) => {
  // get contract address, removing network indentifier if any
  if (!pointer?.contract) {
    return false
  }
  const contract = pointer.contract.split(".")[0]
  if (
    [FxhashContracts.ISSUER, FxhashContracts.ISSUER_V3].indexOf(contract) === -1
  ) {
    return false
  }
  const split = pointer.path.split("::")
  if (split[0] !== "ledger") {
    return false
  }
  if (isNaN(parseInt(split[1]))) {
    return false
  }
  return true
}

TezosStorageProject.getPropsFromPointer = (pointer) => {
  return {
    id: parseInt(pointer.path.split("::")[1]),
  }
}
