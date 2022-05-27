import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserById } from "../../../services/ServerSideProps/ServerSidePropsUser"
import { ReactElement } from "react"
import { UserGenerativeTokens } from "../../../containers/User/UserGenerativeTokens"


interface Props {
  user: User
}

const UserPageCreations = ({ user }: Props) => {
  return (
    <UserGenerativeTokens user={user}/>
  )
}

UserPageCreations.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout
      user={page.props.user}
      tabIndex={1}
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserById

export default UserPageCreations
