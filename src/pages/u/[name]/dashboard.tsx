import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserByName } from "../../../services/ServerSideProps/ServerSidePropsUser"
import { ReactElement } from "react"
import { UserActions } from '../../../containers/User/UserActions'
import { Spacing } from "../../../components/Layout/Spacing";
import { UserSalesTable } from "../../../containers/User/UserSalesTable";


interface Props {
  user: User
}

const UserPageDashboard = ({ user }: Props) => {
  return (
    <>
      <UserSalesTable user={user} />
      <Spacing size="5x-large" />
      <UserActions user={user}/>
    </>
  )
}

UserPageDashboard.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout
      user={page.props.user}
      tabIndex={3}
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserByName

export default UserPageDashboard
