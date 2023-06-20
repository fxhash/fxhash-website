import React, { memo } from "react"
import cs from "classnames"
import style from "./ConnectWithUs.module.scss"
import Link from "next/link"

interface SocialProps {
  icon: string
  url: string
}

function FooterSocial({ icon, url }: SocialProps) {
  return (
    <Link href={url}>
      <a>
        <i aria-hidden className={`fab fa-${icon}`} />
      </a>
    </Link>
  )
}
interface ConnectWithUsProps {
  className?: string
}
const _ConnectWithUs = ({ className }: ConnectWithUsProps) => {
  return (
    <div className={cs(style.container, className)}>
      <span>connect with us</span>
      <div className={cs(style.socials)}>
        <FooterSocial
          icon="square-twitter"
          url={process.env.NEXT_PUBLIC_URL_TWITTER!}
        />
        <FooterSocial
          icon="square-instagram"
          url={process.env.NEXT_PUBLIC_URL_INSTAGRAM!}
        />
        <FooterSocial
          icon="discord"
          url={process.env.NEXT_PUBLIC_URL_DISCORD!}
        />
      </div>
    </div>
  )
}

export const ConnectWithUs = memo(_ConnectWithUs)
