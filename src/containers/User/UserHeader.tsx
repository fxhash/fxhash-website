import style from "./UserHeader.module.scss"
import layout from "../../styles/Layout.module.scss"
import effects from "../../styles/Effects.module.scss"
import cs from "classnames"
import { User } from "../../types/entities/User"
import { Avatar } from "../../components/User/Avatar"
import {
  getUserName,
  isPlatformOwned,
  isUserModerator,
  isUserVerified,
  userAliases,
} from "../../utils/user"
import nl2br from "react-nl2br"
import { useContext } from "react"
import { UserContext } from "../UserProvider"
import Link from "next/link"
import { Button } from "../../components/Button"
import { useTzProfileVerification } from "../../utils/hookts"
import { UserVerification } from "./UserVerification"
import { HoverTitle } from "../../components/Utils/HoverTitle"
import { UserModeration } from "./UserModeration"

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
    <header className={cs(style.container, layout["padding-big"])}>
      <Avatar
        image={user.avatarMedia}
        uri={user.avatarUri}
        className={cs(style.avatar, effects["drop-shadow-big"])}
      />
      <div className={cs(style.infos)}>
        {user.id && (
          <a href={"https://tzkt.io/" + user.id} className={cs(style.tz_link)}>
            {user.id}
          </a>
        )}

        <h1
          className={cs(style.name, {
            [style.moderator]: isPlatformOwned(user),
          })}
        >
          <span>{getUserName(user)}</span>
          {verified && (
            <HoverTitle
              message="This user was verified by the moderation team"
              className={cs(style.badge)}
            >
              <i aria-hidden className="fas fa-badge-check" />
            </HoverTitle>
          )}
        </h1>

        {(tzProfileData || loading) && (
          <div className={style.container_verification}>
            <UserVerification profile={tzProfileData} loading={loading} />
          </div>
        )}
        <p>{nl2br(user.description)}</p>
        {userConnected &&
          (isUserModerator(userConnected as User) ||
            userConnected.id === user.id) && (
            <div
              className={cs(
                layout["x-inline"],
                layout.flex_wrap,
                style.buttons
              )}
            >
              {userConnected.id === user.id && (
                <Link href="/edit-profile" passHref>
                  <Button className={style.button_edit} isLink size="small">
                    edit profile
                  </Button>
                </Link>
              )}
              <UserModeration user={user} />
            </div>
          )}
      </div>
    </header>
  )
}
