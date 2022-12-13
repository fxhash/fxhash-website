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

interface Props {
  objkt: Objkt
  redeemableDetails: RedeemableDetails[]
}

const ObjktRedeem: NextPage<Props> = ({ objkt, redeemableDetails }) => {
  const { user } = useContext(UserContext)

  // get the display url for og:image
  const displayUrl =
    objkt.captureMedia?.cid &&
    getImageApiUrl(objkt.captureMedia.cid, OG_IMAGE_SIZE)

  return (
    <>
      <MetaHead
        title={`${objkt.name} — redeem details`}
        description={`Informations about the redeemables of ${objkt.name}`}
        image={displayUrl}
      />

      <PageLayout padding="big">
        <div className={cs(layout.flex_column_left)}>
          <Link href={getGentkUrl(objkt)}>
            <Button isLink iconComp={<Icon icon="arrow-left" />}>
              back to gentk
            </Button>
          </Link>
        </div>

        <Spacing size="3x-large" />

        <div>
          <h2>Gentk: {objkt.name}</h2>
        </div>

        <Spacing size="3x-large" />

        <Infobox>
          This gentk can be redeemed to activate an effect.
          <br />
          Redeeming this token will not destroy it, and owners will keep the
          ownership of their token.
          <br />
          <br />
          <LinkGuide href="/docs">Learn more about Redeemable tokens</LinkGuide>
        </Infobox>

        <Spacing size="3x-large" />

        {redeemableDetails.map((details) => (
          <div key={details.address}>
            <RedeemableDetailsView details={details} />
            <Spacing size="x-large" />
            {objkt.availableRedeemables.find(
              (r) => r.address === details.address
            ) &&
              (user?.id === objkt.owner!.id ? (
                objkt.activeListing ? (
                  <strong>
                    You cannot redeem this token if it's currently listed.
                  </strong>
                ) : (
                  <Link href={`/gentk/${objkt.id}/redeem/${details.address}`}>
                    <Button
                      isLink
                      iconComp={<Icon icon="sparkles" />}
                      color="secondary"
                    >
                      redeem your token
                    </Button>
                  </Link>
                )
              ) : (
                <strong>only the owner can redeem this token</strong>
              ))}
          </div>
        ))}

        <Spacing size="3x-large" />

        <div className={cs(layout.flex_column_left)}>
          <Link href={getGentkUrl(objkt)}>
            <Button isLink iconComp={<Icon icon="arrow-left" />}>
              back to gentk
            </Button>
          </Link>
        </div>
      </PageLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const idStr = context.params?.id
  let objkt = null
  let redeemableDetails = null

  if (idStr) {
    const id = parseInt(idStr as string)
    if (id === 0 || id) {
      const { data } = await createApolloClient().query({
        query: Qu_objkt,
        fetchPolicy: "no-cache",
        variables: {
          id: id,
        },
      })
      if (data) {
        objkt = data.objkt

        if (objkt.availableRedeemables?.length > 0) {
          // now we query the events API to get details about the redeemables
          const { data: data2 } = await createEventsClient().query({
            query: Qu_redeemableDetails,
            fetchPolicy: "no-cache",
            variables: {
              where: {
                address: {
                  in: objkt.availableRedeemables.map((red: any) => red.address),
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
  }

  return {
    props: {
      objkt: objkt,
      redeemableDetails: redeemableDetails,
    },
    notFound: !objkt || !redeemableDetails,
  }
}

export default ObjktRedeem
