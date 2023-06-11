export type TUpdateStateFn<T> = (data: Partial<T>) => void

export type TUpdateableState<T> = T & {
  update: TUpdateStateFn<T>
}
