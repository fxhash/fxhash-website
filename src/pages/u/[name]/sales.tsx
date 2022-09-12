import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserByName } from "../../../services/ServerSideProps/ServerSidePropsUser"
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
      activeTab="on-sale"
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserByName

export default UserPageSales
