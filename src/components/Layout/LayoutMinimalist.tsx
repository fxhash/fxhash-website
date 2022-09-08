import React, { memo, PropsWithChildren, useContext } from 'react';
import { HeaderMinimalist } from "./HeaderMinimalist";
import style from "./LayoutMinimalist.module.scss";
import { UserContext } from "../../containers/UserProvider";
import { ConnectWallet } from "../LiveMinting/ConnectWallet";

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
            {userCtx.user ? children : <ConnectWallet />}
          </>
          : children
        }
      </main>
    </div>
  );
};

export const LayoutMinimalist = memo(_LayoutMinimalist);
