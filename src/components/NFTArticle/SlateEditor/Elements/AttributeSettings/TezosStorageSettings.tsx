import style from "./TezosStorageSettings.module.scss"
import text from "../../../../../styles/Text.module.css"
import cs from "classnames"
import { TEditAttributeComp } from "../Blocks"
import { TabsContainer } from "../../../../Layout/TabsContainer"
import { TabDefinition } from "../../../../Layout/Tabs"
import { Submit } from "../../../../Form/Submit"
import { Button } from "../../../../Button"
import { Field } from "../../../../Form/Field"
import { InputReactiveSearch, InputReactSearchResultsRendererProps } from "../../../../Input/InputReactiveSearch"
import { GenerativeToken } from "../../../../../types/entities/GenerativeToken"
import { Fragment, useCallback, useMemo, useState } from "react"
import { useApolloClient, useQuery } from "@apollo/client"
import { Qu_genTokenAllIterations, Qu_searchGenTok } from "../../../../../queries/generative-token"
import { ipfsGatewayUrl } from "../../../../../services/Ipfs"
import { EntityBadge } from "../../../../User/EntityBadge"
import { FxhashContracts } from "../../../../../types/Contracts"
import { Spacing } from "../../../../Layout/Spacing"
import { ModalTitle } from "../../Utils/ModalTitle"
import { Objkt } from "../../../../../types/entities/Objkt"
import { LoaderBlock } from "../../../../Layout/LoaderBlock"
import { ImageIpfs } from "../../../../Medias/ImageIpfs"

const tabs: TabDefinition[] = [
  { name: "Project" },
  { name: "Iteration" },
]

export const TezosStorageSettings: TEditAttributeComp = ({
  element,
  onEdit,
  children,
}) => {
  // the selected project
  const [project, setProject] = useState<GenerativeToken|null>(null)
  // the selected iteration
  const [iteration, setIteration] = useState<Objkt|null>(null)

  // clears the selection -> state of iteration & project
  const clearSelection = useCallback(() => {
    setIteration(null)
    setProject(null)
  }, [])

  return (
    <div className={cs(style.root)}>
      <ModalTitle>
        Insert fxhash content
      </ModalTitle>
    
      <p className={cs(text.info)}>
        You can first select a project, and then insert the project itself or pick a particular iteration of the project.
      </p>
      <Spacing size="small"/>
      
      <div className={cs({
        [style.hidden]: !!project,
      })}>
        <TezosStorageLoadProject
          onChange={setProject}
        />
      </div>

      {project && (
        <div className={cs(style.selected_project_wrapper, {
          [style.disabled]: !!iteration,
        })}>
          <div className={cs(style.selected_project_title)}>
            <span>Selected project</span>
            <button
              type="button"
              onClick={clearSelection}
            >
              clear selection
              <i aria-hidden className="far fa-xmark"/>
            </button>
          </div>
          <div className={cs(style.selected_project)}>
            <ProjectRendererOneLine
              project={project}
            />
          </div>
        </div>
      )}

      {project && (
        <>
          <Spacing size="8px"/>
          <div className={cs(style.selected_project_wrapper, {
            [style.disabled]: !iteration
          })}>
            <div className={cs(style.selected_project_title)}>
              <span>
                {iteration
                  ? "Iteration selected"
                  : "You can select an iteration"
                }
              </span>
              {iteration && (
                <button
                  type="button"
                  onClick={() => setIteration(null)}
                >
                  clear selection
                  <i aria-hidden className="far fa-xmark"/>
                </button>
              )}
            </div>
            <div className={cs(style.selected_project)}>
              <ProjectIterationPicker
                project={project}
                selected={iteration}
                onChange={setIteration}
              />
            </div>
          </div>
        </>
      )}

      <Submit layout="center">
        <Button
          type="button"
          size="regular"
          color="secondary"
          disabled={!(project)}
          onClick={() => {}}
        >
          insert {iteration ? `iteration #${iteration.iteration}` : "project"}
        </Button>
      </Submit>
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


/**
 * The component to quickly search and explore projects, with a list to display
 * the projects.
 */
interface IImportCompProps {
  onChange: (project: GenerativeToken) => void
}
function TezosStorageLoadProject({
  onChange,
}: IImportCompProps) {
  const client = useApolloClient()
  const [value, setValue] = useState<string>("")

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
  }, [])

  // import the selected token, if any
  // const importSelected = useCallback(() => {
  //   if (selected) {
  //     onImport({
  //       address: FxhashContracts.ISSUER,
  //       pKey: selected.id,
  //       pType: "FX-ISSUER-03",
  //       // todo: points to the spec based on version
  //       metadataSpec: "FX-GENERATIVE-02",
  //       bigmap: "ledger",
  //       value: "metadata",
  //     })
  //   }
  // }, [selected])

  return (
    <div>
      <Field>
        <InputReactiveSearch
          value={value}
          onChange={updateValue}
          placeholder="search by project name, artist..."
          searchFn={searchGenToken}
          transformSearchResults={resultsIntoGenToks}
          valueFromResult={valueFromToken}
          RenderResults={ProjectsReactiveSearchResultsRenderer}
          className={cs(style.reactive_search)}
        >
          {({ item }) => (
            <button
              className={cs(style.search_result)}
              onClick={() => {
                onChange(item)
              }}
            >
              <ProjectRendererOneLine
                project={item}
              />
            </button>
          )}
        </InputReactiveSearch>
      </Field>
    </div>
  )
}


/**
 * A simple component to render a project with a one-liner
 */
interface IProjectRendererOneLineProps {
  project: GenerativeToken
}
function ProjectRendererOneLine({
  project,
}: IProjectRendererOneLineProps) {
  return (
    <div className={cs(style.project_one_liner)}>
      <img
        src={ipfsGatewayUrl(project.thumbnailUri)}
        alt={project.name}
        className={cs(style.thumbnail)}
      />
      <div className={cs(style.details)}>
        <div>
          #{project.id} <strong>{project.name}</strong>
        </div>
        <EntityBadge
          user={project.author}
          size="small"
        />
      </div>
    </div>
  )
}


/***
 * Component to select an iteration from a project
 */
interface IProjectIterationPickerProps {
  project: GenerativeToken
  selected: Objkt|null
  onChange: (value: Objkt|null) => void
}
function ProjectIterationPicker({
  project,
  selected,
  onChange,
}: IProjectIterationPickerProps) {
  const { data } = useQuery(Qu_genTokenAllIterations, {
    variables: {
      id: project.id,
    }
  })

  const iterations = useMemo<Objkt[] | null>(() => {
    if (data?.generativeToken?.entireCollection) {
      return [...data.generativeToken.entireCollection].reverse()
    }
    return null
  }, [data])

  return (
    <div className={cs(style.iterations_wrapper)}>
      {iterations ? (
        <div className={cs(style.iterations_container)}>
          {iterations.map((item) => (
            <button
              key={item.id}
              type="button"
              className={cs(style.iteration, {
                [style.selected]: selected?.id === item.id
              })}
              onClick={() => onChange(selected?.id === item.id ? null : item)}
            >
              <div className={cs(style.iteration__border)}/>
              <div className={cs(style.thumbnail_wrapper)}>
                <ImageIpfs
                  src={item.metadata!.thumbnailUri}
                />
              </div>
              <span>#{item.iteration}</span>
            </button>
          ))}
        </div>
      ):(
        <LoaderBlock
          size="small"
          height="100%"
        />
      )}
    </div>
  )
}