import { FlagBanner } from "../../../components/Flag/FlagBanner"
import { ArticleFlag, NFTArticle } from "../../../types/entities/Article"


function getFlagText(flag: ArticleFlag): string {
  switch (flag) {
    case ArticleFlag.AUTO_DETECT_COPY:
      return "The fxhash system has automatically flagged this Article as a potential copymint. The moderation team has not yet stated if it respects the Guidelines of the platform. Please wait until a decision is taken."
    case ArticleFlag.MALICIOUS:
      return "This Article was flagged as undesirable content by the moderation team."
    case ArticleFlag.HIDDEN:
      return "This article was hidden at the request of the minter, not because it doesn't follow the rules of fxhash but because an incident happened when it was released. Please consider it as non-existing."
    case ArticleFlag.REPORTED:
    default:
      return "This Article has recently been reported by the community. The moderation team has not yet stated if it respects the Guidelines of the platform. Please wait until a decision is taken."
  }
}

interface Props {
  article: NFTArticle
}
export function ArticleFlagBanner({
  article
}: Props) {
  const flagged = [
    ArticleFlag.AUTO_DETECT_COPY,
    ArticleFlag.MALICIOUS,
    ArticleFlag.REPORTED,
    ArticleFlag.HIDDEN,
  ].includes(article.flag)

  return flagged ? (
    <FlagBanner>
      <h4>Warning ! This Article has been flagged</h4>
      <p>{ getFlagText(article.flag) }</p>
      {article.moderationReason && (
        <span>
          <strong>Reason</strong>: {article.moderationReason}
        </span>
      )}
    </FlagBanner>
  ):null
}