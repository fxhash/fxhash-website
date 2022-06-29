import style from "./TezosStorageSettings.module.scss"
import cs from "classnames"
import { TEditAttributeComp } from "../Blocks"
import { TabsContainer } from "../../../../Layout/TabsContainer"
import { TabDefinition } from "../../../../Layout/Tabs"
import { Submit } from "../../../../Form/Submit"
import { Button } from "../../../../Button"
import { Field } from "../../../../Form/Field"
import { InputReactiveSearch, InputReactSearchResultsRendererProps } from "../../../../Input/InputReactiveSearch"
import { GenerativeToken } from "../../../../../types/entities/GenerativeToken"
import { Fragment, useCallback, useState } from "react"
import { useApolloClient } from "@apollo/client"
import { Qu_searchGenTok } from "../../../../../queries/generative-token"
import { ipfsGatewayUrl } from "../../../../../services/Ipfs"
import { EntityBadge } from "../../../../User/EntityBadge"
import { FxhashContracts } from "../../../../../types/Contracts"

const tabs: TabDefinition[] = [
  { name: "Project" },
  { name: "Iteration" },
]

export const TezosStorageSettings: TEditAttributeComp = ({
  element,
  onEdit,
  children,
}) => {
  return (
    <div className={cs(style.root)}>
      <TabsContainer
        tabsLayout="full-width"
        tabDefinitions={tabs}
        tabsClassName={style.tab}
      >
        {({ tabIndex }) => (
          <div className={cs(style.content)}>
            {tabIndex === 0 ? (
              <div>
                <TezosStorageLoadProject
                  onImport={onEdit}
                />
              </div>
            ):(
              <div>iter</div>
            )}
          </div>
        )}
      </TabsContainer>
    </div>
  )
}

/**
 * Renderer for the projects for the Input Reactive Search 
 */
function ProjectsReactiveSearchResultsRenderer({
  results,
  children,
}: InputReactSearchResultsRendererProps<GenerativeToken>) {
  return (
    <div className={cs(style.search_results)}>
      {results?.map((token) => (
        <Fragment
          key={token.id}
        >
          {children?.({
            item: token
          })}
        </Fragment>
      ))}
    </div>
  )
}

interface IImportCompProps {
  onImport: (element: any) => void
}

/**
 * The component to load a Projecy
 */
function TezosStorageLoadProject({
  onImport,
}: IImportCompProps) {
  const client = useApolloClient()
  const [value, setValue] = useState<string>("")
  const [selected, setSelected] = useState<GenerativeToken|null>(null)

  const searchGenToken = (search: string) => {
    return client.query({
      query: Qu_searchGenTok,
      fetchPolicy: "no-cache",
      variables: {
        skip: 0,
        limit: 30,
        filters: {
          searchQuery_eq: search,
        },
        sort: {
          relevance: "DESC"
        }
      }
    })
  }

  const resultsIntoGenToks = (results: any): GenerativeToken[] => {
    if (!results || ! results.data || !results.data.generativeTokens) {
      return []
    }
    return results.data.generativeTokens
  }

  const valueFromToken = (token: GenerativeToken) => {
    return ""+token.id
  }

  // update the value and clear the selection
  const updateValue = useCallback((value: string) => {
    setValue(value)
    setSelected(null)
  }, [])

  // import the selected token, if any
  const importSelected = useCallback(() => {
    if (selected) {
      onImport({
        address: FxhashContracts.ISSUER,
        pKey: selected.id,
        pType: "FX-ISSUER-03",
        // todo: points to the spec based on version
        metadataSpec: "FX-GENERATIVE-02",
        bigmap: "ledger",
        value: "metadata",
      })
    }
  }, [selected])

  return (
    <div>
      <Field>
        <InputReactiveSearch
          value={value}
          onChange={updateValue}
          placeholder="project name, artist..."
          searchFn={searchGenToken}
          transformSearchResults={resultsIntoGenToks}
          valueFromResult={valueFromToken}
          RenderResults={ProjectsReactiveSearchResultsRenderer}
          className={cs(style.reactive_search)}
        >
          {({ item }) => (
            <button
              className={cs(style.search_result, {
                [style.selected]: selected?.id === item.id
              })}
              onClick={() => {
                setSelected(item)
              }}
            >
              <img
                src={ipfsGatewayUrl(item.thumbnailUri)}
                alt={item.name}
                className={cs(style.thumbnail)}
              />
              <div className={cs(style.details)}>
                <div>
                  #{item.id} <strong>{item.name}</strong>
                </div>
                <EntityBadge
                  user={item.author}
                  size="small"
                />
              </div>
            </button>
          )}
        </InputReactiveSearch>
      </Field>

      <Submit layout="center">
        <Button
          type="button"
          size="regular"
          color="secondary"
          disabled={selected === null}
          onClick={importSelected}
        >
          insert project
        </Button>
      </Submit>
    </div>
  )
}