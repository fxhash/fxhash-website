import style from "./UserVerification.module.scss"
import cs from "classnames"
import { TzProfile } from "../../utils/user"
import { Loader } from "../../components/Utils/Loader"


interface Props {
  profile: TzProfile|null
  loading?: boolean
}

export function UserVerification({
  profile,
  loading
}: Props) {
  return (
    loading ? (
      <div className={cs(style.loading)}>
        <Loader size="tiny"/>
        <span>checking profile on tzProfiles</span>
      </div>
    ):(
      <div className={cs(style.container)}>
        {profile?.twitter && profile.twitter.url && profile.twitter.handle && (
          <a href={profile.twitter.url} className={cs(style.badge)} target="_blank" referrerPolicy="no-referrer" style={{ color: "#00acee" }}>
            <i className="fab fa-twitter"/>
            <span>{ profile.twitter.handle }</span>
          </a>
        )}
        {profile?.website && (
          <a href={profile.website.url} className={cs(style.badge)} target="_blank" referrerPolicy="no-referrer">
            <i className="fas fa-globe"/>
            <span>{ profile.website.handle }</span>
          </a>
        )}
      </div>
    )
  )
}