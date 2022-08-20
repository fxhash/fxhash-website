import style from "./GenTokArticleMentions.module.scss"
import cs from "classnames"
import text from "../../../styles/Text.module.css"
import { ArticleGenerativeTokenMention } from "../../../types/entities/ArticleGenerativeTokenMention"
import Link from "next/link"
import { ImagePolymorphic } from "../../../components/Medias/ImagePolymorphic"
import { NFTArticle } from "../../../types/entities/Article"
import { getUserName } from "../../../utils/user"
import { useMemo, useState } from "react"

const MAX_MENTIONS = 5

interface Props {
  mentions: ArticleGenerativeTokenMention[]
}
export function GenTokArticleMentions({
  mentions,
}: Props) {
  const [showAll, setShowAll] = useState(false)

  const mentionsShown = useMemo(() => {
    return showAll
      ? mentions
      : mentions.slice(0, MAX_MENTIONS)
  }, [mentions, showAll])

  return (
    <div>
      <span className={cs(text.bold)}>
        Mentions <span className={cs(text.info)}>({mentions.length})</span>
      </span>
      <div className={cs(style.mentions)}>
        {mentionsShown.map((mention, idx) => (
          <ArticleMention
            key={idx}
            article={mention.article}
          />
        ))}
        {mentionsShown.length < mentions.length && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className={cs(style.expand_btn)}
          >
            <i className="fa-solid fa-angles-down" aria-hidden/>
            show all ({mentions.length-mentionsShown.length})
          </button>
        )}
      </div>
    </div>
  )
}

interface SingleProps {
  article: NFTArticle
}
function ArticleMention({
  article,
}: SingleProps) {
  return (
    <Link href={`/article/${article.slug}`}>
      <a className={cs(style.mention)}>
        <ImagePolymorphic
          uri={article.thumbnailUri}
          alt={article.title}
          className={cs(style.thumbnail)}
        />
        <div>
          <strong>{article.title}</strong><br/>
          {getUserName(article.author!)}
        </div>
      </a>
    </Link>
  )
}