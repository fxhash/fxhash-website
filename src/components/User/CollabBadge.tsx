import style from "./CollabBadge.module.scss"
import badgeStyle from "./UserBadge.module.scss"
import cs from "classnames"
import { IProps as IEntityBadgeProps } from "./EntityBadge"
import { Collaboration } from "../../types/entities/User"
import { Avatar } from "./Avatar"
import { useEffect, useMemo, useState } from "react"
import { shuffleArray } from "../../utils/array"
import { UserBadge } from "./UserBadge"
import { getUserName, isUserVerified } from "../../utils/user"

interface Props extends IEntityBadgeProps {
  user: Collaboration
}
export function CollabBadge(props: Props) {
  const {
    user,
    size,
    toggeable = false,
    avatarSide,
    className,
    classNameAvatar,
  } = props
  const [collaborators, setCollaborators] = useState(user.collaborators);
  const [isInitialized, setIsInitialized] = useState(false);

  const [opened, setOpened] = useState<boolean>(false)
  useEffect(() => {
    setCollaborators((stateArray) => shuffleArray(stateArray))
    setIsInitialized(true)
  }, [])
  return (
    <div className={cs(
      style.root,
      style[`size_${size}`],
      style[`side_${avatarSide}`], {
        [style.opened]: opened,
        [style.toggeable]: toggeable,
        [style.hide]: !isInitialized,
      },
      className,
    )}>
      <button
        type="button"
        className={cs(style.avatars)}
        onClick={() => setOpened(!opened)}
        disabled={!toggeable}
      >
        {collaborators.map((user) => (
          <div key={user.id} className={cs(style.avatar_wrapper)}>
            <Avatar
              uri={user.avatarUri}
              className={cs(
                badgeStyle.avatar,
                badgeStyle[`avatar-${size}`],
                style.avatar,
                classNameAvatar,
              )}
            />
            <span className={cs(style.user_name)}>
              <span className={cs(style.user_name_content)}>
                {getUserName(user, 10)}
                {isUserVerified(user) && (
                  <i
                    aria-hidden
                    className={cs("fas", "fa-badge-check", style.verified)}
                  />
                )}
              </span>
            </span>
          </div>
        ))}
        <div
          className={cs(
            badgeStyle.avatar,
            badgeStyle[`avatar-${size}`],
            style.avatar,
            style.avatar_wrapper,
            style.link
          )}
        >
          <span>
            {toggeable ? (
              <>
                <i
                  className={cs(
                    `fa-solid fa-angle-${opened ? "up" : "down"}`,
                    style.caret
                  )}
                  aria-hidden
                />
                <span> collab </span>
              </>
            ) : (
              <i className="fa-solid fa-link" aria-hidden />
            )}
          </span>
        </div>
      </button>

      {toggeable && (
        <div className={cs(style.collaborators)}>
          {collaborators.map((user) => (
            <UserBadge
              key={user.id}
              {...props}
              user={user}
              size="regular"
              className={cs(style.collaborator)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
