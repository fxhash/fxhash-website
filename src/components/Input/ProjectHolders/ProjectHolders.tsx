import style from "./ProjectHolders.module.scss"
import text from "../../../styles/Text.module.css"
import cs from "classnames"
import { Modal } from "../../Utils/Modal"
import { useContext, useEffect, useMemo, useState } from "react"
import { UserContext } from "../../../containers/UserProvider"
import { useLazyQuery, useQuery } from "@apollo/client"
import { Qu_userGenTokens } from "../../../queries/user"
import { InputMultiList, MultiListItem } from "../InputMultiList"
import { GenerativeToken } from "../../../types/entities/GenerativeToken"
import { LoaderBlock } from "../../Layout/LoaderBlock"
import { ipfsGatewayUrl } from "../../../services/Ipfs"
import { Field } from "../../Form/Field"
import { IOptions, Select } from "../Select"
import { Objkt } from "../../../types/entities/Objkt"
import { User } from "../../../types/entities/User"
import { Spacing } from "../../Layout/Spacing"
import { Submit } from "../../Form/Submit"
import { Button } from "../../Button"
import { Qu_genTokOwners } from "../../../queries/generative-token"
import { ISplit } from "../../../types/entities/Split"


enum EImportStrategy {
  FULL =                      "FULL",
  ONE_PER_USER_PER_PROJECT =  "ONE_PER_USER_PER_PROJECT",
  ONE_PER_USER =              "ONE_PER_USER",
}

interface IImportStrategyDefinition {
  label: string
  description: string
  getUsers: (gentks: Objkt[]) => ISplit[]
}

const importStrategyDefinitions: Record<EImportStrategy, IImportStrategyDefinition> = {
  FULL: {
    label: "Full import",
    description: "Holders will have as many slots as the total number of iterations they own",
    getUsers: (gentks) => {
      // maps user id -> number of slots
      const splitsMap: Record<string, number> = {}
      for (const gentk of gentks) {
        const id = gentk.owner!.id
        if (!splitsMap[id]) {
          splitsMap[id] = 0
        }
        splitsMap[id]++
      }
      return Object.keys(splitsMap).map(addr => ({
        address: addr,
        pct: splitsMap[addr],
      }))
    },
  },
  ONE_PER_USER_PER_PROJECT: {
    label: "One per user per project",
    description: "Holders will have as many slots as projects for which they hold at least one iteration. This limits the number of slots to 1 if a user holds 10 iterations of the same project.",
    getUsers: (gentks) => {
      // hashmap { project_id => [ owner ]}
      const mappedByProject: Record<number, User[]> = {}
      for (const gentk of gentks) {
        const id = gentk.issuer.id
        // create entry if none
        if (!mappedByProject[id]) {
          mappedByProject[id] = []
        }
        // only push user if not already in
        if (!mappedByProject[id].find(u => u.id === gentk.owner!.id)) {
          mappedByProject[id].push(gentk.owner!)
        }
      }
      // we can concatenate the owners in a single array
      const owners: User[] = Object.values(mappedByProject).reduce(
        (prev, curr) => prev.concat(curr),
        [] as User[]
      )
      // map { address -> nb_slots }
      const splitsMap: Record<string, number> = {}
      for (const user of owners) {
        if (!splitsMap[user.id]) {
          splitsMap[user.id] = 0
        }
        splitsMap[user.id]++
      }
      return Object.keys(splitsMap).map(addr => ({
        address: addr,
        pct: splitsMap[addr],
      }))
    },
  },
  ONE_PER_USER: {
    label: "One per user",
    description: "Holders will only get 1 slot regardless of how many iterations they own in total.",
    getUsers: (gentks) => {
      // maps user id -> number of slots
      const splitsMap: Record<string, number> = {}
      for (const gentk of gentks) {
        splitsMap[gentk.owner!.id] = 1
      }
      return Object.keys(splitsMap).map(addr => ({
        address: addr,
        pct: splitsMap[addr],
      }))
    },
  },
}

const importOptions: IOptions[] = Object.keys(EImportStrategy).map(
  (strategy) => ({
    value: strategy,
    label: importStrategyDefinitions[strategy as EImportStrategy].label,
  })
)

interface Props {
  onClose: () => void
  onImport: (splits: ISplit[]) => void
}
export function ProjectHolders({
  onClose,
  onImport,
}: Props) {
  // need user to find their projects
  const { user } = useContext(UserContext)

  // a list of the selected projects to use for the query
  const [selected, setSelected] = useState<number[]>([])
  // the import strategy
  const [importStrategy, setImportStrategy] = useState<EImportStrategy>(
    EImportStrategy.ONE_PER_USER_PER_PROJECT,
  )

  // query the projects of the user
  const { data } = useQuery(Qu_userGenTokens, {
    variables: {
      id: user!.id,
      skip: 0,
      take: 50,
    }
  })

  const options = useMemo<MultiListItem[]|null>(
    () => {
      if (!data || !data.user) return null
      const tokens: GenerativeToken[] = data.user.generativeTokens
      return tokens.map(tok => ({
        value: tok.id,
        props: tok,
      }))
    },
    [data]
  )

  // query to get the owners of some project
  const [
    getProjects, 
    { data: projects, loading: projectsLoading }
  ] = useLazyQuery(Qu_genTokOwners, {
    fetchPolicy: "no-cache",
    nextFetchPolicy: "no-cache",
  })

  // projects fetched, safe to use
  const projectsSafe: GenerativeToken[]|null = projects?.generativeTokens || null

  // when projects are fetched, we push to the parent
  useEffect(() => {
    if (projectsSafe) {
      // concatenates all the objkts from results
      const gentks = projectsSafe.reduce(
        (prev, curr) => prev.concat(
          curr.entireCollection!.map(
            gentk => ({
              ...gentk,
              issuer: {
                id: curr.id,
              } as GenerativeToken
            })
          )
        ),
        [] as Objkt[]
      )
      // apply the function to get a list of splits
      const splits = importStrategyDefinitions[importStrategy].getUsers(gentks)
      onImport(splits)
    }
  }, [projectsSafe])

  return (
    <Modal
      title="Import project holders"
      onClose={onClose}
      className={cs(style.modal)}
    >
      <div>
        <Field>
          <label>
            Select projects
            <small>
              A list of projects from which you want to import current holders.
            </small>
          </label>
          {options ? (
            <div className={cs(style.multi_wrapper)}>
              <InputMultiList
                listItems={options}
                selected={selected}
                onChangeSelected={setSelected}
              >
                {({ itemProps, selected }) => (
                  <div className={cs(style.project, {
                    [style.selected]: selected
                  })}>
                    <img src={ipfsGatewayUrl(itemProps.thumbnailUri)}/>
                    {itemProps.name}
                  </div>
                )}
              </InputMultiList>
            </div>
          ):(
            <LoaderBlock
              size="small"
              height="100px"
            />
          )}
        </Field>

        <Field>
          <label>
            Import strategy
          </label>
          <Select
            options={importOptions}
            value={importStrategy}
            onChange={setImportStrategy}
          />
          <Spacing size="8px"/>
          <span className={cs(text.info)}>
            {importStrategyDefinitions[importStrategy].description}
          </span>
        </Field>

        <Submit layout="center">
          <Button
            type="button"
            size="regular"
            color="secondary"
            disabled={selected.length === 0}
            state={projectsLoading ? "loading" : "default"}
            onClick={() => {
              getProjects({
                variables: {
                  filters: {
                    id_in: selected
                  }
                }
              })
            }}
          >
            import holders
          </Button>
        </Submit>
      </div>

    </Modal>
  )
}