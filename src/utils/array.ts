export function shuffleArray<T = any>(array: T[]): T[] {
  const a = [...array]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = a[i]
    a[i] = a[j]
    a[j] = temp
  }
  return a
}

export function arrayRemove<T = any>(array: T[], item: T) {
  const idx = array.indexOf(item)
  if (idx > -1) {
    array.splice(idx, 1)
  }
  return array
}

export function arraySum(array: number[]) {
  return array.reduce((prev, curr) => prev + curr, 0)
}

export function arrayAverage(array: number[]) {
  const sum = arraySum(array)
  return sum / array.length
}

export type TArrayCompareFn<T = any> = (a: T, b: T) => boolean
export type TArrayCopyFn<T = any> = (array: T[]) => T[]

export function arrayRemoveDuplicates<T = any>(
  array: T[],
  isSame: TArrayCompareFn<T> = (a, b) => a === b,
  arrayCopy: TArrayCopyFn<T> = arr => arr,
): T[] {
  const ret = arrayCopy(array)
  for1: for (let i = array.length-1; i >= 1; i--) {
    for (let j = i-1; j >= 0; j--) {
      if (isSame(array[i], array[j])) {
        ret.splice(i, 1)
        continue for1
      }
    }
  }
  return ret
}