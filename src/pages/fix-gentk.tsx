import cs from "classnames"
import layout from "../styles/Layout.module.scss"
import { NextPage } from "next"
import colors from "../styles/Colors.module.css"
import { SectionHeader } from "../components/Layout/SectionHeader"
import { TitleHyphen } from "../components/Layout/TitleHyphen"
import { Spacing } from "../components/Layout/Spacing"
import { Form } from "../components/Form/Form"
import { InputText } from "../components/Input/InputText"
import { FormEvent, useMemo, useState } from "react"
import { Field } from "../components/Form/Field"
import { Button } from "../components/Button"
import useFetch, { CachePolicies } from "use-http"
import { Objkt } from "../types/entities/Objkt"
import { ErrorBlock } from "../components/Error/ErrorBlock"
import { Error } from "../components/Error/Error"
import ClientOnly, { ClientOnlyEmpty } from "../components/Utils/ClientOnly"
import { JsonViewer } from "../components/Utils/JsonViewer"

const FixGentkPage: NextPage = () => {
  const [id, setId] = useState<string>("")

  const { get, loading, error, data } = 
    useFetch<Objkt|string>(`${process.env.NEXT_PUBLIC_API_INDEXER}fix-gentk/${id}`, {
      cachePolicy: CachePolicies.NO_CACHE
    })

  console.log({ loading, error, data })

  const send = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    get()
  }

  const formattedJson = useMemo(() => {
    if (data && !error) {
      const brace = {
        brace: 0
      }
      return JSON.stringify(data).replace(
        /({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g,
        (m, p1) => {
          const returnFunction = () =>
            `<div style="text-indent: ${brace["brace"] * 20}px;">${p1}</div>`;
          let returnString = ""
          if (p1.lastIndexOf("{") === p1.length - 1) {
            returnString = returnFunction();
            brace["brace"] += 1;
          } else if (p1.indexOf("}") === 0) {
            brace["brace"] -= 1;
            returnString = returnFunction();
          } else {
            returnString = returnFunction();
          }
          return returnString;
        }
      )
    }
  }, [data, error])

  return (
    <>
      <Spacing size="6x-large" />

      <section>
        <SectionHeader>
          <TitleHyphen>fix broken Gentk 🚑🚑🚑</TitleHyphen>
        </SectionHeader>

        <Spacing size="3x-large" />

        <main className={cs(layout['padding-big'])}>
          <p>The indexer may have missed your Gentk when it was buggy. You can use this page to try and fix it.</p>
          <p><strong>NOTE:</strong> <span className={cs(colors.gray)}>only try once, the data you receive is what is currentky stored on-chain. So if your token doesn't appear to be signed, that's because it hasn't been signed yet.</span></p>

          <Spacing size="3x-large" />

          <Form onSubmit={send}>
            <Field>
              <label>GENTK ID:</label>
              <InputText
                value={id}
                onChange={evt => setId(evt.target.value)}
                style={{
                  maxWidth: "300px"
                }}
              />
            </Field>

            <Spacing size="small" />

            <Button
              type="submit"
              style={{
                alignSelf: "flex-start"
              }}
              state={loading ? "loading" : "default"}
            >
              fix gentk
            </Button>
          </Form>

          <Spacing size="3x-large" />

          {error && !loading && (
            <Error>
              Error: {typeof data === "string" ? data : "unknown"}
            </Error>
          )}

          {!error && !loading && data && (
            <ClientOnlyEmpty>
              <h4>Synchronized token data</h4>
              <Spacing size="small" />
              <JsonViewer json={data as object}/>
            </ClientOnlyEmpty>
          )}

          <Spacing size="6x-large" />
        </main>
      </section>
    </>
  )
}

export default FixGentkPage