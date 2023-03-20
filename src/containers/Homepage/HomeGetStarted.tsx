import React, { memo } from "react"
import { TitleHyphen } from "../../components/Layout/TitleHyphen"
import cs from "classnames"
import style from "./HomeGetStarted.module.scss"
import layout from "../../styles/Layout.module.scss"
import Link from "next/link"

const docs = [
  {
    title: "what is generative art?",
    description:
      "Learn more about generative art, fxhash and his artist ecosystem",
    url: "/doc/fxhash/overview",
  },
  {
    title: "collect art on fxhash",
    description:
      "Learn about the core principles behind fxhash, and how to use the platform as an educated collector",
    url: "/doc/collect/guide",
  },
  {
    title: "publish content on fxhash",
    description:
      "An in-depth guide to cover what you need to know as an artist to publish your work on the platform",
    url: "/doc/artist/guide-publish-generative-token",
  },
]
const _HomeGetStarted = () => {
  return (
    <div className={cs(layout["padding-big"], style.bg)}>
      <TitleHyphen>get started</TitleHyphen>
      <div className={style.docs}>
        {docs.map((doc) => (
          <Link key={doc.url} href={doc.url}>
            <a>
              <div className={style.doc_title}>
                <span>{doc.title}</span>
                <i aria-hidden="true" className="fas fa-arrow-right" />
              </div>
              <div className={style.doc_description}>{doc.description}</div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const HomeGetStarted = memo(_HomeGetStarted)
