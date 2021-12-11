import { User } from '../../../types/entities/User'
import { UserProfileLayout } from "../../../containers/User/UserProfileLayout"
import { getServerSidePropsUserByName } from "../../../services/ServerSideProps/ServerSidePropsUser"
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
      tabIndex={0}
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps = getServerSidePropsUserByName

export default UserPageCreations