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
import { ObjktCard } from "../../components/Card/ObjktCard";
import { UserBadgeLoading } from "../../components/User/UserBadgeLoading";
import { CardsLoading } from "../../components/Card/CardsLoading";
import { CardNftArticleSkeleton } from "../../components/Card/CardNFTArticleSkeleton";

interface Sample<T extends keyof SearchQuery> {
  dataKey: T
  title: string
  hrefExploreMore: string
  render: (
    data: SearchQuery[T],
    showMoreResults: boolean,
    loading: boolean,
    settings: ISettingsContext
  ) => any
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
    render: (users, showMoreResults, loading) =>
      users.length > 0 && (
        <div className={style.container_gallery}>
          <CardsContainer
            className={cs(style.gallery_users, {
              [style["gallery_users--one-row"]]: !showMoreResults,
            })}
            emptyDivs={users.length >= 8 ? 0 : undefined}
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
      ),
  }),
  gentk: makeSample<"generativeTokens">({
    dataKey: "generativeTokens",
    title: "Generative Tokens",
    hrefExploreMore: "/search/gentk",
    render: (gentks, showMoreResults, loading, settings) =>
      gentks.length > 0 && (
        <div className={style.container_gallery}>
          <CardsContainer
            className={cs({
              [style["gallery_gentk--one-row"]]: !showMoreResults,
            })}
            emptyDivs={gentks.length >= 8 ? 0 : undefined}
          >
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
      ),
  }),
  articles: makeSample<"articles">({
    dataKey: "articles",
    title: "Articles",
    hrefExploreMore: "/search/articles",
    render: (articles, showMoreResults, loading) => {
      const displayedArticles = showMoreResults
        ? articles
        : articles.slice(0, 4)
      return (
        displayedArticles.length > 0 && (
          <div className={style.container_gallery}>
            <CardsContainer className={style.gallery_articles} emptyDivs={0}>
              {displayedArticles.map((article, index) => (
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
    render: (listings, showMoreResults, loading) => {
      return (
        listings.length > 0 && (
          <div className={style.container_gallery}>
            <CardsContainer
              className={cs({
                [style["gallery_marketplace--one-row"]]: !showMoreResults,
              })}
              emptyDivs={listings.length >= 8 ? 0 : undefined}
            >
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
