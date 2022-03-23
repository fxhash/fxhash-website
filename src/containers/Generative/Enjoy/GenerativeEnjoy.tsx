import style from "./GenerativeEnjoy.module.scss"
import Link from "next/link"
import cs from "classnames"
import { GenerativeTokenWithCollection } from "../../../types/entities/GenerativeToken"
import { ArtworkIframe } from "../../../components/Artwork/PreviewIframe"
import { ipfsGatewayUrl } from "../../../services/Ipfs"
import { UserBadge } from "../../../components/User/UserBadge"
import { getGenerativeTokenUrl } from "../../../utils/generative-token"
import { useEffect, useMemo, useRef, useState } from "react"
import { shuffleArray } from "../../../utils/array"
import { useAnimationFrame, useHasInterractedIn } from "../../../utils/hookts"
import { Objkt } from "../../../types/entities/Objkt"
import { getObjktUrl } from "../../../utils/objkt"
import { Modal } from "../../../components/Utils/Modal"
import { SliderWithText } from "../../../components/Input/SliderWithText"

const DEFAULT_TIME_PER_ITERATION_MS = 20000
const TRANSITION_DURATION_MS = 3000

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  }
  else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

interface Props {
  tokens: Objkt[]
  backLink: string
  requestData?: () => void
}
export function GenerativeEnjoy({ tokens, backLink, requestData }: Props) {
  // ref to elements manipulated directly
  const barRef = useRef<HTMLDivElement>(null)
  const frameContainerRef = useRef<HTMLDivElement>(null)

  // timers used internally
  const relativeTimer = useRef<number>(0)

  // cursor to the current piece being viewed
  const cursorRef = useRef<number>(0)
  const [cursor, setCursor] = useState<number>(0)
  const cursorShifted = (shift: number = 1) => (cursorRef.current + shift + tokens.length) % tokens.length

  // has user interacted with the page since 2s ?
  const [isUserActive, setUserActive] = useHasInterractedIn(2000)

  const [timePerIteration, setTimePerIteration] = useState<number>(DEFAULT_TIME_PER_ITERATION_MS/1000)
  const [paused, setPaused] = useState<boolean>(false)
  const [settingsModal, setSettingsModal] = useState<boolean>(false)
  const [showUI, setShowUI] = useState<boolean>(true)

  // derive show UI from props & user active
  const hideUI = !showUI && !isUserActive

  const shiftIteration = (shift: number = 1) => {
    // first, hide if not hidden 
    if (!frameContainerRef.current?.classList.contains(style.hidden) && tokens.length > 1) {
      frameContainerRef.current?.classList.add(style.hidden)
    }

    // shift the cursor
    cursorRef.current = cursorShifted(shift)
    setCursor(cursorRef.current)
    relativeTimer.current = 0

    // if the cursor is at 10 from the end of the list request data
    if (cursorRef.current > tokens.length - 10) {
      requestData?.()
    }
  }

  // whenever the cursor changed, we load the next one
  useEffect(() => {
    if (tokens.length > 1) {
      // also, preload the next piece
      const toLoad = tokens[cursorShifted(1)]
      fetch(ipfsGatewayUrl(toLoad.metadata?.artifactUri, "pinata-fxhash-safe"))
    }
  }, [cursor])

  useAnimationFrame((time, delta) => {
    if (!paused) {
      relativeTimer.current+= delta
      const timeIterationMs = timePerIteration * 1000

      if (barRef.current) {
        barRef.current.style.width = `${relativeTimer.current / timeIterationMs * 100}%`
      }
  
      if (relativeTimer.current > (timeIterationMs - TRANSITION_DURATION_MS)
      && !frameContainerRef.current?.classList.contains(style.hidden)
      && tokens.length > 1) {
        frameContainerRef.current?.classList.add(style.hidden)
      }
        
      if (relativeTimer.current > timeIterationMs) {
        shiftIteration(1)
      }
    }
  }, [paused, timePerIteration, tokens])
  
  // triggered when iframe is loaded 
  const onIframeLoaded = () => {
    frameContainerRef.current?.classList.remove(style.hidden)
  }

  // derive the url to display using the cursor
  const selectedToken = tokens[cursor]

  return (
    <main className={cs(style.root, { [style.no_cursor]: hideUI })}>
      <header className={cs(style.header, { [style.hide]: hideUI })}>
        <Link href={backLink}>
          <a className={cs(style.back)}>
            <i className="fas fa-chevron-left" aria-hidden/>
            <span>back</span>
          </a>
        </Link>
        {tokens.length > 0 && (
          <div className={cs(style.header_details)}>
            <strong>{selectedToken.issuer.name}</strong> 
            <UserBadge size="small" user={selectedToken.issuer.author}/>
          </div>
        )}
      </header>

      <div 
        className={cs(style.frame_container, style.hidden, { [style.is_empty]: tokens.length === 0 })}
        ref={frameContainerRef}
      >
        {tokens.length > 0 ? (
          <ArtworkIframe
            url={ipfsGatewayUrl(selectedToken.metadata?.artifactUri, "ipfsio")}
            onLoaded={onIframeLoaded}
          />
        ):(
          <div className={cs(style.empty)}>
            This collection is empty
          </div>
        )}
      </div>

      {tokens.length > 0 && (
        <footer className={cs(style.footer, { [style.hide]: hideUI })}>
          <div className={cs(style.gentk_details)}>
            <Link href={getObjktUrl(selectedToken)}>
              <a>#{selectedToken.iteration}</a> 
            </Link>
            <span>owned by</span>
            <UserBadge user={selectedToken.owner!}/>
          </div>

          <div className={cs(style.controls)}>
            <button 
              onClick={() => shiftIteration(-1)}
              title="previous"
            >
              <i className="fas fa-chevron-left"/>
            </button>
            <button 
              onClick={() => setPaused(!paused)}
              title={paused ? "play": "pause"}
            >
              {paused
                ? <i className="fas fa-play"/>
                : <i className="fas fa-pause"/>}
            </button>
            <button 
              onClick={() => shiftIteration(1)}
              title="next"
            >
              <i className="fas fa-chevron-right"/>
            </button>
          </div>

          <div className={cs(style.controls, style.right_controls)}>
            <button 
              onClick={() => {
                if (showUI) {
                  setUserActive(false)
                }
                setShowUI(!showUI)
              }}
              title={showUI ? "hide UI" : "show UI"}
            >
              <i className={`fas fa-${showUI ? "eye-slash" : "eye"}`}/>
            </button>
            <button 
              onClick={() => setSettingsModal(!settingsModal)}
              title="settings"
            >
              <i className="fas fa-cog"/>
            </button>
            <button 
              onClick={() => toggleFullScreen()}
              title="toggle fullscreen"
            >
              <i className="fas fa-expand"/>
            </button>
          </div>
        </footer>
      )}

      <div className={cs(style.progress)}>
        <div 
          ref={barRef}
          className={cs(style.bar)}
        />
      </div>

      {settingsModal && (
        <Modal
          title="Gallery settings"
          onClose={() => setSettingsModal(false)}
          className={cs(style.settings_modal)}
        >
          <div className={cs(style.line)}>
            <span>Time/iteration</span>
            <SliderWithText
              value={timePerIteration}
              onChange={setTimePerIteration}
              min={10}
              max={120}
              step={1}
            />
          </div>
        </Modal>
      )}
    </main>
  )
}