import style from "./GenerativeIterationsFilters.module.scss"
import cs from "classnames"
import { FiltersGroup } from "../../../components/Exploration/FiltersGroup"
import { Dispatch, SetStateAction, useCallback, useMemo } from "react"
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
import { useQuery } from "@apollo/client"
import {
  InputRadioButtons,
  RadioOption,
} from "../../../components/Input/InputRadioButtons"

const ActiveListingsOptions: RadioOption[] = [
  {
    value: undefined,
    label: "All",
  },
  {
    value: true,
    label: "For sale",
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
  objtkFilters: ObjktFilters
  setObjtkFilters: Dispatch<SetStateAction<ObjktFilters>>
}
export function GenerativeIterationsFilters({
  token,
  featureFilters,
  setFeatureFilters,
  objtkFilters,
  setObjtkFilters,
}: Props) {
  const { data, loading } = useQuery(Qu_genTokenFeatures, {
    notifyOnNetworkStatusChange: true,
    variables: {
      id: token.id,
    },
    fetchPolicy: "no-cache",
  })

  const handleChangeFilters = useCallback(
    (field) => (option: boolean | undefined) => {
      setObjtkFilters((oldFilters) => ({
        ...oldFilters,
        [field]: option,
      }))
    },
    [setObjtkFilters]
  )

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

  return (
    <>
      <FiltersGroup title="Features">
        {loading ? (
          <LoaderBlock size="small" />
        ) : processedFeatures && processedFeatures.length > 0 ? (
          processedFeatures?.map((feature) => (
            <FiltersSubGroup key={feature.name} title={feature.name}>
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
                {({ itemProps, selected }) => (
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
        <InputRadioButtons
          value={objtkFilters.activeListing_exist}
          onChange={handleChangeFilters("activeListing_exist")}
          options={ActiveListingsOptions}
        />
      </FiltersGroup>
    </>
  )
}
