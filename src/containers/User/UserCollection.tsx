import { useQuery } from "@apollo/client"
import style from "./UserCollection.module.scss"
import styleCardsExplorer from "../../components/Exploration/CardsExplorer.module.scss"
import styleSearch from "../../components/Input/SearchInput.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import Link, { LinkProps } from "next/link"
import { useRef, useEffect, useState, useMemo, PropsWithChildren, HTMLAttributes } from "react"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { InfiniteScrollTrigger } from "../../components/Utils/InfiniteScrollTrigger"
import { Qu_userObjkts, Qu_userArticlesOwned } from "../../queries/user"
import { Objkt } from "../../types/entities/Objkt"
import { User, IUserCollectionFilters } from "../../types/entities/User"
import { Spacing } from "../../components/Layout/Spacing"
import { Button } from "../../components/Button"
import { getUserProfileLink } from "../../utils/user"
import { CardsExplorer } from "../../components/Exploration/CardsExplorer"
import { SearchHeader } from "../../components/Search/SearchHeader"
import { IOptions, Select } from "../../components/Input/Select"
import { SearchInputControlled } from "../../components/Input/SearchInputControlled"
import { FiltersPanel } from "../../components/Exploration/FiltersPanel"
import { ExploreTagDef, ExploreTags } from "../../components/Exploration/ExploreTags"
import { UserCollectionFilters } from "./UserCollectionFilters"
import { CardsLoading } from "../../components/Card/CardsLoading"
import { checkIsTabKeyActive, Tabs } from "../../components/Layout/Tabs"
import { NFTArticlesOwned } from '../../types/entities/Article'
import { CardNftArticle } from "../../components/Card/CardNFTArticle";
import { CardNftArticleSkeleton } from "../../components/Card/CardNFTArticleSkeleton";

type TabWrapperProps = PropsWithChildren<LinkProps> & HTMLAttributes<HTMLAnchorElement>
const TabWrapper = ({ children, ...props }: TabWrapperProps) => (
  <Link {...props}>
    <a className={props.className}>{ children }</a>
  </Link>
)

const ITEMS_PER_PAGE = 20

const generalSortOptions: IOptions[] = [
  {
    label: "recently minted",
    value: "id-desc"
  },
  {
    label: "oldest minted",
    value: "id-asc"
  },
  {
    label: "recently bought",
    value: "collectedAt-desc",
  },
  {
    label: "rarity (rarest first)",
    value: "rarity-asc",
  },
  {
    label: "rarity (rarest last)",
    value: "rarity-desc",
  },
]

const searchSortOptions: IOptions[] = [
  {
    label: "search relevance",
    value: "relevance-desc",
  },
  ...generalSortOptions
]

function sortValueToSortVariable(val: string) {
  if (val === "pertinence") return {}
  const split = val.split("-")
  return {
    [split[0]]: split[1].toUpperCase()
  }
}

