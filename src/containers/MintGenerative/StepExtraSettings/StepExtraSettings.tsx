import style from "./StepExtraSettings.module.scss"
import layout from "../../../styles/Layout.module.scss"
import cs from "classnames"
import { StepComponent } from "../../../types/Steps"
import { useRef, useState, useCallback } from "react"
import { cloneDeep } from "@apollo/client/utilities"
import { GenTokenSettings } from "../../../types/Mint"
import { Form } from "../../../components/Form/Form"
import { Spacing } from "../../../components/Layout/Spacing"
import { Button } from "../../../components/Button"
import { HashTest } from "../../../components/Testing/HashTest"
import {
  ArtworkIframe,
  ArtworkIframeRef,
} from "../../../components/Artwork/PreviewIframe"
import { SquareContainer } from "../../../components/Layout/SquareContainer"
import { LinkGuide } from "../../../components/Link/LinkGuide"
import {
  checkIsTabKeyActive,
  Tabs,
  TabDefinition,
} from "components/Layout/Tabs"
import { deserializeParams } from "components/FxParams/utils"
import { ControlsTest } from "components/Testing/ControlsTest"
import { IterationTest } from "components/Testing/IterationTest"
import { ArtworkFrame } from "components/Artwork/ArtworkFrame"
import { useRuntimeController } from "hooks/useRuntimeController"
import { truncateEnd } from "utils/strings"
import { VariantForm } from "./VariantForm"

const variantSettingsTabs = ["preMint", "postMint"] as const

export type VariantSettingsTabKey = typeof variantSettingsTabs[number]

const tabsDefinitions: TabDefinition[] = [
  { key: "preMint", name: "Pre-mint" },
  { key: "postMint", name: "Post-mint" },
]
const initialSettings: Partial<GenTokenSettings> = {
  exploration: {
    preMint: {
      enabled: true,
      hashConstraints: null,
      iterationConstraints: null,
      paramsConstraints: null,
    },
    postMint: {
      enabled: true,
      hashConstraints: null,
      iterationConstraints: null,
      paramsConstraints: null,
    },
  },
}

const ExploreOptions = [
  {
    label: "Infinite",
    value: "infinite",
  },
  {
    label: "Constrained to a list of hashes",
    value: "constrained",
  },
]

