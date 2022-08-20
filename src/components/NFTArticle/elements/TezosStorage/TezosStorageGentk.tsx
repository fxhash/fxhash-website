import style from "./TezosStorageGentk.module.scss"
import layout from "../../../../styles/Layout.module.scss"
import cs from "classnames"
import { TezosStorageRenderer } from "./TezosStorageFactory"
import { FxhashContracts } from "../../../../types/Contracts"
import { SquareContainer } from "../../../Layout/SquareContainer"
import { ArtworkFrame } from "../../../Artwork/ArtworkFrame"
import { ImageIpfs } from "../../../Medias/ImageIpfs"
import { useQuery } from "@apollo/client"
import { Qu_objkt } from "../../../../queries/objkt"
import { useMemo, useRef, useState } from "react"
import { Objkt } from "../../../../types/entities/Objkt"
import { LoaderBlock } from "../../../Layout/LoaderBlock"
import { EntityBadge } from "../../../User/EntityBadge"
import Link from "next/link"
import { getGentkUrl } from "../../../../utils/gentk"
import { Button } from "../../../Button"
import { ArtworkIframe, ArtworkIframeRef } from "../../../Artwork/PreviewIframe"
import { gentkLiveUrl } from "../../../../utils/objkt"

interface Props {
  id: number
}
export const TezosStorageGentk: TezosStorageRenderer<Props> = ({
  id,
}) => {
  const [running, setRunning] = useState<boolean>(false)

  const { data } = useQuery(Qu_objkt, {
    variables: {
      id: id
    }
  })

  const token = useMemo<Objkt|null>(() => {
    return data?.objkt || null
  }, [data])

  const iframeRef = useRef<ArtworkIframeRef>(null)
  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.reloadIframe()
    }
  }

  return (
    <div>
      {token && (
        <div className={cs(style.header)}>
          <Link href={getGentkUrl(token)}>
            <a className={cs(style.title)} target="_blank">
              {token.name}
            </a>
          </Link>
          <EntityBadge
            size="regular"
            user={token.issuer!.author}
            className={cs(style.user)}
            avatarSide="right"
            newTab
          />
        </div>
      )}
      <SquareContainer>
        <ArtworkFrame>
          {token ? (
            running ? (
              <ArtworkIframe
                ref={iframeRef}
                url={gentkLiveUrl(token)}
                hasLoading={false}
              />
            ):(
              <ImageIpfs
                src={token.metadata!.displayUri}
              />
            )
          ):(
            <LoaderBlock
              size="small"
              height="100%"
            >
              loading token
            </LoaderBlock>
          )}
        </ArtworkFrame>
      </SquareContainer>
      
      {token && (
        <div className={cs(layout.buttons_inline, layout.grid_center)}>
          {!running ? (
            <Button
              type="button"
              size="small"
              color="transparent"
              iconComp={<i aria-hidden className="fas fa-play"/>}
              iconSide="right"
              onClick={() => setRunning(true)}
            >
              run
            </Button>
          ):(
            <>
              <Button
                type="button"
                size="small"
                color="transparent"
                iconComp={<i aria-hidden className="fas fa-stop"/>}
                iconSide="right"
                onClick={() => setRunning(false)}
              >
                stop
              </Button>
              <Button
                type="button"
                size="small"
                iconComp={<i aria-hidden className="fas fa-redo"/>}
                iconSide="right"
                onClick={reload}
                color="transparent"
              >
                reload
              </Button>
            </>
          )}
          <Link href={getGentkUrl(token)} passHref>
            <Button
              isLink={true}
              size="small"
              iconComp={
                <i aria-hidden className="fas fa-external-link-square"/>
              }
              // @ts-ignore
              target="_blank"
              color="transparent"
              iconSide="right"
            >
              token
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

TezosStorageGentk.matches = (pointer) => {
  // get contract address, removing network indentifier if any
  const contract = pointer.contract.split(".")[0]
  if (![
    FxhashContracts.GENTK_V1, 
    FxhashContracts.GENTK_V2,
  ].includes(contract)) {
    return false
  }
  const split = pointer.path.split("::")
  if (split[0] !== "token_metadata") {
    return false
  }
  if (isNaN(parseInt(split[1]))) {
    return false
  }
  return true
}

TezosStorageGentk.getPropsFromPointer = (pointer) => {
  return {
    id: parseInt(pointer.path.split("::")[1])
  }
}