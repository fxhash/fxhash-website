import React, { memo, useCallback, useContext, useState } from 'react';
import style from "./ConnectWallet.module.scss"
import { Button } from "../Button";
import { UserContext } from "../../containers/UserProvider";
import { IconTezos } from "../Icons/IconTezos";
import Link from 'next/link';
import { Checkbox } from "../Input/Checkbox";
import { Spacing } from '../Layout/Spacing';

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
  const handleChangeWallet = useCallback((value) => () => setWalletType(value), []);
  const handleClickConnect = useCallback(() => {
    if (walletType === 'custom') {
      userCtx.connect()
    } else if (walletType === 'naan') {
      // todo naan - I believe userCtx.connect should be able to do it on its own (naan appears there)
      userCtx.connect()
    }
  }, [userCtx, walletType])
  return (
    <div className={style.container}>
      <div className={style.container_button}>
        <Link href={"https://www.naanwallet.com"} passHref>
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
      <div className={style.container_button}>
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
        <Button
          disabled={!walletType}
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
