import React, {
  useRef,
  useEffect,
  useState,
  FormEvent,
  useCallback,
} from "react"
import style from "./FloatingInlineMenu.module.scss"
import effects from "../../../../styles/Effects.module.scss"
import { ReactEditor, useSlateStatic } from "slate-react"
import { Transforms, Node, Element, Editor, Range } from "slate"
import { lookupElementByType, useHotkey } from "../../utils"
import cs from "classnames"

const LINK_HOTKEY = "mod+k"

type OverrideContentHandler = (form: any) => void
type ResetOverrideContentHandler = () => void

interface LinkButtonProps {
  setOverrideContent: OverrideContentHandler
}

interface LinkButtomFormProps {
  resetOverrideContent: ResetOverrideContentHandler
  activeElement?: Node | null
}

export const LinkButtonForm = ({
  resetOverrideContent,
  activeElement,
}: LinkButtomFormProps) => {
  const editor = useSlateStatic()

  const inputRef = useRef<HTMLInputElement>(null)
  const [href, setHref] = useState(activeElement?.url || "")

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (activeElement) {
      Transforms.setNodes(
        editor,
        {
          url: href,
        },
        {
          match: (n) =>
            !Editor.isEditor(n) && Element.isElement(n) && n.type === "link",
        }
      )
    } else {
      Transforms.wrapNodes(
        editor,
        {
          type: "link",
          url: href,
        },
        {
          split: true,
        }
      )
    }
    resetOverrideContent()
  }

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHref(e.target.value)
  }

  useEffect(() => {
    setHref(activeElement?.url || "")
  }, [activeElement?.url])

  return (
    <form
      className={cs(style.linkForm)}
      autoComplete="off"
      onSubmit={handleSubmit}
      onMouseDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
        inputRef?.current?.focus()
      }}
    >
      <input
        ref={inputRef}
        type="text"
        id="fname"
        name="fname"
        value={href}
        autoFocus={!activeElement?.url}
        onChange={handleChangeInput}
        onBlur={resetOverrideContent}
        placeholder="https://"
      />
      <button type="submit">
        <i className="fa-solid fa-check" />
      </button>
      <button onClick={handleDelete}>
        <i className="fa-solid fa-trash-can" />
      </button>
    </form>
  )
}

export const LinkButton = ({ setOverrideContent }: LinkButtonProps) => {
  const editor = useSlateStatic()
  const currentNodeEntry = lookupElementByType(editor, "link")
  const isActive = !!currentNodeEntry

  const handleSetOverrideContent = useCallback(() => {
    setOverrideContent(
      <LinkButtonForm
        resetOverrideContent={() => {
          ReactEditor.focus(editor)
          setOverrideContent(null)
        }}
      />
    )
  }, [setOverrideContent, editor])

  useHotkey(
    LINK_HOTKEY,
    handleSetOverrideContent,
    editor.selection && Range.isCollapsed(editor.selection)
  )

  // auto open form when cursor is on a link
  useEffect(() => {
    if (isActive) {
      handleSetOverrideContent()
    }
  }, [isActive, handleSetOverrideContent])

  return (
    <button
      className={cs(style.button, { [style.active]: isActive })}
      onClick={handleSetOverrideContent}
    >
      <i className="fa-solid fa-link" aria-hidden />
    </button>
  )
}
