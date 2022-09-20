export const buildUrlFromQuery = (
  pathname: string,
  query: Record<string, string>
) =>
  `${pathname}?${Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join("&")}`
