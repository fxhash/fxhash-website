import effect from "../../styles/Effects.module.scss"
import style from "./Avatar.module.scss"
import cs from "classnames"
import { ipfsGatewayUrl } from "../../services/Ipfs"
import { MouseEventHandler, useMemo, useRef } from "react"

interface Props {
  currentIpfs?: string
  file?: File | null
  onChange: (file: File) => void
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
  const url = useMemo<string | null>(
    () => (file ? URL.createObjectURL(file) : ipfsGatewayUrl(currentIpfs)),
    [currentIpfs, file]
  )

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

  return (
    <>
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
      </button>
      <input
        ref={inputFileRef}
        type="file"
        hidden
        multiple={false}
        accept="image/*"
        onChange={onFileChange}
      />
    </>
  )
}
