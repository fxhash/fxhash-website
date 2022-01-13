import style from "./LiveFeed.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import Link from "next/link"
import { useLazyQuery } from "@apollo/client"
import { Qu_objktsFeed } from "../../queries/objkt"
import { useInterval, useIsMounted } from "../../utils/hookts"
import { useRef, useState, useEffect } from "react"
import { subMinutes } from "date-fns"
import { Objkt } from "../../types/entities/Objkt"
import { RevealIframe } from "../../components/Reveal/RevealIframe"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { Spacing } from "../../components/Layout/Spacing"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { UserBadge } from "../../components/User/UserBadge"
import { Button } from "../../components/Button"
import { getGentkUrl } from "../../utils/gentk"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { ProgressAnimated, ProgressAnimatedRef } from "../../components/Utils/ProgressAnimated"

export function LiveFeed() {
  const isMounted = useIsMounted()

  const lastFetch = useRef<Date>(subMinutes(new Date(), 60))
  const [getObjktsFeed, { data, loading, error }] = useLazyQuery(Qu_objktsFeed, {
    fetchPolicy: "no-cache"
  })

  // 3 piles: to be revealed, revealing, revealed
  const [toReveal, setToReveal] = useState<Objkt[]>([])
  const [revealing, setRevealing] = useState<Objkt|null>(null)
  const [revealed, setRevealed] = useState<Objkt[]>([])
  // is it ready to be revealed
  const [readyRevealNew, setReadyRevealNew] = useState<boolean>(false)

  const progressRef = useRef<ProgressAnimatedRef>(null)

  useInterval(() => {
    getObjktsFeed({
      variables: {
        "filters": {
          "assigned_eq": "true",
          "assignedAt_gt": lastFetch.current.toISOString()
        },
        "take": 20
      }
    })
  }, 30000, true)

  useEffect(() => {
    if (!data) return
    // @ts-ignore update the date based on the most recent assignation
    const sortedByAssigned = [...data.objkts].sort((a: Objkt, b: Objkt) => new Date(a.assignedAt!) - new Date(b.assignedAt!))
    if (sortedByAssigned.length > 0) {
      lastFetch.current = new Date(sortedByAssigned[0].assignedAt)
    }

    // filter those already seen - never know
    const filtered = sortedByAssigned.filter(objkt => {
      if (revealing && revealing.id === objkt.id) return false
      for (const obj of revealed) {
        if (obj.id === objkt.id) return false
      }
      for (const obj of toReveal) {
        if (obj.id === objkt.id) return false
      }
      return true
    })

    // update the to reveal list
    if (filtered.length > 0) {
      // if there is nothing being revealed, we set it
      if (!revealing || readyRevealNew) {
        const rev = filtered.shift()
        setReadyRevealNew(false)
        setRevealing(rev)
      }
      setToReveal([...filtered, ...toReveal])
    }
  }, [data])

  const revealedFinished = () => {
    progressRef.current?.start()

    setTimeout(() => {
      if (isMounted()) {
        // the new token to reveal
        const toRevealNew = [...toReveal]
        const reveal = toRevealNew.shift()
        // update the revealed array
        let revealedNew = []
        if (revealing) revealedNew.push(revealing)
        revealedNew = revealedNew.concat(revealed)
        setRevealed(revealedNew)
        // update the revealing token
        if (reveal) {
          setRevealing(reveal)
        }
        else {
          setReadyRevealNew(true)
        }
        // finally we start to load the next resource in the background
        if (toRevealNew.length > 0 && toRevealNew[0].metadata) {
          const url = ipfsGatewayUrl(toRevealNew[0].metadata.artifactUri, "ipfsio")
          fetch(url)
        }
        setToReveal(toRevealNew)
      }
    }, 13000)
  }

  return (
    <div>
      <Spacing size="x-large"/>

      <div className={cs(style.reveal_container)}>
        {revealing ? (
          <>
            <RevealIframe
              url={ipfsGatewayUrl(revealing.metadata?.artifactUri, "ipfsio")}
              onLoaded={revealedFinished}
              resetOnUrlChange={true}
            />

            <Spacing size="large"/>
            <ProgressAnimated
              width="min(250px, 50vw)"
              ref={progressRef}
            />
            <Spacing size="large"/>

            <small className={cs(colors.gray)}>GENTK#{ revealing.id }</small>
            <h3>{ revealing.name }</h3>
            <Spacing size="x-small"/>
            <UserBadge
              prependText="created by"
              user={revealing.issuer.author}
              size="big"
            />
            <Spacing size="8px"/>
            <UserBadge 
              prependText="owned by"
              user={revealing.owner!}
              size="big"
            />
            <Spacing size="2x-large"/>

            <Link href={getGentkUrl(revealing)} passHref>
              <Button
                isLink={true}
                // @ts-ignore
                target="_blank"
              >
                view details
              </Button>
            </Link>
          </>
        ):(
          <LoaderBlock height="30vh">
            waiting for a reveal
          </LoaderBlock>
        )}
      </div>

      <Spacing size="6x-large"/>

      <SectionHeader>
        <TitleHyphen>Recently revealed</TitleHyphen>
      </SectionHeader>

      <Spacing size="x-large"/>

      {revealed.length > 0 ? (
        <CardsContainer>
          {revealed.map(gentk => (
            <ObjktCard key={gentk.id} objkt={gentk} />
          ))}
        </CardsContainer>
      ):(
        <em className={cs(colors['gray-dark'])}>
          Once a token will be revealed on your screen it will appear in here...
        </em>
      )}
    </div>
  )
}