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
  const hasStarted = useMemo(
    () => liveMinting.event?.startsAt 
      && isAfter(new Date(), new Date(liveMinting.event.startsAt)),
    [liveMinting]
  )

  // has the pass expired ?
  const hasPassExpired = useMemo(
    () => liveMinting.mintPass?.expiresAt
      && isAfter(new Date(), new Date(liveMinting.mintPass.expiresAt)),
    [liveMinting]
  )

  // derive top level error
  const error = useMemo(() => {
    if (liveMinting.loading) return null
    if (liveMinting.error) {
      return {
        title: "An error has occured 😟",
        message: liveMinting.error
      }
    }
    else if (!hasStarted) {
      return {
        title: `Sorry, but ${liveMinting.event!.name} has not started yet`,
        message: (
          <LiveMintingWait
            event={liveMinting.event!}
          />
        )
      }
    }
    else if (hasPassExpired) {
      return {
        title: `Sorry, but this minting pass has expired`,
        message: (
          <>
            <p>You can still explore the projects posted on fxhash</p>
            <br/>
            <Link href="/explore" passHref>
              <Button
                isLink
                size="regular"
                color="secondary"
              >
                explore fxhash
              </Button>
            </Link>
          </>
        ),
      }
    }
    return null
  }, [liveMinting, hasPassExpired, hasStarted])

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
        error ? (
          <ErrorPage title={error.title}>
            {error.message}
          </ErrorPage>
        ): children
      )}
    </>
  )
}