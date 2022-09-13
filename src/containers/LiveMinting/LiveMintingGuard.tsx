import { isAfter } from "date-fns";
import Link from "next/link";
import { PropsWithChildren, useContext, useMemo } from "react";
import { Button } from "../../components/Button";
import { ErrorPage } from "../../components/Error/ErrorPage";
import { LoaderBlock } from "../../components/Layout/LoaderBlock";
import { DateFormatted } from "../../components/Utils/Date/DateFormat";
import { LiveMintingContext } from "../../context/LiveMinting";
import { LiveMintingWait } from "./LiveMintingWait";


type Props = PropsWithChildren<{}>
/**
 * This component consumes the Live Minting Context to display the appropriate 
 * components based on the context state.
 */
export function LiveMintingGuard({
  children,
}: Props) {
  const liveMinting = useContext(LiveMintingContext)

  // has the event started ? if not we display an error message
  const hasStarted = true/* useMemo(
    () => liveMinting.event?.startsAt 
      && isAfter(new Date(), new Date(liveMinting.event.startsAt)),
    [liveMinting]
  )*/

  return (
    <>
      {liveMinting.loading ? (
        <LoaderBlock
          size="small"
          height="80vh"
        >
          loading mint pass
        </LoaderBlock>
      ):(
        liveMinting.error ? (
          <ErrorPage
            title="An error has occured 😟"
          >
            {liveMinting.error}
          </ErrorPage>
        ):(
          !hasStarted ? (
            <ErrorPage
              title={`Sorry, but ${liveMinting.event!.name} has not started yet`}
            >
              <LiveMintingWait
                event={liveMinting.event!}
              />
            </ErrorPage>
          ):children
        )
      )}
    </>
  )
}