import style from "./InputSearchUser.module.scss"
import cs from "classnames"
import { useApolloClient } from "@apollo/client"
import { Qu_searchUser } from "../../queries/user"
import { User } from "../../types/entities/User"
import { InputReactiveSearch } from "./InputReactiveSearch"
import { UserBadge } from "../User/UserBadge"

interface Props {
  value: string
  onChange: (value: string, autofill: boolean) => void
  className?: string
  classNameResults?: string
}
export function InputSearchUser({
  value,
  onChange,
  className,
  classNameResults,
}: Props) {
  const client = useApolloClient()

  const searchUsers = async (search: string) => {
    const results = await client.query({
      query: Qu_searchUser,
      fetchPolicy: "no-cache",
      variables: {
        filters: {
          searchQuery_eq: search
        }
      }
    })
    return results
  }

  const resultsIntoUsers = (results: any): User[] => {
    if (!results || !results.data || !results.data.users) {
      return []
    }
    return results.data.users
  }

  const valueFromUser = (user: User) => {
    return user.id
  }

  return (
    <InputReactiveSearch
      value={value}
      onChange={onChange}
      placeholder="user name, tezos address"
      searchFn={searchUsers}
      transformSearchResults={resultsIntoUsers}
      valueFromResult={valueFromUser}
      className={className}
      classNameResults={classNameResults}
    >
      {({ item: user }) => (
        <UserBadge
          user={user}
          size="small"
        />
      )}
    </InputReactiveSearch>
  )
}