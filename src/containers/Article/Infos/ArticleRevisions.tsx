import style from "./ArticleRevisions.module.scss"
import cs from "classnames"
import text from "../../../styles/Text.module.css"
import { NFTArticleRevision } from "../../../types/entities/Article"
import { ToggableInfo } from "../../../components/Layout/ToggableInfo"
import { DateFormatted } from "../../../components/Utils/Date/DateFormat"
import { getNumberWithOrdinal } from "../../../utils/math"
import { ipfsGatewayUrl } from "../../../services/Ipfs"

interface Props {
  revisions: NFTArticleRevision[]
}
export function ArticleRevisions({ revisions }: Props) {
  return (
    <ToggableInfo
      label="Revisions"
      placeholder={`(${revisions.length - 1})`}
      toggled={false}
    >
      <div className={cs(style.root)}>
        {revisions.map((rev) => (
          <a
            key={rev.iteration}
            className={cs(style.rev, text.info_link)}
            href={ipfsGatewayUrl(rev.metadataUri)}
            target="__blank"
            referrerPolicy="no-referrer"
          >
            <span>
              {rev.iteration === 0
                ? "Initial mint"
                : getNumberWithOrdinal(rev.iteration) + " revision"}
            </span>
            {", "}
            <DateFormatted date={rev.createdAt} />{" "}
            <i className="fas fa-external-link-square" aria-hidden />
          </a>
        ))}
      </div>
    </ToggableInfo>
  )
}
