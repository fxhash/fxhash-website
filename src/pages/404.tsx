import { NextPage } from "next"
import { ErrorPage } from "../components/Error/ErrorPage"

const Custom404: NextPage = () => {
  return (
    <ErrorPage title="404">
      👁️
    </ErrorPage>
  )
}

export default Custom404