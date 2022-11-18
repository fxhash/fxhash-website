import React, { memo } from "react"
import { Dropdown } from "../../../components/Navigation/Dropdown"
import style from "./GentksActions.module.scss"
import { getUserProfileLink } from "../../../utils/user"
import { User } from "../../../types/entities/User"
import Link from "next/link"
import { Button } from "../../../components/Button"
import { iconClubNft } from "../../../components/Icons/custom"

interface GentksActionsProps {
  user: User
}

const _GentksActions = ({ user }: GentksActionsProps) => {
  return (
    <Dropdown
      mobileMenuAbsolute
      itemComp={<i aria-hidden className="fa-solid fa-ellipsis-vertical" />}
      btnClassName={style.open_btn}
      className={style.dropdown}
    >
      <div>
        <Link href={`${getUserProfileLink(user)}/collection/enjoy`} passHref>
          <a className={style.opt}>
            <i aria-hidden className="fa-sharp fa-solid fa-circle-play" />
            <span>enjoy collection</span>
          </a>
        </Link>
      </div>
      <div>
        <a
          href={`https://app.clubnft.com/`}
          target="_blank"
          rel="noreferrer"
          className={style.opt}
        >
          <i aria-hidden>{iconClubNft}</i>
          <span>backup collection (ClubNFT)</span>
        </a>
      </div>
    </Dropdown>
  )
}

export const GentksActions = memo(_GentksActions)
