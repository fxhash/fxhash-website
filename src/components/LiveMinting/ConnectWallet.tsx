import React, { memo, useCallback, useContext, useMemo, useState } from "react"
import autonomyIRL from "autonomy-irl-js"
import cs from "classnames"
import style from "./ConnectWallet.module.scss"
import { Button } from "../Button"
import { UserContext } from "../../containers/UserProvider"
import { IconTezos } from "../Icons/IconTezos"
import Link from "next/link"
import { Checkbox } from "../Input/Checkbox"
import { Spacing } from "../Layout/Spacing"
import { LiveMintingContext } from "../../context/LiveMinting"
import { useRouter } from "next/router"

type WalletType = "custom" | "naan"
const options = [
  {
    value: "naan",
    label: "I have installed naan wallet",
  },
  {
    value: "custom",
    label: "I have my own wallet installed",
  },
]

const _ConnectWallet = () => {
  const [walletType, setWalletType] = useState<WalletType | "">("")
  const userCtx = useContext(UserContext)

  const liveMinting = useContext(LiveMintingContext)

  const isFreeLiveMint = true

  const handleClickConnect = useCallback(() => {
    userCtx.connect()
  }, [userCtx, walletType])

  const getAutonomyAddress = async () => {
    const result = await autonomyIRL.getAddress({
      chain: autonomyIRL.chain.tez,
      // params: params,
    })

    console.log(result)
  }

  return (
    <div className={cs(style.container)}>
      <div className={cs(style.welcome)}>
        Welcome to our Live Minting experience at{" "}
        <strong>{liveMinting.event?.name}</strong>
      </div>

      <div className={style.container_button}>
        {isFreeLiveMint ? (
          <Button
            color="secondary"
            className={style.button}
            onClick={getAutonomyAddress}
          >
            sync Autonomy wallet
          </Button>
        ) : (
          <>
            <Link href={"https://wallet.kukai.app/"} passHref>
              <Button
                isLink
                // @ts-ignore
                target="_blank"
                color="secondary"
                className={style.button}
              >
                sync with autonomy wallet
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
          </>
        )}
      </div>

      <div className={style.container_button}>
        <Button
          type="button"
          // disabled={!walletType && !isFocus}
          iconComp={<i aria-hidden className="fas fa-wallet" />}
          onClick={handleClickConnect}
        >
          connect your wallet
        </Button>
      </div>
    </div>
  )
}

export const ConnectWallet = memo(_ConnectWallet)
