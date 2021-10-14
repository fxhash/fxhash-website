import { useRouter } from "next/router"
import { useContext } from "react"
import { useEffect, useState } from "react"
import { UserGuard } from "../components/Guards/UserGuard"
import { ConnectedUser } from "../types/entities/User"
import { UserContext } from "./UserProvider"
import { Formik } from "formik"
import * as Yup from "yup"
import { Form } from "../components/Form/Form"
import { Field } from "../components/Form/Field"
import { Button } from "../components/Button"
import { InputText } from "../components/Input/InputText"
import style from "./EditProfile.module.scss"
import cs from "classnames"
import { InputTextarea } from "../components/Input/InputTextarea"
import { AvatarUpload } from "../components/User/AvatarUpload"
import { Spacing } from "../components/Layout/Spacing"


const Schema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Min 3 characters')
    .max(16, 'Max 16 characters')
    .required('Min 3 characters'),
  description: Yup.string()
    .max(250, 'Max 250 characters')
})

export function EditProfile() {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!

  const [avatarFile, setAvatarFile] = useState<File|null>(null)
  const [data, setData] = useState({
    name: user.name||"",
    description: user.description||""
  })

  useEffect(() => {
    setData({
      name: user.name||"",
      description: user.description||""
    })
  }, [user])

  return (
    <>
      <Formik
        initialValues={data}
        enableReinitialize
        validationSchema={Schema}
        onSubmit={(values) => {
          const f = new FormData()
          if (avatarFile) {
            f.append('avatarFile', avatarFile)
          }
          else if (user.avatarUri) {
            f.append('avatarIpfs', user.avatarUri)
          }
          f.append('name', values.name)
          f.append('description', values.description)
        }}
      >
        {({ values, handleChange, handleBlur, isSubmitting, errors, touched }) => (
          <Form className={cs(style.form)}>
            <div className={cs(style['form-header'])}>
              <AvatarUpload
                currentIpfs={user.avatarUri}
                file={avatarFile}
                onChange={setAvatarFile}
                className={cs(style.avatar)}
              />

              <div className={cs(style.fields)}>
                <Field error={errors.name}>
                  <label htmlFor="name">Name</label>
                  <InputText
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.name}
                    className={cs(style.input)}
                  />
                </Field>

                <Field error={errors.description}>
                  <label htmlFor="description">Description</label>
                  <InputTextarea
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={!!errors.description}
                    className={cs(style.input)}
                  />
                </Field>
              </div>
            </div>

            <Spacing size="3x-large"/>

            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>

      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
      <Spacing size="3x-large"/>
    </>
  )
}