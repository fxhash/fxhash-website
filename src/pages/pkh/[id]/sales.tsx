import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserById } from "../../../services/ServerSideProps/ServerSidePropsUser"
import { ReactElement } from "react"
import { UserListings } from '../../../containers/User/UserListings'


interface Props {
  user: User
}

const UserPageSales = ({ user }: Props) => {
  return (
    <UserListings user={user}/>
  )
}

UserPageSales.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout
      user={page.props.user}
      tabIndex={2}
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserById

export default UserPageSales