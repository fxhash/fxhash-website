import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserByName } from "../../../services/ServerSideProps/ServerSidePropsUser"
import { ReactElement } from "react"
import { UserDashboard } from "../../../containers/User/UserDashboard";

interface Props {
  user: User
}

const UserPageDashboard = ({ user }: Props) => {
  return (
    <UserDashboard user={user} />
  )
}

UserPageDashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout
      user={page.props.user}
      tabIndex={0}
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserByName

export default UserPageDashboard
