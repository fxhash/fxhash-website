import { Controller, FxParamControllerProps } from "./Controller"
import { BaseSelect } from "../BaseInput"

export function SelectController({
  id,
  label,
  value,
  onChange,
  options,
  isCodeDriven,
}: FxParamControllerProps<"select">) {
  return (
    <Controller id={id} label={label}>
      <BaseSelect
        name={id}
        id={id}
        onChange={onChange}
        value={value}
        disabled={isCodeDriven}
      >
        {options?.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </BaseSelect>
    </Controller>
  )
}
