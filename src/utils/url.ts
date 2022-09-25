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

/**
 * Given an URL, and if it's a valid URL, replaces it with the fallback if the
 * domain is external to the application's domain.
 */
export function urlSanitizeExternalSource(
  url: string,
  fallback: string = "/"
): string {
  try {
    const parsed = new URL(url)
    // this is a valid URL, we check for host
    if (parsed.hostname !== "fxhash.xyz") {
      return fallback
    } else {
      return url
    }
  } catch (err: any) {
    // this is most likely not a valid URL, so we can just return it
    return url
  }
}
