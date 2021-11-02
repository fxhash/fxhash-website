import style from "./RevealProgress.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { useEffect } from "react"
import { SigningData, SigningProgress, SigningState } from "../../types/Responses"
import { useEventSource } from "../../utils/hookts"
import { ProgressModule } from "../../components/Utils/ProgressModule/ProgressModule"
import { Button } from "../../components/Button"
import { Spacing } from "../../components/Layout/Spacing"
import { useRouter } from "next/router"
import { ipfsDisplayUrl } from "../../services/Ipfs"
import { getIpfsSlash } from "../../utils/ipfs"


interface Props {
  hash: string
  onRevealed: (generativeUri: string, previewUri: string) => void
}

function getProgressPosition(progress: SigningProgress|null): number {
  if (!progress) return 0

  switch(progress.state) {
    case SigningState.NOT_FOUND:
      return 1
    case SigningState.QUEUED:
      return 2
    case SigningState.GENERATING_METADATA:
      return 3
    case SigningState.CALLING_CONTRACT:
      return 4
    case SigningState.SIGNED:
      return 6
    case SigningState.NONE:
    default:
      return 0
  }
}

/**
 * The RevealProgress components starts an EventSource connection with the API to
 * get informations about the state of the Reveal of their Token
 */
export function RevealProgress({ hash, onRevealed }: Props) {
  const router = useRouter()
  const { progress, error, success, loading, data, start } 
    = useEventSource<SigningData, SigningProgress>(
      `${process.env.NEXT_PUBLIC_API_INDEXER}mint-feedback/${hash}`, 
      data => JSON.parse(data)
    )

  console.log({ progress, error, success, loading, data, start })

  useEffect(() => {
    start()
  }, [])

  // when the state changes to success, then we can reveal the object safely
  const reveal = () => {
    if (success) {
      // if there is no data, reload the page
      if (!data || !data.cidGenerative || !data.cidPreview) {
        router.reload()
      }
      else {
        // trigger the reveal of the token 
        onRevealed(getIpfsSlash(data.cidGenerative), getIpfsSlash(data.cidPreview))
      }
    }
  }

  return (
    <div className={cs(style.container)}>
      <h1 className={cs(colors.success)}>
        <span>Token is minted </span>
        <i aria-hidden className="fas fa-glass-cheers"/>
      </h1>

      <p>fxhash is currently assigning the metadata of your token, please wait a little</p>

      <Spacing size="3x-large"/>

      <ProgressModule
        entries={[
          "contacting signing server",
          `token will be added to the queue`,
          `token is in the queue ${progress?.state === SigningState.QUEUED ? `(position: ${progress?.extra?.position || "unknown"})` : ""}`,
          "server is generating your token metadata",
          "signing operation is being sent to the blockchain",
          "token metadata has been signed"
        ]}
        position={success ? 100 : getProgressPosition(progress)}
      />

      <Spacing size="3x-large"/>

      <Button
        iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
        iconSide="right"
        color="secondary"
        size="large"
        disabled={!success}
        onClick={reveal}
      >
        reveal your token
      </Button>
    </div>
  )
}