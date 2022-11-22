import React, { FunctionComponent, useEffect, useState } from "react"
import style from "./WinterCheckout.module.scss"

type TSuccess = (transactionHash: string, amountUSD: number) => void

interface Props {
  projectId?: number
  showModal?: boolean
  contractAddress?: string
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
  assetId?: string
  appearance?: Record<string, string | number | undefined>
  onClose?: () => void
  onSuccess?: TSuccess
}

const WinterCheckout: FunctionComponent<Props> = ({
  onSuccess,
  onClose,
  projectId,
  showModal,
  walletAddress,
  email,
  mintQuantity,
  title,
  brandImage,
  extraMintParams,
  priceFunctionParams,
  production,
  language,
  appearance,
  gentkId,
  assetId,
  contractAddress,
  tokenId,
  fillSource,
  orderSource,
}) => {
  const [projectUrl, setProjectUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleWindowEvent = (e: MessageEvent) => {
        const { data } = e
        if (data === "closeWinterCheckoutModal") {
          onClose?.()
        } else if (data.name === "successfulWinterCheckout") {
          const {
            transactionHash,
            email,
            nftQuantity,
            amountUSD,
            nftTokenIds,
            nftUrls,
            openseaUrls,
          } = data

          onSuccess?.(transactionHash, amountUSD)
        }
      }
      window.addEventListener("message", handleWindowEvent)
      return () => window.removeEventListener("message", handleWindowEvent)
    }
  }, [onClose, onSuccess])

  useEffect(() => {
    let queryString = ""
    if (projectId) {
      queryString += "projectId=" + projectId
    } else if (contractAddress && tokenId) {
      queryString +=
        "contractAddress=" + contractAddress + "&tokenId=" + tokenId
    }
    if (walletAddress) {
      queryString += "&walletAddress=" + walletAddress
    }
    if (email) {
      queryString += "&email=" + email
    }
    if (mintQuantity) {
      queryString += "&mintQuantity=" + mintQuantity
    }
    if (fillSource) {
      queryString += `&fillSource=` + fillSource
    }
    if (orderSource) {
      queryString += `&orderSource=` + orderSource
    }
    if (title) {
      queryString += "&title=" + title
    }
    if (language) {
      queryString += "&language=" + language
    }
    if (brandImage) {
      queryString += `&brandImage=${brandImage}`
    }
    if (gentkId) {
      queryString += `&gentkId=${gentkId}`
    }
    if (assetId) {
      queryString += `&assetId=${assetId}`
    }
    if (extraMintParams) {
      queryString += `&extraMintParams=${encodeURIComponent(
        JSON.stringify(extraMintParams)
      )}`
    }
    if (priceFunctionParams) {
      queryString += `&priceFunctionParams=${encodeURIComponent(
        JSON.stringify(priceFunctionParams)
      )}`
    }
    if (appearance) {
      queryString += `&appearance=${encodeURIComponent(
        JSON.stringify(appearance)
      )}`
    }

    const url = production
      ? "https://checkout.usewinter.com/?" + queryString
      : "https://sandbox-winter-checkout.onrender.com/?" + queryString
    setProjectUrl(url)
  }, [
    onSuccess,
    onClose,
    projectId,
    showModal,
    walletAddress,
    email,
    mintQuantity,
    title,
    brandImage,
    extraMintParams,
    priceFunctionParams,
    production,
    language,
    appearance,
    gentkId,
    assetId,
  ])

  return showModal ? (
    <iframe id="winter-checkout" src={projectUrl} className={style.iframe} />
  ) : (
    <></>
  )
}

export default WinterCheckout
