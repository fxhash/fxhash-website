import { useQuery } from "@apollo/client"
import cs from "classnames"
import { FunctionComponent, useMemo } from "react"
import { Qu_userLight } from "../../queries/user"
import { User } from "../../types/entities/User"

interface PropsChildren {
  user: User
}

interface Props {
  address: string
  children: FunctionComponent<PropsChildren>
}

/**
 * A generic component which receives an address in input and tries to match
 * the user with existing users in database
 */
export function UserFromAddress({ address, children }: Props) {
  const { data, loading } = useQuery(Qu_userLight, {
    variables: {
      id: address,
    },
  })

  // if there's some data, return it otherwise creates a fake user
  const user = useMemo<User>(() => {
    if (data && data.user) {
      return data.user
    } else {
      return {
        id: address,
      }
    }
  }, [data, address])

  return children({ user })
}
