import style from "./Dropzone.module.scss"
import cs from "classnames"
import { ReactNode, useCallback, useMemo, useState } from "react"
import { ErrorCode, useDropzone } from "react-dropzone"
import { prettyPrintBytes } from "../../utils/units"
import colors from "../../styles/Colors.module.css"

const getPrettyError = (code: ErrorCode) => {
  switch (code) {
    case ErrorCode.FileInvalidType:
      return "Invalid format"
    case ErrorCode.FileTooLarge:
      return "File is too large"
    case ErrorCode.FileTooSmall:
      return "File is too small"
    case ErrorCode.TooManyFiles:
      return "There are too many files"
    default:
      return "Unknown error"
  }
}

export interface DropzoneProps {
  accepted?: string | string[]
  files?: File[] | null
  onChange: (files: File[] | null) => void
  textDefault?: ReactNode
  textDrag?: ReactNode
  className?: string
  onClick?: () => void
  maxSizeMb?: number
}

export function Dropzone({
  textDefault = "Drag 'n' drop some files here, or click to select files",
  textDrag = "Drop the files here ...",
  accepted,
  files,
  onChange,
  onClick,
  className,
  maxSizeMb = parseInt(process.env.NEXT_PUBLIC_MAX_FILESIZE!),
}: DropzoneProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        // send file upwards
        onChange(acceptedFiles)
        setError(null)
      } else {
        onChange(null)
        setError("Format is not supported")
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      onDragEnter: (event) => {},
      accept: accepted,
      maxFiles: 1,
      multiple: false,
      maxSize: maxSizeMb * 1024 * 1024,
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
        [style.error]: !!error,
      })}
      contentEditable={false}
    >
      <input {...getInputProps()} />
      {files ? (
        <div>
          {files
            .map((f) => `📃 ${f.name} (${prettyPrintBytes(f.size)})`)
            .join(", ")}
        </div>
      ) : (
        <div>
          {error ? (
            <>
              {fileRejections?.length > 0
                ? fileRejections.map(({ file, errors }) => (
                    <div key={file.name} className={colors.error}>
                      {file.name}:{" "}
                      {errors
                        .map((e) => getPrettyError(e.code as ErrorCode))
                        .join(",")}
                      {"."}
                    </div>
                  ))
                : error}
            </>
          ) : isDragActive ? (
            textDrag
          ) : (
            textDefault
          )}
        </div>
      )}
    </div>
  )
}
