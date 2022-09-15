import { IArticleBlockDefinition } from "../../../../types/ArticleEditor/BlockDefinition"

export function sanitizeUrl(url: string) {
  if (!url) {
    return "about:blank"
  }

  var invalidProtocolRegex = /^(%20|\s)*(javascript|data|vbscript)/im
  var ctrlCharactersRegex = /[^\x20-\x7EÀ-ž]/gim
  var urlSchemeRegex = /^([^:]+):/gm
  var relativeFirstCharacters = [".", "/"]

  function _isRelativeUrlWithoutProtocol(url: string) {
    return relativeFirstCharacters.indexOf(url[0]) > -1
  }

  var sanitizedUrl = url.replace(ctrlCharactersRegex, "").trim()
  if (_isRelativeUrlWithoutProtocol(sanitizedUrl)) {
    return sanitizedUrl
  }

  var urlSchemeParseResults = sanitizedUrl.match(urlSchemeRegex)
  if (!urlSchemeParseResults) {
    return sanitizedUrl
  }

  var urlScheme = urlSchemeParseResults[0]
  if (invalidProtocolRegex.test(urlScheme)) {
    return "about:blank"
  }

  return sanitizedUrl
}

export const linkDefinition: IArticleBlockDefinition<any> = {
  name: "Link",
  icon: <i className="fa-solid fa-link" aria-hidden />,
  render: ({ attributes, element, children }) => {
    console.log("test")
    return (
      <a
        {...attributes}
        href={sanitizeUrl(element.url as string)}
        title={element.title as string}
      >
        {children}
      </a>
    )
  },
  hasUtilityWrapper: false,
}
