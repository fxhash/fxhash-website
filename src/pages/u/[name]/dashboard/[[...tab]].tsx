import { User } from "../../../../types/entities/User"
import {
  DashboardTabsKey,
  UserDashboard,
  userDashboardComponentsKeys,
} from "../../../../containers/User/UserDashboard"
import { ReactElement } from "react"
import { UserProfileLayout } from "../../../../containers/User/UserProfileLayout"
import { GetServerSideProps } from "next"
import { getServerSidePropsUserByName } from "../../../../services/ServerSideProps/ServerSidePropsUser"

interface Props {
  user: User
  tab: DashboardTabsKey
}

const UserPageDashboardTab = ({ user, tab }: Props) => {
  return <UserDashboard activeTab={tab} user={user} />
}

UserPageDashboardTab.getLayout = function getLayout(page: ReactElement) {
  return (
    <UserProfileLayout
      hideSectionSpacing
      user={page.props.user}
      activeTab="dashboard"
    >
      {page}
    </UserProfileLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tab = context.params?.tab?.[0] || "sales"
  const isExistingTab = userDashboardComponentsKeys.indexOf(tab) > -1
  const propsUser = await getServerSidePropsUserByName(context)
  if (propsUser.notFound) {
    return { notFound: true }
  }
  if (!isExistingTab) {
    return {
      redirect: {
        destination: `/u/${propsUser.props.user!.name}`,
        permanent: false,
      },
    }
  }
  return {
    props: {
      ...propsUser.props,
      tab,
    },
  }
}

export default UserPageDashboardTab
