import style from "./Mint.module.scss"
import cs from "classnames"
import { Button } from "../../components/Button"
import { Error } from "../../components/Error/Error"
import colors from "../../styles/Colors.module.css"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { MintError } from "../../types/Responses"
import { getMintError } from "../../utils/errors"
import { displayMutez } from "../../utils/units"
import { getUserName } from "../../utils/user"


interface Props {
  token: GenerativeToken
  onStart: () => void
  error: string|null
}

export function MintInformations({ token, onStart, error }: Props) {
  return (
    <>
      <p>
        You are about to mint your own unique token of the piece <strong>{token.name}</strong>, 
        created by <strong className={cs(colors.secondary)}>{getUserName(token.author)}</strong>
      </p>
      <p className={cs(colors.gray)}>
        Click on this button to initiate the process
      </p>
      <Button
        color="secondary"
        size="large"
        onClick={onStart}
      >
        mint your unique token — {displayMutez(token.price)} tez
      </Button>

      {error && (
        <Error className={cs(style.error)}>
          An error occurred during the minting: <br/>
          {error}
        </Error>
      )}
    </>
  )
}