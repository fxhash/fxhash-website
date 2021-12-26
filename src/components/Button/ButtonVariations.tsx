import style from "./ButtonVariations.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { Button } from "."
import { useMemo } from "react"
import { generateFxHash } from "../../utils/hash"
import { uniq } from "lodash"

interface Props {
  token: GenerativeToken
  previewHash?: string|null
  onChangeHash: (hash: string) => void
}
export function ButtonVariations({
  token,
  previewHash,
  onChangeHash,
}: Props) {
  // some shortcuts to get access to useful variables derived from the token data
  const fullyMinted = token.balance === 0
  const exploreSet = token.metadata.settings?.exploration

  // settings activated based on fully minted state
  const activeSettings = fullyMinted ? exploreSet?.postMint : exploreSet?.preMint

  // the hover message is only here if disabled, and depends some conditions
  const hoverMessage = useMemo<string|null>(() => {
    if (!token.metadata.settings?.exploration) {
      return "This token doesn't have variation settings, therefore exploration of variations is disabled"
    }
    if (!activeSettings?.enabled) {
      if (fullyMinted) {
        return "Artist disabled the exploration of variations after minting phase"
      }
      else {
        return "Artist disabled the exploration of variation during the minting phase"
      }
    }
    return null
  }, [])

  // a list of hashes to explore, if enabled
  const hashes = useMemo<string[]|null>(() => {
    if (!activeSettings?.hashConstraints) {
      return null
    }
    return uniq([
      token.metadata.previewHash!,
      ...activeSettings.hashConstraints
    ])
  }, [])

  // the component rendering the icon next to the button 
  const icon = useMemo(() => {
    if (activeSettings?.enabled) {
      // if there is an infinite number of variations
      if (!activeSettings?.hashConstraints) {
        return (
          <i aria-hidden className="fas fa-infinity"/>
        )
      }
      // otherwise there is a finite amount of variations, we need to display the active
      else {
        // find index of the active hash
        let idx = hashes?.indexOf(previewHash!)
        idx = idx === -1 || idx == null ? 0 : idx
        return (
          <div className={cs(style.progress)}>
            {idx+1}/{hashes!.length}
          </div>
        )
      }
    }
  }, [previewHash])

  // update the preview hash, either by looping through available hashes, or by
  // generating a random hash
  const updatePreviewHash = () => {
    // if no hash constraints, just give a random hash
    if (!hashes) {
      onChangeHash(generateFxHash())
    }
    // if there is a list of hashes, cycle through those
    else {
      // find index of the active hash
      let idx = hashes?.indexOf(previewHash!)
      console.log(idx)
      idx = idx === -1 || idx == null ? 0 : idx
      // compute the new index
      idx = (idx+1) % hashes.length
      console.log(idx)
      console.log(hashes[idx])
      onChangeHash(hashes[idx])
    }
  }

  return (
    <div className={cs(style.wrapper, {
      [style.hover_enabled]: !!hoverMessage
    })}>
      <Button
        type="button"
        size="small"
        disabled={!activeSettings?.enabled}
        iconComp={icon}
        iconSide="right"
        onClick={updatePreviewHash}
      >
        variations
      </Button>
      {hoverMessage && (
        <div className={cs(style.hover_message)}>
          {hoverMessage}
        </div>
      )}
    </div>
  )
}