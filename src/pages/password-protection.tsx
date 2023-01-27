import { NextPage } from "next"
import Head from "next/head"
import { ChangeEventHandler, useCallback, useState } from "react"
import { useRouter } from "next/router"

// least dependencies possible
import style from "../styles/PasswordProtection.module.scss"

const PasswordProtection: NextPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<false | string>(false)
  const [password, setPassword] = useState("")
  const handleChangePassword = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >((e) => {
    setPassword(e.target.value)
  }, [])
  const handleLogIn = useCallback(
    async (e) => {
      e.preventDefault()
      setError(false)
      if (password.length < 1) return
      try {
        setLoading(true)
        const response = await fetch("/api/unlock-password-protection", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          referrerPolicy: "no-referrer",
          body: JSON.stringify({
            password,
          }),
        })
        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message)
        }
        router.push("/")
      } catch (e: any) {
        setLoading(false)
        console.error(e)
        setError(e.message || "Error")
      }
    },
    [password, router]
  )
  return (
    <>
      <Head>
        <title>Authentification required - fxhash</title>
      </Head>
      <main className={style.main}>
        <div>
          <div className={style.section}>
            <h3>fxhash</h3>
            <h1>Authentification required</h1>
            <p>This deployment requires authentication.</p>
          </div>
          <div className={style.section}>
            {error && <p className={style.error}>{error}</p>}
            <form onSubmit={handleLogIn}>
              <input
                type="password"
                onChange={handleChangePassword}
                placeholder="password"
              />
              <button disabled={loading}>
                {loading ? "loading..." : "login"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}

export default PasswordProtection
