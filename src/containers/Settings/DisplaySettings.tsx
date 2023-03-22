import style from "./DisplaySettings.module.scss"
import styleSettings from "./Settings.module.scss"
import cs from "classnames"
import { useMemo } from "react"
import { Switch } from "../../components/Input/Switch"
import { ISettingsContext } from "../../context/Theme"
import { SettingsGroup } from "./SettingsGroup"
import { GenerativeTokenCard } from "../../components/Card/GenerativeTokenCard"
import { fakeGenerativeToken } from "../../utils/generative-token"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Card } from "../../components/Card/Card"
import { Slider } from "../../components/Input/Slider"
import { ObjktCard } from "../../components/Card/ObjktCard"
import { fakeGentk } from "../../utils/gentk"
import { Objkt } from "../../types/entities/Objkt"
import { MasonryCardsContainer } from "../../components/Card/MasonryCardsContainer"
import { CardsContainer } from "../../components/Card/CardsContainer"
import { Select } from "components/Input/Select"
import { marketplaceSortOptions } from "containers/Marketplace/GenerativeListings"

interface Props {
  settings: ISettingsContext
  className?: string
}

const NUM_MASONRY_BOXES = 10
const SIZE_MASONRY_BOXES = 60

export function DisplaySettings({ settings, className }: Props) {
  const randomSizes = useMemo(
    () => [...Array(NUM_MASONRY_BOXES)].map(() => Math.random()),
    []
  )
  const CContainer = settings.layoutMasonry
    ? MasonryCardsContainer
    : CardsContainer

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
            <span className={styleSettings.toggle_line_description}>
              Display image previews instead of real-time code
            </span>
          </span>
          <Switch
            onChange={(value) => settings.update("quality", value ? 0 : 1)}
            value={!settings.quality}
          />
        </div>
        <div className={cs(styleSettings.toggle_line)}>
          <span>
            <span>NSFW</span>
            <span className={styleSettings.toggle_line_description}>
              Hide content that contains nudity, violence and sensitive content.
            </span>
          </span>
          <Switch
            onChange={(value) => settings.update("nsfw", value)}
            value={settings.nsfw}
          />
        </div>
        <div className={cs(styleSettings.toggle_line)}>
          <span>
            <span>Epilepsy</span>
            <span className={styleSettings.toggle_line_description}>
              Hide tokens that contain epilepsy, vestibular and photosensitive
              triggers
            </span>
          </span>
          <Switch
            onChange={(value) => settings.update("epilepsy", value)}
            value={settings.epilepsy}
          />
        </div>
        <div className={cs(styleSettings.toggle_line)}>
          <span>
            <span>Default marketplace sorting</span>
            <span className={styleSettings.toggle_line_description}>
              The default sort order for marketplace listings
            </span>
          </span>
          <Select
            value={settings.preferredMarketplaceSorting}
            options={marketplaceSortOptions}
            onChange={(value) =>
              settings.update("preferredMarketplaceSorting", value)
            }
          />
        </div>
      </SettingsGroup>
      <hr />
      <SettingsGroup title="Layout">
        <div className={style.settings_layout}>
          <div className={style.layout_controls}>
            <div className={cs(styleSettings.toggle_line)}>
              <span>Masonry</span>
              <Switch
                onChange={(value) => settings.update("layoutMasonry", value)}
                value={settings.layoutMasonry}
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
          </div>
          <div className={style.masonry_container}>
            <CContainer
              cardSize={SIZE_MASONRY_BOXES}
              emptyDivs={0}
              style={{
                gap: "calc(var(--cards-gap) * 0.5)",
              }}
            >
              {randomSizes.map((size, i) => (
                <div
                  key={`mini_card-${size}-${i}`}
                  className={cs(style.mini_card, {
                    [style.mini_card_masonry]: settings.layoutMasonry,
                  })}
                  style={{
                    height: SIZE_MASONRY_BOXES + size * SIZE_MASONRY_BOXES,
                  }}
                />
              ))}
            </CContainer>
          </div>
        </div>
      </SettingsGroup>
      <hr />
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
      <hr />
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
      <hr />
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
