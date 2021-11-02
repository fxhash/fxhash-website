// import style from "./Reveal.module.scss"
import cs from "classnames"
import { Objkt } from "../../types/entities/Objkt"

interface Props {
  generativeUri: string
  previeweUri: string
}

/**
 * The Reveal component displays a token with metadata assigned in a proper way
 */
export function Reveal({ generativeUri, previeweUri }: Props) {
  console.log("reveal ")
  console.log({ generativeUri, previeweUri })
  return (
    <div>display token with nice effect</div>
  )
}