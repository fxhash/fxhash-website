import Head from "next/head"

interface Props {
  title: string
  image?: string
  description: string
  cardSize?: "summary" | "summary_large_image"
}

export function MetaHead({
  title,
  image,
  description,
  cardSize = "summary_large_image",
}: Props) {
  return (
    <Head>
      <title>{title ? `${title} — fxhash` : "fxhash"}</title>
      <meta key="og:title" property="og:title" content={title} />
      <meta key="description" name="description" content={description} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:type" property="og:type" content="website" />
      <meta
        key="og:image"
        property="og:image"
        content={image || "https://www.fxhash.xyz/images/og/og1.jpg"}
      />
      <meta name="twitter:site" content="@fx_hash_" />
      <meta name="twitter:card" content={cardSize} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={image || "https://www.fxhash.xyz/images/og/og1.jpg"}
      />
    </Head>
  )
}
