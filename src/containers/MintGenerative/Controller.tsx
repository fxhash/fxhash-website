import { useState, useEffect, useMemo, RefObject } from "react"
import { MintGenerativeData } from "../../types/Mint"
import { Switch, Route, Link, LinkProps, useRouteMatch, useHistory, useLocation } from "react-router-dom"
import { StepHome } from "./StepHome"
import { MintGenerativeTabs } from "./Tabs"
import { StepUploadIpfs } from "./StepUploadIpfs"
import { Step } from "../../types/Steps"
import { StepCheckFiles } from "./StepCheckFiles"
import { StepConfigureCapture } from "./StepConfigureCapture"
import { StepVerification } from "./StepVerification"
import { StepInformations } from "./StepInformations"
import { StepSuccess } from "./StepSuccess"
import { StepExtraSettings } from "./StepExtraSettings"


/**
 * Some rules to ensure the consistency of this module:
 *  - when a sub-module updates the state, it resets every propery down the line
 *  - when a sub-module is loaded, it must check if some properties are in the state,
 *    otherwise it must fallback to the previous sub-module
 *  - each sub-module must verify the validity of the data before allowing the 
 *    access to the sub-modules down the line
 */


const STEPS: Step[] = [
  {
    path: "/",
    component: StepHome,
    hideTabs: true,
    validateIn: () => true,
    clearDataDown: (data) => ({
      minted: data.minted
    })
  },
  {
    path: "/upload-ipfs",
    component: StepUploadIpfs,
    title: "1. Upload to IPFS",
    validateIn: () => true,
    clearDataDown: (data) => ({
      minted: data.minted
    })
  },
  {
    path: "/check-files",
    component: StepCheckFiles,
    title: "2. Check files",
    validateIn: (data) => !!(data.cidUrlParams && data.authHash1),
    clearDataDown: (data) => ({
      cidUrlParams: data.cidUrlParams,
      authHash1: data.authHash1,
      minted: data.minted
    })
  },
  {
    path: "/capture-settings",
    component: StepConfigureCapture,
    title: "3. Configure capture",
    validateIn: (data) => !!(data.cidUrlParams && data.authHash1 && data.previewHash),
    clearDataDown: (data) => ({
      cidUrlParams: data.cidUrlParams,
      authHash1: data.authHash1,
      previewHash: data.previewHash,
      minted: data.minted
    })
  },
  {
    path: "/verifications",
    component: StepVerification,
    title: "4. Verifications",
    validateIn: (data) => 
      !!(data.cidUrlParams && data.authHash1 && data.previewHash
        && data.cidPreview && data.authHash2 && data.captureSettings && data.cidThumbnail),
    clearDataDown: (data) => ({
      cidUrlParams: data.cidUrlParams,
      authHash1: data.authHash1,
      previewHash: data.previewHash,
      cidPreview: data.cidPreview,
      authHash2: data.authHash2,
      captureSettings: data.captureSettings,
      cidThumbnail: data.cidThumbnail,
      minted: data.minted
    })
  },
  {
    path: "/extra-settings",
    component: StepExtraSettings,
    title: "5. Extra settings",
    validateIn: (data) => 
      !!(data.cidUrlParams && data.authHash1 && data.previewHash
        && data.cidPreview && data.authHash2 && data.captureSettings && data.cidThumbnail),
    clearDataDown: (data) => ({
      cidUrlParams: data.cidUrlParams,
      authHash1: data.authHash1,
      previewHash: data.previewHash,
      cidPreview: data.cidPreview,
      authHash2: data.authHash2,
      captureSettings: data.captureSettings,
      settings: data.settings,
      cidThumbnail: data.cidThumbnail,
      minted: data.minted
    })
  },
  {
    path: "/informations",
    component: StepInformations,
    title: "6. Mint",
    validateIn: (data) => 
      !!(data.cidUrlParams && data.authHash1 && data.previewHash
        && data.cidPreview && data.authHash2 && data.captureSettings && data.cidThumbnail),
    clearDataDown: (data) => ({
      cidUrlParams: data.cidUrlParams,
      authHash1: data.authHash1,
      previewHash: data.previewHash,
      cidPreview: data.cidPreview,
      authHash2: data.authHash2,
      captureSettings: data.captureSettings,
      settings: data.settings,
      cidThumbnail: data.cidThumbnail,
      minted: data.minted
    })
  },
  {
    path: "/success",
    component: StepSuccess,
    hideTabs: true,
    validateIn: (data) => 
      !!(data.cidUrlParams && data.authHash1 && data.previewHash
        && data.cidPreview && data.authHash2 && data.captureSettings
        && data.cidThumbnail),
    clearDataDown: (data) => data
  }
]

interface Props {
  anchor?: RefObject<HTMLElement>
}

export function MintGenerativeController({ anchor }: Props) {
  const [state, setState] = useState<MintGenerativeData>({
    minted: false
  })
  const history = useHistory()
  const location = useLocation()

  // derive index of the step from the location
  const stepIndex = useMemo<number>(() => {
    const S = STEPS.find(step => step.path === location.pathname)
    const idx = S ? STEPS.indexOf(S) : 0
    return idx !== -1 ? idx : 0
  }, [location])

  // updates the state, and pushes to history to update view
  const onNext = (update: Partial<MintGenerativeData>) => {
    setState({
      ...state,
      ...update
    })
    history.push(STEPS[stepIndex+1].path)
  }

  // when the step changes, needs to validate the data and clear the data down
  // if validation fails, forces the history to previous step path
  useEffect(() => {
    // move user back to top of the page
    if (stepIndex !== 0 && anchor?.current) {
      window.scrollTo({
        top: anchor.current.offsetTop - 30,
        left: 0,
        behavior: "smooth"
      })
    }

    const step = STEPS[stepIndex]
    if (step.validateIn(state)) {
      // clear the data down the state
      setState(step.clearDataDown(state))
    }
    else {
      // move to the previous step
      const previous = STEPS[stepIndex-1]
      history.replace(previous.path)
    }
  }, [stepIndex])

  // safe guard to prevent going back if token is minted
  useEffect(() => {
    if (state.minted && location.pathname !== "/success") {
      history.replace(STEPS[STEPS.length-1].path)
    }
  }, [state])

  return (
    <>
      <MintGenerativeTabs steps={STEPS} />

      <Switch>
        {STEPS.map((step, idx) => (
          <Route key={idx} path={step.path} exact>
            <step.component 
              onNext={onNext}
              state={state}
            />
          </Route>
        ))}

          <Route path="/">
            <StepHome 
              onNext={onNext}
              state={state}
            />
          </Route>
      </Switch>
    </>
  )
}