import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link 
            href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap"
            rel="stylesheet"
          />          
          <script src="https://kit.fontawesome.com/0aadf73f47.js" crossOrigin="anonymous"></script>
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
