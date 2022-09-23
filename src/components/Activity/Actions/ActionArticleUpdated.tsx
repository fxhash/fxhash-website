import { ipfsGatewayUrl } from "../../../services/Ipfs"
import { getNumberWithOrdinal } from "../../../utils/math"
import style from "../Action.module.scss"
import cs from "classnames"
import { TActionComp } from "./Action"
import { UserBadge } from "../../User/UserBadge"
import { NFTArticleRevision } from "../../../types/entities/Article"

interface ArticleRevisionLinkProps {
  revision: NFTArticleRevision
}

function ArticleRevisionLink({ revision }: ArticleRevisionLinkProps) {
  return (
    <a
      className={style.link}
      href={ipfsGatewayUrl(revision.metadataUri)}
      target="_blank"
      rel="noreferrer"
    >
      <strong>
        {revision.iteration === 0
          ? "initial mint"
          : getNumberWithOrdinal(revision.iteration) + " revision"}
      </strong>
    </a>
  )
}

export const ActionArticleUpdated: TActionComp = ({ action, verbose }) => {
  const { from, to } = action.metadata!
  const revisionFrom = action.article!.revisions!.find(
    (r) => r.metadataUri === from
  )
  const revisionTo = action.article!.revisions!.find(
    (r) => r.metadataUri === to
  )

  return (
    <>
      <UserBadge
        className={cs(style.user)}
        hasLink={true}
        user={action.issuer!}
        size="small"
      />
      <span>
        updated article {` `}
        <ArticleRevisionLink revision={revisionFrom!} />
        {` `} to {` `}
        <ArticleRevisionLink revision={revisionTo!} />
      </span>
    </>
  )
}
