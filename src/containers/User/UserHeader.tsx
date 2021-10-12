import style from "./UserHeader.module.scss"
import layout from "../../styles/Layout.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { User } from "../../types/entities/User"
import { Avatar } from "../../components/User/Avatar"
import { getUserName } from "../../utils/user"
import nl2br from "react-nl2br"


interface Props {
  user: User
}

export function UserHeader({ user }: Props) {
  return (
    <header className={cs(style.container, layout['padding-small'])}>
      <Avatar uri={user.avatarUri} className={cs(style.avatar, effects['drop-shadow-big'])} />
      <div>
        <h1>{ getUserName(user) }</h1>
        <p>{ nl2br(user.description) }</p>
      </div>
    </header>
  )
}