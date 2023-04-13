import { Editor, Path } from "slate"

// a function which updates a node based on some update fields
export type TEditNodeFn = (update: any) => void

// a function which outputs a TEditNodeFn based on some construction properties
export type TEditNodeFnFactory = (
  editor: Editor,
  element: Element,
  path: Path
) => TEditNodeFn
