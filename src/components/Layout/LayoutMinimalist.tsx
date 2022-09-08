import React, { memo, PropsWithChildren, useContext } from 'react';
import cs from "classnames"
import { HeaderMinimalist } from "./HeaderMinimalist";
import style from "./LayoutMinimalist.module.scss";
import { UserContext } from "../../containers/UserProvider";
import { ConnectWallet } from "../LiveMinting/ConnectWallet";
import { WalletBalance } from '../User/WalletBalance';

interface LayoutMinimalistProps extends PropsWithChildren<{}> {
  requireWallet?: boolean
}
const _LayoutMinimalist = ({ requireWallet, children }: LayoutMinimalistProps) => {
  const userCtx = useContext(UserContext);
  return (
    <div className={style.screen}>
      <HeaderMinimalist />

      <main className={style.main}>
        {requireWallet ?
          <>
            {userCtx.user ? (
              <>
                <div className={cs(style.wallet_balance)}>
                  <span>Wallet balance:</span>
                  <span className={cs(style.balance)}>
                    <WalletBalance/>
                  </span>
                </div>
                {children}
              </>
            ): <ConnectWallet />}
          </>
          : children
        }
      </main>
    </div>
  );
};

export const LayoutMinimalist = memo(_LayoutMinimalist);
