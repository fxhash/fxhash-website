import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserByName } from "../../../services/ServerSideProps/ServerSidePropsUser"
import { ReactElement } from "react"
import { UserGenerativeTokens } from '../../../containers/User/UserGenerativeTokens';

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

export const getServerSideProps = getServerSidePropsUserByName

export default UserPageDashboard
