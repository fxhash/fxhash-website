import { ConnectedUser } from "../../types/entities/User"
import { getUserProfileLink } from "../../utils/user"

export interface NavigationLinkSingle {
  href: string
  label: string
  key: string
  external?: boolean
}
export interface NavigationLinkSubmenu {
  label: string
  key: string
  subMenu: NavigationLinkSingle[]
}
export type NavigationLink = NavigationLinkSingle | NavigationLinkSubmenu

export const navigationLinks: NavigationLink[] = [
  { href: "/explore", label: "explore", key: "explore" },
  {
    label: "community",
    key: "community",
    subMenu: [
      {
        href: "/community/opening-schedule",
        label: "opening schedule",
        key: "opening-schedule",
      },
      { href: "/community/reports", label: "tokens reported", key: "reports" },
      {
        href: "https://feedback.fxhash.xyz/",
        external: true,
        label: "feedback",
        key: "feedback",
      },
    ],
  },
  { href: "/marketplace", label: "marketplace", key: "marketplace" },
  { href: "/sandbox", label: "sandbox", key: "sandbox" },
  { href: "/doc", label: "doc", key: "doc" },
]

export const getProfileLinks = (user: ConnectedUser) => [
  {
    href: "/mint-generative",
    key: "mint-generative",
    label: "mint generative token",
  },
  {
    href: "/article/editor/local/new",
    key: "article-new",
    label: "mint article",
  },
  { href: `${getUserProfileLink(user)}`, key: "creations", label: "creations" },
  {
    href: `${getUserProfileLink(user)}/articles`,
    key: "articles",
    label: "articles",
  },
  {
    href: `${getUserProfileLink(user)}/collection`,
    key: "collection",
    label: "collection",
  },
  {
    href: `${getUserProfileLink(user)}/dashboard`,
    key: "dashboard",
    label: "dashboard",
  },
  { href: `/collaborations`, key: "collaborations", label: "collaborations" },
  { href: `/edit-profile`, key: "edit-profile", label: "edit profile" },
]
