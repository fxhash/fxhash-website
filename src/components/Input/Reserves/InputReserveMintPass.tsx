import cs from "classnames"
import style from "./InputReserveMintPass.module.scss"
import text from "../../../styles/Text.module.css"
import { TInputReserveProps } from "./InputReserve"
import { InputText } from "../InputText"
import { useQuery } from "@apollo/client"
import { Qu_eventMintPassGroup } from "../../../queries/events/events"
import { eventsClient } from "../../../services/EventsClient"
import { isContractAddress } from "../../../utils/tezos"
import { LiveMintingPassGroup } from "../../../types/entities/LiveMinting"
import { Spacing } from "../../Layout/Spacing"

export function InputReserveMintPass({
  value,
  onChange,
  children,
}: TInputReserveProps<any>) {
  const { data } = useQuery(Qu_eventMintPassGroup, {
    client: eventsClient,
    variables: {
      where: {
        address: value,
      },
    },
    fetchPolicy: "cache-first",
    skip: !isContractAddress(value),
  })

  const mintPassGroup: LiveMintingPassGroup | null = data?.mintPassGroup || null

  return (
    <div>
      {children}
      <InputText
        value={value}
        onChange={(evt) => onChange(evt.target.value)}
        placeholder="Enter the Mint Pass contract address"
        className={cs(style.input)}
      />
      {mintPassGroup && (
        <div
          className={cs(text.small)}
          style={{
            textAlign: "right",
          }}
        >
          <Spacing size="2x-small" />
          <strong>{mintPassGroup.event.name}</strong> - {mintPassGroup.label}
        </div>
      )}
    </div>
  )
}
