import style from "./CollabBadge.module.scss"
import badgeStyle from "./UserBadge.module.scss"
import cs from "classnames"
import { IProps as IEntityBadgeProps } from "./EntityBadge"
import { Collaboration } from "../../types/entities/User"
import { Avatar } from "./Avatar"
import {
  useEffect,
  useMemo,
  useState,
  ReactElement,
  useRef,
  forwardRef,
  CSSProperties,
} from "react"
import { shuffleArray } from "../../utils/array"
import { UserBadge } from "./UserBadge"
import { getUserName, isUserVerified } from "../../utils/user"

type BadgeCircleProps = Partial<IEntityBadgeProps> & {
  children?: ReactElement
  style?: CSSProperties
}

const BadgeCircle = forwardRef<HTMLDivElement, BadgeCircleProps>(
  (props, ref) => {
    const { size, className, ...rest } = props
    return (
      <div
        ref={ref}
        className={cs(
          badgeStyle.avatar,
          badgeStyle[`avatar-${size}`],
          style.avatar,
          style.avatar_wrapper,
          style.link,
          className
        )}
        {...rest}
      />
    )
  }
)

BadgeCircle.displayName = "BadgeCircle"

interface Props extends IEntityBadgeProps {
  user: Collaboration
  centered?: boolean
  maxCollaborators?: number
}
export function CollabBadge(props: Props) {
  const {
    user,
    size,
    toggeable = false,
    centered = false,
    displayAvatar = true,
    avatarSide,
    className,
    classNameAvatar,
    maxCollaborators = 5,
  } = props
  const sliceCountRef = useRef<HTMLDivElement>(null)
  const [collaborators, setCollaborators] = useState(user.collaborators)
  const [isInitialized, setIsInitialized] = useState(false)

  const [opened, setOpened] = useState<boolean>(false)
  useEffect(() => {
    setCollaborators((stateArray) => shuffleArray(stateArray))
    setIsInitialized(true)
  }, [])

  const slicedCollaborators = useMemo(
    () => collaborators.slice(0, maxCollaborators),
    [collaborators, maxCollaborators]
  )

  const isSliced = slicedCollaborators.length < collaborators.length

  const marginLeftToggleButton = useMemo(() => {
    if (!displayAvatar) {
      return 0
    }
    if (!sliceCountRef.current?.offsetWidth || !opened) return undefined
    return sliceCountRef?.current?.offsetWidth * -1
  }, [displayAvatar, opened])

  return (
    <div
      className={cs(
        style.root,
        style[`size_${size}`],
        style[`side_${avatarSide}`],
        {
          [style.opened]: opened,
          [style.toggeable]: toggeable,
          [style.hide]: !isInitialized,
          [style.centered]: centered,
          [style.hide_avatars]: !displayAvatar,
        },
        className
      )}
    >
      <button
        type="button"
        className={cs(style.avatars)}
        onClick={() => setOpened(!opened)}
        disabled={!toggeable}
      >
        {slicedCollaborators.map((user) => (
          <div key={user.id} className={cs(style.avatar_wrapper)}>
            {displayAvatar && (
              <Avatar
                image={user.avatarMedia}
                uri={user.avatarUri}
                className={cs(
                  badgeStyle.avatar,
                  badgeStyle[`avatar-${size}`],
                  style.avatar,
                  classNameAvatar
                )}
              />
            )}
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
        {isSliced && (
          <BadgeCircle size={size} ref={sliceCountRef}>
            <span>+{collaborators.length - maxCollaborators}</span>
          </BadgeCircle>
        )}
        {toggeable && (
          <BadgeCircle
            size={size}
            className={style.toggleButton}
            style={{
              marginLeft: marginLeftToggleButton,
            }}
          >
            <span>
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
            </span>
          </BadgeCircle>
        )}
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
