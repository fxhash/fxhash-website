import Head from "next/head"
import Link, { LinkProps } from "next/link"
import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import { HTMLAttributes, PropsWithChildren, useMemo } from "react"
import { Spacing } from "../../components/Layout/Spacing"
import { Tabs } from "../../components/Layout/Tabs"
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
  tabIndex: number
}
export function UserProfileLayout({ 
  user,
  tabIndex, 
  children
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
      name: "creations",
      props: {
        href: getUserProfileLink(user)
      }
    },
    {
      name: "collection",
      props: {
        href: `${getUserProfileLink(user)}/collection`
      }
    },
    {
      name: "on sale",
      props: {
        href: `${getUserProfileLink(user)}/sales`
      }
    },
    {
      name: "activity",
      props: {
        href: `${getUserProfileLink(user)}/activity`
      }
    }
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
        activeIdx={tabIndex}
        tabsLayout="fixed-size"
        tabsClassName={cs(layout['padding-big'])}
        tabWrapperComponent={TabWrapper}
      />

      <Spacing size="x-large" />

      <section>
        {children}
      </section>

      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}