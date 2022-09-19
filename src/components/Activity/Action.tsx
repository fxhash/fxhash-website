import style from "./Action.module.scss"
import colors from "../../styles/Colors.module.css"
import cs from "classnames"
import { Action as ActionType } from "../../types/entities/Action"
import { useMemo, PropsWithChildren } from "react"
import Link from "next/link"
import { TActionLinkFn } from "./Actions/Action"
import { DateDistance } from "../Utils/Date/DateDistance"
import { ActionDefinitions } from "./ActionDefinitions"

interface Props {
  action: ActionType
  verbose: boolean
}
export const ActionReference = ({ action }: { action: ActionType }) => {
  return (
    <a
      className={cs(style.date)}
      href={`https://tzkt.io/${action.opHash}`}
      target="_blank"
      rel="noreferrer"
    >
      <DateDistance timestamptz={action.createdAt} />
      <i aria-hidden className="fas fa-external-link-square" />
    </a>
  )
}

// some actions may have a link to a page - which requires some tricky logic
type ILinkWrapperProps = PropsWithChildren<{
  action: ActionType
  linkFn?: TActionLinkFn | null
}>
function LinkWrapper({ action, linkFn, children }: ILinkWrapperProps) {
  const link = useMemo(() => linkFn?.(action) || null, [action, linkFn])

  return link ? (
    <article className={cs(style.container, style.is_link)}>
      <Link href={link}>
        <a className={cs(style.link_wrapper)} />
      </Link>
      {children}
    </article>
  ) : (
    <article className={cs(style.container)}>{children}</article>
  )
}

export function Action({ action, verbose }: Props) {
  const def = useMemo(() => ActionDefinitions[action.type], [action.type])

  if (!def?.render) {
    return <div>todo {action.type}</div>
  }

  return (
    <LinkWrapper action={action} linkFn={def.link}>
      <div className={cs(style.content)}>
        <div className={cs(style.details)}>
          <i
            aria-hidden
            className={cs(def.icon, colors[def.iconColor], style.icon)}
          />
          <div className={cs(style.details_content)}>
            {def.render({ action, verbose })}
          </div>
        </div>
        <ActionReference action={action} />
      </div>
    </LinkWrapper>
  )
}
