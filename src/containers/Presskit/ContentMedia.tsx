import classes from "./Content.module.scss"

interface NewsLinkProps {
  children: string
  href: string
}

function NewsLink(props: NewsLinkProps) {
  return (
    <li>
      <a target="_blank" rel="noopener nofollow noreferrer" href={props.href}>
        {props.children}
        <i className="fa-solid fa-arrow-up-right-from-square" />
      </a>
    </li>
  )
}

export function ContentMedia() {
  return (
    <article className={classes.rootMedia}>
      <section>
        <h2>fxhash in the news</h2>
        <ul>
          <NewsLink href="#">
            Tezos NFT Market Shines Amid Crypto Slump
          </NewsLink>
          <NewsLink href="#">
            Tezos NFT Market Shines Amid Crypto Slump
          </NewsLink>
          <NewsLink href="#">
            Tezos NFT Market Shines Amid Crypto Slump
          </NewsLink>
          <NewsLink href="#">
            Tezos NFT Market Shines Amid Crypto Slump
          </NewsLink>
        </ul>
      </section>
      <section>
        <h2>past event showcase</h2>
      </section>
    </article>
  )
}
