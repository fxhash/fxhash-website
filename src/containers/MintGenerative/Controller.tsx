import { useState, useEffect, useMemo, RefObject } from "react"
import { MintGenerativeData } from "../../types/Mint"
import { Switch, Route, useHistory, useLocation } from "react-router-dom"
import { StepHome } from "./StepHome"
import { MintGenerativeTabs } from "./Tabs"
import { StepUploadIpfs } from "./StepUploadIpfs"
import { Step } from "../../types/Steps"
import { StepCheckFiles } from "./StepCheckFiles"
import { StepConfigureCapture } from "./StepConfigureCapture"
import { StepVerification } from "./StepVerification"
import { StepInformations } from "./StepInformations"
import { StepSuccess } from "./StepSuccess"
import { StepExtraSettings } from "./StepExtraSettings/StepExtraSettings"
import { StepAuthoring } from "./StepAuthoring"
import { StepDistribution } from "./StepDistribution"
import { StepPreviewMint } from "./StepPreviewMint"

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
    requiredProps: ["minted"],
  },
  {
    path: "/authoring",
    component: StepAuthoring,
    title: "Authoring",
    requiredProps: [],
  },
  {
    path: "/upload-ipfs",
    component: StepUploadIpfs,
    title: "Upload to IPFS",
    requiredProps: ["collaboration"],
  },
  {
    path: "/check-files",
    component: StepCheckFiles,
    title: "Check files",
    requiredProps: ["cidUrlParams", "authHash1"],
  },
  {
    path: "/capture-settings",
    component: StepConfigureCapture,
    title: "Configure capture",
    requiredProps: ["previewHash", "previewInputBytes", "params"],
  },
  {
    path: "/verifications",
    component: StepVerification,
    title: "Verifications",
    requiredProps: [
      "cidPreview",
      "authHash2",
      "captureSettings",
      "cidThumbnail",
    ],
  },
  {
    path: "/distribution",
    component: StepDistribution,
    title: "Distribution",
    requiredProps: [],
  },
  {
    path: "/extra-settings",
    component: StepExtraSettings,
    title: "Extra settings",
    requiredProps: ["distribution"],
  },
  {
    path: "/informations",
    component: StepInformations,
    title: "Project details",
    requiredProps: ["settings"],
  },
  {
    path: "/preview-mint",
    component: StepPreviewMint,
    title: "Preview & Mint",
    requiredProps: ["informations"],
  },
  {
    path: "/success",
    component: StepSuccess,
    hideTabs: true,
    requiredProps: [],
  },
]

// validates if a list of properties are set in a given state
function validateState(
  state: MintGenerativeData,
  props: (keyof MintGenerativeData)[]
): boolean {
  for (const prop of props) {
    if (typeof state[prop] === "undefined") {
      return false
    }
  }
  return true
}

// creates a new state by only passing a list of properties from the previous
function clearDataDown(
  state: MintGenerativeData,
  props: (keyof MintGenerativeData)[]
): MintGenerativeData {
  const nstate: MintGenerativeData = {}
  for (const prop of props) {
    nstate[prop] = state[prop] as any
  }
  return nstate
}

interface Props {
  anchor?: RefObject<HTMLElement>
}

export function MintGenerativeController({ anchor }: Props) {
  const [state, setState] = useState<MintGenerativeData>({
    minted: false,
  })
  const history = useHistory()
  const location = useLocation()

  console.log(state)

  // derive index of the step from the location
  const stepIndex = useMemo<number>(() => {
    const S = STEPS.find((step) => step.path === location.pathname)
    const idx = S ? STEPS.indexOf(S) : 0
    return idx !== -1 ? idx : 0
  }, [location])

  // updates the state, and pushes to history to update view
  const onNext = (update: Partial<MintGenerativeData>) => {
    setState({
      ...state,
      ...update,
    })
    history.push(STEPS[stepIndex + 1].path)
  }

  // when the step changes, needs to validate the data and clear the data down
  // if validation fails, forces the history to previous step path
  useEffect(() => {
    // move user back to top of the page
    if (stepIndex !== 0 && anchor?.current) {
      window.scrollTo({
        top: anchor.current.offsetTop - 30,
        left: 0,
        behavior: "smooth",
      })
    }

    // we take the current step and all the steps before to build the list of
    // required properties, used to validate state & clear state down
    const requiredProps = STEPS.slice(0, stepIndex + 1)
      .map((step) => step.requiredProps)
      .reduce((prev, props) => prev.concat(props), [])

    // checks if the step has all the required props
    if (validateState(state, requiredProps)) {
      // clear the data down the state, keeping the props required up to the
      // next step
      const keepProps = STEPS.slice(0, stepIndex + 2)
        .map((step) => step.requiredProps)
        .reduce((prev, props) => prev.concat(props), [])

      setState(clearDataDown(state, keepProps))
    } else {
      // move to the previous step
      const previous = STEPS[stepIndex - 1]
      history.replace(previous.path)
    }
  }, [stepIndex])

  // safe guard to prevent going back if token is minted
  useEffect(() => {
    if (state.minted && location.pathname !== "/success") {
      history.replace(STEPS[STEPS.length - 1].path)
    }
  }, [state])

  return (
    <>
      <MintGenerativeTabs steps={STEPS} />

      <Switch>
        {STEPS.map((step, idx) => (
          <Route key={idx} path={step.path} exact>
            <step.component onNext={onNext} state={state} />
          </Route>
        ))}

        <Route path="/">
          <StepHome onNext={onNext} state={state} />
        </Route>
      </Switch>
    </>
  )
}
