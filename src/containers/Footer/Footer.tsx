import style from "./Footer.module.scss"
import cs from "classnames"
import Link from "next/link"
import { Logo } from "./Logo"
import { IndexerStatusLabel } from "../../components/Status/IndexerStatusLabel"
import { useIndexerStatusSeverity } from "../../hooks/useIndexerStatusSeverity"
import layout from "../../styles/Layout.module.scss"
import { ConnectWithUs } from "../../components/ConnectWithUs/ConnectWithUs";


export function Footer() {
  const severity = useIndexerStatusSeverity()
  return (
    <footer className={cs(style.footer, layout["padding-big"])}>
      <div className={cs(style.content)}>
        <div className={cs(style.logo_wrapper)}>
          <Logo />
          <ConnectWithUs className={style.connect} />
        </div>
        <div>
          <div className={cs(style.links)}>
            <Link href="/doc">
              <a>Documentation</a>
            </Link>
            <Link href="/doc/fxhash/integration-guide">
              <a>3rd party integration</a>
            </Link>
          </div>
        </div>
        <div>
          <div className={cs(style.links)}>
            <Link href="/doc/legal/terms.pdf">
              <a target="_blank">Terms and conditions (english soon)</a>
            </Link>
            <Link href="/doc/legal/referencement.pdf">
              <a target="_blank">Referencing (english soon)</a>
            </Link>
            <Link href="https://feedback.fxhash.xyz">
              <a target="_blank">Feature request</a>
            </Link>
            <Link href="https://join.com/companies/fxhash">
              <a target="_blank">Career opportunities</a>
            </Link>
            <Link href="/press-kit">
              <a>Press kit</a>
            </Link>
            <Link href="/status">
              <a className={style.indexer}>
                <IndexerStatusLabel
                  severity={severity}
                  label="Indexer status"
                />
              </a>
            </Link>
          </div>
          <div className={cs(style.powered)}>
            <span>
              powered by{" "}
              <a href="https://tzkt.io/" target="_blank" rel="noreferrer">
                tzkt
              </a>{" "}
              &amp;{" "}
              <a href="https://smartpy.io/" target="_blank" rel="noreferrer">
                SmartPy
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
