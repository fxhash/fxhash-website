import style from "./StepCheckFiles.module.scss"
import cs from "classnames"
import { StepComponent } from "../../types/Steps"
import { Spacing } from "../../components/Layout/Spacing"
import { ArtworkIframe, ArtworkIframeRef } from "../../components/Artwork/PreviewIframe"
import { useMemo, useState, useRef, useEffect } from "react"
import { generateFxHash } from "../../utils/hash"
import { getIpfsIoUrl } from "../../utils/ipfs"
import { HashTest } from "../../components/Testing/HashTest"
import { Checkbox } from "../../components/Input/Checkbox"
import { Button } from "../../components/Button"
import useFetch, { CachePolicies } from "use-http"
import { StaticGenError, StaticGenResponse } from "../../types/Responses"
import { Error } from "../../components/Error/Error"
import { getStaticGenError } from "../../utils/errors"


export const StepCheckFiles: StepComponent = ({ onNext, state }) => {
  const [hash, setHash] = useState<string>(generateFxHash())
  const [check1, setCheck1] = useState<boolean>(false)
  const [check2, setCheck2] = useState<boolean>(false)
  const artworkIframeRef = useRef<ArtworkIframeRef>(null)

  const { data, loading, error, post } = 
    useFetch<StaticGenResponse|StaticGenError>(`${process.env.NEXT_PUBLIC_API_FILE_ROOT}/generate-static`,
    { cachePolicy: CachePolicies.NO_CACHE })

  // this variable ensures that we can safely access its data regardless of the state of the queries
  const safeData: StaticGenResponse|false|undefined = !error && !loading && (data as StaticGenResponse)

  const url = useMemo<string>(() => {
    return `${getIpfsIoUrl(state.cidUrlParams!)}?fxhash=${hash}`
  }, [hash])

  const sendData = () => {
    const F = new FormData()
    F.append("cidParams", state.cidUrlParams!)
    F.append("authHash", state.authHash1!)
    F.append("hash", hash)
    post(F)
  }

  useEffect(() => {
    if (safeData) {
      onNext({
        cidFixedHash: safeData.cidStatic,
        authHash2: safeData.authenticationHash
      })
    }
  }, [safeData])

  return (
    <>
      <p>
        Now, double-check your Generative Token to see if it behaves properly on the IPFS network. <br/>
        Sometimes, the IPFS network can be <strong>slow</strong> 🐢. Please be patient.
      </p>
      <p>
        On the next step, you will configure how previews will be generated each time your token is collected.
        <strong>Use this step to find a hash you want to use for the thumbnail of the project on the plateform.</strong>
      </p>

      <Spacing size="5x-large"/>

      <div className={cs(style.container)}>
        <div>
          <h5>Testing</h5>
          <p>You need to verify that:</p>
          <ul>
            <li>a same hash will <strong>always</strong> generate the same output</li>
            <li>different hashes generate <strong>different</strong> outputs</li>
          </ul>

          <Spacing size="3x-large"/>

          <HashTest
            autoGenerate={false}
            value={hash}
            onHashUpdate={setHash}
            onRetry={() => {
              artworkIframeRef.current?.reloadIframe()
            }}
          />
        </div>

        <div className={cs(style.artwork)}>
          <div className={cs(style['preview-cont'])}>
            <div className={cs(style['preview-wrapper'])}>
              <ArtworkIframe
                ref={artworkIframeRef}
                url={url}
                textWaiting="looking for content on IPFS"
              />
            </div>
          </div>
        </div>
      </div>

      <Spacing size="6x-large"/>

      <div className={cs(style.checkboxes)}>
        <div>
          <Checkbox value={check1} onChange={setCheck1}>
            I want to keep this hash for the preview of my project
          </Checkbox>
          <Checkbox value={check2} onChange={setCheck2}>
            My Generative Token works properly
          </Checkbox>
        </div>
        <Spacing size="large"/>

        {error && (
          <Error>
            { getStaticGenError(data as StaticGenError) }
          </Error>
        )}

        <Button
          color="secondary"
          iconComp={<i aria-hidden className="fas fa-arrow-right"/>}
          iconSide="right"
          size="large"
          disabled={!check1 || !check2}
          state={loading ? "loading" : "default"}
          onClick={sendData}
        >
          Next step
        </Button>
      </div>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
    </>
  )
}