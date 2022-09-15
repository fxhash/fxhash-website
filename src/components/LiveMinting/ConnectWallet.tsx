import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import cs from "classnames"
import style from "./ConnectWallet.module.scss"
import { Button } from "../Button";
import { UserContext } from "../../containers/UserProvider";
import { IconTezos } from "../Icons/IconTezos";
import Link from 'next/link';
import { Checkbox } from "../Input/Checkbox";
import { Spacing } from '../Layout/Spacing';
import { LiveMintingContext } from '../../context/LiveMinting';
import { useRouter } from 'next/router';

type WalletType = 'custom' | 'naan';
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
  const [walletType, setWalletType] = useState<WalletType | ''>('');
  const userCtx = useContext(UserContext);

  const liveMinting = useContext(LiveMintingContext)

  const openNaaN = () => {
    window.open(
      `fxhash://${window.location.host}/live-minting/${liveMinting.event?.id}/?token=${liveMinting.mintPass?.token}&sync=naan`,
      '_blank'
    )
  }

  const handleChangeWallet = useCallback((value) => () => setWalletType(value), []);
  const handleClickConnect = useCallback(() => {
    if (walletType === 'custom') {
      userCtx.connect()
    } else if (walletType === 'naan') {
      openNaaN()
    } else {
      userCtx.connect()
    }
  }, [userCtx, walletType])

  // check if this is device is iOS
  const isIos = useMemo(
    () => typeof window !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent),
    []
  )

  const router = useRouter()
  const isFocus = !!(router.query?.sync === "naan")

  return (
    <div className={cs(style.container, {
      [style.center]: isFocus
    })}>
      {isFocus ? (
        <div className={cs(style.welcome)}>
          Please sync fxhash with NaaN wallet
        </div>
      ):(
        <div className={cs(style.welcome)}>
          Welcome to our Live Minting experience at{" "}
          <strong>{liveMinting.event?.name}</strong>
        </div>
      )}
    
      {!isFocus && (
        <div className={style.container_button}>
          <Link 
            href={
              isIos
                ? "https://apps.apple.com/us/app/naan-a-tasty-tezos-wallet/id1573210354"
                : "https://play.google.com/store/apps/details?id=com.naan&hl=en&gl=US"
            }
            passHref
          >
            <Button
              isLink
              // @ts-ignore
              target="_blank"
              color="secondary"
              className={style.button}
            >
              install naan wallet
            </Button>
          </Link>
          <div className={style.purchase}>
            You can purchase <span className={style.tezos}><IconTezos />tezos</span> from
            the wallet application
          </div>
        </div>
      )}
      <div className={style.container_button}>
        {!isFocus && (
          <>
            {options.map(opt =>
              <Checkbox
                key={opt.value}
                value={opt.value === walletType}
                onChange={handleChangeWallet(opt.value)}
                paddingLeft={false}
                isRadio
                className={style.radio}
              >
                {opt.label}
              </Checkbox>
            )}
            <Spacing size="x-small"/>
          </>
        )}
        <Button
          disabled={!walletType && !isFocus}
          iconComp={<i aria-hidden className="fas fa-wallet"/>}
          onClick={handleClickConnect}
        >
          connect your wallet
        </Button>
      </div>
    </div>
  );
};

export const ConnectWallet = memo(_ConnectWallet);
