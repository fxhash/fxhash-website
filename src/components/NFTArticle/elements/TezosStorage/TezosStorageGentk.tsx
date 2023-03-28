import style from "./TezosStorageGentk.module.scss"
import layout from "../../../../styles/Layout.module.scss"
import cs from "classnames"
import { TezosStorageRenderer } from "./TezosStorageFactory"
import { FxhashContracts } from "../../../../types/Contracts"
import { SquareContainer } from "../../../Layout/SquareContainer"
import { ArtworkFrame } from "../../../Artwork/ArtworkFrame"
import { Image } from "../../../Image"
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
import { gentkLiveUrl, getObjktIdFromContract } from "../../../../utils/objkt"

interface Props {
  id: string
}
export const TezosStorageGentk: TezosStorageRenderer<Props> = ({ id }) => {
  const [running, setRunning] = useState<boolean>(false)

  const { data } = useQuery(Qu_objkt, {
    variables: {
      id: id,
    },
  })

  const token = useMemo<Objkt | null>(() => {
    return data?.objkt || null
  }, [data])

  const iframeRef = useRef<ArtworkIframeRef>(null)
  const reload = () => {
    if (iframeRef.current) {
      iframeRef.current.reloadIframe()
    }
  }

  return (
    <div className={style.container}>
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
            className={cs(style.user, layout.hide_sm)}
            avatarSide="right"
            newTab
          />
          <EntityBadge
            size="regular"
            user={token.issuer!.author}
            displayAvatar={false}
            className={cs(style.user, layout.show_sm)}
            toggeable
            newTab
          />
        </div>
      )}
      <SquareContainer>
        <ArtworkFrame tokenLabels={token?.issuer?.labels}>
          {token ? (
            running ? (
              <ArtworkIframe
                tokenLabels={token?.issuer?.labels}
                ref={iframeRef}
                url={gentkLiveUrl(token)}
                hasLoading={false}
              />
            ) : (
              <Image
                image={token.captureMedia}
                ipfsUri={token.metadata!.displayUri}
                alt={token.name || ""}
              />
            )
          ) : (
            <LoaderBlock size="small" height="100%">
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
              iconComp={<i aria-hidden className="fas fa-play" />}
              iconSide="right"
              onClick={() => setRunning(true)}
            >
              run
            </Button>
          ) : (
            <>
              <Button
                type="button"
                size="small"
                color="transparent"
                iconComp={<i aria-hidden className="fas fa-stop" />}
                iconSide="right"
                onClick={() => setRunning(false)}
              >
                stop
              </Button>
              <Button
                type="button"
                size="small"
                iconComp={<i aria-hidden className="fas fa-redo" />}
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
                <i aria-hidden className="fas fa-external-link-square" />
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
  if (!pointer?.contract) {
    return false
  }
  // get contract address, removing network indentifier if any
  const contract = pointer.contract.split(".")[0]
  if (
    [
      FxhashContracts.GENTK_V1,
      FxhashContracts.GENTK_V2,
      FxhashContracts.GENTK_V3,
    ].indexOf(contract) === -1
  ) {
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
  const contract = pointer.contract.split(".")[0]
  const idNumber = parseInt(pointer.path.split("::")[1])

  return {
    id: getObjktIdFromContract(contract, idNumber),
  }
}
