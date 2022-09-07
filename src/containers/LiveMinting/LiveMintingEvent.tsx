import React, { memo } from 'react';
import style from "./LiveMintingEvent.module.scss";

interface LiveMintingEventProps {
  // eventId
}

const _LiveMintingEvent = (props: LiveMintingEventProps) => {
  return (
    <div className={style.container}>
      <p>
        These are the projects created especially for this event.<br/>
        Make sure you have enough tezos in your wallet before minting.
      </p>
      <div>
        list of events
      </div>
    </div>
  );
};

export const LiveMintingEvent = memo(_LiveMintingEvent);
