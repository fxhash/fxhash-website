import classes from "./Content.module.scss"
export function ContentBrand() {
  return (
    <p className={classes.txtRoot}>
      When talking about fxhash in written copy both <mark>fxhash</mark> and{" "}
      <mark>fx(hash)</mark> are appropriate. Use of uppercases, extra
      punctuation or symbol and spaces are not appropriate. When talking about
      secondary platforms, events, or features please write their names as
      presented in situation. e.g. <mark>fx(text)</mark> or{" "}
      <mark>fx(collab)</mark> using the brackets as a framing device for the
      platform.
    </p>
  )
}
