import { gql } from '@apollo/client'
import Link from 'next/link'
import { GetServerSideProps, NextPage } from "next"
import layout from "../../styles/Layout.module.scss"
import style from "../../styles/GenerativeTokenDetails.module.scss"
import homeStyle from "../../styles/Home.module.scss"
import cs from "classnames"
import client from "../../services/ApolloClient"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { ArtworkPreview } from '../../components/Artwork/Preview'
import { Spacing } from '../../components/Layout/Spacing'
import { UserBadge } from '../../components/User/UserBadge'
import { MintProgress } from '../../components/Artwork/MintProgress'
import { Button } from '../../components/Button'
import nl2br from 'react-nl2br'
import { displayMutez } from '../../utils/units'
import { ipfsDisplayUrl } from '../../services/Ipfs'
import { SectionHeader } from '../../components/Layout/SectionHeader'
import { CardsContainer } from '../../components/Card/CardsContainer'
import { ObjktCard } from '../../components/Card/ObjktCard'
import { Activity } from '../../components/Activity/Activity'
import ClientOnly from '../../components/Utils/ClientOnly'
import { EditTokenSnippet } from '../../containers/Token/EditTokenSnippet'
import { UserGuard } from '../../components/Guards/UserGuard'


interface Props {
  token: GenerativeToken
}

const GenerativeTokenDetails: NextPage<Props> = ({ token }) => {
  const hasCollection = token.objkts?.length > 0
  const collectionUrl = `/generative/${token.id}/collection`

  return (
    <>
      <Spacing size="6x-large" />

      <section className={cs(style.presentation, layout['padding-big'])}>
        <div className={cs(style['presentation-details'])}>
          <header>
            <h3>{ token.name }</h3>
            <Spacing size="x-small"/>
            <UserBadge 
              user={token.author}
              size="big"
            />
            <ClientOnly>
              <UserGuard>
                <EditTokenSnippet token={token} />
              </UserGuard>
            </ClientOnly>
          </header>

          <Spacing size="large"/>

          <p>{ nl2br(token.metadata?.description) }</p>

          <Spacing size="2x-large"/>

          <div className={cs(style['artwork-details'])}>
            <MintProgress
              balance={token.balance}
              supply={token.supply}
            />
            <Spacing size="large"/>
            <Button
              color="secondary"
            >
              Mint unique token - {displayMutez(token.price)} tez
            </Button>
          </div>
        </div>

        <div className={cs(style['presentation-artwork'])}>
          <ArtworkPreview ipfsUri={token.metadata?.displayUri} />
          <Spacing size="x-small"/>
          <Link href={ipfsDisplayUrl(token.metadata?.artifactUri)} passHref>
            <Button
              isLink={true}
              size="small"
              iconComp={<i aria-hidden className="fas fa-external-link-alt"></i>}
              // @ts-ignore
              target="_blank"
            >
              open live
            </Button>
          </Link>
        </div>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <h2>— Latest tokens minted</h2>
          {hasCollection && (
            <Link href={collectionUrl}>
              <a>view entire collection &gt;</a>
            </Link>
          )}
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          {hasCollection ? (
            <>
              <CardsContainer className={cs(homeStyle['row-responsive-limiter'])}>
                {token.objkts.slice(0, 5).map(objkt => (
                  <ObjktCard key={objkt.id} objkt={objkt}/>
                ))}
              </CardsContainer>
              <Spacing size="4x-large"/>
              <div className={cs(style['view-collection-container'])}>
                <Link href={collectionUrl} passHref>
                  <Button isLink={true}>view entire collection</Button>
                </Link>
              </div>
            </>
          ):(
            <>
              <p>Nobody has minted from this Generative Token. <strong>Become the first of the collection !</strong></p>
            </>
          )}
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <h2>— Recent activity ⚡</h2>
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          <div className={cs(style['activity-wrapper'])}>
            <Activity actions={token.actions} className={style.activity} />
          </div>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const idStr = context.params?.id
  let token = null

  if (idStr) {
    const id = parseInt(idStr as string)
    if (id) {
      const { data, error } = await client.query({
        query: gql`
          query Query($id: Float!) {
            generativeToken(id: $id) {
              id
              name
              metadata
              metadataUri
              price
              supply
              balance
              enabled
              royalties
              objkts {
                id
                owner {
                  id
                  name
                  avatarUri
                }
                name
                metadata
                offer {
                  issuer {
                    id
                    name
                    avatarUri
                  }
                  price
                }
              }
              createdAt
              updatedAt
              actions {
                id
                type
                metadata
                createdAt
                issuer {
                  id
                  name
                  avatarUri
                }
                target {
                  id
                  name
                  avatarUri
                }
                objkt {
                  id
                  name
                }
                token {
                  id
                  name
                }
              }
              author {
                id
                name
                avatarUri
              }
            }
          }
        `,
        fetchPolicy: "no-cache",
        variables: { id }
      })
      if (data) {
        token = data.generativeToken
      }
    }
  }

  return {
    props: {
      token: token,
    },
    notFound: !token
  }
}

export default GenerativeTokenDetails