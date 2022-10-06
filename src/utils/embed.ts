export const getYoutubeCodeFromUrl = (url: string) => {
  const regexExtractCode =
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]+).*/
  const regexIsValidCode = /^[a-zA-Z0-9\-_]+$/
  const match = url.match(regexExtractCode)
  const youtubeCode = match?.[1]
  return youtubeCode && youtubeCode.match(regexIsValidCode) ? youtubeCode : null
}
export const getTweetIdFromUrl = (url: string) => {
  const regexExtractCode =
    /(?:https?:\/\/)?(?:www\.)?twitter\.com\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/
  const match = url.match(regexExtractCode)
  return match?.[2] || null
}
export const getCodepenFromUrl = (url: string) => {
  const regexExtractCode =
    /(?:https?:\/\/)?(?:www\.)?codepen\.io\/(?:#!\/)?(\w+)\/pen\/(\w+)/
  const match = url.match(regexExtractCode)
  return match
    ? {
        author: match[1],
        id: match[2],
      }
    : null
}
