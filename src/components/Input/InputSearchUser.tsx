import { useApolloClient } from "@apollo/client"
import { Qu_searchUser } from "../../queries/user"
import { User } from "../../types/entities/User"
import { InputReactiveSearch } from "./InputReactiveSearch"
import { UserBadge } from "../User/UserBadge"

interface Props {
  value: string
  onChange: (value: string, autofill: boolean) => void
  onFetchUsers?: (users: any[]) => void,
  className?: string
  classNameResults?: string
  displayAddress?: boolean,
  hideInput?: boolean
  hideNoResults?: boolean
  keyboardSelectedUserIdx?: number
}
export function InputSearchUser({
  value,
  onChange,
  onFetchUsers,
  className,
  classNameResults,
  displayAddress,
  hideInput,
  hideNoResults,
  keyboardSelectedUserIdx
}: Props) {
  const client = useApolloClient()

  const searchUsers = async (search: string) => {
    const results = await client.query({
      query: Qu_searchUser,
      fetchPolicy: "no-cache",
      variables: {
        filters: {
          searchQuery_eq: search,
        }
      }
    })
    return results
  }

  const resultsIntoUsers = (results: any): User[] => {
    let users;
    if (!results || !results.data || !results.data.users) {
      users = []
    } else {
      users = results.data.users;
    }
    if (onFetchUsers) {
      onFetchUsers(users);
    }
    return users;
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
      hideInput={hideInput}
      hideNoResults={hideNoResults}
      keyboardSelectedIdx={keyboardSelectedUserIdx}
    >
      {({ item: user }) => (
        <UserBadge
          user={user}
          size="small"
          displayAddress={displayAddress}
        />
      )}
    </InputReactiveSearch>
  )
}
