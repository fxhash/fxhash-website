import { useQuery } from "@apollo/client"
import style from "./UserCollection.module.scss"
import cs from "classnames"
import Link from "next/link"
import { useRef, useEffect } from "react"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { Qu_userObjkts } from "../../queries/user"
import { Objkt } from "../../types/entities/Objkt"
import { User } from "../../types/entities/User"
import { Spacing } from "../../components/Layout/Spacing"
import { Button } from "../../components/Button"

interface Props {
  user: User
}
export function UserCollection({
  user,
}: Props) {
  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore } = useQuery(Qu_userObjkts, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: 20
    }
  })

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.user.objkts?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.user.objkts?.length
      }
    }
  }, [data, loading])

  const load = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          id: user.id,
          skip: data?.user.objkts.length || 0,
          take: 20
        }
      })
    }
  }

  const objkts: Objkt[]|null = data?.user.objkts || null

  return (
    <>
      <header className={cs(style.header)}>
        <Link href={`/enjoy-collection/${user}`} passHref>
          <Button
            isLink={true}
            iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
            iconSide="right"
          >
            enjoy
          </Button>
        </Link>
      </header>

      <Spacing size="small"/>

      <InfiniteScrollTrigger
        onTrigger={load}
      >
        <CardsContainer>
          {objkts?.map(objkt => (
            <ObjktCard
              key={objkt.id}
              objkt={objkt}
            />
          ))}
        </CardsContainer>
      </InfiniteScrollTrigger>

      {loading && data && <LoaderBlock height="100px"/>}
    </>
  )
}