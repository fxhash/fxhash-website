// import style from "./UserGenerativeTokens.module.scss"
import layout from "../../styles/Layout.module.scss"
import { useQuery } from "@apollo/client"
import cs from "classnames"
import { useRef, useEffect, useContext } from "react"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard"
import { LoaderBlock } from "../../components/Layout/LoaderBlock"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { SettingsContext } from "../../context/Theme"
import { Qu_userGenTokens } from "../../queries/user"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { User } from "../../types/entities/User"
import { CardsLoading } from "../../components/Card/CardsLoading"

interface Props {
  user: User
}
export function UserGenerativeTokens({
  user,
}: Props) {
  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const settings = useContext(SettingsContext)

  const { data, loading, fetchMore } = useQuery(Qu_userGenTokens, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: 20
    },
  })

  // safe access to gentoks
  const genToks: GenerativeToken[] = data?.user?.generativeTokens || null

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === genToks?.length) {
        ended.current = true
      }
      else {
        currentLength.current = genToks?.length
      }
    }
  }, [data, loading])

  const load = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          id: user.id,
          skip: genToks?.length || 0,
          take: 20
        }
      })
    }
  }

  return (
    <div className={cs(layout['padding-big'])}>
      <InfiniteScrollTrigger
        onTrigger={load}
      >
        <CardsContainer>
          {genToks?.map(token => (
            <GenerativeTokenCard
              key={token.id}
              token={token}
              displayPrice={settings.displayPricesCard}
              displayDetails={settings.displayInfosGenerativeCard}
            />
          ))}
          {loading && (
            <CardsLoading number={20} />
          )}
        </CardsContainer>
      </InfiniteScrollTrigger>
    </div>
  )
}