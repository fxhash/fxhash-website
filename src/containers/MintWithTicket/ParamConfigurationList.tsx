import { faCheck, faPen, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  concatParamConfiguration,
  ParamConfiguration,
} from "components/FxParams/ParamsHistory"
import { FxParamDefinition } from "components/FxParams/types"
import { deserializeParams } from "components/FxParams/utils"
import { DateDistance } from "components/Utils/Date/DateDistance"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { truncateEnd } from "utils/strings"
import style from "./ParamConfigurationList.module.scss"

interface ConfigNameProps {
  name: string
  onUpdateName: (name: string) => void
}

function ConfigName({ name, onUpdateName }: ConfigNameProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [newName, setNewName] = useState(name)
  const [isEditing, setIsEditing] = useState(false)
  const toggleIsEditing = () => {
    setIsEditing(!isEditing)
    if (isEditing) onUpdateName(newName)
  }
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value)
  }

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false)
      onUpdateName(newName)
    }
  }

  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.focus()
  }, [inputRef, isEditing])

  return (
    <h6>
      {!isEditing && name}
      {isEditing && (
        <input
          ref={inputRef}
          value={newName}
          onChange={handleChangeName}
          onKeyDown={handleSubmit}
        />
      )}
      <FontAwesomeIcon
        icon={isEditing ? faCheck : faPen}
        size="sm"
        onClick={toggleIsEditing}
      />
    </h6>
  )
}

interface ParamConfigurationListProps {
  items: ParamConfiguration[]
  params: FxParamDefinition<any>[]
  onLoadConfiguration: (c: ParamConfiguration) => void
  onUpdateConfigName: (idx: number, name: string) => void
  onRemoveConfig: (idx: number) => void
}

export function ParamConfigurationList({
  items,
  params,
  onLoadConfiguration,
  onUpdateConfigName,
  onRemoveConfig,
}: ParamConfigurationListProps) {
  const translateInputBytes = (bytes: string) => {
    const data = deserializeParams(bytes, params, {})
    return truncateEnd(Object.values(data).join(", "), 100)
  }
  return (
    <ul className={style.list}>
      {items.map((config, idx) => {
        return (
          <li key={concatParamConfiguration(config)}>
            <div className={style.head}>
              <ConfigName
                name={config.name}
                onUpdateName={(name) => onUpdateConfigName(idx, name)}
              />
              <DateDistance timestamptz={new Date(config.createdAt)} />
            </div>
            <div className={style.configWrap}>
              <div
                className={style.config}
                onClick={() => onLoadConfiguration(config)}
              >
                {config.hash}&nbsp;{translateInputBytes(config.inputBytes)}
              </div>
              <FontAwesomeIcon
                onClick={() => onRemoveConfig(idx)}
                icon={faTrash}
                size="sm"
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
