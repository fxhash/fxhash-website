import style from "./UserHeader.module.scss"
import layout from "../../styles/Layout.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { User } from "../../types/entities/User"
import { Avatar } from "../../components/User/Avatar"
import { getUserName } from "../../utils/user"
import nl2br from "react-nl2br"
import { useContext } from "react"
import { UserContext } from "../UserProvider"
import Link from "next/link"
import { Button } from "../../components/Button"


interface Props {
  user: User
}

export function UserHeader({ user }: Props) {
  const userCtx = useContext(UserContext)
  const userConnected = userCtx.user!

  return (
    <header className={cs(style.container, layout['padding-small'])}>
      <Avatar uri={user.avatarUri} className={cs(style.avatar, effects['drop-shadow-big'])} />
      <div>
        <h1>{ getUserName(user) }</h1>
        <p>{ nl2br(user.description) }</p>
        {userConnected && userConnected.id === user.id && (
          <div style={{
            display: "inline-block"
          }}>
            <Link href="/edit-profile" passHref>
              <Button
                isLink
                style={{
                  alignSelf: "flex-start"
                }}
                size="small"
              >
                edit profile
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}