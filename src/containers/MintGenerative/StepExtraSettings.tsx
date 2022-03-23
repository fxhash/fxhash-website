import style from "./StepExtraSettings.module.scss"
import layout from "../../styles/Layout.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { useMemo, useRef, useState } from "react"
import { GenTokenSettings } from "../../types/Mint"
import { Form } from "../../components/Form/Form"
import { Field } from "../../components/Form/Field"
import { Spacing } from "../../components/Layout/Spacing"
import { Fieldset } from "../../components/Form/Fieldset"
import { Checkbox } from "../../components/Input/Checkbox"
import { Button } from "../../components/Button"
import { cloneDeep } from "@apollo/client/utilities"
import { HashTest } from "../../components/Testing/HashTest"
import { ArtworkIframe, ArtworkIframeRef } from "../../components/Artwork/PreviewIframe"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { SquareContainer } from "../../components/Layout/SquareContainer"
import { Select } from "../../components/Input/Select"
import { HashList } from "../../components/Utils/HashList"
import { generateFxHash } from "../../utils/hash"


const initialSettings: Partial<GenTokenSettings> = {
  exploration: {
    preMint: {
      enabled: true,
      hashConstraints: null,
    },
    postMint: {
      enabled: true,
      hashConstraints: null,
    },
  }
}

const ExploreOptions = [
  {
    label: "Infinite",
    value: "infinite"
  },
  {
    label: "Constrained to a list of hashes",
    value: "constrained"
  }
]