export const StepExtraSettings: StepComponent = ({ state, onNext }) => {
  const usesParams = !!state.previewInputBytes

  // REFERENCES
  const iframeRef = useRef<ArtworkIframeRef>(null)

  // STATES
  // form state (since not much data its ok to store there)
  const [selectedVariant, setSelectedVariant] = useState<number>(0)
  const [settings, setSettings] = useState(
    state.settings ? cloneDeep(state.settings) : initialSettings
  )

  const { runtime, controls } = useRuntimeController(iframeRef, {
    cid: state.cidUrlParams!,
    hash: state.previewHash,
    iteration: state.previewIteration || 1,
  })

  // the explore options
  const [preExploreOptions, setPreExploreOptions] = useState<string>("infinite")
  const [postExploreOptions, setPostExploreOptions] =
    useState<string>("infinite")

  // FUNCTIONS
  // some setters to update the settings easily
  const updateExplorationSetting = (
    target: VariantSettingsTabKey,
    setting:
      | "enabled"
      | "hashConstraints"
      | "iterationConstraints"
      | "paramsConstraints",
    value: any
  ) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      exploration: {
        ...currentSettings.exploration,
        [target]: {
          ...currentSettings.exploration![target],
          [setting]: value,
        },
      },
    }))
  }

  // add current variant (token state) to the list of variants
  const addCurrentVariant = (target: VariantSettingsTabKey) => {
    const currentHashConstraints =
      settings.exploration?.[target]?.hashConstraints || []
    const currentIterationConstraints =
      settings.exploration?.[target]?.iterationConstraints || []
    const currentParamConstraints =
      settings.exploration?.[target]?.paramsConstraints || []

    if (!usesParams) {
      const combinationExists = currentHashConstraints.some(
        (existingHash, index) => {
          const pairedIteration = currentIterationConstraints[index]
          return (
            existingHash === runtime.state.hash &&
            pairedIteration === runtime.state.iteration
          )
        }
      )

      if (!combinationExists) {
        currentHashConstraints.push(runtime.state.hash)
        updateExplorationSetting(
          target,
          "hashConstraints",
          currentHashConstraints
        )
        currentIterationConstraints.push(runtime.state.iteration)
        updateExplorationSetting(
          target,
          "iterationConstraints",
          currentIterationConstraints
        )
      }
    } else {
      const combinationExists = currentHashConstraints.some(
        (existingHash, index) => {
          const pairedInputBytes = currentParamConstraints[index]
          const pairedIteration = currentIterationConstraints[index]
          return (
            existingHash === runtime.state.hash &&
            pairedInputBytes === runtime.details.params.inputBytes &&
            pairedIteration === runtime.state.iteration
          )
        }
      )
      if (!combinationExists && runtime.details.params.inputBytes) {
        currentHashConstraints.push(runtime.state.hash)
        updateExplorationSetting(
          target,
          "hashConstraints",
          currentHashConstraints
        )
        currentIterationConstraints.push(runtime.state.iteration)
        updateExplorationSetting(
          target,
          "iterationConstraints",
          currentIterationConstraints
        )
        currentParamConstraints.push(runtime.details.params.inputBytes)
        updateExplorationSetting(
          target,
          "paramsConstraints",
          currentParamConstraints
        )
      }
    }
  }

  // process the user input and turn inputs into a proper settings
  const onSubmit = (evt: any) => {
    evt.preventDefault()

    const cloned = cloneDeep(settings)
    // if explore options are set to infinite, we force hash list to be null
    if (preExploreOptions === "infinite") {
      const preMint = cloned.exploration?.preMint
      if (preMint?.hashConstraints) preMint.hashConstraints = null
      if (preMint?.iterationConstraints) preMint.iterationConstraints = null
      if (preMint?.paramsConstraints) preMint.paramsConstraints = null
    }
    if (postExploreOptions === "infinite") {
      const postMint = cloned.exploration?.postMint
      if (postMint?.hashConstraints) postMint.hashConstraints = null
      if (postMint?.iterationConstraints) postMint.iterationConstraints = null
      if (postMint?.paramsConstraints) postMint.paramsConstraints = null
    }
    // we can send the update of the settings to the next component in the tree
    onNext({ settings: cloned })
  }

  const [activeTab, setActiveTab] = useState<VariantSettingsTabKey>("preMint")

  const handleClickTab = useCallback(
    (newIdx, newDef) => {
      setActiveTab(newDef.key)
    },
    [setActiveTab]
  )

  // ALIASES
  const preMintSettings = settings.exploration?.preMint
  const postMintSettings = settings.exploration?.postMint

  const setVariant = (
    index: number,
    hash: string,
    iteration: number,
    paramBytes?: string
  ) => {
    setSelectedVariant(index)
    runtime.state.update({ hash, iteration })
    if (runtime.definition.params && paramBytes) {
      const data = deserializeParams(paramBytes, runtime.definition.params, {
        withTransform: true,
      })
      // update the control & force refresh the runtime
      controls.updateParams(data, true)
    }
  }

  const translateInputBytes = (bytes: string) => {
    if (!runtime.definition.params) return ""
    const data = deserializeParams(bytes, runtime.definition.params, {})
    return truncateEnd(Object.values(data).join(", "), 100)
  }

  return (
    <div className={cs(style.container)}>
      <h3>Explore variations settings</h3>

      <p>
        These settings will help you define how much freedom users will have in
        exploring the variety of your Generative Token. When they land on the
        page of your Generative Token, the <strong>variations</strong> button
        can give them the ability to see more variations than the one you
        provided for the preview. These settings are independent from the random
        outputs collectors will generate when minting.
      </p>

      {usesParams && (
        <p>
          For projects using fx(params), the <strong>explore params</strong>{" "}
          button allows users to navigate the parameter space of your Generative
          Token.
        </p>
      )}

      <p>
        If exploration is <strong>disabled</strong>, the{" "}
        <strong>variations</strong>{" "}
        {usesParams ? (
          <>
            and <strong>explore params</strong> buttons
          </>
        ) : (
          "button"
        )}{" "}
        will be inactive on the Generative Token page.
      </p>

      <LinkGuide
        href="/doc/artist/project-settings#explore-variation-settings"
        newTab
      >
        read more on the explore variation settings
      </LinkGuide>

      <Spacing size="x-large" />

      <div className={cs(layout.cols2)}>
        <div>
          <Form>
            <Tabs
              onClickTab={handleClickTab}
              checkIsTabActive={checkIsTabKeyActive}
              tabDefinitions={tabsDefinitions}
              activeIdx={activeTab}
            />
            <Spacing size="x-small" />
            {activeTab === "preMint" && (
              <VariantForm
                withParams={usesParams}
                target="preMint"
                settings={preMintSettings}
                exploreOption={preExploreOptions}
                onChangeExploreOption={setPreExploreOptions}
                onChangeExplorationSettings={updateExplorationSetting}
                activeVariant={selectedVariant}
                onClickVariant={setVariant}
                onAdd={addCurrentVariant}
                translateInputBytes={translateInputBytes}
              />
            )}
            {activeTab === "postMint" && (
              <VariantForm
                withParams={usesParams}
                target="postMint"
                settings={postMintSettings}
                exploreOption={postExploreOptions}
                onChangeExploreOption={setPostExploreOptions}
                onChangeExplorationSettings={updateExplorationSetting}
                activeVariant={selectedVariant}
                onClickVariant={setVariant}
                onAdd={addCurrentVariant}
                translateInputBytes={translateInputBytes}
              />
            )}
          </Form>
          <Spacing size="x-large" />
          <h4>Variant Configuration</h4>
          <Spacing size="regular" />
          <HashTest
            autoGenerate={false}
            value={runtime.state.hash}
            onHashUpdate={(hash) => runtime.state.update({ hash })}
            onRetry={() => {
              iframeRef.current?.reloadIframe()
            }}
          />
          <Spacing size="x-large" />
          {{ preMint: preExploreOptions, postMint: postExploreOptions }[
            activeTab
          ] !== "infinite" && (
            <p className={style.info_text}>
              N.B. if your project utilizes fxiteration, the iteration number
              below will be injected into the variant along with the hash
              {usesParams ? " and params" : ""}; it will be otherwise ignored.
            </p>
          )}
          <IterationTest
            autoGenerate={false}
            value={runtime.state.iteration}
            onIterationUpdate={(iteration) =>
              runtime.state.update({
                iteration,
              })
            }
          />
          {usesParams && runtime.definition.params && (
            <>
              <Spacing size="x-large" />
              <ControlsTest
                definition={controls.state.params.definition}
                params={controls.state.params.values}
                updateParams={controls.updateParams}
                onSubmit={controls.hardSync}
              />
            </>
          )}
        </div>

        <div>
          <Spacing size="regular" />
          <div className={style.artworkWrapper}>
            <ArtworkFrame>
              <SquareContainer>
                <ArtworkIframe
                  ref={iframeRef}
                  textWaiting="looking for content on IPFS"
                />
              </SquareContainer>
            </ArtworkFrame>
          </div>
        </div>
      </div>

      <Spacing size="3x-large" sm="x-large" />

      <div className={cs(layout.y_centered)}>
        <Button
          onClick={onSubmit}
          type="submit"
          size="large"
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right" />}
          iconSide="right"
          className={style.button}
        >
          next step
        </Button>
      </div>

      <Spacing size="3x-large" />
      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />
    </div>
  )
}
