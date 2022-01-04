import style from "./UserHeader.module.scss"
import layout from "../../styles/Layout.module.scss"
import colors from "../../styles/Colors.module.css"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { User } from "../../types/entities/User"
import { Avatar } from "../../components/User/Avatar"
import { getUserName, isAdmin, isModerator, isUserVerified, userAliases } from "../../utils/user"
import nl2br from "react-nl2br"
import { useContext, useMemo } from "react"
import { UserContext } from "../UserProvider"
import Link from "next/link"
import { Button } from "../../components/Button"
import useFetch, { CachePolicies } from "use-http"
import { useTzProfileVerification } from "../../utils/hookts"
import { UserVerification } from "./UserVerification"
import { Spacing } from "../../components/Layout/Spacing"
import { HoverTitle } from "../../components/Utils/HoverTitle"


interface Props {
  user: User
}

export function UserHeader({ user }: Props) {
  user = userAliases(user)
  const userCtx = useContext(UserContext)
  const userConnected = userCtx.user!
  const { tzProfileData, loading } = useTzProfileVerification(user.id)
  const verified = isUserVerified(user)

  return (
    <header className={cs(style.container, layout['padding-small'])}>
      <Avatar uri={user.avatarUri} className={cs(style.avatar, effects['drop-shadow-big'])} />
      <div>
        {user.id && <small className={cs(colors['gray-light'])}>
          <a href={ 'https://tzkt.io/'+ user.id } className={cs(style.tz_link)}>
            {user.id}
          </a>
        </small>}

        <h1 className={cs(style.name, { [style.moderator]: isAdmin(user) })}>
          <span>{ getUserName(user) }</span>
          <HoverTitle
            message="This user was verified by the moderation team"
            className={cs(style.badge)}
          >
            <i className="fas fa-badge-check"/>
          </HoverTitle>
        </h1>

        {(tzProfileData||loading) && (
          <>
            <Spacing size="2x-small"/>
            <UserVerification profile={tzProfileData} loading={loading} />
          </>
        )}
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