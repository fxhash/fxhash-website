export const getYoutubeCodeFromUrl = (url: string) => {
  const regexExtractCode = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]+).*/;
  const regexIsValidCode = /^[a-zA-Z0-9\-_]+$/;
  const match = url.match(regexExtractCode)
  const youtubeCode = match?.[1];
  return youtubeCode && youtubeCode.match(regexIsValidCode) ? youtubeCode : null;
}
