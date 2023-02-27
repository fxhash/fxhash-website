export const onKeydownAccessibleButton =
  (callback: any) => (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter" || e.key === "Spacebar") {
      callback(e.target)
    }
  }
