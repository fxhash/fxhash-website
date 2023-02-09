export interface InputProps<T = string> {
  value: T
  onChange: (value: T) => void
}
