// import style from "./UserGenerativeTokens.module.scss"
import { useQuery } from "@apollo/client";
import cs from "classnames"
import { useRef, useEffect } from "react";
import { CardsContainer } from "../../components/Card/CardsContainer";
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard";
import { ObjktCard } from "../../components/Card/ObjktCard";
import { LoaderBlock } from "../../components/Layout/LoaderBlock";
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger";
import { Qu_userGenTokens, Qu_userObjkts } from "../../queries/user";
import { GenerativeToken } from "../../types/entities/GenerativeToken";
import { Objkt } from "../../types/entities/Objkt";
import { User } from "../../types/entities/User";

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