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


interface Props {
  randomGenerativeToken: GenerativeToken
  generativeTokens: GenerativeToken[]
  offers: Offer[]
}

const Home: NextPage<Props> = ({ 
  randomGenerativeToken,
  generativeTokens,
  offers
}) => {
  console.log(offers)
  return (
    <>
      <Spacing size="3x-large" />
      <section className={cs(styles.presentation)}>
        <h1 className={cs(Text.h3)}>
          fxhash is a plateform to <span className={cs(Colors.primary)}>create</span> and <span className={cs(Colors.secondary)}>collect</span> generative NFTs on the tezos blockchain
        </h1>
      </section>

      <Spacing size="6x-large" />

      <section className={cs(styles['random-artwork'], layout['padding-big'])}>
        <div>
          <span className={cs(styles['section-subtitle'], Colors.gray)}>— a random artwork</span>
          <Spacing size="4x-large"/>
          <div>
            <h3>{ randomGenerativeToken.name }</h3>
            <Spacing size="x-small"/>
            <UserBadge 
              user={randomGenerativeToken.author}
              size="big"
            />
            <Spacing size="large"/>

            <div className={cs(styles['artwork-details'])}>
              <MintProgress
                balance={randomGenerativeToken.balance}
                supply={randomGenerativeToken.supply}
              />
              <Spacing size="2x-large"/>
              <Link href="/test" passHref>
                <Button 
                  isLink={true}
                  iconComp={<i aria-hidden className="fas fa-eye"/>}
                >
                  see token
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

      <section>
        <SectionHeader>
          <h2>— recent works</h2>
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
          objkt {
            id
            owner {
              id
              name
              avatarUri
            }
            name
            metadata
          }
        }
      }
    `,
    fetchPolicy: "network-only",
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
