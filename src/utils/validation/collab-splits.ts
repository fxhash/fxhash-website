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
    if (split.pct < 100) {
      errors.push(
        `Individual shares must be over 100 (wrong: ${split.pct})`
      )
      break
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}