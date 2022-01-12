import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserById } from "../../../services/ServerSideProps/ServerSidePropsUser"
import { ReactElement } from "react"
import { UserActions } from '../../../containers/User/UserActions'


interface Props {
  user: User
}

const UserPageActivity = ({ user }: Props) => {
  return (
    <UserActions user={user}/>
  )
}

UserPageActivity.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout
      user={page.props.user}
      tabIndex={3}
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserById

export default UserPageActivity