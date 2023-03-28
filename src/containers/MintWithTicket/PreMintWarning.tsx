import React, { memo, useCallback, useState } from "react"
import { generateFxHash } from "../../utils/hash"
import { Checkbox } from "../../components/Input/Checkbox"
import { useSettingsContext } from "../../context/Theme"
import style from "./PreMintWarning.module.scss"
import { BaseButton, IconButton } from "../../components/FxParams/BaseInput"
import { Spacing } from "../../components/Layout/Spacing"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faRotate } from "@fortawesome/free-solid-svg-icons"
interface PreMintWarningProps {
  onChangeHash: (hash: string) => void
  onMint: () => void
  onClose: () => void
}

const _PreMintWarning = ({
  onChangeHash,
  onMint,
  onClose,
}: PreMintWarningProps) => {
  const { update } = useSettingsContext()
  const [counterGeneration, setCounterGeneration] = useState(0)
  const [hideNextTime, setHideNextTime] = useState(false)
  const handleGenerateHash = useCallback(() => {
    setCounterGeneration((old) => old + 1)
    onChangeHash(generateFxHash())
  }, [onChangeHash])
  const handleClickMint = useCallback(() => {
    if (hideNextTime) {
      update("showTicketPreMintWarning", false)
    }
    onMint()
  }, [hideNextTime, onMint, update])
  return (
    <div className={style.container}>
      <p>
        What you see is <strong>not necessarily</strong> what you get.
        <br />
        <br />
        Minted outputs can differ significantly from the displayed preview.
        <br />
        <br />
        Try out with different hashes at least 3 times to visualize how your
        mint will look like.
      </p>
      <Spacing size="x-large" sm="regular" />
      <div className={style.container_generate}>
        <div>{counterGeneration < 3 ? counterGeneration : 3}/3 hashes</div>
        <BaseButton
          type="button"
          color="primary-inverted"
          onClick={handleGenerateHash}
          className={style.generate}
        >
          <FontAwesomeIcon icon={faRotate} />
          <span>new hash</span>
        </BaseButton>
      </div>
      <Spacing size="3x-large" sm="x-large" />
      <Checkbox
        value={hideNextTime}
        onChange={setHideNextTime}
        className={style.checkbox}
        classNameCheckmark={style.checkmark}
        paddingLeft={false}
      >
        Don't show this warning next time
      </Checkbox>
      <div className={style.container_mint}>
        <IconButton onClick={onClose} title="go back to params">
          <FontAwesomeIcon icon={faArrowLeft} />
        </IconButton>
        <BaseButton
          title="mint"
          color="main"
          type="button"
          onClick={handleClickMint}
          disabled={counterGeneration < 3}
          className={style.mint}
        >
          mint
        </BaseButton>
      </div>
    </div>
  )
}

export const PreMintWarning = memo(_PreMintWarning)
