import { useState } from "react"
import { FxParamDefinition, FxParamType } from "../types"
import { ZodError, ZodIssue } from "zod"
import classes from "./Invalid.module.scss"
import cx from "classnames"

interface IssueProps {
  issue: ZodIssue
}

function Issue(props: IssueProps) {
  const { issue } = props
  return (
    <li className={classes.issue}>
      <h3>
        {issue.code} at {issue.path.join(".")}
      </h3>
      <p>{issue.message}</p>
    </li>
  )
}

interface AttributeProps {
  id: keyof FxParamDefinition<FxParamType>
  definition: FxParamDefinition<FxParamType>
}

function Attribute(props: AttributeProps) {
  const { id, definition } = props
  if (!definition[id]) return null
  return (
    <h4>
      <>
        {id}: {definition[id]}
      </>
    </h4>
  )
}

export interface ControllerInvalidProps {
  definition: FxParamDefinition<FxParamType>
  error: ZodError
}

export function ControllerInvalid(props: ControllerInvalidProps) {
  const { definition, error } = props

  const [showIssues, setShowIssues] = useState(false)

  const handleToggleShowIssues = () => {
    setShowIssues(!showIssues)
  }

  return (
    <div className={cx(classes.invalid)}>
      <label onClick={handleToggleShowIssues}>
        Invalid parameter definition
        <i className={cx({ [classes.isOpen]: showIssues })}>
          {showIssues ? "-" : "+"}
        </i>
      </label>
      {showIssues && (
        <div className={classes.errorsWrapper}>
          <div className={classes.attributes}>
            <Attribute definition={definition} id="id" />
            <Attribute definition={definition} id="name" />
          </div>
          <ul className={cx(classes.issues, { [classes.isOpen]: showIssues })}>
            {error.issues.map((issue) => (
              <Issue
                key={`${issue.code}-${issue.path.join("-")}`}
                issue={issue}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
