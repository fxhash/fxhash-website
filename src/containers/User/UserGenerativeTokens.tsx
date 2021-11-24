// import style from "./UserGenerativeTokens.module.scss"
import { useQuery } from "@apollo/client";
import cs from "classnames"
import { useRef, useEffect } from "react";
import { CardsContainer } from "../../components/Card/CardsContainer";
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard";
import { LoaderBlock } from "../../components/Layout/LoaderBlock";
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger";
import { Qu_userGenTokens } from "../../queries/user";
import { GenerativeToken } from "../../types/entities/GenerativeToken";
import { User } from "../../types/entities/User";

interface Props {
  user: User
}
export function UserGenerativeTokens({
  user,
}: Props) {
  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore } = useQuery(Qu_userGenTokens, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: 20
    },
  })

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === data.user.generativeTokens?.length) {
        ended.current = true
      }
      else {
        currentLength.current = data.user.generativeTokens?.length
      }
    }
  }, [data, loading])

  const load = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          id: user.id,
          skip: data?.user.generativeTokens.length || 0,
          take: 20
        }
      })
    }
  }

  const generativeTokens: GenerativeToken[]|null = data?.user.generativeTokens || null

  return (
    <>
      <InfiniteScrollTrigger
        onTrigger={load}
      >
        <CardsContainer>
          {generativeTokens?.map(token => (
            <GenerativeTokenCard
              key={token.id}
              token={token}
            />
          ))}
        </CardsContainer>
      </InfiniteScrollTrigger>

      {loading && data && <LoaderBlock height="100px"/>}
    </>
  )
}