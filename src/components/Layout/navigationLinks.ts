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
  href?: string
}
export type NavigationLink = NavigationLinkSingle | NavigationLinkSubmenu

export const navigationLinks: NavigationLink[] = [
  { href: "/explore", label: "explore", key: "explore" },
  {
    href: "/articles",
    label: "fx(text)",
    key: "articles",
  },
  { href: "/marketplace", label: "marketplace", key: "marketplace" },
  { href: "/sandbox", label: "sandbox", key: "sandbox" },
  { href: "/doc", label: "doc", key: "doc" },
]

export const getProfileLinks = (user: ConnectedUser): NavigationLink[] => [
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
  {
    label: "Profile",
    key: "profile",
    href: `${getUserProfileLink(user)}`,
    subMenu: [
      {
        href: `${getUserProfileLink(user)}`,
        key: "creations",
        label: "creations",
      },
      {
        href: `/collaborations`,
        key: "collaborations",
        label: "collaborations",
      },

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
        href: `${getUserProfileLink(user)}/dashboard/`,
        key: "sales",
        label: "sales",
      },
      {
        href: `${getUserProfileLink(user)}/dashboard/offers-received`,
        key: "offers",
        label: "offers",
      },
    ],
  },
]
