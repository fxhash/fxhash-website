import style from "./ArticleInfos.module.scss"
import layout from "../../styles/Layout.module.scss"
import text from "../../styles/Text.module.css"
import cs from "classnames"
import { NFTArticle } from "../../types/Article";
import { EntityBadge } from "../../components/User/EntityBadge";
import { displayRoyalties } from "../../utils/units";
import { ListSplits } from "../../components/List/ListSplits";
import { Tags } from "../../components/Tags/Tags";
import { ipfsGatewayUrl } from "../../services/Ipfs";
import { useMemo } from "react";
import SocialMediaShare from "../../components/SocialMediaShare/SocialMediaShare";

interface ArticleInfosProps {
  article: NFTArticle
}
export function ArticleInfos({
  article,
}: ArticleInfosProps) {
  const urlIpfs = useMemo(() => ipfsGatewayUrl(article.metadataUri), [])
  const urlShare = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/article/${article.slug}`;
  }, [article.slug])
  return (
    <div className={cs(style.presentation_details)}>
      <div className={style.base}>
        <div className={style.base_left}>
          <div>
            <h6 className={text.small_title}>Written by</h6>
            <EntityBadge
              user={article.author}
              size="big"
              toggeable
            />
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
            <SocialMediaShare url={urlShare} />
          </div>
        </div>
      </div>
      <div className={style.details}>
        <h6 className={text.small_title}>Details</h6>
        <div className={cs(
          style.multilines,
          layout.break_words,
          style.details_list,
        )}>
          <strong>Royalties</strong>
          <span>{displayRoyalties(article.royalties)}</span>
          <ListSplits
            name="Royalties split"
            splits={article.royaltiesSplits}
          />
          <strong>Tags</strong>
          <span>
            {article.tags && article.tags.length > 0 ? (
              <Tags tags={article.tags}/>
            ):(
              <span className={cs(text.info)}>{"/"}</span>
            )}
          </span>
          <strong>Metadata</strong>
          <a
            target="_blank"
            referrerPolicy="no-referrer"
            href={urlIpfs}
            className={cs(text.info_link)} rel="noreferrer"
          >
            view on IPFS <i className="fas fa-external-link-square" aria-hidden/>
          </a>
        </div>
      </div>
    </div>
  )
}
