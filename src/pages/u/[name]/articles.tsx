import { User } from "../../../types/entities/User"
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserByName } from "../../../services/ServerSideProps/ServerSidePropsUser"
import { ReactElement, useContext, useMemo } from "react"
import { UserArticles } from "../../../containers/User/UserArticles"
import { UserContext } from "../../../containers/UserProvider"

interface UserPageArticlesProps {
  user: User
}

const UserPageArticles = ({ user }: UserPageArticlesProps) => {
  const { user: userConnected } = useContext(UserContext)
  const isConnectedUser = useMemo(
    () => !!(userConnected && userConnected.id === user.id),
    [user.id, userConnected]
  )
  return <UserArticles user={user} showLocalDrafts={isConnectedUser} />
}

UserPageArticles.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout user={page.props.user} activeTab="articles">
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserByName

export default UserPageArticles
