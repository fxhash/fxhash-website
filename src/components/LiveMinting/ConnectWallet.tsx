import React, { memo, useCallback, useContext } from "react"
import cs from "classnames"
import style from "./ConnectWallet.module.scss"
import { Button } from "../Button"
import { UserContext } from "../../containers/UserProvider"
import { LiveMintingContext } from "../../context/LiveMinting"

const _ConnectWallet = () => {
  const { connect } = useContext(UserContext)
  const { event } = useContext(LiveMintingContext)

  const handleClickConnect = useCallback(
    (useAutonomy: boolean) => connect(useAutonomy),
    [connect]
  )

  const handleClickConnectAutonomy = () => handleClickConnect(true)
  const handleClickConnectWallet = () => handleClickConnect(false)

  return (
    <div className={cs(style.container)}>
      <div className={cs(style.welcome)}>
        Welcome to our Live Minting experience at <strong>{event?.name}</strong>
      </div>

      <div className={style.container_button}>
        <Button
          color="secondary"
          className={style.button}
          onClick={handleClickConnectAutonomy}
        >
          connect Autonomy wallet
        </Button>
        <div className={style.purchase}>
          You will be prompted to select a wallet from the Autonomy app
        </div>
      </div>

      {/* 

      TODO: figure out how to connect other wallet from inside autonomy webview
      
      <div className={style.container_button}>
        <Button
          type="button"
          iconComp={<i aria-hidden className="fas fa-wallet" />}
          onClick={handleClickConnectWallet}
        >
          connect other wallet
        </Button>
      </div> */}
    </div>
  )
}

export const ConnectWallet = memo(_ConnectWallet)
