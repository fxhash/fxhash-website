import { SectionHeader } from "../components/Layout/SectionHeader"
import { TitleHyphen } from "../components/Layout/TitleHyphen"
import cs from "classnames"
import layout from "../styles/Layout.module.scss"
import { Spacing } from "../components/Layout/Spacing"

export function Maintenance() {
  return (
    <section>
      <SectionHeader>
        <TitleHyphen>maintenance</TitleHyphen>
      </SectionHeader>

      <Spacing size="x-large"/>

      <main className={cs(layout['padding-big'])}>
        <p>fxhash is temporarly in maintenance mode</p>
        <p>(until indexer catches up)</p>
      </main>
    </section>
  )
}