import type { NextPage } from 'next'
import Link from 'next/link'
import styles from '../styles/Home.module.scss'
import layout from '../styles/Layout.module.scss'
import cs from 'classnames'
import Text from '../styles/Text.module.css'
import Colors from '../styles/Colors.module.css'
import client from '../services/ApolloClient'
import { gql, useQuery } from '@apollo/client'
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
import { useEffect } from 'react'
import ClientOnly from '../components/Utils/ClientOnly'
import { ExploreGenerativeTokens } from '../containers/ExploreGenerativeTokens'



const Explore: NextPage = () => {
  return (
    <>
      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <h2>— explore artists' work</h2>
        </SectionHeader>

        <Spacing size="3x-large"/>

        <main className={cs(layout['padding-big'])}>
          <ClientOnly>
            <ExploreGenerativeTokens />
          </ClientOnly>
        </main>
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export default Explore
