import style from "./EditTokenSnippet.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import { displayMutez, displayRoyalties } from "../../utils/units"
import Link from "next/link"
import { Button } from "../../components/Button"
import { useContext } from "react"
import { UserContext } from "../UserProvider"


interface Props {
  token: GenerativeToken
}

export function EditTokenSnippet({ token }: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!

  if (!user || !token) return null

  return user.id === token.author.id ? (
    <div className={cs(style.container)}>
      <Link href={`/edit-generative/${token.id}`} passHref>
        <Button
          isLink
          size="small"
        >
          edit
        </Button>
      </Link>
      <strong className={cs({ [style.enabled]: token.enabled, [style.disabled]: !token.enabled })}>
        {token.enabled ? "enabled" : "disabled"}
      </strong>
      <span>
        <strong>price:</strong> {displayMutez(token.price, 3)}tez
      </span>
      <span>
        <strong>royalties:</strong> {displayRoyalties(token.royalties)}
      </span>
    </div>
  ):null
}