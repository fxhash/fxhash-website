import cs from "classnames"
import { useState } from "react"
import { Button } from "../../../components/Button"
import { ModerationModal } from "../../../components/Moderation/Modal/ModerationModal"
import { ArticleFlag, NFTArticle } from "../../../types/entities/Article"

interface Props {
  article: NFTArticle
}
export function ArticleModeration({
  article,
}: Props) {
  const [show, setShow] = useState<boolean>(false)

  return (
    <>
      <Button
        type="button"
        size="small"
        iconComp={<i aria-hidden className="fas fa-gavel"/>}
        color="primary"
        onClick={() => setShow(!show)}
      >
        moderate
      </Button>

      {show && (
        <ModerationModal
          entityId={article.id}
          moderationContract="article"
          flags={Object.keys(ArticleFlag).map((flag, idx) => ({
            label: flag,
            value: idx
          }))}
          title="Moderate this Article"
          infoText='With this utility you can force the moderation of this Article. This action can be reversed at any point in time. In case of a doubt, setting the flag "REVIEW" will put the Article in the "Awaiting Moderation" list for further deliberation.'
          infoState='If set to "malicious", will be hidden from the front'
          onClose={() => setShow(false)}
        />
      )}
    </>
  )
}