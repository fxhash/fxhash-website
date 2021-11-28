import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'
import layout from '../styles/Layout.module.scss'
import cs from 'classnames'
import Text from '../styles/Text.module.css'
import Colors from '../styles/Colors.module.css'
import client from '../services/ApolloClient'
import { gql } from '@apollo/client'
import { GenerativeToken } from '../types/entities/GenerativeToken'
import { ArtworkPreview } from '../components/Artwork/Preview'
import { Button } from '../components/Button'
import { Spacing } from '../components/Layout/Spacing'
import { MintProgress } from '../components/Artwork/MintProgress'
import { UserBadge } from '../components/User/UserBadge'
import { SectionHeader } from '../components/Layout/SectionHeader'
import { CardsContainer } from '../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../components/Card/GenerativeTokenCard'
import { Offer } from '../types/entities/Offer'
import { ObjktCard } from '../components/Card/ObjktCard'
import nl2br from 'react-nl2br'
import { TitleHyphen } from '../components/Layout/TitleHyphen'
import { PerformanceTimings } from '../utils/performance'
import { getGenerativeTokenUrl } from '../utils/generative-token'


interface Props {
  randomGenerativeToken: GenerativeToken | null
  generativeTokens: GenerativeToken[]
  offers: Offer[]
}

const Home: NextPage<Props> = ({ 
  randomGenerativeToken,
  generativeTokens,
  offers
}) => {
  return (
    <>
      <Head>
        <title>fxhash — home</title>
        <meta key="og:title" property="og:title" content="fxhash — Generative Art on the Blockchain"/> 
        <meta key="description" name="description" content="fxhash is an open platform to mint and collect Generative Tokens on the Tezos blockchain"/>
        <meta key="og:description" property="og:description" content="fxhash is a platform to mint and collect Generative Tokens on the Tezos blockchain"/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content="https://www.fxhash.xyz/images/og/og1.jpg"/>
      </Head>

      <Spacing size="3x-large" />
      <section className={cs(styles.presentation, layout['padding-small'])}>
        <h1 className={cs(Text.h3)}>
          <a href="https://fxhash.xyz/"><span className={cs(Colors.primary)}>fxhash(official beta)</span></a> cloned by <span className={cs(Colors.secondary)}>huang47</span>
        </h1>
      </section>

      <Spacing size="6x-large" />

      {randomGenerativeToken && (
        <>
          <section className={cs(styles['random-artwork'], layout['padding-big'])}>
            <div className={cs(styles['artwork-infos'])}>
              <span className={cs(styles['section-subtitle'], Colors.gray)}>— a random artwork</span>
              <Spacing size="4x-large" />
              <div>
                <h3>{ randomGenerativeToken.name }</h3>
                <Spacing size="x-small"/>
                <UserBadge 
                  user={randomGenerativeToken.author}
                  size="big"
                />
                <Spacing size="x-small"/>

                <div className={cs(styles['artwork-details'])}>
                  <MintProgress
                    balance={randomGenerativeToken.balance}
                    supply={randomGenerativeToken.supply}
                  />

                  <Spacing size="large"/>

                  <p>{nl2br(randomGenerativeToken.metadata.description)}</p>

                  <Spacing size="large"/>

                  <Link href={getGenerativeTokenUrl(randomGenerativeToken)} passHref>
                    <Button 
                      isLink={true}
                      iconComp={<i aria-hidden className="fas fa-eye"/>}
                    >
                      open Generative Token
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className={cs(styles['artwork-container'])}>
              <ArtworkPreview ipfsUri={randomGenerativeToken.metadata?.displayUri} /> 
            </div>
          </section>

          <Spacing size="6x-large" />
          <Spacing size="6x-large" />
        </>
      )}

      <section>
        <SectionHeader>
          <TitleHyphen>recent works</TitleHyphen>
          <Link href="/explore" passHref>
            <Button
              isLink={true}
              iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
              iconSide="right"
            >
              explore
            </Button>
          </Link>
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          <CardsContainer className={cs(styles['row-responsive-limiter'])}>
            {generativeTokens.map(token => (
              <GenerativeTokenCard key={token.id} token={token}/>
            ))}
          </CardsContainer>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <div>
            <small>late to the party ?</small>
            <TitleHyphen>marketplace</TitleHyphen>
          </div>
          <Link href="/marketplace" passHref>
            <Button
              isLink={true}
              iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
              iconSide="right"
            >
              marketplace
            </Button>
          </Link>
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          <CardsContainer className={cs(styles['row-responsive-limiter'])}>
            {offers.map(offer => (
              <ObjktCard key={offer.objkt.id} objkt={offer.objkt}/>
            ))}
          </CardsContainer>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export async function getServerSideProps() {
  const { data } = await client.query({
    query: gql`
      query Query ($skip: Int, $take: Int) {
        randomGenerativeToken {
          id
          name
          slug
          metadata
          metadataUri
          price
          supply
          balance
          enabled
          royalties
          createdAt
          updatedAt
          author {
            id
            name
            avatarUri
            description
          }
        }
        generativeTokens(skip: $skip, take: $take) {
          id
          name
          slug
          metadata
          price
          supply
          balance
          enabled
          royalties
          createdAt
          updatedAt
          author {
            id
            name
            avatarUri
          }
        }
        offers(skip: $skip, take: $take) {
          price
          id
          id
          objkt {
            id
            name
            slug
            metadata
            issuer {
              author {
                id
                name
                avatarUri
              }
            }
            offer {
              id
              price
              issuer {
                id
                name
                avatarUri
              }
            }
            owner {
              id
              name
              avatarUri
            }
          }
        }
      }
    `,
    fetchPolicy: "no-cache",
    variables: {
      skip: 0,
      take: 5,
    }
  })

  return {
    props: {
      randomGenerativeToken: data.randomGenerativeToken,
      generativeTokens: data.generativeTokens,
      offers: data.offers
    },
  }
}

export default Home
