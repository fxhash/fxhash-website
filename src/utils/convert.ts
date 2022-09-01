import { ProcessRawTokenFeatureErrorType, ProcessRawTokenFeatureErrorTypes, RawTokenFeatures, TokenFeature } from "../types/Metadata";

export function bytesToString(byteArray: number[]): string {
  return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

export function stringToByteString(str: string): string {
	const bytes = []
  for (let i = 0; i<str.length; i++) {
  	bytes.push(str.charCodeAt(i))
  }
  return bytesToString(bytes)
}

export function processRawTokenFeatures(rawFeatures: any): TokenFeature[] {
  try {
    const features: TokenFeature[] = []
  
    // first check if features are an object
    if (typeof rawFeatures !== "object" || Array.isArray(rawFeatures) || !rawFeatures) {
      throw {
        type: ProcessRawTokenFeatureErrorType.INVALID_FEATURES_SIGNATURE
      }
    }

    // go through each property and process it
    for (const name in rawFeatures) {
      // chack if propery is accepted type
      if (!(typeof rawFeatures[name] === "boolean" || typeof rawFeatures[name] === "string" || typeof rawFeatures[name] === "number")) {
        throw {
          type: ProcessRawTokenFeatureErrorType.INVALID_PROPERTY_TYPE,
          extra: ` property "${name}" is of type ${typeof rawFeatures[name]}, only accepted types are [string, boolean, number]`
        }
      }
      // all good, the feature can be added safely
      features.push({
        name,
        value: rawFeatures[name]
      })
    }
  
    return features
  }
  catch(err: any) {
    if (err.type && ProcessRawTokenFeatureErrorTypes.includes(err.type)) {
      throw err
    }
    else {
      throw {
        type: ProcessRawTokenFeatureErrorType.UNKNOWN
      }
    }
  }
}

export function hexStringToString(str: string): string {
	return str.length > 1 ? String.fromCharCode.apply(null, str.match(/.{2}/g)!.map(hx => parseInt(hx, 16))) : ""
}