import style from "./SettingsModal.module.scss"
import cs from "classnames"
import { Modal } from "../../components/Utils/Modal"
import { DisplaySettings } from "./DisplaySettings"
import { TabsContainer } from "../../components/Layout/TabsContainer"
import { TabDefinition } from "../../components/Layout/Tabs"
import { PropsWithChildren, useContext } from "react"
import { SettingsContext } from "../../context/Theme"
import { NotificationSettings } from "./NotificationSettings"

interface PropsTabWrapper {
  className: string
}
function TabWrapper({
  children,
  ...props
}: PropsWithChildren<PropsTabWrapper>) {
  return (
    <div {...props} className={cs(props.className, style.tab)}>
      {children}
    </div>
  )
}

const SettingTabs: TabDefinition[] = [
  {
    name: "display",
  },
  {
    name: "notifications",
  },
]

interface Props {
  onClose: () => void
}
export function SettingsModal({ onClose }: Props) {
  const settings = useContext(SettingsContext)

  return (
    <Modal title="Settings" onClose={onClose} className={cs(style.root)}>
      <TabsContainer
        tabsLayout="full-width"
        tabDefinitions={SettingTabs}
        tabWrapperComponent={TabWrapper}
      >
        {({ tabIndex }) => (
          <div className={cs(style.content)}>
            {tabIndex === 0 ? (
              <DisplaySettings settings={settings} />
            ) : tabIndex === 1 ? (
              <NotificationSettings settings={settings} />
            ) : tabIndex === 2 ? (
              <div>2</div>
            ) : null}

            {/* <span className={cs(style.info_bottom)}>
              you can propose customization settings on discord
            </span> */}
          </div>
        )}
      </TabsContainer>
    </Modal>
  )
}
