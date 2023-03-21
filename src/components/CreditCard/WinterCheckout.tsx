import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react"
import style from "./WinterCheckout.module.scss"

type TSuccess = (transactionHash: string, amountUSD: number) => void

interface Props {
  projectId?: number
  showModal?: boolean
  contractAddress?: string
  contractVersion?: number
  tokenId?: string
  walletAddress?: string
  email?: string
  title?: string
  brandImage?: string
  mintQuantity?: number
  extraMintParams?: object
  priceFunctionParams?: object
  production?: boolean
  fillSource?: string
  orderSource?: string
  language?: string
  gentkId?: number
  listingId?: number
  assetId?: string
  paymentMethod?: string
  appearance?: Record<string, string | number | undefined>
  additionalPurchaseParams?: Record<string, any>
  onClose?: () => void
  onSuccess?: TSuccess
  onFinish: (data: any) => void
}

const WinterCheckout: FunctionComponent<Props> = (props) => {
  const {
    onSuccess,
    onClose,
    projectId,
    showModal,
    production,
    contractAddress,
    tokenId,
    onFinish,
    additionalPurchaseParams,
  } = props
  const [projectUrl, setProjectUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleWindowEvent = (e: MessageEvent) => {
        const { data } = e
        if (data === "closeWinterCheckoutModal") {
          onClose?.()
        } else if (data.reveal || data.viewNFTs) {
          onFinish(data)
        } else if (data.name === "successfulWinterCheckout") {
          const { transactionHash, amountUSD } = data
          onSuccess?.(transactionHash, amountUSD)
        }
      }
      window.addEventListener("message", handleWindowEvent)
      return () => window.removeEventListener("message", handleWindowEvent)
    }
  }, [onClose, onSuccess, onFinish])

  useEffect(() => {
    let queryParams = []
    if (projectId) {
      queryParams.push(`projectId=${projectId}`)
    } else if (contractAddress && tokenId) {
      queryParams.push(
        `contractAddress=${contractAddress}`,
        `tokenId=${tokenId}`
      )
    }

    const paramsStr = [
      "contractVersion",
      "walletAddress",
      "email",
      "mintQuantity",
      "fillSource",
      "orderSource",
      "title",
      "language",
      "brandImage",
      "gentkId",
      "listingId",
      "assetId",
      "paymentMethod",
    ]
    paramsStr.forEach((param) => {
      const propValue = props[param as keyof PropsWithChildren<Props>]
      if (propValue) {
        queryParams.push(`${param}=${propValue}`)
      }
    })

    const paramsObj = [
      "extraMintParams",
      "priceFunctionParams",
      "appearance",
      "additionalPurchaseParams",
    ]
    paramsObj.forEach((param) => {
      const propValue = props[param as keyof PropsWithChildren<Props>]
      if (propValue) {
        queryParams.push(
          `${param}=${encodeURIComponent(JSON.stringify(propValue))}`
        )
      }
    })

    const queryString = queryParams.join("&")
    const url = production
      ? "https://checkout.usewinter.com/?" + queryString
      : "https://sandbox-winter-checkout.onrender.com/?" + queryString
    setProjectUrl(url)
  }, [contractAddress, production, projectId, props, tokenId])


  return showModal ? (
    <iframe id="winter-checkout" src={projectUrl} className={style.iframe} />
  ) : (
    <></>
  )
}

export default WinterCheckout
