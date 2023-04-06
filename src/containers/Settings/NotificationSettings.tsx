import style from "./DisplaySettings.module.scss"
import styleSettings from "./Settings.module.scss"
import cs from "classnames"
import { Switch } from "../../components/Input/Switch"
import { ISettingsContext } from "../../context/Theme"
import { SettingsGroup } from "./SettingsGroup"
import { Slider } from "../../components/Input/Slider"

interface Props {
  settings: ISettingsContext
}

export function NotificationSettings({ settings }: Props) {
  return (
    <div className={cs(styleSettings.page)}>
      <SettingsGroup title="Notifications">
        <div className={cs(styleSettings.toggle_line)}>
          <span>
            <span>Mint tickets expiring</span>
            <span className={styleSettings.toggle_line_description}>
              Receive a daily alert when you have mint tickets expiring (going
              into dutch auction) in the next 48 hours
            </span>
          </span>
          <Switch
            onChange={(value) => settings.update("showMintTicketAlerts", value)}
            value={settings.showMintTicketAlerts}
          />
        </div>
        <div className={cs(styleSettings.toggle_line)}>
          <span>
            <span>Offers</span>
            <span className={styleSettings.toggle_line_description}>
              Receive a daily alert when you have a new offer
            </span>
          </span>
          <Switch
            onChange={(value) => settings.update("showOfferAlerts", value)}
            value={settings.showOfferAlerts}
          />
        </div>
        {settings.showOfferAlerts && (
          <div className={cs(styleSettings.toggle_line)}>
            <span>
              <span>Offer alert floor threshold</span>
              <span className={styleSettings.toggle_line_description}>
                The minimum price of an offer to trigger an alert in % of the
                current floor (lowest listed) price. E.g. if the floor of a
                collection is 10xtz and you receive a 4xtz offer, a floor
                threshold of 50% (5xtz) means you will not receive an alert.
              </span>
            </span>
            <div className={cs(style.labelled_slider)}>
              <Slider
                value={settings.offerAlertsFloorThreshold}
                onChange={(val) =>
                  settings.update("offerAlertsFloorThreshold", val)
                }
                className={cs(style.slider)}
                min={0}
                max={1}
                step={0.1}
              />
              <p>{settings.offerAlertsFloorThreshold * 100}%</p>
            </div>
          </div>
        )}
      </SettingsGroup>
    </div>
  )
}
