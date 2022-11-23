import style from "./ArticleQuickCollect.module.scss"
import cs from "classnames"
import { NFTArticle } from "../../../types/entities/Article"
import { useQuery } from "@apollo/client"
import { Qu_articleListingsById } from "../../../queries/articles"
import { useContext, useMemo } from "react"
import { Listing } from "../../../types/entities/Listing"
import { UserContext } from "../../UserProvider"
import { ArticleQuickCollectionAction } from "./ArticleQuickCollectAction"
import { Spacing } from "../../../components/Layout/Spacing"

interface ChildrenProps {
  collectAction: JSX.Element | null
}

interface Props {
  article: NFTArticle
  children: (props: ChildrenProps) => JSX.Element
}
export function ArticleQuickCollect({ article, children }: Props) {
  const { user } = useContext(UserContext)
  // check if we need to render a CTA (if possible by availability)
  const { data, loading } = useQuery(Qu_articleListingsById, {
    variables: {
      id: article.id,
    },
  })

  const listingHighlight = useMemo<Listing | null>(() => {
    if (data?.article?.activeListings) {
      let listings: Listing[] = data.article.activeListings
      if (listings?.length === 0) return null
      // first filter the listings from the author, if any we only get those
      const fromAuthor = listings.filter(
        (listing) => listing.issuer.id === article.author!.id
      )
      if (fromAuthor.length > 0) listings = fromAuthor
      // sort the listings by price
      listings = [...listings].sort((a, b) => a.price - b.price)
      return listings.length > 0 ? listings[0] : null
    }
    return null
  }, [data])

  // we hide the quick listing if it's from the user connected
  const listing = useMemo(() => {
    if (listingHighlight?.issuer.id === user?.id) return null
    return listingHighlight
  }, [listingHighlight])

  // if no listing, component just voids
  if (!listing) {
    return null
  }

  // otherwise we display the collect action
  return children({
    collectAction: (
      <>
        <ArticleQuickCollectionAction article={article} listing={listing} />
      </>
    ),
  })
}
