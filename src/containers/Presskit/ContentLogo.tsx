import { Button } from "components/Button"
import classes from "./Content.module.scss"

interface DownloadBoxProps {
  caption: string
}

function DownloadBox(props: DownloadBoxProps) {
  const { caption } = props
  return (
    <div className={classes.downloadBox}>
      <img />
      <div className={classes.buttons}>
        <Button size="very-small">Download svg</Button>
        <Button size="very-small">Download png</Button>
      </div>
      <p>{caption}</p>
    </div>
  )
}

export function ContentLogo() {
  return (
    <div className={classes.rootLogo}>
      <h2>full logo</h2>
      <article>
        <section>
          <DownloadBox caption="Black logo on white background" />
          <DownloadBox caption="White logo on dark background" />
        </section>
        <section>
          <DownloadBox caption="Black logo on white background" />
          <DownloadBox caption="White logo on dark background" />
        </section>
      </article>
      <h2>square logo</h2>
      <article>
        <section>
          <DownloadBox caption="Black logo on white background" />
          <DownloadBox caption="White logo on dark background" />
        </section>
        <section>
          <DownloadBox caption="Black logo on white background" />
          <DownloadBox caption="White logo on dark background" />
        </section>
      </article>
      <h2>clearspace</h2>
      <article>
        <section className={classes.nobg}>
          <DownloadBox caption="Black logo on white background" />
          <DownloadBox caption="White logo on dark background" />
        </section>
      </article>
    </div>
  )
}
