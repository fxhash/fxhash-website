import { FunctionComponent, HTMLAttributes } from "react"
import style from "./Form.module.scss"
import cs from "classnames"
import { FormHTMLAttributes } from "react-router/node_modules/@types/react"


type FormProps = FormHTMLAttributes<HTMLFormElement> 

/**
 * A generic component to encapsulate form fields
 */
export const Form: FunctionComponent<FormProps> = ({ children, ...props }) => {
	return (
		<form {...props} className={cs(style.form, props.className)}>
      { children }
    </form>
	)
}