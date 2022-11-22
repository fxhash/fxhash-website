import style from "./ArticleInfos.module.scss"
import layout from "../../styles/Layout.module.scss"
import text from "../../styles/Text.module.css"
import cs from "classnames"
import { NFTArticle } from "../../types/entities/Article"
import { EntityBadge } from "../../components/User/EntityBadge"
import { displayRoyalties } from "../../utils/units"
import { ListSplits } from "../../components/List/ListSplits"
import { Tags } from "../../components/Tags/Tags"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { useMemo } from "react"
import SocialMediaShare from "../../components/SocialMediaShare/SocialMediaShare"
import { ArticleRevisions } from "./Infos/ArticleRevisions"
import { ArticleQuickCollect } from "./Infos/ArticleQuickCollect"

interface ArticleInfosProps {
  article: NFTArticle
  originUrl: string
  isPreview?: boolean
}
export function ArticleInfos({
  article,
  isPreview,
  originUrl,
}: ArticleInfosProps) {
  const urlIpfs = useMemo(() => ipfsGatewayUrl(article.metadataUri), [])
  const urlShare = useMemo(() => {
    return `${originUrl}/article/${article.slug}`
  }, [article.slug, originUrl])
  return (
    <div className={cs(style.presentation_details)}>
      <div className={style.base}>
        <div className={style.base_left}>
          <div>
            <h6 className={text.small_title}>Written by</h6>
            {article.author && (
              <EntityBadge user={article.author} size="big" toggeable />
            )}
          </div>
        </div>
        <div className={style.base_center}>
          <div>
            <h6 className={text.small_title}>Editions</h6>
            <p className={style.editions}>{article.editions}</p>
          </div>
        </div>
        <div className={style.base_right}>
          <div>
            <h6 className={text.small_title}>Share</h6>
            <SocialMediaShare url={urlShare} disabled={isPreview} />
          </div>
        </div>
        <ArticleQuickCollect article={article}>
          {({ collectAction }) => (
            <div className={style.collect}>
              <div>
                <h6 className={text.small_title}>Collect</h6>
                {collectAction}
              </div>
            </div>
          )}
        </ArticleQuickCollect>
      </div>

      <div className={style.details}>
        <h6 className={text.small_title}>Details</h6>
        <div
          className={cs(
            style.multilines,
            layout.break_words,
            style.details_list
          )}
        >
          <strong>Royalties</strong>
          <span className={cs(style.mobile_align_right, style.mobile_gray)}>
            {displayRoyalties(article.royalties)}
          </span>

          <ListSplits name="Royalties split" splits={article.royaltiesSplits} />

          <strong>Tags</strong>
          <span className={style.mobile_grid_two}>
            {article.tags && article.tags.length > 0 ? (
              <Tags tags={article.tags} />
            ) : (
              <span className={cs(text.info)}>{"/"}</span>
            )}
          </span>
          <hr />
          <strong>Metadata</strong>
          <div className={cs(text.info, style.mobile_align_right)}>
            {article.metadataLocked && (
              <>
                <span className={cs(style.locked)}>
                  <i className="fa-sharp fa-solid fa-lock" aria-hidden />
                  locked
                </span>
                {" - "}
              </>
            )}
            <a
              target="_blank"
              referrerPolicy="no-referrer"
              rel="noreferrer"
              href={urlIpfs}
              className={cs(style.metadata, {
                [style.disabled]: isPreview,
              })}
              tabIndex={isPreview ? -1 : 0}
            >
              view on IPFS{" "}
              <i className="fas fa-external-link-square" aria-hidden />
            </a>
          </div>

          {!isPreview && article.revisions?.length > 1 && (
            <ArticleRevisions revisions={article.revisions} />
          )}
        </div>
      </div>
    </div>
  )
}
