import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserByName } from "../../../services/ServerSideProps/ServerSidePropsUser"
import { ReactElement } from "react"
import { UserArticles } from '../../../containers/User/UserArticles';

interface UserPageArticlesProps {
  user: User
}

const UserPageArticles = ({ user }: UserPageArticlesProps) => {
  return (
    <UserArticles user={user} />
  )
}

UserPageArticles.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout
      user={page.props.user}
      activeTab="articles"
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserByName

export default UserPageArticles
