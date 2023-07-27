import { useRouter } from "next/router"
import { useEffect, useState, useContext, useRef } from "react"
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
import { CachePolicies, useFetch } from "use-http"
import { ProfileUploadError, ProfileUploadResponse } from "../types/Responses"
import { useTzProfileVerification } from "../utils/hookts"
import { ContractFeedback } from "../components/Feedback/ContractFeedback"
import { UserVerification } from "./User/UserVerification"
import { useContractOperation } from "../hooks/useContractOperation"
import {
  TUpdateProfileParams,
  UpdateProfileOperation,
} from "../services/contract-operations/UpdateProfile"

const Schema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Min 3 characters")
    .max(64, "Max 64 characters")
    .required("Min 3 characters"),
  description: Yup.string().max(250, "Max 250 characters"),
})

export function EditProfile() {
  const userCtx = useContext(UserContext)
  const user = userCtx.user!

  // hack Formik
  const userName = useRef<string>(user.name || "")

  const { tzProfileData, loading: loadingTz } = useTzProfileVerification(
    user.id
  )

  const {
    post,
    loading: fileLoading,
    error,
    data: fetchData,
  } = useFetch<ProfileUploadResponse | ProfileUploadError>(
    `${process.env.NEXT_PUBLIC_API_FILE_ROOT}/profile`,
    {
      cachePolicy: CachePolicies.NO_CACHE,
    }
  )

  // this variable ensures that we can safely access its data regardless of the state of the queries
  const safeData: ProfileUploadResponse | false | undefined =
    !error && !fileLoading && (fetchData as ProfileUploadResponse)

  // comment je voudrais l'utiliser ?
  const {
    state,
    loading: contractLoading,
    error: contractError,
    success,
    call,
    clear,
  } = useContractOperation<TUpdateProfileParams>(UpdateProfileOperation)

  useEffect(() => {
    if (safeData && userCtx.walletManager) {
      clear()
      call({
        name: userName.current,
        metadata: safeData.metadataUri,
      })
    }
  }, [safeData])

  const [avatarFile, setAvatarFile] = useState<File | "ipfs" | null>("ipfs")
  const [data, setData] = useState({
    name: user.name || "",
    description: user.description || "",
  })

  useEffect(() => {
    setData({
      name: user.name || "",
      description: user.description || "",
    })
    userName.current = user.name || ""
  }, [user])

  // derived from props, to take account for both side-effects interactions
  const loading = fileLoading || contractLoading

  return (
    <>
      <Formik
        initialValues={data}
        enableReinitialize
        validationSchema={Schema}
        onSubmit={(values) => {
          const f = new FormData()
          if (avatarFile && avatarFile !== "ipfs") {
            f.append("avatarFile", avatarFile)
          } else if (avatarFile === "ipfs" && user.avatarUri) {
            f.append("avatarIpfs", user.avatarUri)
          }
          f.append("description", values.description)
          userName.current = values.name
          post(f)
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, errors }) => (
          <Form className={cs(style.form)} onSubmit={handleSubmit}>
            <div className={cs(style["form-header"])}>
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

            <Spacing size="3x-large" sm="x-large" />

            <ContractFeedback
              state={state}
              loading={contractLoading}
              success={success}
              error={contractError}
              successMessage="Your profile update is now on the blockchain !"
            />

            <Button
              type="submit"
              disabled={loading}
              className={style.button}
              state={loading ? "loading" : "default"}
            >
              submit
            </Button>

            <Spacing size="6x-large" sm="x-large" />

            <div>
              <span>
                <span>You can verify your social media platforms using </span>
                <a
                  href="https://tzprofiles.com"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  rel="noreferrer"
                >
                  tzprofiles
                </a>
                <Spacing size="x-small" sm="regular" />
                <div>
                  {(tzProfileData || loadingTz) && (
                    <>
                      <UserVerification
                        profile={tzProfileData}
                        loading={loadingTz}
                      />
                    </>
                  )}
                  {!loadingTz && !tzProfileData && (
                    <em>No profile on tzprofile</em>
                  )}
                </div>
              </span>
            </div>
            <Spacing size="3x-large" sm="x-large" />
            <div className={style.warn}>
              <strong>tzProfiles</strong> can take a while to synchronize,
              sometimes up to 1 day.
              <br />
              If you've updated your tzProfile recently but the changes are not
              reflected here, please wait a little bit.
            </div>
          </Form>
        )}
      </Formik>

      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" sm="none" />
      <Spacing size="3x-large" />
    </>
  )
}
