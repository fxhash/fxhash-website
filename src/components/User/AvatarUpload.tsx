import effect from "../../styles/Effects.module.scss"
import style from "./Avatar.module.scss"
import cs from "classnames"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { MouseEventHandler, useCallback, useMemo, useRef } from "react"

interface Props {
  currentIpfs?: string
  file?: File | "ipfs" | null
  onChange: (file: File | null) => void
  className?: string
}

export function AvatarUpload({
  currentIpfs,
  file,
  className,
  onChange,
}: Props) {
  const inputFileRef = useRef<HTMLInputElement>(null)

  // the url is determined as following:
  // - is there a file ? if so get a local url to display it
  // - is there a current ipfs url to display url
  // - url is empty
  const url = useMemo<string | null>(() => {
    if (file && file !== "ipfs") {
      return URL.createObjectURL(file)
    }
    if (file === "ipfs") {
      return ipfsGatewayUrl(currentIpfs)
    }
    return null
  }, [currentIpfs, file])

  const onFileChange = () => {
    if (inputFileRef.current) {
      const files = inputFileRef.current.files
      if (files && files.length > 0) {
        onChange(files[0])
      }
    }
  }

  const onClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.preventDefault()
    inputFileRef.current?.click()
  }

  const handleRemovePicture = useCallback(() => {
    onChange(null)
  }, [onChange])
  return (
    <div className={style.wrapper}>
      <button
        type="button"
        className={cs(
          style.container,
          style["avatar-upload"],
          effect["drop-shadow-small"],
          className,
          {
            [style["no-image"]]: !url,
          }
        )}
        style={{
          backgroundImage: url ? `url(${url})` : "none",
        }}
        onClick={onClick}
      >
        <span>upload {url ? "a new" : "an"} image</span>
        {url && <i className="fa-solid fa-arrow-up-from-bracket" />}
      </button>
      {url && (
        <button
          type="button"
          className={style.remove}
          onClick={handleRemovePicture}
        >
          remove image
        </button>
      )}
      <input
        ref={inputFileRef}
        type="file"
        hidden
        multiple={false}
        accept="image/*"
        onChange={onFileChange}
      />
    </div>
  )
}
