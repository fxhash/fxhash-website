import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserByName } from "../../../services/ServerSideProps/ServerSidePropsUser"
import { UserCollection } from "../../../containers/User/UserCollection"
import { ReactElement } from "react"


interface Props {
  user: User
}

const UserPageCollection = ({ user }: Props) => {
  return (
    <UserCollection user={user}/>
  )
}

UserPageCollection.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout
      user={page.props.user}
      activeTab="collection"
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserByName

export default UserPageCollection
