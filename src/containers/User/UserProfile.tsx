import style from "./UserProfile.module.scss"
import cs from "classnames"
import { User } from "../../types/entities/User"
import { UserHeader } from "./UserHeader"
import ClientOnly from "../../components/Utils/ClientOnly"
import { UserItems } from "./UserItems"
import { Spacing } from "../../components/Layout/Spacing"
import { BrowserRouter as Router, Switch, Route, Link, LinkProps, useRouteMatch } from "react-router-dom"
import { getUserProfileLink } from "../../utils/user"


interface Props {
  user: User
}

export function UserProfile({ user }: Props) {
  return (
    <>
      <UserHeader user={user} />

      <Spacing size="x-large"/>

      <ClientOnly>
        <Router basename={getUserProfileLink(user)}>
          <UserItems user={user} />
        </Router>
      </ClientOnly>
    </>
  )
}