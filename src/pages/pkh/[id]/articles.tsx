import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import {
  getServerSidePropsUserById,
} from "../../../services/ServerSideProps/ServerSidePropsUser"
import { ReactElement } from "react"
import { UserArticles } from '../../../containers/User/UserArticles';

interface UserArticlesProps {
  user: User
}

const UserArticles = ({ user }: UserArticlesProps) => {
  return (
    <UserArticles user={user} />
  )
}

UserArticles.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout
      user={page.props.user}
      activeTab="articles"
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserById

export default UserArticles
