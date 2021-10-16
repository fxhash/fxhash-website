import { useState, useEffect, useMemo } from "react"
import { MintGenerativeData } from "../../types/Mint"
import { Switch, Route, Link, LinkProps, useRouteMatch, useHistory, useLocation } from "react-router-dom"
import { StepHome } from "./StepHome"
import { MintGenerativeTabs } from "./Tabs"
import { StepUploadIpfs } from "./StepUploadIpfs"
import { Step } from "../../types/Steps"
import { StepCheckFiles } from "./StepCheckFiles"
import { StepConfigureCapture } from "./StepConfigureCapture"


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
    clearDataDown: (data) => ({})
  },
  {
    path: "/upload-ipfs",
    component: StepUploadIpfs,
    title: "1. Upload to IPFS",
    validateIn: () => true,
    clearDataDown: (data) => ({})
  },
  {
    path: "/check-files",
    component: StepCheckFiles,
    title: "2. Check files",
    validateIn: (data) => !!(data.cidUrlParams && data.authHash1),
    clearDataDown: (data) => ({
      cidUrlParams: data.cidUrlParams,
      authHash1: data.authHash1
    })
  },
  {
    path: "/capture-settings",
    component: StepConfigureCapture,
    title: "3. Configure capture",
    validateIn: (data) => !!(data.cidUrlParams && data.authHash1 && data.cidFixedHash && data.authHash2),
    clearDataDown: (data) => ({
      cidUrlParams: data.cidUrlParams,
      authHash1: data.authHash1,
      cidFixedHash: data.cidFixedHash,
      authHash2: data.authHash2
    })
  },
  {
    path: "/verifications",
    component: StepHome,
    title: "4. Verifications",
    validateIn: (data) => 
      !!(data.cidUrlParams && data.authHash1 && data.cidFixedHash && data.authHash2
        && data.cidPreview && data.authHash3),
    clearDataDown: (data) => ({
      cidUrlParams: data.cidUrlParams,
      authHash1: data.authHash1,
      cidFixedHash: data.cidFixedHash,
      authHash2: data.authHash2,
      cidPreview: data.cidPreview,
      authHash3: data.authHash3
    })
  },
  {
    path: "/informations",
    component: StepHome,
    title: "5. Mint",
    validateIn: (data) => 
      !!(data.cidUrlParams && data.authHash1 && data.cidFixedHash && data.authHash2
        && data.cidPreview && data.authHash3),
    clearDataDown: (data) => ({
      cidUrlParams: data.cidUrlParams,
      authHash1: data.authHash1,
      cidFixedHash: data.cidFixedHash,
      authHash2: data.authHash2,
      cidPreview: data.cidPreview,
      authHash3: data.authHash3
    })
  },
  {
    path: "/success",
    component: StepHome,
    hideTabs: true,
    validateIn: (data) => 
      !!(data.cidUrlParams && data.authHash1 && data.cidFixedHash && data.authHash2
        && data.cidPreview && data.authHash3 && data.informations),
    clearDataDown: (data) => data
  }
]

export function MintGenerativeController() {
  const [state, setState] = useState<MintGenerativeData>({})
  const history = useHistory()
  const location = useLocation()

  console.log(state)

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

  return (
    <>
      <MintGenerativeTabs steps={STEPS} />

      <Switch>
        {STEPS.map((step, idx) => (
          <Route key={idx} path={step.path} exact>
            <step.component 
              onNext={onNext}
              state={state}
              // validateIncoming={step.validateIn}
              // onValidationFailed={onStepValidationFailed}
            />
          </Route>
        ))}

          <Route path="/">
            <StepHome 
              onNext={onNext}
              state={state}
              // validateIncoming={STEPS[0].validateIn}
              // onValidationFailed={onStepValidationFailed}
            />
          </Route>
      </Switch>
    </>
  )
}