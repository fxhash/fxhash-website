import style from "./EditTokenSnippet.module.scss"
import cs from "classnames"
import { GenerativeToken } from "../../types/entities/GenerativeToken"
import Link from "next/link"
import { Button } from "../../components/Button"
import { useContext } from "react"
import { UserContext } from "../UserProvider"
import { Spacing } from "../../components/Layout/Spacing"
import { isGenerativeAuthor } from "../../utils/generative-token"
import { User } from "../../types/entities/User"

interface Props {
  token: GenerativeToken
}

export function EditTokenSnippet({ token }: Props) {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!

  if (!user || !token) return null

  return isGenerativeAuthor(token, user as User) ? (
    <>
      <div className={cs(style.container)}>
        <Link href={`/edit-generative/${token.id}`} passHref>
          <Button isLink size="small" className={style.button}>
            edit
          </Button>
        </Link>
      </div>

      <Spacing size="large" sm="x-large" />
    </>
  ) : null
}
