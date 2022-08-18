import style from "./Dropzone.module.scss"
import cs from "classnames"
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { prettyPrintBytes } from "../../utils/units"

interface Props {
  accepted?: string | string[]
  files?: File[] | null
  onChange: (files: File[]|null) => void
  textDefault?: ReactNode
  textDrag?: ReactNode
  className?: string
  onClick?: () => void
}

export function Dropzone({
  textDefault = "Drag 'n' drop some files here, or click to select files",
  textDrag = "Drop the files here ...",
  accepted,
  files,
  onChange,
  onClick,
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
  }, [onChange])

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    onDragEnter: (event) => {
    },
    accept: accepted,
    maxFiles: 1,
    multiple: false,
    maxSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILESIZE!) * 1024 * 1024
  })

  const rootProps = useMemo(() => {
    const props = getRootProps()
    if (onClick) {
      props.onClick = onClick
    }
    return props
  }, [getRootProps])

  return (
    <div
      {...rootProps}
      className={cs(style.container, className, {
        [style.drag]: isDragActive,
        [style.error]: !!error
      })}
      contentEditable={false}
    >
      <input {...getInputProps()} />
      {files ? (
        <div>{ files.map(f => `📃 ${f.name} (${prettyPrintBytes(f.size)})`).join(', ') }</div>
      ):(
        <div>{ error ? error : (isDragActive ? textDrag : textDefault) }</div>
      )}
    </div>
  )
}
