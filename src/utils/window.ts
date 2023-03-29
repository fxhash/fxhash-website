export function hasLocalStorage() {
  const fx = "fx"
  try {
    localStorage.setItem(fx, fx)
    localStorage.removeItem(fx)
    return true
  } catch (e) {
    return false
  }
}
