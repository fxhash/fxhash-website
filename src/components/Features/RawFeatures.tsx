import { useState, useEffect } from "react"
import { ProcessRawTokenFeatureError, RawTokenFeatures, TokenFeature } from "../../types/Metadata"
import { processRawTokenFeatures } from "../../utils/convert"
import { getProcessRawFeaturesError } from "../../utils/errors"
import { ErrorBlock } from "../Error/ErrorBlock"
import { Features } from "./Features"

interface Props {
  rawFeatures: RawTokenFeatures | null
}

/**
 * This Component acts as a wrapper arround the Features Renderer, it receives RawFeatures as input and process those
 */
export function RawFeatures({ rawFeatures }: Props) {
  // features & errors related to feature processing
  const [features, setFeatures] = useState<TokenFeature[] | null>(null)
  const [featuresError, setFeaturesError] = useState<ProcessRawTokenFeatureError | null>(null)

  
  useEffect(() => {
    setFeaturesError(null)
    if (rawFeatures) {
      try {
        // @ts-ignore
        const processed = processRawTokenFeatures(rawFeatures)
        setFeatures(processed)
      }
      catch(err: any) {
        if (err.type) {
          setFeaturesError(err)
        }
      }
    }
    else {
      setFeatures(null)
    }
  }, [rawFeatures])

  return (
    featuresError ? (
      <ErrorBlock title="Error when processing the Token features:" align="left">
        {getProcessRawFeaturesError(featuresError.type)}
        {featuresError.extra}
      </ErrorBlock>
    ):(
      <Features features={features} />
    )
  )
}