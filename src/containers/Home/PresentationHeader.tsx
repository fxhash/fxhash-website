import style from "./PresentationHeader.module.scss"
import Colors from "../../styles/Colors.module.css"
import cs from "classnames"
import Link from "next/link"

interface Props {
  
}
export function PresentationHeader({
  
}: Props) {
  return (
    <div className={cs(style.root)}>
      <h1 className={cs(style.presentation_text)}>
        fxhash is an open platform to <span className={cs(Colors.primary)}>create</span> and <span className={cs(Colors.secondary)}>collect</span> generative NFTs on the tezos blockchain
      </h1>
      <div className={cs(style.guides_section)}>
        <h4 className={cs(style.guides_section_title)}>Useful resources</h4>
        <div className={cs(style.guides_wrapper)}>
          <Link href="/articles/collect-mint-tokens">
            <a className={cs(style.guide)}>
              <i aria-hidden className="fas fa-book"/>
              <div className={cs(style.guide_details)}>
                <strong>Collecting art on fxhash</strong>
                <span>Learn about the core principles behind fxhash, and how to use the platform as an educated collector</span>
              </div>
            </a>
          </Link>
          <Link href="/articles/guide-mint-generative-token">
            <a className={cs(style.guide)}>
              <i aria-hidden className="fas fa-book"/>
              <div className={cs(style.guide_details)}>
                <strong>Publishing content on fxhash</strong>
                <span>An in-depth guide to cover what you need to know as an artist to publish your work on the platform</span>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>  
  )
}