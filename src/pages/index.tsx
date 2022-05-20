import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'
import layout from '../styles/Layout.module.scss'
import cs from 'classnames'
import Colors from '../styles/Colors.module.css'
import client from '../services/ApolloClient'
import { gql } from '@apollo/client'
import { GenerativeToken, GenerativeTokenFilters, GenTokFlag } from '../types/entities/GenerativeToken'
import { ArtworkPreview } from '../components/Artwork/Preview'
import { Button } from '../components/Button'
import { Spacing } from '../components/Layout/Spacing'
import { MintProgress } from '../components/Artwork/MintProgress'
import { UserBadge } from '../components/User/UserBadge'
import { SectionHeader } from '../components/Layout/SectionHeader'
import { CardsContainer } from '../components/Card/CardsContainer'
import { GenerativeTokenCard } from '../components/Card/GenerativeTokenCard'
import { Listing } from '../types/entities/Listing'
import { ObjktCard } from '../components/Card/ObjktCard'
import nl2br from 'react-nl2br'
import { TitleHyphen } from '../components/Layout/TitleHyphen'
import { getGenerativeTokenUrl } from '../utils/generative-token'
import { useContext } from 'react'
import { SettingsContext } from '../context/Theme'
import { PresentationHeader } from '../containers/Home/PresentationHeader'
import { Frag_GenAuthor, Frag_GenPricing } from '../queries/fragments/generative-token'


interface Props {
  randomGenerativeToken: GenerativeToken | null
  generativeTokens: GenerativeToken[]
  listings: Listing[]
}

const Home: NextPage<Props> = ({
  randomGenerativeToken,
  generativeTokens,
  listings
}) => {
  const settings = useContext(SettingsContext)

  const linkMarketPlace = (
    <Link href="/marketplace" passHref>
      <Button
        isLink={true}
        iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
        iconSide="right"
        color="transparent"
      >
        marketplace
      </Button>
    </Link>
  );
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

      <section className={cs(layout['padding-big'])}>
        <PresentationHeader/>
      </section>

      <Spacing size="6x-large" />

      {randomGenerativeToken && (
        <>
          <section className={cs(styles['random-artwork'], layout['padding-big'], layout.break_words)}>
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
                  <div className={cs(styles.mint_progress)}>
                    <MintProgress
                      token={randomGenerativeToken}
                    />
                  </div>

                  <Spacing size="2x-large"/>

                  <Link href={getGenerativeTokenUrl(randomGenerativeToken)} passHref>
                    <Button
                      isLink={true}
                      size="regular"
                    >
                      open project
                    </Button>
                  </Link>

                  <Spacing size="large"/>

                  <p>{nl2br(randomGenerativeToken.metadata.description)}</p>
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
        <SectionHeader className={cs(styles.section_header)}>
          <TitleHyphen>recent works</TitleHyphen>
          <Link href="/explore" passHref>
            <Button
              isLink={true}
              iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
              iconSide="right"
              color="transparent"
            >
              explore
            </Button>
          </Link>
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          <CardsContainer className={cs(styles['row-responsive-limiter'])}>
            {generativeTokens.map(token => (
              <GenerativeTokenCard
                key={token.id}
                token={token}
                displayPrice={settings.displayPricesCard}
                displayDetails={settings.displayInfosGenerativeCard}
              />
            ))}
          </CardsContainer>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" sm="none" />

      <section>
        <SectionHeader className={cs(styles.section_header)}>
          <div>
            <small>late to the party ?</small>
            <TitleHyphen>marketplace</TitleHyphen>
          </div>
          <div className={styles.section_header_marketplace}>
            {linkMarketPlace}
          </div>
        </SectionHeader>
        <div className={styles.section_header_marketplace_mobile}>
          {linkMarketPlace}
        </div>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          <CardsContainer className={cs(styles['row-responsive-limiter'])}>
            {listings.map(listing => (
              <ObjktCard key={listing.objkt.id} objkt={listing.objkt}/>
            ))}
          </CardsContainer>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" sm="none" />
      <Spacing size="6x-large" sm="none" />
    </>
  )
}

export async function getServerSideProps() {
  interface IQueryVariables {
    skip: number
    take: number
    filters: GenerativeTokenFilters
  }

  const { data, error } = await client.query<any, IQueryVariables>({
    query: gql`
      ${Frag_GenAuthor}
      ${Frag_GenPricing}
      query Query ($skip: Int, $take: Int, $filters: GenerativeTokenFilter) {
        randomGenerativeToken {
          id
          name
          slug
          metadata
          metadataUri
          ...Pricing
          supply
          originalSupply
          balance
          enabled
          royalties
          createdAt
          ...Author
        }
        generativeTokens(skip: $skip, take: $take, filters: $filters) {
          id
          name
          slug
          thumbnailUri
          ...Pricing
          supply
          originalSupply
          balance
          enabled
          royalties
          createdAt
          ...Author
        }
        listings(skip: $skip, take: $take) {
          id
          price
          objkt {
            id
            name
            slug
            metadata
            issuer {
              ...Author
            }
            owner {
              id
              name
              flag
              avatarUri
            }
            activeListing {
              id
              price
            }
          }
        }
      }
    `,
    fetchPolicy: "no-cache",
    variables: {
      skip: 0,
      take: 5,
      filters: {
        mintOpened_eq: true,
        flag_in: [
          GenTokFlag.CLEAN,
          GenTokFlag.NONE,
        ]
      }
    }
  })

  return {
    props: {
      randomGenerativeToken: data.randomGenerativeToken,
      generativeTokens: data.generativeTokens,
      listings: data.listings
    },
  }
}

export default Home
