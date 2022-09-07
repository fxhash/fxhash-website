import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserById } from "../../../services/ServerSideProps/ServerSidePropsUser"
import { ReactElement } from "react"
import { UserGenerativeTokens } from '../../../containers/User/UserGenerativeTokens'


interface Props {
  user: User
}

const UserPageDashboard = ({ user }: Props) => {
  return (
    <UserGenerativeTokens user={user}/>
  )
}

UserPageDashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout
      user={page.props.user}
      activeTab="creations"
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserById

export default UserPageDashboard
