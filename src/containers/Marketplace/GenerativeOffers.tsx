import style from "./GenerativeOffers.module.scss"
import cs from "classnames"
import { SectionWrapper } from "../../components/Layout/SectionWrapper"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { useQuery } from "@apollo/client"
import { Qu_genTokOffers } from "../../queries/generative-token"
import { ListOffers } from "../../components/List/ListOffers"

interface Props {
  token: GenerativeToken
}
export function GenerativeOffers({
  token,
}: Props) {
  const { data, loading } = useQuery(Qu_genTokOffers, {
    variables: {
      id: token.id
    }
  })

  const offers = data?.generativeToken?.offers

  return (
    <SectionWrapper layout="fixed-width-centered">
      <ListOffers
        offers={offers}
        loading={loading}
        showObjkt
      />
    </SectionWrapper>
  )
}