import style from "./Logo.module.scss"
import cs from "classnames"
import { useRef, useEffect } from "react"
import { LogoEffect } from "./LogoEffect"
import { useRouter } from "next/router"

export interface LogoGenerativeProps {
  width?: number
  height?: number
  fontSize?: number
}
export function LogoGenerative({ width = 213, height = 120, fontSize = 28 }: LogoGenerativeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const effectRef = useRef<LogoEffect>()
  const router = useRouter()

  useEffect(() => {
    // once the font is loaded, start the logo
    if (canvasRef.current) {
      const effect = new LogoEffect(canvasRef.current, fontSize)
      effectRef.current = effect
      document.fonts.load('24px "Fira Code"').then(() => {
        effect.init()
        effect.start()
      })
    }
  }, [fontSize])

  useEffect(() => {
    if (effectRef.current) {
      effectRef.current.reset()
    }
  }, [router.asPath])

  return (
    <div className={cs(style.logo_wrapper)}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={cs(style.logo)}
      />
    </div>
  )
}
