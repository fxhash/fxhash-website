import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import style from "./Reports.module.scss"
import { NextPage } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"
import colors from "../../styles/Colors.module.css"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import { Spacing } from "../../components/Layout/Spacing"
import Head from "next/head"
import gql from "graphql-tag"
import client from "../../services/ApolloClient"
import { GenerativeToken, GenTokFlag } from "../../types/entities/GenerativeToken"
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard"
import { useState, useMemo } from "react"
import { useClientEffect } from "../../utils/hookts"
import ClientOnly from "../../components/Utils/ClientOnly"
import { UserGuard } from "../../components/Guards/UserGuard"
import { ModeratorActions } from "../../containers/Community/ModeratorActions"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { Frag_GenAuthor, Frag_GenPricing } from "../../queries/fragments/generative-token"

const Chart = dynamic(() => import("../../components/Charts/Chart"))


const Qu_reportedGenTokens = gql`
  ${Frag_GenAuthor}
  ${Frag_GenPricing}
  query Query ($skip: Int, $take: Int, $filters: GenerativeTokenFilter) {
    generativeTokens(skip: $skip, take: $take, filters: $filters) {
      id
      flag
      reports {
        id
        createdAt
      }
      name
      slug
      metadata
      supply
      balance
      enabled
      royalties
      createdAt
      ...Pricing
      ...Author
    }
  }
`

interface Props {
  tokens: GenerativeToken[]
}
const ReportsPage: NextPage<Props> = ({
  tokens,
}) => {
  const awaitingMod = useMemo<GenerativeToken[]>(() => {
    return tokens.filter(tok => tok.flag === GenTokFlag.REPORTED || tok.flag === GenTokFlag.AUTO_DETECT_COPY)
  }, [tokens])

  const malicious = useMemo<GenerativeToken[]>(() => {
    return tokens.filter(tok => tok.flag === GenTokFlag.MALICIOUS)
  }, [tokens])

  return (
    <>
      <Head>
        <title>fxhash — reports by community</title>
        <meta key="og:title" property="og:title" content="fxhash — reports by community"/>
        <meta key="description" name="description" content="Reports mades by the community"/>
        <meta key="og:description" property="og:description" content="Reports mades by the community"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>
      </Head>

      <Spacing size="6x-large" sm="3x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>community reports</TitleHyphen>
        </SectionHeader>

        <Spacing size="3x-large" />

        <main className={cs(layout['padding-big'])}>
          <p>This page lists Generative Tokens reported by the community, awaiting for moderation. To learn more about the current moderation system in place, <Link href="/articles/moderation-system"><a>read the report system guide</a></Link>.</p>
          <p>Only a group of trusted moderators can decide on the final state of a reported Token. This is a temporary system.</p>
          <p>These Generative Tokens will remain hidden from the rest of the application until a statement is decided.</p>

          <Spacing size="3x-large" />

          <h4>Generative Tokens awaiting for moderation</h4>
          <Spacing size="large" />

          {awaitingMod.length > 0 ? (
            <div className={cs(style.reports)}>
              {awaitingMod.map(token => (
                <div key={token.id} className={cs(style.report)}>
                  <GenerativeTokenCard token={token} className={cs(style.token)} />
                  <div>
                    <strong>Total reports: {token.reports?.length || 0}</strong>
                    {Chart && token.reports && token.reports.length > 0 && (
                      <Chart
                        reports={token.reports}
                        className={cs(style.chart)}
                      />
                    )}
                    <ClientOnly>
                      <UserGuard forceRedirect={false}>
                        <ModeratorActions token={token} />
                      </UserGuard>
                    </ClientOnly>
                  </div>
                </div>
              ))}
            </div>
          ):(
            <em>No tokens are awaiting for moderation.</em>
          )}

          <Spacing size="6x-large" />

          <h4>Tokens rejected by the moderators</h4>
          <Spacing size="large" />

          <CardsContainer>
            {malicious.map(tok => (
              <GenerativeTokenCard
                key={tok.id}
                token={tok}
              />
            ))}
          </CardsContainer>

          <Spacing size="6x-large" />
        </main>
      </section>
    </>
  )
}

export async function getServerSideProps() {
  const { data } = await client.query({
    query: Qu_reportedGenTokens,
    fetchPolicy: "no-cache",
    variables: {
      skip: 0,
      take: 50,
      filters: {
        flag_in: [
          GenTokFlag.REPORTED,
          GenTokFlag.AUTO_DETECT_COPY,
          GenTokFlag.MALICIOUS,
        ]
      }
    }
  })

  return {
    props: {
      tokens: data.generativeTokens,
    },
    // revalidate: 60
  }
}

export default ReportsPage
