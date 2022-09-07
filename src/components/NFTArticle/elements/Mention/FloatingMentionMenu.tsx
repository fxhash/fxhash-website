import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ReactEditor, useSlate } from "slate-react";
import { Editor, Range, Transforms } from "slate";
import ReactDOM from "react-dom";
import { InputSearchUser } from "../../../Input/InputSearchUser";
import { mentionDefinition } from "./MentionDefinition";
import style from "./FloatingMentionMenu.module.scss"
import { User } from "../../../../types/entities/User";

export interface RefFloatingMentionMenu {
  onKeyDown: (event: React.KeyboardEvent) => void;
}
export const FloatingMentionMenu = forwardRef<RefFloatingMentionMenu>((props, ref) => {
  const editor = useSlate();
  const refFloatingMenu = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<Range | undefined | null>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [fetchedUsers, setFetchedUsers] = useState<User[]>([]);

  const handleFetchUsers = useCallback((users) => {
    setIndex(0);
    setFetchedUsers(users)
  }, [])
  const handleSelectUser = useCallback((tzAddress: string) => {
    if (target) {
      Transforms.select(editor, target)
    }
    const mention = mentionDefinition.instanciateElement!({ tzAddress });
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
    setTarget(null);
  }, [editor, target]);
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (target) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            const prevIndex = index >= fetchedUsers.length - 1 ? 0 : index + 1
            setIndex(prevIndex)
            break
          case 'ArrowUp':
            event.preventDefault()
            const nextIndex = index <= 0 ? fetchedUsers.length - 1 : index - 1
            setIndex(nextIndex)
            break
          case 'Tab':
          case 'Enter':
            event.preventDefault()
            const selectedUser = fetchedUsers[index];
            if (selectedUser) {
              handleSelectUser(selectedUser.id)
            }
            setTarget(null)
            break
          case 'Escape':
            event.preventDefault()
            setTarget(null)
            break
        }
      }
    },
    [fetchedUsers, handleSelectUser, index, target]
  )

  useEffect(() => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [start] = Range.edges(selection)
      const wordBefore = Editor.before(editor, start, { unit: 'word' })
      const before = wordBefore && Editor.before(editor, wordBefore)
      const beforeRange = before && Editor.range(editor, before, start)
      const beforeText = beforeRange && Editor.string(editor, beforeRange)
      const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
      const after = Editor.after(editor, start)
      const afterRange = Editor.range(editor, start, after)
      const afterText = Editor.string(editor, afterRange)
      const afterMatch = afterText.match(/^(\s|$)/)
      if (beforeMatch && afterMatch) {
        setTarget(beforeRange)
        setSearch(beforeMatch[1])
        setIndex(0)
        return
      }
    }
    setTarget(null)
  }, [editor, editor.selection])

  useEffect(() => {
    if (target && search.length > 2) {
      const el = refFloatingMenu.current
      const domRange = ReactEditor.toDOMRange(editor, target)
      const rect = domRange.getBoundingClientRect()
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`
        el.style.left = `${rect.left + window.pageXOffset}px`
      }
    }
  }, [search.length, editor, index, search, target])
  useImperativeHandle(ref, () => ({
    onKeyDown: handleKeyDown,
  }), [handleKeyDown])

  return target ? ReactDOM.createPortal(
    <div
      ref={refFloatingMenu}
      className={style.floating_menu}
    >
      <InputSearchUser
        value={search}
        onChange={handleSelectUser}
        displayAddress
        onFetchUsers={handleFetchUsers}
        hideInput
        hideNoResults
        classNameResults={style.search_results}
        keyboardSelectedUserIdx={index}
      />
    </div>,
    document.body
  ) : null;
});
FloatingMentionMenu.displayName = 'FloatingMentionMenu';
