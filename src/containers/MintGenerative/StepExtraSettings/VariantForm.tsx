import { Fieldset } from "components/Form/Fieldset"
import { Checkbox } from "components/Input/Checkbox"
import { Select } from "components/Input/Select"
import { Spacing } from "components/Layout/Spacing"
import { HashList } from "components/Utils/HashList"
import { Field } from "components/Form/Field"
import { forwardRef, useState, ReactNode } from "react"
import cs from "classnames"
import style from "./StepExtraSettings.module.scss"
import { Button } from "components/Button"
import layout from "../../../styles/Layout.module.scss"
import { VariantSettingsTabKey } from "./StepExtraSettings"

const EXPLORATION_OPTIONS_HASH = [
  {
    label: "Infinite",
    value: "infinite",
  },
  {
    label: "Constrained to a list of hashes",
    value: "constrained",
  },
]

const EXPLORATION_OPTIONS_PARAMS = [
  {
    label: "Infinite",
    value: "infinite",
  },
  {
    label: "Constrained to a list of hashes and params",
    value: "constrained",
  },
]

type VariantTarget = VariantSettingsTabKey

const TARGET_DESCRIPTIONS: Record<string, ReactNode> = {
  postMint: (
    <>Will only be applied when your Generative Token is fully minted.</>
  ),
  preMint: <>Will be applied if your Generative Token is not fully minted.</>,
}

const TARGET_HEADLINE: Record<string, string> = {
  postMint: "Post-mint",
  preMint: "Pre-mint",
}

interface VariantFormProps {
  withParams?: boolean
  target: VariantTarget
  settings?: {
    enabled: boolean
    hashConstraints?: string[] | null
    paramsConstraints?: string[] | null
  }
  onChangeExplorationSettings: (
    target: VariantTarget,
    setting: "enabled" | "hashConstraints" | "paramsConstraints",
    value: any
  ) => void
  exploreOption: string
  onChangeExploreOption: (option: string) => void
  activeHash: string
  onClickVariant: (hash: string, param?: string) => void
  onAdd: (target: VariantTarget) => void
}

const ADD_BUTTON_LABELS: Record<string, ReactNode> = {
  params: "Add current hash and params (below) to list",
  hash: "Add current hash (below) to list",
}

const EMPTY_LABELS: Record<string, ReactNode> = {
  params: (
    <span>
      <em>No hash and params</em>
      <br />
      <span>You must add a hash and params if using a constrained list</span>
    </span>
  ),
  hash: (
    <span>
      <em>No hash</em>
      <br />
      <span>You must add a hash if using a constrained list</span>
    </span>
  ),
}

const EXPLORATION_OPTIONS = {
  params: EXPLORATION_OPTIONS_PARAMS,
  hash: EXPLORATION_OPTIONS_HASH,
}

export function VariantForm(props: VariantFormProps) {
  const {
    withParams = false,
    target,
    activeHash,
    settings,
    onChangeExplorationSettings,
    exploreOption,
    onChangeExploreOption,
    onClickVariant,
    onAdd,
  } = props

  const labelTarget = withParams ? "params" : "hash"
  const { hashConstraints, paramsConstraints } = settings || {}

  return (
    <Fieldset>
      <h4>{TARGET_HEADLINE[target]}</h4>
      <p>
        <em>{TARGET_DESCRIPTIONS[target]}</em>
      </p>
      <Field className={cs(style.checkbox)}>
        <Checkbox
          name={`${target}-enabled`}
          value={settings?.enabled || false}
          onChange={(_, event) =>
            onChangeExplorationSettings(target, "enabled", !settings?.enabled)
          }
        >
          exploration enabled
        </Checkbox>
      </Field>

      <div
        className={cs({
          [style.field_disabled]: !settings?.enabled,
        })}
      >
        <Spacing size="regular" />
        <Field>
          <label>Number of variations</label>
          <Select
            options={EXPLORATION_OPTIONS[labelTarget]}
            value={exploreOption}
            onChange={onChangeExploreOption}
          />
        </Field>

        {exploreOption === "constrained" && (
          <Field className={cs(layout.flex_column_left)}>
            <div className={cs(style.field_header)}>
              <label>List of variants ({hashConstraints?.length})</label>
              <Button
                type="button"
                color="black"
                size="small"
                onClick={() => onAdd(target)}
                iconComp={<i aria-hidden className="fas fa-plus-circle" />}
              >
                {ADD_BUTTON_LABELS[labelTarget]}
              </Button>
            </div>
            <div
              className={cs(style.hashlist_wrapper, {
                [style.no_hash]: !(hashConstraints && hashConstraints?.length),
              })}
            >
              {hashConstraints && hashConstraints.length > 0 ? (
                <HashList
                  className={cs(style.hashlist)}
                  hashes={hashConstraints || []}
                  params={paramsConstraints}
                  activeHash={activeHash}
                  onChange={(hashes, params) => {
                    onChangeExplorationSettings(
                      target,
                      "hashConstraints",
                      hashes
                    )
                    if (params) {
                      onChangeExplorationSettings(
                        target,
                        "paramsConstraints",
                        params
                      )
                    }
                  }}
                  onHashClick={onClickVariant}
                />
              ) : (
                EMPTY_LABELS[labelTarget]
              )}
            </div>
          </Field>
        )}
      </div>
    </Fieldset>
  )
}
