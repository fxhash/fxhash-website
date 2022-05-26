import style from "./ObjktTabs.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { useState } from "react"
import { Objkt } from "../../types/entities/Objkt"
import { Spacing } from "../../components/Layout/Spacing"
import { TabsContainer } from "../../components/Layout/TabsContainer"
import { Activity } from "../../components/Activity/Activity"
import { ListOffers } from "../../components/List/ListOffers"

interface Props {
  objkt: Objkt
}
export function ObjktTabs({
  objkt,
}: Props) {
  return (
    <TabsContainer
      tabDefinitions={[
        {
          name: "activity"
        },
        {
          name: `offers (${objkt.offers?.length || 0})`
        }
      ]}
      tabsLayout="fixed-size"
    >
      {({ tabIndex }) => (
        <section className={cs(layout['padding-big'])}>    
          <Spacing size="3x-large" />
          {tabIndex === 0 ? (
            <div className={cs(style.activity_wrapper)}>
              <Activity 
                actions={objkt.actions}
                className={cs(style.activity)}
              />
            </div>
          ):tabIndex === 1 ? (
            <div className={cs(style.activity_wrapper)}>
              <ListOffers
                objkt={objkt}
                offers={objkt.offers!}
                className={cs(style.activity)}
              />
            </div>
          ):null}
        </section>
      )}
    </TabsContainer>
  )
}