interface Props {
  user: User,
  activeTab: 'gentk' | 'articles'
}
export function UserCollection({
  user,
  activeTab,
}: Props) {
  // sort variables
  const [sortValue, setSortValue] = useState<string>("id-desc")
  const sort = useMemo<Record<string, any>>(() => sortValueToSortVariable(sortValue), [sortValue])
  // sort options - when the search is triggered, options are updated to include relevance
  const [sortOptions, setSortOptions] = useState<IOptions[]>(generalSortOptions)
  // keeps track of the search option used before the search was triggered
  const sortBeforeSearch = useRef<string>(sortValue)

  // effect to update the sortBeforeSearch value whenever a sort changes
  useEffect(() => {
    if (sortValue !== "relevance-desc") {
      sortBeforeSearch.current = sortValue
    }
  }, [sortValue])

  // filters
  const [filters, setFilters] = useState<IUserCollectionFilters>({})

  // reference to an element at the top to scroll back
  const topMarkerRef = useRef<HTMLDivElement>(null)

  // use to know when to stop loading
  const currentLength = useRef<number>(0)
  const ended = useRef<boolean>(false)

  const { data, loading, fetchMore, refetch } = useQuery(Qu_userObjkts, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
      skip: 0,
      take: ITEMS_PER_PAGE,
      filters,
      sort,
    },
  })

  const { data: dataArticlesOwned, loading: loadingArticlesOwned } = useQuery(Qu_userArticlesOwned, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: user.id,
    },
  })

  // safe access to gentks
  const objkts: Objkt[] = data?.user?.objkts || null
  const articlesOwned: NFTArticlesOwned[] = dataArticlesOwned?.user?.articlesOwned || null

  useEffect(() => {
    if (!loading) {
      if (currentLength.current === objkts?.length) {
        ended.current = true
      }
      else {
        currentLength.current = objkts?.length
      }
    }
  }, [data, loading])

  const load = () => {
    if (!ended.current) {
      fetchMore({
        variables: {
          skip: objkts?.length || 0,
          take: ITEMS_PER_PAGE
        }
      })
    }
  }

  useEffect(() => {
    // first we scroll to the top
    const top = (topMarkerRef.current?.offsetTop || 0) + 20
    if (window.scrollY > top + 10) {
      window.scrollTo(0, top)
    }

    currentLength.current = 0
    ended.current = false
    refetch?.({
      skip: 0,
      take: ITEMS_PER_PAGE,
      sort,
      filters,
    })
  }, [sort, filters])

  const addFilter = (filter: string, value: any) => {
    setFilters({
      ...filters,
      [filter]: value
    })
  }

  const removeFilter = (filter: string) => {
    addFilter(filter, undefined)
    // if the filter is search string, we reset the sort to what ti was
    if (filter === "searchQuery_eq" && sortValue === "relevance-desc") {
      setSortValue(sortBeforeSearch.current)
      setSortOptions(generalSortOptions)
    }
  }

  // build the list of filters
  const filterTags = useMemo<ExploreTagDef[]>(() => {
    const tags: ExploreTagDef[] = []
    for (const key in filters) {
      let value: string|null = null
      // @ts-ignore
      if (filters[key] !== undefined) {
        switch (key) {
          case "assigned_eq":
            //@ts-ignore
            value = `metadata assigned: ${filters[key] ? "yes" : "no"} tez`
            break
          case "authorVerified_eq":
            //@ts-ignore
            value = `artist: ${filters[key] ? "verified" : "un-verified"}`
            break
          case "mintProgress_eq":
            //@ts-ignore
            value = `mint progress: ${filters[key]?.toLowerCase()}`
            break
          case "searchQuery_eq":
            //@ts-ignore
            value = `search: ${filters[key]}`
            break
          case "author_in":
            //@ts-ignore
            value = `artists: (${filters[key].length})`
            break
          case "issuer_in":
            //@ts-ignore
            value = `generators: (${filters[key].length})`
            break
        }
        if (value) {
          tags.push({
            value,
            onClear: () => removeFilter(key)
          })
        }
      }
    }
    return tags
  }, [filters])

  // TABS href are computed using the user profile URL
  const TABS = [
    {
      key: "gentk",
      name: "gentk",
      props: {
        scroll: false,
        href: `${getUserProfileLink(user)}/collection/`
      }
    },
    {
      key: "articles",
      name: "articles",
      props: {
        scroll: false,
        href: `${getUserProfileLink(user)}/collection/articles/`
      }
    },
  ]


  
  return (
    <>
      <Spacing size="2x-small"/>

      <Tabs
        tabDefinitions={TABS}
        checkIsTabActive={checkIsTabKeyActive}
        activeIdx={activeTab}
        tabsLayout="subtabs-vertical"
        tabsClassName={cs(layout['padding-big'])}
        tabWrapperComponent={TabWrapper}
      />

      <CardsExplorer>
        {({
          filtersVisible,
          setFiltersVisible,
          refCardsContainer,
          inViewCardsContainer,
          setIsSearchMinimized,
          isSearchMinimized,
        }) => (
          <>
	    {activeTab === "gentk" && 
	      <>
		<div ref={topMarkerRef}/>

		<SearchHeader
		  hasFilters
		  filtersOpened={filtersVisible}
		  showFiltersOnMobile={inViewCardsContainer}
		  onToggleFilters={() => setFiltersVisible(!filtersVisible)}
		  sortSelectComp={
		    <div className={style.select_comp_container}>
		      <Link href={`${getUserProfileLink(user)}/collection/enjoy`} passHref>
			<Button
			  isLink={true}
			  iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
			  size="regular"
			  iconSide={null}
			/>
		      </Link>
		      <Select
			classNameRoot={cs({
			  [styleCardsExplorer['hide-sort']]: !isSearchMinimized
			})}
			value={sortValue}
			options={sortOptions}
			onChange={setSortValue}
		      />
		    </div>
		  }
		>
		  <SearchInputControlled
		    minimizeOnMobile
		    onMinimize={setIsSearchMinimized}
		    onSearch={(value) => {
		      if (value) {
			setSortOptions(searchSortOptions)
			setSortValue("relevance-desc")
			addFilter("searchQuery_eq", value)
		      }
		      else {
			removeFilter("searchQuery_eq")
			setSortOptions(generalSortOptions)
			if (sortValue === "relevance-desc") {
			  setSortValue(sortBeforeSearch.current)
			}
		      }
		    }}
		    className={styleSearch.large_search}
		  />
		</SearchHeader>

		<div className={cs(layout.cards_explorer, layout['padding-big'])}>
		  {filtersVisible && (
		    <FiltersPanel onClose={() => setFiltersVisible(false)}>
		      <UserCollectionFilters
			user={user}
			filters={filters}
			setFilters={setFilters}
		      />
		    </FiltersPanel>
		  )}

		  <div style={{width: "100%"}}>
		    {filterTags.length > 0 && (
		      <>
			<ExploreTags
			  terms={filterTags}
			  onClearAll={() => {
			    setFilters({})
			    setSortOptions(generalSortOptions)
			    setSortValue(sortBeforeSearch.current)
			  }}
			/>
			<Spacing size="regular"/>
		      </>
		    )}

		    {!loading && objkts?.length === 0 && (
		      <span>No results</span>
		    )}
		    <InfiniteScrollTrigger
		      onTrigger={load}
		    >
		      <CardsContainer ref={refCardsContainer}>
			{objkts?.map(objkt => (
			  <ObjktCard
			    key={objkt.id}
			    objkt={objkt}
			    showOwner={false}
			    showRarity={sort.rarity != null}
			  />
			))}
			{loading && (
			  <CardsLoading number={ITEMS_PER_PAGE} />
			)}
		      </CardsContainer>
		    </InfiniteScrollTrigger>
              </div>
	      </div>
	      </>
	    }
          </>
        )}
      </CardsExplorer>
      { activeTab === "articles" &&
	<div className={cs(style.article_container, layout['padding-big'])}>
	  {articlesOwned?.map(({ article }, index) =>
	    <CardNftArticle className={style.article} key={article.slug} article={article} imagePriority={index < 4} />
	  )}
	  {loadingArticlesOwned &&
	    [...Array(20)].map((_, idx) =>
	      <CardNftArticleSkeleton className={style.article} key={idx} />
	    )
	  }
	</div>
      }
    </>
  )
}
