import { GetServerSideProps, NextPage } from "next"
import cs from "classnames"
import client from "../../services/ApolloClient"
import { User } from '../../types/entities/User'
import { Spacing } from '../../components/Layout/Spacing'
import { Qu_user } from '../../queries/user'
import { UserProfile } from "../../containers/User/UserProfile"
import { processUserItems } from "../../utils/user"


interface Props {
  user: User
}

const UserPage: NextPage<Props> = ({ user }) => {
  return (
    <>
      <Spacing size="6x-large" />
      <UserProfile user={user} />
      <Spacing size="6x-large" />
      <Spacing size="6x-large" />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name = context.params?.params && context.params.params[0]
  let user = null

  if (name && name.length > 0) {
    const { data, error } = await client.query({
      query: Qu_user,
      fetchPolicy: "no-cache",
      variables: { name }
    })
    if (data) {
      user = data.user
      // process the user items
      const items = processUserItems(user)
      user = { ...user, ...items }
    }
  }
  return {
    props: {
      user
    },
    notFound: !user
  }
}

export default UserPage