import Head from "next/head"
import Link, { LinkProps } from "next/link"
import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import { HTMLAttributes, PropsWithChildren, useMemo } from "react"
import { Spacing } from "../../components/Layout/Spacing"
import { checkIsTabKeyActive, Tabs } from "../../components/Layout/Tabs"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { User } from "../../types/entities/User"
import { truncateEnd } from "../../utils/strings"
import { getUserName, getUserProfileLink } from "../../utils/user"
import { UserHeader } from "./UserHeader"
import { UserFlagBanner } from "./FlagBanner"


type TabWrapperProps = PropsWithChildren<LinkProps> & HTMLAttributes<HTMLAnchorElement>
const TabWrapper = ({ children, ...props }: TabWrapperProps) => (
  <Link {...props}>
    <a className={props.className}>{ children }</a>
  </Link>
)

interface Props {
  user: User
  activeTab: 'creations' | 'articles' | 'collection' | 'on-sale' | 'dashboard',
  hideSectionSpacing?: boolean
}
export function UserProfileLayout({
  user,
  activeTab,
  children,
  hideSectionSpacing
}: PropsWithChildren<Props>) {
  // find the lastest work/item of the user
  const ogImageUrl = useMemo<string|null>(() => {
    let url = null
    if (user.generativeTokens && user.generativeTokens?.length > 0) {
      url = user.generativeTokens[0].metadata.displayUri
    }
    if(!url && user.objkts && user.objkts.length > 0) {
      url = user.objkts[0].metadata?.displayUri
    }
    return (url && ipfsGatewayUrl(url)) || null
  }, [])

  // TABS href are computed using the user profile URL
  const TABS = [
    {
      key: "creations",
      name: "creations",
      props: {
        scroll: false,
        href: `${getUserProfileLink(user)}/creations`
      }
    },
    {
      key: "articles",
      name: "articles",
      props: {
        scroll: false,
        href: `${getUserProfileLink(user)}/articles`
      }
    },
    {
      key: "collection",
      name: "collection",
      props: {
        scroll: false,
        href: `${getUserProfileLink(user)}/collection`
      }
    },
    {
      key: "on-sale",
      name: "on sale",
      props: {
        scroll: false,
        href: `${getUserProfileLink(user)}/sales`
      }
    },
    {
      key: "dashboard",
      name: "dashboard",
      props: {
        scroll: false,
        href: `${getUserProfileLink(user)}/dashboard`,
      }
    },
  ]

  return (
    <>
      <Head>
        <title>fxhash — {getUserName(user)} profile</title>
        <meta key="og:title" property="og:title" content={`fxhash — ${getUserName(user)} profile`}/>
        <meta key="description" property="description" content={truncateEnd(user.metadata?.description || "", 200, "")}/>
        <meta key="og:description" property="og:description" content={truncateEnd(user.metadata?.description || "", 200, "")}/>
        <meta key="og:type" property="og:type" content="website"/>
        <meta key="og:image" property="og:image" content={ogImageUrl || "https://www.fxhash.xyz/images/og/og1.jpg"}/>
      </Head>

      <UserFlagBanner user={user} />

      <Spacing size="6x-large" />

      <UserHeader user={user} />

      <Spacing size="x-large" />

      <Tabs
        tabDefinitions={TABS}
        checkIsTabActive={checkIsTabKeyActive}
        activeIdx={activeTab}
        tabsLayout="fixed-size"
        tabsClassName={cs(layout['padding-big'])}
        tabWrapperComponent={TabWrapper}
      />

      { !hideSectionSpacing && <Spacing size="x-large" /> }

      <section>
        {children}
      </section>

      <Spacing size="6x-large" sm="3x-large" />
      <Spacing size="6x-large" sm="none" />
    </>
  )
}
