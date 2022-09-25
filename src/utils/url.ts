/**
 * Sanitize an URL, preventing eventual XSS
 */
export function sanitizeUrl(url: string, fallback: string = "about:blank") {
  if (!url) {
    return fallback
  }

  const invalidProtocolRegex = /^(%20|\s)*(javascript|data|vbscript)/im
  const ctrlCharactersRegex = /[^\x20-\x7EÀ-ž]/gim
  const urlSchemeRegex = /^([^:]+):/gm
  const relativeFirstCharacters = [".", "/"]

  function _isRelativeUrlWithoutProtocol(url: string) {
    return relativeFirstCharacters.indexOf(url[0]) > -1
  }

  const sanitizedUrl = url.replace(ctrlCharactersRegex, "").trim()
  if (_isRelativeUrlWithoutProtocol(sanitizedUrl)) {
    return sanitizedUrl
  }

  const urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex)
  if (!urlSchemeParseResults) {
    return sanitizedUrl
  }

  const urlScheme = urlSchemeParseResults[0]
  if (invalidProtocolRegex.test(urlScheme)) {
    return fallback
  }

  return sanitizedUrl
}
