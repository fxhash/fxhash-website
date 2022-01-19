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