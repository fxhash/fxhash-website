import { SearchTabKey } from "./PageSearch"
import style from "./SearchSummary.module.scss"
import { CardsContainer } from "../../components/Card/CardsContainer"
import cs from "classnames"
import { UserBadge } from "../../components/User/UserBadge"
import React from "react"
import { ITEMS_PER_PAGE, SearchQuery } from "./SearchSummary"
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard"
import { ISettingsContext } from "../../context/Theme"
import { CardNftArticle } from "../../components/Card/CardNFTArticle"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { UserBadgeLoading } from "../../components/User/UserBadgeLoading"
import { CardsLoading } from "../../components/Card/CardsLoading"
import { CardNftArticleSkeleton } from "../../components/Card/CardNFTArticleSkeleton"
import { breakpoints } from "../../hooks/useWindowsSize"

interface Sample<T extends keyof SearchQuery> {
  dataKey: T
  title: string
  hrefExploreMore: string
  classNameContainerMaxHeight: string
  render: (props: {
    data: SearchQuery[T]
    showMoreResults: boolean
    loading: boolean
    windowWidth: number
    settings: ISettingsContext
  }) => any
}
// ts shenanigans
function makeSample<T extends keyof SearchQuery>(obj: Sample<T>): Sample<T> {
  return obj
}
export const samples: Record<Exclude<SearchTabKey, "summary">, Sample<any>> = {
  users: makeSample<"users">({
    dataKey: "users",
    title: "Users",
    hrefExploreMore: "/search/users",
    classNameContainerMaxHeight: style["gallery_users--one-row"],
    render: ({ data: users, windowWidth, loading }) => {
      const getEmptyDivsNb = () => {
        if (users.length >= 8 || windowWidth <= breakpoints.sm) {
          return 0
        }
        if (windowWidth <= breakpoints.md) {
          return 3
        }
        return undefined
      }
      const emptyDivs = getEmptyDivsNb()
      return (
        users.length > 0 && (
          <div className={style.container_gallery}>
            <CardsContainer
              className={cs(style.gallery_users)}
              emptyDivs={emptyDivs}
            >
              {users.map((user) => (
                <UserBadge
                  hasLink
                  key={user.id}
                  avatarSide="top"
                  size="xl"
                  user={user}
                />
              ))}
              {loading && (
                <UserBadgeLoading
                  avatarSide="top"
                  number={ITEMS_PER_PAGE}
                  size="xl"
                />
              )}
            </CardsContainer>
          </div>
        )
      )
    },
  }),
  gentk: makeSample<"generativeTokens">({
    dataKey: "generativeTokens",
    title: "Generative Tokens",
    hrefExploreMore: "/search/gentk",
    classNameContainerMaxHeight: style["gallery_gentk--one-row"],
    render: ({ data: gentks, windowWidth, loading, settings }) => {
      const getEmptyDivsNb = () => {
        if (gentks.length >= 8 || windowWidth <= breakpoints.sm) {
          return 0
        }
        if (windowWidth <= breakpoints.md) {
          return 1
        }
        if (windowWidth <= breakpoints.lg) {
          return 2
        }
        if (windowWidth <= breakpoints.vlg) {
          return 3
        }
        return undefined
      }
      const emptyDivs = getEmptyDivsNb()
      return (
        gentks.length > 0 && (
          <div className={style.container_gallery}>
            <CardsContainer emptyDivs={emptyDivs}>
              {gentks.map((token) => (
                <GenerativeTokenCard
                  key={token.id}
                  token={token}
                  displayPrice={settings.displayPricesCard}
                  displayDetails={settings.displayInfosGenerativeCard}
                />
              ))}
              {loading && <CardsLoading number={ITEMS_PER_PAGE} />}
            </CardsContainer>
          </div>
        )
      )
    },
  }),
  articles: makeSample<"articles">({
    dataKey: "articles",
    title: "Articles",
    hrefExploreMore: "/search/articles",
    classNameContainerMaxHeight: style["gallery_articles--limit"],
    render: ({ data: articles, loading }) => {
      return (
        articles.length > 0 && (
          <div className={style.container_gallery}>
            <CardsContainer className={style.gallery_articles} emptyDivs={0}>
              {articles.map((article, index) => (
                <CardNftArticle
                  key={article.id}
                  article={article}
                  imagePriority={index < 4}
                />
              ))}
              {loading &&
                [...Array(ITEMS_PER_PAGE)].map((_, idx) => (
                  <CardNftArticleSkeleton className={style.article} key={idx} />
                ))}
            </CardsContainer>
          </div>
        )
      )
    },
  }),
  marketplace: makeSample<"listings">({
    dataKey: "listings",
    title: "Marketplace",
    hrefExploreMore: "/search/marketplace",
    classNameContainerMaxHeight: style["gallery_marketplace--one-row"],
    render: ({ data: listings, windowWidth, loading }) => {
      const getEmptyDivsNb = () => {
        if (listings.length >= 8 || windowWidth <= breakpoints.sm) {
          return 0
        }
        if (windowWidth <= breakpoints.md) {
          return 1
        }
        if (windowWidth <= breakpoints.lg) {
          return 2
        }
        if (windowWidth <= breakpoints.vlg) {
          return 3
        }
        return undefined
      }
      const emptyDivs = getEmptyDivsNb()
      return (
        listings.length > 0 && (
          <div className={style.container_gallery}>
            <CardsContainer emptyDivs={emptyDivs}>
              {listings &&
                listings.map((offer) => (
                  <ObjktCard key={offer.id} objkt={offer.objkt} />
                ))}
              {loading && <CardsLoading number={ITEMS_PER_PAGE} />}
            </CardsContainer>
          </div>
        )
      )
    },
  }),
}
