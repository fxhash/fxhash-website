import style from "./Logo.module.scss"
import cs from "classnames"
import { useRef, useEffect } from "react"
import { LogoEffect } from "./LogoEffect"
import { useRouter } from "next/router"

export function LogoGenerative() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const effectRef = useRef<LogoEffect>()
  const router = useRouter()

  useEffect(() => {
    // once the font is loaded, start the logo
    if (canvasRef.current) {
      const effect = new LogoEffect(canvasRef.current)
      effectRef.current = effect
      document.fonts.load('24px "Fira Code"').then(() => {
        effect.init()
        effect.start()
      })
    }
  }, [])

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.reset()
    }
  }, [router.asPath])

  return (
    <div className={cs(style.logo_wrapper)}>
      <canvas
        ref={canvasRef}
        width={213}
        height={120}
        className={cs(style.logo)}
      />
    </div>
  )
}