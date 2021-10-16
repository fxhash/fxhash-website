import { NextPage } from "next"
import { SectionHeader } from "../../components/Layout/SectionHeader"
import { Spacing } from "../../components/Layout/Spacing"
import cs from "classnames"
import layout from "../../styles/Layout.module.scss"
import ClientOnly from "../../components/Utils/ClientOnly"
import { UserGuard } from "../../components/Guards/UserGuard"
import { MintGenerativeController } from "../../containers/MintGenerative/Controller"
import { BrowserRouter as Router } from "react-router-dom"

const MintGenerative: NextPage = () => {
  return (
    <>
      <Spacing size="6x-large"/>

      <section>
        <SectionHeader>
          <h2>— mint a Generative Token</h2>
        </SectionHeader>

        <Spacing size="x-large"/>

        <main className={cs(layout['padding-big'])}>
          <ClientOnly>
            <UserGuard>
              <Router basename="/mint-generative">
                <MintGenerativeController />
              </Router>
            </UserGuard>
          </ClientOnly>
        </main>
      </section>
    </>
  )
}

export default MintGenerative