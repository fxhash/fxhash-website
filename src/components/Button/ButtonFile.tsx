import { useRef } from "react"
import { Button, ButtonProps } from "./index"

interface Props extends ButtonProps {
  onFile: (file: File|null) => void
  accepted?: string[]
  multiple?: boolean
  maxSize?: number
}

export function ButtonFile({ 
  onFile,
  accepted = [ "*" ],
  multiple = false,
  maxSize = 1024*1024,
  ...props 
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const clicked = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const onChange = () => {
    const files = inputRef.current!.files
    if (files && files.length > 0) {
      onFile(files[0])
    }
    else {
      onFile(null)
    }
  }

  return (
    <>
      <input 
        hidden
        ref={inputRef}
        type="file"
        multiple={multiple}
        accept={accepted.join(',')}
        onChange={onChange}
      />
      <Button {...props} onClick={clicked}>{ props.children }</Button>
    </>
  )
}