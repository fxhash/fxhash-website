import React, { useContext, useState, useEffect } from 'react'
import style from "./TopBanner.module.scss"
import cs from "classnames"
import { SettingsContext, ISettingsContext } from '../context/Theme'
import { Warning } from './Layout/Warning';

interface Props {
 message: string|undefined 
}

export function TopBanner({ message }:Props) {
  const settings = useContext<ISettingsContext>(SettingsContext)

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClose = () => {
    if (isOpen && message) {
      settings.update('topBannerMessage', message)
    }
  }

  useEffect(() => {
    const { topBannerMessage } = settings;
    setIsOpen(message !== topBannerMessage)
  }, [settings.topBannerMessage]);

  return (
    <Warning
      closeButton={
	<button
	  className={cs(style.btn_close)}
	  onClick={handleClose}
	>
	  <i aria-hidden className="far fa-times"/>
	</button>
      }
      className={cs({[style.hidden]: !isOpen})}
    >
      <i aria-hidden className="fa-solid fa-party-horn"/>
      <span dangerouslySetInnerHTML={{ __html: message }}/>
    </Warning>
  )
}
