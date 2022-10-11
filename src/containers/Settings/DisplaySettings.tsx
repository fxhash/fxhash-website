import style from "./DisplaySettings.module.scss"
import styleSettings from "./Settings.module.scss"
import cs from "classnames"
import { useContext, useEffect, useRef, useState } from "react"
import { Switch } from "../../components/Input/Switch"
import { ISettingsContext, SettingsContext } from "../../context/Theme"
import { SettingsGroup } from "./SettingsGroup"
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard"
import { fakeGenerativeToken } from "../../utils/generative-token"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Card } from "../../components/Card/Card"
import { Slider } from "../../components/Input/Slider"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { fakeGentk } from "../../utils/gentk"
import { Objkt } from "../../types/entities/Objkt"

interface Props {
  settings: ISettingsContext
  className?: string
}
export function DisplaySettings({ settings, className }: Props) {
  return (
    <div className={cs(styleSettings.page)}>
      <SettingsGroup title="General">
        <div className={cs(styleSettings.toggle_line)}>
          <span>Dark mode</span>
          <Switch
            onChange={(value) => settings.update("darkTheme", value)}
            value={settings.darkTheme}
          />
        </div>
        <div className={cs(styleSettings.toggle_line)}>
          <span>
            <span>Image previews</span>
            <em>Display image previews instead of real-time code</em>
          </span>
          <Switch
            onChange={(value) => settings.update("quality", value ? 0 : 1)}
            value={!settings.quality}
          />
        </div>
        <div className={cs(styleSettings.toggle_line)}>
          <span>
            <span>NSFW</span>
            <em>
              Display without warning content that contains nudity, violence and
              sensitive content.
            </em>
          </span>
          <Switch
            onChange={(value) => settings.update("nsfw", value)}
            value={settings.nsfw}
          />
        </div>
        <div className={cs(styleSettings.toggle_line)}>
          <span>
            <span>Epilepsy</span>
            <em>Hide tokens that contains epilepsy triggers</em>
          </span>
          <Switch
            onChange={(value) => settings.update("epilepsy", value)}
            value={settings.epilepsy}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup title="Cards design">
        <div className={cs(style.settings_card)}>
          <div className={cs(style.settings_controls)}>
            <div className={cs(styleSettings.toggle_line)}>
              <span>Border width</span>
              <Slider
                value={settings.borderWidthCards}
                onChange={(val) => settings.update("borderWidthCards", val)}
                className={cs(style.slider)}
                min={0}
                max={4}
                step={1}
              />
            </div>
            <div className={cs(styleSettings.toggle_line)}>
              <span>Shadow</span>
              <Slider
                value={settings.shadowCards}
                onChange={(val) => settings.update("shadowCards", val)}
                className={cs(style.slider)}
                min={0}
                max={30}
                step={1}
              />
            </div>
            <div className={cs(styleSettings.toggle_line)}>
              <span>Gap between cards</span>
              <Slider
                value={settings.spaceBetweenCards}
                onChange={(val) => settings.update("spaceBetweenCards", val)}
                className={cs(style.slider)}
                min={0}
                max={30}
                step={1}
              />
            </div>
            <div className={cs(styleSettings.toggle_line)}>
              <span>Hover effect</span>
              <Switch
                onChange={(value) => settings.update("hoverEffectCard", value)}
                value={settings.hoverEffectCard}
              />
            </div>
          </div>
          <div className={cs(style.card_wrapper)}>
            <Card>
              <h5>Card design</h5>
              <br />
              <span>Some random card</span>
            </Card>
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Generative token cards">
        <div className={cs(style.settings_card)}>
          <div className={cs(style.settings_controls)}>
            <div className={cs(styleSettings.toggle_line)}>
              <span>Display infos</span>
              <Switch
                onChange={(value) =>
                  settings.update("displayInfosGenerativeCard", value)
                }
                value={settings.displayInfosGenerativeCard}
              />
            </div>
            <div
              className={cs(styleSettings.toggle_line, {
                [styleSettings.disabled]: !settings.displayInfosGenerativeCard,
              })}
            >
              <span>Display prices</span>
              <Switch
                onChange={(value) =>
                  settings.update("displayPricesCard", value)
                }
                value={settings.displayPricesCard}
              />
            </div>
            <div
              className={cs(styleSettings.toggle_line, {
                [styleSettings.disabled]: !settings.displayInfosGenerativeCard,
              })}
            >
              <span>Display editions burnt</span>
              <Switch
                onChange={(value) => settings.update("displayBurntCard", value)}
                value={settings.displayBurntCard}
              />
            </div>
          </div>
          <div className={cs(style.card_wrapper)}>
            <GenerativeTokenCard
              token={fakeGenerativeToken as GenerativeToken}
              displayPrice={settings.displayPricesCard}
              displayDetails={settings.displayInfosGenerativeCard}
            />
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup title="Gentk cards">
        <div className={cs(style.settings_card)}>
          <div className={cs(style.settings_controls)}>
            <div className={cs(styleSettings.toggle_line)}>
              <span>Display infos</span>
              <Switch
                onChange={(value) =>
                  settings.update("displayInfosGentkCard", value)
                }
                value={settings.displayInfosGentkCard}
              />
            </div>
          </div>
          <div className={cs(style.card_wrapper)}>
            <ObjktCard objkt={fakeGentk as Objkt} />
          </div>
        </div>
      </SettingsGroup>
    </div>
  )
}
