import { DeepPartial } from "types/DeepPartial"

export type TUpdateStateFn<T> = (data: DeepPartial<T>) => void

export type TUpdateableState<T> = T & {
  update: TUpdateStateFn<T>
}
