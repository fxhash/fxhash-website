import React, { useContext, useCallback, useState } from 'react'
import style from "./Warning.module.scss"
import cs from "classnames"
import { TopBannerContext, ITopBannerContext } from '../../context/TopBanner'
import { FunctionComponent } from "react"
import Link from "next/link"

export const Warning: FunctionComponent = ({ children }) => {
  const [message, setMessage] = useState<string|null>(null);
  const { 
    history, 
    addMessage 
  } = useContext<ITopBannerContext>(TopBannerContext)

  const isOpen = !message || !history.find(m => m.text === message); 

  const handleClose = () => {
    if (isOpen && message) {
      addMessage({
	text: message,
	from: Date.now(), 
      }) 
    }
  }

  const messageRef = useCallback(node => {
    if (node) setMessage(node.textContent)
  }, [children])


  return (
    <div
      className={cs(style.container, {[style.hidden]: !isOpen})}
    >
      <button
	className={cs(style.btn_close)}
	onClick={handleClose}
      >
	<i aria-hidden className="far fa-times"/>
      </button>
      <Link href="/doc/fxhash/one">
	<a>
	  <span className={cs(style.message)} ref={messageRef}>
	    <i aria-hidden className="fa-solid fa-party-horn"/>
	    {children}
	  </span>
	</a>
      </Link>
    </div>
  )
}
