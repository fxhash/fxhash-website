const lerp = (a: number, b: number, t: number) => (b - a) * t + a
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x))

function generateConfig() {
  const deposit = 0.1 + Math.random() * 0.2
  return {
    stepSize: lerp(0.25, 0.4, Math.random()),
    turnChances: lerp(0, 0.9, Math.random()),
    turnAngle: lerp(0, Math.PI, Math.random()),
    turnDiscrete: Math.random() < 0.5,
    divChances: lerp(0.07, 0.1, Math.random()),
    divAngle: lerp(0.01, Math.PI, Math.random()),
    divDiscrete: Math.random() < 0.5,
    terminationThreshold: 1.1,
    deposit: deposit,
    // very low chances to have some color change chancs
    colorChangeChances: Math.pow(lerp(0, 0.9, Math.random()), 10),
    // if a color change occur, some decent chances to have high variation
    colorChangeVal: lerp(0, 0.9, Math.random()),
    terminationChances: lerp(0.02, 0.2, Math.random()),
  }
}

let cfg = generateConfig()

const MAX_WALKERS = 5000

const rectCenterX = 140
const rectCenterY = 20

const black = [0, 0, 0]
const white = [255, 255, 255]

const colors = [black, [112, 0, 255], [255, 0, 92]]

const getRandomCol = () => Math.pow(Math.random(), 20)
const isActive = (x: number) => x < 200

class Walker {
  x = 0
  y = 0
  ang = 0
  colX: number
  colY: number
  col: number[] = []

  constructor(x: number, y: number, ang: number, colX: number, colY: number) {
    this.x = x
    this.y = y
    this.ang = ang
    ;(this.colX = clamp(colX, 0, 1)), (this.colY = clamp(colY, 0, 1))
    this.setColor()
  }

  setColor() {
    this.col = [
      lerp(
        lerp(colors[0][0], colors[1][0], this.colX),
        colors[2][0],
        this.colY
      ),
      lerp(
        lerp(colors[0][1], colors[1][1], this.colX),
        colors[2][1],
        this.colY
      ),
      lerp(
        lerp(colors[0][2], colors[1][2], this.colX),
        colors[2][2],
        this.colY
      ),
    ]
  }
}

export class LogoEffect {
  fontSize: number
  cvs: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  walkers: Walker[]
  env: Float32Array

  constructor(canvas: HTMLCanvasElement, fontSize: number) {
    this.cvs = canvas
    this.fontSize = fontSize
    this.ctx = this.cvs.getContext("2d")!
    this.walkers = []
    this.env = new Float32Array(this.cvs.width * this.cvs.height)
  }

  c2dTo1d(x: number, y: number) {
    return (x | 0) + (y | 0) * this.cvs.width
  }

  init() {
    this.ctx.fillStyle = `rgb(${white[0]}, ${white[1]}, ${white[2]})`
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height)
    this.ctx.fillStyle = `rgb(${black[0]}, ${black[1]}, ${black[2]})`
    this.ctx.font = `bold ${this.fontSize}px 'Fira Code'`
    this.ctx.textAlign = "center"
    this.ctx.textBaseline = "middle"
    this.ctx.fillText("fx(hash)", this.cvs.width * 0.5, this.cvs.height * 0.5)

    // initialize all the values of the env to 0
    this.env.fill(0)

    // naive approach to spawn walkers on the edges on the text
    // get the area of interest before-hand
    const rCx = (this.cvs.width - rectCenterX) * 0.5,
      rCy = (this.cvs.height - rectCenterY) * 0.5
    const data = this.ctx.getImageData(rCx, rCy, rectCenterX, rectCenterY)
    // loop through the area of interest
    let C, I, Wx, Wy
    for (let x = 1; x < rectCenterX - 1; x += 1) {
      for (let y = 1; y < rectCenterY - 1; y += 1) {
        I = x + y * rectCenterX
        C = data.data[I * 4]
        // if center is active and one side is inactive
        if (isActive(C)) {
          Wx = x + rCx
          Wy = y + rCy
          this.walkers.push(
            new Walker(
              Wx,
              Wy,
              Math.random() * Math.PI * 2,
              getRandomCol(),
              getRandomCol()
            )
            // new Walker(
            //   x + (this.cvs.width-rectCenterX)*0.5,
            //   y + (this.cvs.height-rectCenterY)*0.5,
            //   Math.random() * Math.PI * 2,
            //   getRandomCol(),
            //   getRandomCol()
            // )
          )
        }
      }
    }

    // now clear the text
    // this.ctx.fillStyle = `rgb(${white[0]}, ${white[1]}, ${white[2]})`
    // this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height)

    // we draw the walkers once to highlight the shape of the text
    this.drawWalkers()
  }

  reset() {
    this.walkers = []
    cfg = generateConfig()
    this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height)
    this.init()
  }

  start() {
    this.update()
  }

  update = () => {
    requestAnimationFrame(this.update)

    // move walkers forward
    for (let i = this.walkers.length - 1; i >= 0; i--) {
      const W = this.walkers[i]
      // walker has chances to turn
      if (Math.random() < cfg.turnChances) {
        let turn = Math.random()
        if (cfg.turnDiscrete) turn = Math.round(turn)
        W.ang += (turn - 0.5) * cfg.turnAngle
      }
      // walker moves
      W.x += Math.cos(W.ang) * cfg.stepSize
      W.y += Math.sin(W.ang) * cfg.stepSize

      // walker dies if it meets too much deposit
      const idx = this.c2dTo1d(W.x, W.y)
      if (
        Math.random() < cfg.terminationChances ||
        this.env[idx] > cfg.terminationThreshold ||
        W.x < -1 ||
        W.x >= this.cvs.width ||
        W.y < -1 ||
        W.y >= this.cvs.height
      ) {
        this.walkers.splice(i, 1)
        continue
      }

      // walker leaves deposit
      this.env[idx] += cfg.deposit

      // walker can duplicate
      if (this.walkers.length < MAX_WALKERS && Math.random() < cfg.divChances) {
        let dA = Math.random()
        if (cfg.divDiscrete) dA = Math.round(dA)
        dA = (dA - 0.5) * cfg.divAngle
        // change the color ?
        const changeColor = Math.random() < cfg.colorChangeChances
        let dColX = 0,
          dColY = 0
        if (changeColor) {
          dColX = (Math.random() - 0.5) * cfg.colorChangeVal
          dColY = (Math.random() - 0.5) * cfg.colorChangeVal
        }
        this.walkers.push(
          new Walker(W.x, W.y, W.ang + dA, W.colX + dColX, W.colY + dColY)
        )
      }
    }

    this.drawWalkers()
  }

  drawWalkers() {
    for (const W of this.walkers) {
      this.ctx.fillStyle = `rgba(${W.col[0]}, ${W.col[1]}, ${W.col[2]}, ${
        cfg.deposit * 0.7
      })`
      this.ctx.fillRect(W.x, W.y, 1, 1)
    }
  }
}
