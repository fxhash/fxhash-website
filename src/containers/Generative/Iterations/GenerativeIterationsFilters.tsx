import { Dispatch, SetStateAction, useMemo } from "react"
import cs from "classnames"
import { useQuery } from "@apollo/client"
import { useBooleanFilters } from "hooks/useBooleanFilters"
import { InputRadioMultiButtons } from "components/Input/InputRadioMultiButtons"
import {
  GenerativeToken,
  GenerativeTokenFeature,
} from "../../../types/entities/GenerativeToken"
import {
  InputMultiList,
  MultiListItem,
} from "../../../components/Input/InputMultiList"
import {
  IObjktFeatureFilter,
  objktFeatureType,
  ObjktFilters,
} from "../../../types/entities/Objkt"
import { Qu_genTokenFeatures } from "../../../queries/generative-token"
import { FiltersSubGroup } from "../../../components/Exploration/FiltersSubGroup"
import { LoaderBlock } from "../../../components/Layout/LoaderBlock"
import { FiltersGroup } from "../../../components/Exploration/FiltersGroup"
import style from "./GenerativeIterationsFilters.module.scss"

interface IBooleanFilterDef {
  label: string
  value: keyof ObjktFilters
}

const iterationsFilters: IBooleanFilterDef[] = [
  {
    label: "For sale",
    value: "activeListing_exist",
  },
]

const redeemableIterationsFilters: IBooleanFilterDef[] = [
  {
    label: "Redeemable",
    value: "redeemable_eq",
  },
  {
    label: "Redeemed",
    value: "redeemed_eq",
  },
]

interface IFeatureListItems {
  name: string
  listItems: MultiListItem[]
}

interface Props {
  token: GenerativeToken
  featureFilters: IObjktFeatureFilter[]
  setFeatureFilters: Dispatch<SetStateAction<IObjktFeatureFilter[]>>
  objktFilters: ObjktFilters
  setObjktFilters: Dispatch<SetStateAction<ObjktFilters>>
}

export function GenerativeIterationsFilters({
  token,
  featureFilters,
  setFeatureFilters,
  objktFilters,
  setObjktFilters,
}: Props) {
  const { data, loading } = useQuery(Qu_genTokenFeatures, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: token.id,
    },
    fetchPolicy: "no-cache",
  })

  const features: GenerativeTokenFeature[] | null =
    data?.generativeToken?.features || null

  // process the features for easier display
  const processedFeatures = useMemo<IFeatureListItems[] | null>(() => {
    if (!features) return null

    // sort the traits by number of occurences
    const processed: IFeatureListItems[] = features.map((feature) => ({
      name: feature.name,
      listItems: feature.values
        .sort((a, b) => ("" + b.value < "" + a.value ? -1 : 1))
        .map((value) => ({
          value: value.value,
          props: {
            name: value.value,
            occur: value.occur,
          },
        })),
    }))
    return processed
  }, [features])

  const updateFeatureFilter = (name: string, values: any[]) => {
    const newFilters = featureFilters.filter((filter) => filter.name !== name)
    if (values.length > 0) {
      newFilters.push({
        name: name,
        values,
        type: objktFeatureType(values[0]),
      })
    }
    setFeatureFilters(newFilters)
  }

  // get flat array of feature names for initial filters
  const enabledFilters: string[] = featureFilters.map(
    (featureFilter) => featureFilter.name
  )

  const enforceMutuallyExclusiveFilters = (
    currentFilters: ObjktFilters,
    newFilters: ObjktFilters
  ) => {
    const hasRedeemableFilter =
      newFilters.redeemable_eq && currentFilters.redeemed_eq
    const hasRedeemedFilter =
      newFilters.redeemed_eq && currentFilters.redeemable_eq

    if (hasRedeemableFilter) return { ...newFilters, redeemed_eq: undefined }
    if (hasRedeemedFilter) return { ...newFilters, redeemable_eq: undefined }
    return newFilters
  }

  const booleanFiltersDef = useMemo(() => {
    if (token.redeemables.length > 0)
      return [...iterationsFilters, ...redeemableIterationsFilters]
    return iterationsFilters
  }, [token])

  const { booleanFilters, updateBooleanFilters } = useBooleanFilters({
    booleanFiltersDef,
    filters: objktFilters,
    setFilters: (newFilters) => {
      const enforcedFilters = enforceMutuallyExclusiveFilters(
        objktFilters,
        newFilters
      )
      setObjktFilters(enforcedFilters)
    },
  })

  return (
    <>
      <FiltersGroup title="Features">
        {loading ? (
          <LoaderBlock size="small" />
        ) : processedFeatures && processedFeatures.length > 0 ? (
          processedFeatures?.map((feature) => (
            <FiltersSubGroup
              key={feature.name}
              title={feature.name}
              expandDefault={enabledFilters.includes(feature.name)}
            >
              <InputMultiList
                listItems={feature.listItems}
                selected={
                  featureFilters.find((filter) => filter.name === feature.name)
                    ?.values || []
                }
                onChangeSelected={(values) =>
                  updateFeatureFilter(feature.name, values)
                }
                className={cs(style.multi_list)}
                btnClassName={cs(style.feature_trait_wrapper)}
              >
                {({ itemProps }) => (
                  <div className={cs(style.feature_trait)}>
                    <span>{"" + itemProps.name}</span>
                    <em>({itemProps.occur})</em>
                  </div>
                )}
              </InputMultiList>
            </FiltersSubGroup>
          ))
        ) : (
          <em className={cs(style.no_filters)}>No features</em>
        )}
      </FiltersGroup>
      <FiltersGroup title="Listings">
        <InputRadioMultiButtons
          options={booleanFiltersDef}
          value={booleanFilters}
          onChange={updateBooleanFilters}
        />
      </FiltersGroup>
    </>
  )
}
