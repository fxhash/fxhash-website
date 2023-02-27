import { useEffect } from "react"

// this is a hack to fix the stylesheet order bug happening in prod
// todo - check if it's still happens when upgrading nextJs version
export const useTransitionStyleFix = () =>
  useEffect(() => {
    // Gather all server-side rendered stylesheet entries.
    let ssrPageStyleSheetsEntries = Array.from(
      document.querySelectorAll('link[rel="stylesheet"][data-n-p]')
    ).map((element) => ({
      element,
      href: element.getAttribute("href"),
    }))

    // Remove the `data-n-p` attribute to prevent Next.js from removing it early.
    ssrPageStyleSheetsEntries.forEach(({ element }) =>
      element.removeAttribute("data-n-p")
    )

    const fixedStyleHrefs: Record<string, any> = {}

    const mutationHandler = (mutations: any) => {
      // Gather all <style data-n-href="/..."> elements.
      const newStyleEntries = mutations
        .filter(
          ({ target }: { target: any }) =>
            target.nodeName === "STYLE" && target.hasAttribute("data-n-href")
        )
        .map(({ target }: { target: any }) => ({
          element: target,
          href: target.getAttribute("data-n-href"),
        }))

      // Cycle through them and either:
      // - Remove the `data-n-href` attribute to prevent Next.js from removing it early.
      // - Remove the element if it's already present.
      newStyleEntries.forEach(
        ({ element, href }: { element: any; href: string }) => {
          const styleExists = fixedStyleHrefs[href]

          if (styleExists) {
            styleExists.remove()
          }
          element.setAttribute("data-fouc-fix-n-href", href)
          element.removeAttribute("data-n-href")
          fixedStyleHrefs[href] = element
        }
      )

      // Cycle through the server-side rendered stylesheets and remove the ones that
      // are already present as inline <style> tags added by Next.js, so that we don't have duplicate styles.
      ssrPageStyleSheetsEntries = ssrPageStyleSheetsEntries.reduce(
        (entries, entry) => {
          const { element, href } = entry
          const styleExists = href && fixedStyleHrefs[href]
          if (styleExists) {
            element.remove()
          } else {
            entries.push(entry)
          }

          return entries
        },
        [] as any
      )
    }

    const observer = new MutationObserver(mutationHandler)

    observer.observe(document.head, {
      subtree: true,
      attributeFilter: ["media"],
    })

    return () => observer.disconnect()
  }, [])

export default useTransitionStyleFix
