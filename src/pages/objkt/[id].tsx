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
import { Objkt } from '../../types/entities/Objkt'
import { User } from '../../types/entities/User'


interface Props {
  objkt: Objkt
}

const ObjktDetails: NextPage<Props> = ({ objkt }) => {
  const owner: User = (objkt.offer ? objkt.offer.issuer : objkt.owner)!
  const creator: User = objkt.issuer.author

  return (
    <>
      <Spacing size="6x-large" />

      <section className={cs(style.presentation, layout['padding-big'])}>
        <div className={cs(style['presentation-details'])}>
          <header>
            <h3>{ objkt.name }</h3>
            <Spacing size="x-small"/>
            <UserBadge 
              prependText="created by"
              user={creator}
              size="big"
            />
            <Spacing size="2x-small"/>
            <UserBadge 
              prependText="owned by"
              user={owner}
              size="big"
            />
          </header>

          <Spacing size="large"/>

          <p>{ nl2br(objkt.metadata?.description) }</p>

          <Spacing size="2x-large"/>

          <div className={cs(style['artwork-details'])}>
            {objkt.offer && (
              <>
                <Button
                  color="secondary"
                >
                  collect token - {displayMutez(objkt.offer.price)} tez
                </Button>
                <Spacing size="small"/>
              </>
            )}
            <Link href={`/generative/${objkt.issuer.id}`} passHref>
              <Button
                isLink={true}
              >
                see generative token
              </Button>
            </Link>
          </div>
        </div>

        <div className={cs(style['presentation-artwork'])}>
          <ArtworkPreview ipfsUri={objkt.metadata?.displayUri} />
          <Spacing size="x-small"/>
          <Link href={ipfsDisplayUrl(objkt.metadata?.artifactUri)} passHref>
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
          <h2>— activity ⚡</h2>
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          <div className={cs(style['activity-wrapper'])}>
            <Activity actions={objkt.actions} className={style.activity} />
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
    if (id === 0 || id) {
      const { data, error } = await client.query({
        query: gql`
          query Query($id: Float!) {
            objkt(id: $id) {
              id
              owner {
                id
                name
                avatarUri
              }
              name
              issuer {
                id
                name
                metadata
                author {
                  id
                  name
                  avatarUri
                }
              }
              metadata
              offer {
                id
                price
                issuer {
                  id
                  name
                  avatarUri
                }
              }
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
                  name
                  id
                }
              }
            }
          }
        `,
        fetchPolicy: "no-cache",
        variables: { id }
      })
      if (data) {
        token = data.objkt
      }
    }
  }

  return {
    props: {
      objkt: token,
    },
    notFound: !token
  }
}

export default ObjktDetails