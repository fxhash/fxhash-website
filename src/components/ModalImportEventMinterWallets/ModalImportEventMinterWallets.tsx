import { useCallback, useEffect, useMemo, useState } from "react"
import cs from "classnames"
import { createEventsClient } from "services/EventsClient"
import { Qu_eventsLiveMintingWallets } from "queries/events/events"
import { ISplit } from "../../types/entities/Split"
import { InputMultiList, MultiListItem } from "../Input/InputMultiList"
import { LoaderBlock } from "../Layout/LoaderBlock"
import { Field } from "../Form/Field"
import { Button } from "../Button"
import { Modal } from "../Utils/Modal"
import style from "./ModalImportEventMinterWallets.module.scss"

interface Props {
  numEditions: number
  onClose: () => void
  onImport: (splits: ISplit[]) => void
}

interface EventData {
  id: string
  liveMintingWallets: { publicKey: string }[]
}

const eventsClient = createEventsClient()

export function ModalImportEventMinterWallets({
  numEditions,
  onClose,
  onImport,
}: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [data, setData] = useState<EventData[] | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchLiveMintingEvents = async () => {
    try {
      const response = await eventsClient.query({
        query: Qu_eventsLiveMintingWallets,
        variables: {
          where: {
            liveMinting: {
              equals: true,
            },
          },
        },
      })
      setData(response.data.events)
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveMintingEvents()
  }, [])

  const options = useMemo<MultiListItem[] | null>(() => {
    if (!data) return null
    return data.map((event) => ({
      value: event.id,
      props: event,
    }))
  }, [data])

  const handleClickImport = useCallback(() => {
    const selectedOptions = options?.filter((option) =>
      selected.includes(option.value)
    )
    const wallets = selectedOptions?.flatMap(
      (option) => option.props.liveMintingWallets
    )
    const splits =
      wallets?.map((wallet) => ({
        address: wallet.publicKey,
        pct: numEditions,
      })) || []
    onImport(splits)
  }, [options, selected, numEditions, onImport])

  return (
    <Modal
      title="Import free live minting wallets"
      onClose={onClose}
      className={cs(style.modal)}
    >
      <div>
        <Field>
          <label>
            Select event
            <small>
              Which event do you want to import the free live minting wallets
              from?
            </small>
          </label>
          {options ? (
            <div className={cs(style.multi_wrapper)}>
              <InputMultiList
                listItems={options}
                selected={selected}
                onChangeSelected={setSelected}
              >
                {({ itemProps }) => (
                  <div className={cs(style.event)}>{itemProps.name}</div>
                )}
              </InputMultiList>
            </div>
          ) : (
            <LoaderBlock size="small" height="100px" />
          )}
        </Field>

        {!loading && !data && (
          <div className={cs(style.empty)}>
            No free live minting events found
          </div>
        )}

        <div className={style.container_import}>
          <Button
            type="button"
            size="regular"
            color="secondary"
            disabled={selected.length === 0}
            state={loading ? "loading" : "default"}
            onClick={handleClickImport}
          >
            import wallets
          </Button>
        </div>
      </div>
    </Modal>
  )
}
