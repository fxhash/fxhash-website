import style from "./Dropzone.module.scss"
import cs from "classnames"
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { prettyPrintBytes } from "../../utils/units"


interface Props {
  accepted?: string | string[]
  files?: File[] | null
  onChange: (files: File[]|null) => void
  textDefault?: string
  textDrag?: string
  className?: string
}

export function Dropzone({ 
  textDefault = "Drag 'n' drop some files here, or click to select files",
  textDrag = "Drop the files here ...",
  accepted, 
  files, 
  onChange,
  className
}: Props) {
  const [error, setError] = useState<string|null>(null)

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      // send file upwards
      onChange(acceptedFiles)
      setError(null)
    }
    else {
      onChange(null)
      setError("Format is not supported")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    onDragEnter: (event) => {
    },
    accept: accepted,
    maxFiles: 1,
    multiple: false,
    maxSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILESIZE!) * 1024 * 1024
  })

  return (
    <div {...getRootProps()} className={cs(style.container, className, {
      [style.drag]: isDragActive,
      [style.error]: !!error
    })}>
      <input {...getInputProps()} />
      {files ? (
        <p>{ files.map(f => `📃 ${f.name} (${prettyPrintBytes(f.size)})`).join(', ') }</p>
      ):(
        <p>{ error ? error : (isDragActive ? textDrag : textDefault) }</p>
      )}
    </div>
  )
}