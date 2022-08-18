import React, { memo, useState, useEffect } from 'react';
import { EmbedElementProps } from "./EmbedMediaDisplay";
import { getTweetIdFromUrl } from "../../../../utils/embed";
import style from "./Embed.module.scss";
import { Error } from "../../../Error/Error";
import useInit from "../../../../hooks/useInit";
import Skeleton from "../../../Skeleton";
import { LoaderBlock } from "../../../Layout/LoaderBlock";

const twitterWidgetJs = 'https://platform.twitter.com/widgets.js';

declare global {
  interface Window {
    twttr: any;
  }
}

const EmbedTwitter = memo<EmbedElementProps>(({ href}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [isInit, setIsInit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasTweetNotFound, setHasTweetNotFound] = useState(false);

  useInit(() => {
    const script = require('scriptjs');
    script(twitterWidgetJs, 'twitter-embed', () => setIsInit(true));
  })

  useEffect(() => {
    const loadTweet = async () => {
      setIsLoading(true)
      if (ref.current) {
        ref.current?.replaceChildren();
      }
      const tweetElement = await window.twttr.widgets.createTweet(
        tweetId,
        ref?.current,
      )
      setIsLoading(false);
      if (!tweetElement) {
        setHasTweetNotFound(true);
      }
    };

    if (!isInit) return ;
    setHasTweetNotFound(false);
    const tweetId = getTweetIdFromUrl(href);
    if (!tweetId) return ;
    if (!window.twttr) {
      console.error('Failure to load window.twttr, aborting load');
      return;
    }
    if (!window.twttr.widgets.createTweet) {
      console.error(`Method createTweet is not present anymore in twttr.widget api`);
      return;
    }
    loadTweet();
  }, [href, isInit]);

  return (
    <>
      {isLoading && <LoaderBlock className={style.twitter_loading} size="small" />}
      <div className={style.twitter} ref={ref}/>
      {hasTweetNotFound && <Error>No tweet found for this url</Error>}
    </>
  );
});

EmbedTwitter.displayName = 'EmbedTwitter';
export default EmbedTwitter;