export const StepExtraSettings: StepComponent = ({ state, onNext }) => {
  // STATES
  // form state (since not much data its ok to store there)
  const [settings, setSettings] = useState(state.settings ? cloneDeep(state.settings) : initialSettings)
  // current hash 
  const [hash, setHash] = useState<string>(generateFxHash())
  // the explore options
  const [preExploreOptions, setPreExploreOptions] = useState<string>("infinite")
  const [postExploreOptions, setPostExploreOptions] = useState<string>("infinite")

  // REFERENCES
  const iframeRef = useRef<ArtworkIframeRef>(null)

  // DERIVED FROM STATE
  // the url to display in the iframe
  const iframeUrl = useMemo<string>(() => {
    return `${ipfsGatewayUrl(state.cidUrlParams, "pinata-fxhash-safe")}?fxhash=${hash}`
  }, [hash])

  // FUNCTIONS
  // some setters to update the settings easily
  const updateExplorationSetting = (target: "preMint"|"postMint", setting: "enabled"|"hashConstraints", value: any) => {
    setSettings({
      ...settings,
      exploration: {
        ...settings.exploration,
        [target]: {
          ...settings.exploration![target],
          [setting]: value
        }
      }
    })
  }

  // add the current hash to the list of hashes of a mint category
  const addCurrentHash = (target: "preMint"|"postMint") => {
    const current = settings.exploration?.[target]?.hashConstraints || []
    if (!current.includes(hash)) {
      current.push(hash)
      updateExplorationSetting(target, "hashConstraints", current)
    }
  }

  // process the user input and turn inputs into a proper settings
  const onSubmit = (evt: any) => {
    evt.preventDefault()

    const cloned = cloneDeep(settings)
    // if explore options are set to infinite, we force hash list to be null
    if (preExploreOptions === "infinite" && cloned.exploration?.preMint?.hashConstraints) {
      cloned.exploration.preMint.hashConstraints = null
    }
    if (postExploreOptions === "infinite" && cloned.exploration?.postMint?.hashConstraints) {
      cloned.exploration.postMint.hashConstraints = null
    }
    // we can send the update of the settings to the next component in the tree
    onNext({ settings })
  }

  // ALIASES
  const preMintSettings = settings.exploration?.preMint
  const postMintSettings = settings.exploration?.postMint

  return (
    <div className={cs(style.container)}>
      <h3>Explore variations settings</h3>

      <p>These settings will help you define how much freedom users will have in exploring the variety of your Generative Token. When they land on the page of your Generative Token, a <strong>variations</strong> button can give them the ability to see more variations than the one you provided for the preview. These settings are independant from the random outputs collectors will generate when minting.</p>

      <p>If exploration is <strong>disabled</strong>, the variations buttons will be disabled on the Generative Token page.</p>

      <Spacing size="x-large"/>

      <Form onSubmit={onSubmit}>
        <div className={cs(layout.cols2)}>
          <div>
            <Fieldset>
              <h4>Pre-mint</h4>
              <p><em>Will be applied if your Generative Token is not fully minted.</em></p>
              <Field className={cs(style.checkbox)}>
                <Checkbox
                  name="premint-enabled"
                  value={preMintSettings?.enabled || false}
                  onChange={(_, event) => updateExplorationSetting("preMint", "enabled", !preMintSettings?.enabled)}
                >
                  exploration enabled
                </Checkbox>
              </Field>

              <div className={cs({ [style.field_disabled]: !preMintSettings?.enabled })}>
                <Spacing size="regular"/>
                <Field>
                  <label>Number of variations</label>
                  <Select
                    options={ExploreOptions}
                    value={preExploreOptions}
                    onChange={setPreExploreOptions}
                  />
                </Field>

                {preExploreOptions === "constrained" && (
                  <Field className={cs(layout.flex_column_left)}>
                    <div className={cs(style.field_header)}>
                      <label>List of hashes</label>
                      <Button
                        type="button"
                        color="black"
                        size="small"
                        onClick={() => addCurrentHash("preMint")}
                        iconComp={<i aria-hidden className="fas fa-plus-circle"/>}
                      >
                        Add current hash (on right) to list
                      </Button>
                    </div>
                    <div className={cs(style.hashlist_wrapper, {
                      [style.no_hash]: !(preMintSettings?.hashConstraints && preMintSettings?.hashConstraints.length)
                    })}>
                      {preMintSettings?.hashConstraints && preMintSettings?.hashConstraints.length > 0 ?(
                        <HashList
                          className={cs(style.hashlist)}
                          hashes={preMintSettings?.hashConstraints || []}
                          activeHash={hash}
                          onChange={(hashes) => updateExplorationSetting("preMint", "hashConstraints", hashes)}
                          onHashClick={setHash}
                        />
                      ):(
                        <span>
                          <em>No hash</em><br/>
                          <span>You must add a hash if using a constrained list of hashes</span>
                        </span>
                      )}
                    </div>
                  </Field>
                )}
              </div>
            </Fieldset>

            <Spacing size="x-large"/>

            <Fieldset>
              <h4>Post-mint</h4>
              <p><em>Will only be applied when your Generative Token is fully minted.</em></p>
              <Field className={cs(style.checkbox)}>
                <Checkbox
                  name="postmint-enabled"
                  value={postMintSettings?.enabled || false}
                  onChange={(_, event) => updateExplorationSetting("postMint", "enabled", !postMintSettings?.enabled)}
                >
                  exploration enabled
                </Checkbox>
              </Field>

              <div className={cs({ [style.field_disabled]: !postMintSettings?.enabled })}>
                <Spacing size="regular"/>
                <Field>
                  <label>Number of variations</label>
                  <Select
                    options={ExploreOptions}
                    value={postExploreOptions}
                    onChange={setPostExploreOptions}
                  />
                </Field>

                {postExploreOptions === "constrained" && (
                  <Field className={cs(layout.flex_column_left)}>
                    <div className={cs(style.field_header)}>
                      <label>List of hashes</label>
                      <Button
                        type="button"
                        color="black"
                        size="small"
                        onClick={() => addCurrentHash("postMint")}
                        iconComp={<i aria-hidden className="fas fa-plus-circle"/>}
                      >
                        Add current hash (on right) to list
                      </Button>
                    </div>
                    <div className={cs(style.hashlist_wrapper, {
                      [style.no_hash]: !(postMintSettings?.hashConstraints && postMintSettings?.hashConstraints.length)
                    })}>
                      {postMintSettings?.hashConstraints && postMintSettings?.hashConstraints.length > 0 ?(
                        <HashList
                          className={cs(style.hashlist)}
                          hashes={postMintSettings?.hashConstraints || []}
                          activeHash={hash}
                          onChange={(hashes) => updateExplorationSetting("postMint", "hashConstraints", hashes)}
                          onHashClick={setHash}
                        />
                      ):(
                        <span>
                          <em>No hash</em><br/>
                          <span>You must add a hash if using a constrained list of hashes</span>
                        </span>
                      )}
                    </div>
                  </Field>
                )}
              </div>
            </Fieldset>
          </div>

          <div>
            <HashTest
              autoGenerate={false}
              value={hash}
              onHashUpdate={setHash}
              onRetry={() => {
                iframeRef.current?.reloadIframe()
              }}
            />
            <Spacing size="regular"/>
            <SquareContainer>
                <ArtworkIframe
                  ref={iframeRef}
                  url={iframeUrl}
                  textWaiting="looking for content on IPFS"
                  // onLoaded={iframeLoaded}
                />
            </SquareContainer>
          </div>
        </div>

        <Spacing size="3x-large"/>
        
        <div className={cs(layout.y_centered)}>
          <Button
            type="submit"
            color="secondary"
          >
            next step
          </Button>
        </div>
      </Form>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
    </div>
  )
}