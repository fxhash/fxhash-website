import style from "./UserItems.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { User } from "../../types/entities/User"
import { Tabs } from "../../components/Layout/Tabs"
import { Switch, Route, Link, LinkProps, useRouteMatch } from "react-router-dom"
import { useEffect, useState } from "react"
import { Spacing } from "../../components/Layout/Spacing"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { Activity } from "../../components/Activity/Activity"


interface Props {
  user: User
}

const TABS = [ 
  {
    name: "creations",
    props: {
      to: "/"
    }
  },
  {
    name: "collection",
    props: {
      to: "/collection"
    }
  },
  {
    name: "on sale",
    props: {
      to: "/sales"
    }
  },
  {
    name: "activity",
    props: {
      to: "/activity"
    }
  }
]

type TabWrapperProps = LinkProps<any> & React.RefAttributes<HTMLAnchorElement>

const TabWrapper = ({ children, ...props }: TabWrapperProps) => (
  <Link {...props}>{ children }</Link>
)

export function UserItems({ user }: Props) {
  const [tabIndex, setTabIndex] = useState<number>(0)

  const matchCollection = useRouteMatch("/collection")
  const matchSales = useRouteMatch("/sales")
  const matchActivity = useRouteMatch("/activity")

  useEffect(() => {
    if (matchCollection) setTabIndex(1)
    else if (matchSales) setTabIndex(2)
    else if (matchActivity) setTabIndex(3)
    else setTabIndex(0)
  }, [matchCollection, matchSales, matchActivity])

  return (
    <section>
      <Tabs
        tabDefinitions={TABS}
        activeIdx={tabIndex}
        onChangeRequest={() => {}}
        tabsLayout="fixed-size"
        tabsClassName={cs(layout['padding-big'])}
        tabWrapperComponent={TabWrapper}
      />
      
      <Spacing size="x-large" />

      <section className={cs(layout['padding-big'])}>
        <Switch>
          <Route path="/collection">
            <CardsContainer>
              {user.objkts?.map(objkt => (
                <ObjktCard
                  key={objkt.id}
                  objkt={objkt}
                />
              ))}
            </CardsContainer>
          </Route>

          <Route path="/sales">
            <CardsContainer>
              {user.offers?.map(offer => (
                <ObjktCard
                  key={offer.objkt.id}
                  objkt={offer.objkt}
                />
              ))}
            </CardsContainer>
          </Route>

          <Route path="/activity">
            {user.actions && (
              <Activity actions={user.actions} className={cs(style.activity)} verbose={true} />
            )}
          </Route>

          <Route path="/">
            <CardsContainer>
              {user.generativeTokens?.map(token => (
                <GenerativeTokenCard
                  key={token.id}
                  token={token}
                />
              ))}
            </CardsContainer>
          </Route>
        </Switch>
      </section>
    </section>
  )
}