import { NextPage } from "next"
import { ErrorPage } from "../components/Error/ErrorPage"

const Custom500: NextPage = () => {
  return (
    <ErrorPage title="500 internal server error">
      Please try again in a minute
    </ErrorPage>
  )
}

export default Custom500
