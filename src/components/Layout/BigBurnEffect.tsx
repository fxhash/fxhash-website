import style from "./BigBurnEffect.module.scss"
import cs from "classnames"
import { useEffect, useState } from "react"


interface IFlame {
  x: number
  y: number
  scale: number
  delay: number
  tint: number
  animation: number
}

interface Props {
  
}
export function BigBurnEffect({
  
}: Props) {

  const [flames, setFlames] = useState<IFlame[]>([])

  useEffect(() => {
    // todo: check in storage if we need to trigger the effect (3 times)

    const inLocal = localStorage.getItem("__big_burn_effect")
    const nb = inLocal ? parseInt(inLocal) : 0

    if (nb <= 2) {
      setFlames(new Array(Math.floor(window.innerWidth*0.07)).fill(0).map(() => ({
        x: Math.random()*1.2 - 0.1,
        y: Math.random() * 0.05 - 0.08,
        scale: 0.7 + Math.random(),
        delay: Math.random() * 10,
        tint: Math.random() - 0.5,
        animation: Math.floor(Math.random()*2)
      })))
      localStorage.setItem("__big_burn_effect", ""+nb+1)
    }
  }, [])

  return (
    <div className={cs(style.root)}>
      {flames.map((flame, idx) => (
        <div
          key={idx}
          className={cs(style.flame, {
            [style.animation_2]: flame.animation === 1
          })}
          style={{
            bottom: `${flame.y*100}%`,
            left: `${flame.x*100}%`,
            animationDelay: `${-flame.delay}s`,
            filter: `hue-rotate(${-flame.tint*50}deg)`,
          }}
        >
          <i 
            aria-hidden
            className="fas fa-fire-alt"
            style={{
              transform: `scale(${flame.scale})`,
            }}
          />
        </div>
      ))}
    </div>
  )
}