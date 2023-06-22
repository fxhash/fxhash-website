import React, { memo, useContext, useEffect, useState } from "react"
import cs from "classnames"
import style from "./ConnectWallet.module.scss"
import { Button } from "../Button"
import { UserContext } from "../../containers/UserProvider"
import { LiveMintingContext } from "../../context/LiveMinting"
import Link from "next/link"
import { IconTezos } from "components/Icons/IconTezos"

const ConnectWalletAutonomy = () => {
  const { connect } = useContext(UserContext)

  return (
    <div className={style.container_button}>
      <Button
        color="secondary"
        className={style.button}
        onClick={() => connect(true)}
      >
        connect Autonomy wallet
      </Button>
      <div className={style.purchase}>
        You will be prompted to select a wallet from the Autonomy app
      </div>
    </div>
  )
}

const ConnectWalletDefault = () => {
  const { connect } = useContext(UserContext)

  return (
    <>
      <div className={style.container_button}>
        <Link href={"https://wallet.kukai.app/"} passHref>
          <Button
            isLink
            // @ts-ignore
            target="_blank"
            color="secondary"
            className={style.button}
          >
            create wallet with kukai
          </Button>
        </Link>
        <div className={style.purchase}>
          You can purchase{" "}
          <span className={style.tezos}>
            <IconTezos />
            tezos
          </span>{" "}
          from the wallet application
        </div>
      </div>

      <div className={style.container_button}>
        <Button
          type="button"
          iconComp={<i aria-hidden className="fas fa-wallet" />}
          onClick={() => connect(false)}
        >
          connect your wallet
        </Button>
      </div>
    </>
  )
}

const _ConnectWallet = () => {
  const { event } = useContext(LiveMintingContext)
  const { connect } = useContext(UserContext)
  const [useAutonomy, setUseAutonomy] = useState(false)

  // check if visiting from Autonomy app
  useEffect(() => {
    const checkAutonomy = async () => {
      try {
        // attempt to connect to Autonomy wallet
        await connect(true)
        setUseAutonomy(true)
      } catch (e) {
        // do nothing
      }
    }

    checkAutonomy()
  }, [])

  return (
    <div className={cs(style.container)}>
      <div className={cs(style.welcome)}>
        Welcome to our Live Minting experience at <strong>{event?.name}</strong>
      </div>

      {useAutonomy ? <ConnectWalletAutonomy /> : <ConnectWalletDefault />}
    </div>
  )
}

export const ConnectWallet = memo(_ConnectWallet)
