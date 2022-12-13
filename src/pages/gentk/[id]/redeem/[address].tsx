import layout from "styles/Layout.module.scss"
import cs from "classnames"
import { gql } from "@apollo/client"
import Head from "next/head"
import Link from "next/link"
import { GetServerSideProps, NextPage } from "next"
import { createApolloClient } from "../../../../services/ApolloClient"
import { GenerativeToken } from "../../../../types/entities/GenerativeToken"
import { Frag_UserBadge } from "../../../../queries/fragments/user"
import { getImageApiUrl, OG_IMAGE_SIZE } from "../../../../components/Image"
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
import { Qu_objkt } from "queries/objkt"
import { Objkt } from "types/entities/Objkt"
import { gentkRedeemables, getGentkUrl } from "utils/gentk"
import { useContext, useMemo } from "react"
import { UserContext } from "containers/UserProvider"
import { UserGuard } from "components/Guards/UserGuard"
import { ErrorBlock } from "components/Error/ErrorBlock"
import { ErrorPage } from "components/Error/ErrorPage"
import { RedeemGentk } from "containers/Redeemable/RedeemGentk"

interface Props {
  objkt: Objkt
  redeemableDetails: RedeemableDetails
}

const ObjktRedeemAction: NextPage<Props> = ({ objkt, redeemableDetails }) => {
  // get the display url for og:image
  const displayUrl =
    objkt.captureMedia?.cid &&
    getImageApiUrl(objkt.captureMedia.cid, OG_IMAGE_SIZE)

  return (
    <>
      <MetaHead
        title={`${objkt.name} — redeem`}
        description={`Redeem ${objkt.name} for ${redeemableDetails.name}`}
        image={displayUrl}
      />

      <PageLayout padding="big">
        <UserGuard
          allowed={(user) => objkt.owner!.id === user.id}
          forceRedirect
        >
          {objkt.activeListing ? (
            <ErrorPage title="You cannot redeem this token currently">
              <p>
                This token is currently listed on the marketplace.
                <br /> You must first unlist this token from the marketplace
                before it can be redeemed.
              </p>
              <Link href={getGentkUrl(objkt)}>
                <Button isLink iconComp={<Icon icon="arrow-left" />}>
                  back to token page
                </Button>
              </Link>
            </ErrorPage>
          ) : (
            <RedeemGentk gentk={objkt} redeemable={redeemableDetails} />
          )}
        </UserGuard>
      </PageLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let objkt: Objkt | null = null
  let redeemableDetails = null

  try {
    const idStr = context.params?.id
    const address = context.params?.address

    if (!idStr || !address) {
      throw new Error("Invalid parameters")
    }

    const id = parseInt(idStr as string)
    if (!(id === 0 || id)) {
      throw new Error("Invalid identifier")
    }

    // query the gentk
    const { data } = await createApolloClient().query({
      query: Qu_objkt,
      fetchPolicy: "no-cache",
      variables: {
        id: id,
      },
    })
    if (!data) {
      throw new Error("Gentk not found")
    }
    objkt = data.objkt as Objkt

    // check if the issuer contains the address in the URL as redeemable
    if (!objkt.availableRedeemables?.find((red) => red.address === address)) {
      throw new Error(
        "Invalid redeemable address, does not exist with this token."
      )
    }

    // query the events API to get details about the redeemables
    const { data: data2 } = await createEventsClient().query({
      query: Qu_redeemableDetails,
      fetchPolicy: "no-cache",
      variables: {
        where: {
          address: {
            equals: address,
          },
        },
      },
    })
    if (!data2 || !data2.consumables || data2.consumables.length < 1) {
      throw new Error("Could not find the redeemable in our database")
    }

    redeemableDetails = data2.consumables[0]
    // process the markdown strings and replace strings from the object
    // clone deep so that we can mutate the object
    redeemableDetails = cloneDeep(redeemableDetails)
    redeemableDetails.description = await mdToHtml(
      redeemableDetails.description
    )

    return {
      props: {
        objkt: objkt,
        redeemableDetails: redeemableDetails,
      },
      notFound: !objkt || !redeemableDetails,
    }
  } catch (err) {
    return {
      props: {},
      redirect: {
        destination: objkt ? getGentkUrl(objkt) : "/",
        permanent: false,
      },
    }
  }
}

export default ObjktRedeemAction
