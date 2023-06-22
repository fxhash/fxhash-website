export function hasFixedPosition(node: Element) {
  let testedNode: Element | null = node
  while (testedNode && testedNode.nodeName.toLowerCase() !== "body") {
    if (
      window
        .getComputedStyle(testedNode)
        .getPropertyValue("position")
        .match(/fixed|sticky/i)
    ) {
      return testedNode
    }
    testedNode = testedNode.parentNode as Element
  }
  return false
}
