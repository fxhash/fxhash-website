import style from "./FileList.module.scss"
import cs from "classnames"
import { useMemo, Fragment } from "react"


interface FileStructure {
  [key: string]: false | FileStructure
}

interface Props {
  files: string[]
}

function StructureRenderer({ structure }: { structure: FileStructure }) {
  const keys = Object.keys(structure)
  return (
    <>
      {keys.map(key => (
        structure[key] 
          ? (
            <Fragment key={key}>
              <li>{ key }</li>
              <ul>
                <StructureRenderer structure={structure[key] as FileStructure} />
              </ul>
            </Fragment>
          ):(
            <li key={key}>{ key }</li>
          )
      ))}
    </>
  )
}

export function FileList({ files }: Props) {
  // parse the files to turn them into a dir structure
  const structure = useMemo<FileStructure>(() => {
    const S: FileStructure = {}
    for (const F of files) {
      let dirs = F.split('/')
      let pos = S
      // build directories
      for (let i = 0; i < dirs.length-1; i++) {
        if (typeof pos[dirs[i]] === "undefined") {
          pos[dirs[i]] = {}
        }
        pos = pos[dirs[i]] as FileStructure
      }
      // add file
      pos[dirs[dirs.length-1]] = false
    }
    return S
  }, [files])

  console.log(structure)

  return (
    <ul className={cs(style.container)}>
      <StructureRenderer structure={structure} />
    </ul>
  )
}