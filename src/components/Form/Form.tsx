import { FunctionComponent, FormHTMLAttributes } from "react"
import style from "./Form.module.scss"
import cs from "classnames"


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