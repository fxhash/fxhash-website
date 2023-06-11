import {
  hexString,
  FxParamDefinition,
  FxParamProcessor,
  FxParamProcessors,
  FxParamTypeMap,
  FxParamType,
  FxParamsData,
  FxParamDefinitions,
} from "./types"

export function rgbaToHex(r: number, g: number, b: number, a: number): string {
  const outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255)
      .toString(16)
      .substring(0, 2),
  ]

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = "0" + part
    }
  })

  return "#" + outParts.join("")
}

function completeHexColor(hexCode: hexString | string): string {
  let hex = hexCode.replace("#", "")
  if (hex.length === 6) {
    hex = `${hex}ff`
  }
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}ff`
  }
  return hex
}

export function hexToRgba(hexCode: hexString) {
  const hex = completeHexColor(hexCode)

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  const a =
    Math.round(
      (parseInt(hex.substring(6, 8), 16) / 255 + Number.EPSILON) * 100
    ) / 100

  return { r, g, b, a }
}

const stringToHex = function (s: string) {
  let rtn = ""
  for (let i = 0; i < s.length; i++) {
    rtn += s.charCodeAt(i).toString(16).padStart(4, "0")
  }
  return rtn
}
const hexToString = function (h: string) {
  const hx = h.match(/.{1,4}/g) || []
  let rtn = ""
  for (let i = 0; i < hx.length; i++) {
    const int = parseInt(hx[i], 16)
    if (int === 0) break
    rtn += String.fromCharCode(int)
  }
  return rtn
}

export const MIN_SAFE_INT64 = BigInt("-9223372036854775808")
export const MAX_SAFE_INT64 = BigInt("9223372036854775807")

export const ParameterProcessors: FxParamProcessors = {
  number: {
    serialize: (input) => {
      const view = new DataView(new ArrayBuffer(8))
      view.setFloat64(0, input as number)
      return view.getBigUint64(0).toString(16).padStart(16, "0")
    },
    deserialize: (input) => {
      const view = new DataView(new ArrayBuffer(8))
      for (let i = 0; i < 8; i++) {
        view.setUint8(i, parseInt(input.substring(i * 2, i * 2 + 2), 16))
      }
      return view.getFloat64(0)
    },
    bytesLength: () => 8,
    random: (definition) => {
      let min = Number.MIN_SAFE_INTEGER
      if (typeof definition.options?.min !== "undefined")
        min = Number(definition.options.min)
      let max = Number.MAX_SAFE_INTEGER
      if (typeof definition.options?.max !== "undefined")
        max = Number(definition.options.max)
      max = Math.min(max, Number.MAX_SAFE_INTEGER)
      min = Math.max(min, Number.MIN_SAFE_INTEGER)
      const v = Math.random() * (max - min) + min
      if (definition?.options?.step) {
        const t = 1.0 / definition?.options?.step
        return Math.round(v * t) / t
      }
      return v
    },
  },
  bigint: {
    serialize: (input: any) => {
      const view = new DataView(new ArrayBuffer(8))
      view.setBigInt64(0, BigInt(input))
      return view.getBigUint64(0).toString(16).padStart(16, "0")
    },
    deserialize: (input: any) => {
      const view = new DataView(new ArrayBuffer(8))
      for (let i = 0; i < 8; i++) {
        view.setUint8(i, parseInt(input.substring(i * 2, i * 2 + 2), 16))
      }
      return view.getBigInt64(0)
    },
    bytesLength: () => 8,
    random: (definition) => {
      let min = MIN_SAFE_INT64
      let max = MAX_SAFE_INT64
      if (typeof definition.options?.min !== "undefined")
        min = BigInt(definition.options.min)
      if (typeof definition.options?.max !== "undefined")
        max = BigInt(definition.options.max)
      const range = max - min
      const bits = range.toString(2).length
      let random
      do {
        random = BigInt(
          "0b" +
            Array.from(
              crypto.getRandomValues(new Uint8Array(Math.ceil(bits / 8)))
            )
              .map((b) => b.toString(2).padStart(8, "0"))
              .join("")
        )
      } while (random > range)
      return random + min
    },
  },
  boolean: {
    serialize: (input) => {
      return typeof input === "boolean"
        ? input
          ? "01"
          : "00"
        : typeof input === "string"
        ? input === "true"
          ? "01"
          : "00"
        : "00"
    },
    deserialize: (input) => {
      return input === "00" ? false : true
    },
    bytesLength: () => 1,
    random: () => Math.random() < 0.5,
  },

  color: {
    serialize: (input: string) => {
      return completeHexColor(input)
    },

    deserialize: (input): hexString => {
      return input as hexString
    },
    bytesLength: () => 4,
    transform: (input) => {
      return `#${completeHexColor(input)}`
    },
    random: () =>
      `${[...Array(8)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
  },

  string: {
    serialize: (input, def) => {
      if (!def.version) {
        let hex = stringToHex(input.substring(0, 64))
        hex = hex.padEnd(64 * 4, "0")
        return hex
      }
      let max = 64
      if (typeof def.options?.maxLength !== "undefined")
        max = Number(def.options.maxLength)
      let hex = stringToHex(input.substring(0, max))
      hex = hex.padEnd(max * 4, "0")
      return hex
    },
    deserialize: (input) => {
      return hexToString(input)
    },

    bytesLength: (def) => {
      if (!def.version) {
        return 64 * 2
      }
      if (typeof def.options?.maxLength !== "undefined")
        return Number(def.options.maxLength) * 2
      return 64 * 2
    },
    random: (definition) => {
      let min = 0
      if (typeof definition.options?.minLength !== "undefined")
        min = definition.options.minLength
      let max = 64
      if (typeof definition.options?.maxLength !== "undefined")
        max = definition.options.maxLength
      const length = Math.round(Math.random() * (max - min) + min)
      return [...Array(length)]
        .map((i) => (~~(Math.random() * 36)).toString(36))
        .join("")
    },
  },

  select: {
    serialize: (input, def) => {
      // find the index of the input in the array of options
      return Math.min(255, def.options?.options?.indexOf(input) || 0)
        .toString(16)
        .padStart(2, "0")
    },

    deserialize: (input, def) => {
      // get the index, which is the input
      const idx = parseInt(input, 16)
      return def.options?.options?.[idx] || def.options?.options?.[0] || ""
    },

    bytesLength: () => 1, // index between 0 and 255
    random: (definition) => {
      const index = Math.round(
        Math.random() * (definition.options.options.length - 1) + 0
      )
      return definition?.options?.options[index]
    },
  },
}

// params are injected into the piece using the binary representation of the
// numbers, to keep precision
export function serializeParams(
  params: any,
  definition: FxParamDefinition<any>[]
) {
  // a single hex string will be used for all the params
  let bytes = ""
  if (!definition) return bytes
  // loop through each parameter from the definition to find the associated
  // parameter as set on the UI
  for (const def of definition) {
    const { id, type } = def
    const processor = ParameterProcessors[
      type as FxParamType
    ] as FxParamProcessor<any>
    // if the param is definined in the object

    const v = params[id] as FxParamTypeMap[]
    const val =
      typeof v !== "undefined"
        ? v
        : typeof def.default !== "undefined"
        ? def.default
        : processor.random(def)
    const serialized = processor.serialize(val, def)
    bytes += serialized
  }

  return bytes
}

// takes an array of bytes, in hexadecimal format, and a parametric space
// definition and outputs an array of parameters, mapping the definition and
// validating input based on the definition constraints
export function deserializeParams(
  bytes: string,
  definition: FxParamDefinition<FxParamType>[],
  options: { withTransform?: boolean }
) {
  const params: Record<string, FxParamType> = {}
  for (const def of definition) {
    const processor = ParameterProcessors[
      def.type as FxParamType
    ] as FxParamProcessor<FxParamType>
    // extract the length from the bytes & shift the initial bytes string
    const bytesLen = processor.bytesLength(def)
    const valueBytes = bytes.substring(0, bytesLen * 2)
    bytes = bytes.substring(bytesLen * 2)
    // deserialize the bytes into the params
    const val = processor.deserialize(valueBytes, def)
    params[def.id] =
      options?.withTransform && processor.transform
        ? processor.transform(val as FxParamType)
        : val
  }
  return params
}

// Consolidates parameters from both a params object provided by the token
// and the dat object of params, which is stored by the controls component.
export function consolidateParams(
  definition: FxParamDefinitions,
  data: FxParamsData
) {
  if (!definition) return []

  const rtn = [...definition]

  for (const p in rtn) {
    const definition = rtn[p]
    const { id, type, default: def } = definition
    if (data && data.hasOwnProperty(id)) {
      rtn[p].value = data[id]
    } else {
      const processor = ParameterProcessors[
        type as FxParamType
      ] as FxParamProcessor<any>
      let v
      if (typeof def === "undefined") v = processor.random(definition)
      else v = def
      rtn[p].value = processor.transform?.(v) || v
    }
  }

  return rtn
}

/**
 * Given a definition and some params data, builds a clean params object where
 * the values are first found in the data object, then in the definition if a
 * default value exists, otherwise in randomizes the value using the param
 * associated processor.
 *
 * @param definition an array of parameter definition
 * @param data the params data used to reconstruct the final values
 */
export function buildParamsObject(
  definition: FxParamDefinitions,
  data: FxParamsData | null
) {
  if (!definition) return {}

  const out: FxParamsData = {}
  for (const def of definition) {
    // find if the data object has the propery
    if (data?.hasOwnProperty(def.id)) {
      out[def.id] = data[def.id]
      continue
    }
    // find if the definition object has a default value
    if (def.hasOwnProperty("default")) {
      out[def.id] = def.default
      continue
    }
    // otherwise use the param processor randomizer
    const processor = ParameterProcessors[def.type] as FxParamProcessor<any>
    const rand = processor.random(def)
    out[def.id] = processor.transform?.(rand) || rand
  }
  return out
}

export function getRandomParamValues(
  params: FxParamDefinition<FxParamType>[],
  options?: { noTransform: boolean }
): any {
  return params.reduce((acc, definition) => {
    const processor = ParameterProcessors[
      definition.type as FxParamType
    ] as FxParamProcessor<FxParamType>
    const v = processor.random(definition) as FxParamType
    acc[definition.id] = options?.noTransform
      ? v
      : processor.transform?.(v) || v
    return acc
  }, {} as Record<string, any>)
}

export function sumBytesParams(
  definitions: FxParamDefinition<FxParamType>[]
): number {
  return (
    definitions?.reduce(
      (acc, def) =>
        acc +
        (
          ParameterProcessors[
            def.type as FxParamType
          ] as FxParamProcessor<FxParamType>
        ).bytesLength(def),
      0
    ) || 0
  )
}

export function stringifyParamsData(data: FxParamsData) {
  return jsonStringifyBigint(data)
}

export function jsonStringifyBigint(data: any): string {
  return JSON.stringify(data, (key, value) => {
    if (typeof value === "bigint") return value.toString()
    return value
  })
}
