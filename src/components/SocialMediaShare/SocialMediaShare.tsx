import React, { memo, useMemo } from 'react'
import cs from "classnames"
import style from "./SocialMediaShare.module.scss"

type SocialMediaShareProps = {
  url: string
  disabled?: boolean
}

const SocialMediaShare = ({ 
  url, 
  disabled,
}: SocialMediaShareProps) => {
  const socialMedias = useMemo(() => {
    const sharingUrl = encodeURIComponent(url);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${sharingUrl}`;
    const twUrl = `https://twitter.com/intent/tweet?url=${sharingUrl}`;
    const lnUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${sharingUrl}`;

    return [
      { key: 'twitter', url: twUrl, icon: 'fa-brands fa-twitter' },
      { key: 'fb', url: fbUrl, icon: 'fa-brands fa-facebook' },
      { key: 'linkedin', url: lnUrl, icon: 'fa-brands fa-linkedin' },
    ];
  }, [url])

  return (
      <div className={cs(style.container, {
        [style.disabled]: disabled
      })}>
        {socialMedias.map((media) => (
          <a
            key={media.key}
            href={media.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={disabled ? -1 : 0}
          >
            <i aria-hidden className={media.icon} />
          </a>
        ))}
      </div>
  );
};

export default memo(SocialMediaShare);
