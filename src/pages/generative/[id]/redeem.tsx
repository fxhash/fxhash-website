import layout from "styles/Layout.module.scss"
import cs from "classnames"
import { gql } from "@apollo/client"
import Head from "next/head"
import Link from "next/link"
import { GetServerSideProps, NextPage } from "next"
import { createApolloClient } from "../../../services/ApolloClient"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { Frag_UserBadge } from "../../../queries/fragments/user"
import { getImageApiUrl, OG_IMAGE_SIZE } from "../../../components/Image"
import { Frag_GenTokenRedeemables } from "queries/fragments/generative-token"
import { MetaHead } from "components/Utils/MetaHead"
import { createEventsClient } from "services/EventsClient"
import { Qu_redeemableDetails } from "queries/events/redeemable"
import { RedeemableDetails } from "types/entities/Redeemable"
import { PageLayout } from "components/Layout/PageLayout"
import { Infobox } from "components/UI/Infobox"
import { LinkGuide } from "components/Link/LinkGuide"
import { Spacing } from "components/Layout/Spacing"
import { RedeemableDetailsView } from "components/Entities/RedeemableDetailsView"
import { cloneDeep } from "@apollo/client/utilities"
import { mdToHtml } from "services/Markdown"
import { Button } from "components/Button"
import { Icon } from "components/Icons/Icon"
import { getGenerativeTokenUrl } from "utils/generative-token"

interface Props {
  token: GenerativeToken
  redeemableDetails: RedeemableDetails[]
}

const GenerativeTokenRedeem: NextPage<Props> = ({
  token,
  redeemableDetails,
}) => {
  // get the display url for og:image
  const displayUrl =
    token.captureMedia?.cid &&
    getImageApiUrl(token.captureMedia.cid, OG_IMAGE_SIZE)

  return (
    <>
      <MetaHead
        title={`${token.name} — redeem details`}
        description={`Informations about the redeemables of ${token.name}`}
        image={displayUrl}
      />

      <PageLayout padding="big">
        <div className={cs(layout.flex_column_left)}>
          <Link href={getGenerativeTokenUrl(token)}>
            <Button isLink iconComp={<Icon icon="arrow-left" />}>
              back to project
            </Button>
          </Link>
        </div>

        <Spacing size="3x-large" />

        <div>
          <h2>Generative token: {token.name}</h2>
        </div>

        <Spacing size="3x-large" />

        <Infobox>
          The iterations of this project can be redeemed to activate an event.
          <br />
          Redeeming a token will not destroy it, and owners will keep the
          ownership of their token.
          <br />
          <br />
          <LinkGuide href="/docs">Learn more about Redeemable tokens</LinkGuide>
        </Infobox>

        <Spacing size="3x-large" />

        {redeemableDetails.map((details) => (
          <RedeemableDetailsView key={details.address} details={details} />
        ))}

        <Spacing size="3x-large" />

        <div className={cs(layout.flex_column_left)}>
          <Link href={getGenerativeTokenUrl(token)}>
            <Button isLink iconComp={<Icon icon="arrow-left" />}>
              back to project
            </Button>
          </Link>
        </div>
      </PageLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const idStr = context.params?.id
  let token = null
  let redeemableDetails = null

  if (idStr) {
    const id = parseInt(idStr as string)
    if (id === 0 || id) {
      const { data, error } = await createApolloClient().query({
        query: gql`
          ${Frag_UserBadge}
          ${Frag_GenTokenRedeemables}

          query QueryGenTokRedeemables($id: Float!) {
            generativeToken(id: $id) {
              id
              name
              author {
                ...UserBadgeInfos
              }
              ...Redeemables
            }
          }
        `,
        fetchPolicy: "no-cache",
        variables: { id },
      })
      if (data) {
        token = data.generativeToken

        // now we query the events API to get details about the redeemables
        const { data: data2 } = await createEventsClient().query({
          query: Qu_redeemableDetails,
          fetchPolicy: "no-cache",
          variables: {
            where: {
              address: {
                in: token.redeemables.map((red: any) => red.address),
              },
            },
          },
        })
        if (data2) {
          redeemableDetails = data2.consumables
          // process the markdown strings and replace strings from the object
          // clone deep so that we can mutate the object
          redeemableDetails = cloneDeep(redeemableDetails)
          for (const details of redeemableDetails) {
            details.description = await mdToHtml(details.description)
          }
        }
      }
    }
  }

  return {
    props: {
      token: token,
      redeemableDetails: redeemableDetails,
    },
    notFound: !token || !redeemableDetails,
  }
}

export default GenerativeTokenRedeem
