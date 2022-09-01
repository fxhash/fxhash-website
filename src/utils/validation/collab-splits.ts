import { split } from "@apollo/client";
import { ISplit } from "../../types/entities/Split";
import { TValidationFunction } from "./validation";

export const validateCollabSplits: TValidationFunction<ISplit[]> = (splits) => {
  const errors: string[] = []
  if (splits.length < 2) {
    errors.push(
      "There must be at least 2 collaborators"
    )
  }

  for (const split of splits) {
    const N = parseFloat(split.pct as any)
    if (isNaN(N)) {
      errors.push(
        `"${split.pct}" is not a valid number`
      )
      break
    }
    if (N%1 > 0) {
      errors.push(
        `Only integer number are accepted. Wrong: ${split.pct}`
      )
    }
  }

  const S = splits.reduce((a, b) => a + parseFloat(b.pct as any), 0)
  if (S < 1) {
    errors.push(
      `The sum of the shares must be >= 1 (current: ${S})`
    )
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}