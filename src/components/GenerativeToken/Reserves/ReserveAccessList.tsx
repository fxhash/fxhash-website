import cs from "classnames"
import style from "./ReserveAccessList.module.scss"
import { useQuery } from "@apollo/client"
import { useContext, useMemo } from "react"
import { Qu_users } from "../../../queries/user"
import { User } from "../../../types/entities/User"
import { ConnectedList } from "../../Layout/ConnectedList"
import { TRenderReserveComponent } from "./Reserve"
import { UserBadge } from "../../User/UserBadge"
import { UserContext } from "../../../containers/UserProvider"

export const ReserveAccessList: TRenderReserveComponent = ({ reserve }) => {
  const { user } = useContext(UserContext)

  // run a query to get all the users in the list
  const { data: users } = useQuery(Qu_users, {
    variables: {
      filters: {
        id_in: Object.keys(reserve.data),
      },
    },
  })

  // turn the items in the list in an array
  const dataAsArray = useMemo(
    () =>
      Object.keys(reserve.data).map((K) => {
        const loadedUser =
          users &&
          users.users &&
          users.users.find((user: User) => user.id === K)
        return {
          user: loadedUser || {
            id: K,
          },
          amount: reserve.data[K],
        }
      }),
    [reserve, users]
  )

  return (
    <ConnectedList items={dataAsArray}>
      {({ item }) => (
        <>
          <span
            className={cs(style.amount, {
              [style.active]: item.user.id === user?.id,
            })}
          >
            {Math.min(item.amount, reserve.amount)}
          </span>
          <div
            className={cs(style.user, {
              [style.active]: item.user.id === user?.id,
            })}
          >
            <UserBadge size="small" user={item.user} displayAvatar={false} />
          </div>
        </>
      )}
    </ConnectedList>
  )
}
