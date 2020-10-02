const confettiId = 'confetti'
const NUM_CONFETTI = 350
const COLORS = [
  [235, 138, 10],
  [231, 198, 50],
  [17, 81, 146],
  [114, 161, 12],
  [94, 146, 146],
  [107, 38, 7],
]
const PI_2 = 2 * Math.PI

const canvas = document.createElement('canvas')
canvas.id = confettiId
const context = canvas.getContext('2d')
let w = 0
let h = 0

const resizeWindow = () => {
  w = canvas.width = innerWidth
  h = canvas.height = innerHeight
}

// addEventListener('resize', resizeWindow, false)
resizeWindow()

const random = (a: number, b: number) => (b - a) * Math.random() + a

const drawCircle = (x: number, y: number, r: number, style: string) => {
  if (!context) return
  context.beginPath()
  context.arc(x, y, r, 0, PI_2, false)
  context.fillStyle = style
  context.fill()
}

let mousePosition = 0.5

document.onmousemove = (e) => (mousePosition = e.pageX / w)

class Confetti {
  private rgb: string
  private style: number[]
  private r: number
  private r2: number
  private opacity = 0
  private dop = 0
  private x = 0
  private y = 0
  private xMax = 0
  private yMax = 0
  private vx = 0
  private vy = 0

  constructor() {
    this.style = COLORS[~~random(0, COLORS.length)]
    this.rgb = `rgba(${this.style[0]},${this.style[1]},${this.style[2]}`
    this.r = ~~random(2, 5)
    this.r2 = 2 * this.r
    this.replace()
  }

  private replace() {
    this.opacity = 0
    this.dop = 0.03 * random(1, 4)
    this.x = random(-this.r2, w - this.r2)
    this.y = random(-20, h - this.r2)
    this.xMax = w - this.r
    this.yMax = h - this.r
    this.vx = 2 * mousePosition - 2 + random(0, 2)
    this.vy = 0.2 * this.r + random(-1, 1)
  }

  public draw() {
    this.x += this.vx
    this.y += this.vy
    this.opacity += this.dop
    if (this.opacity > 1) {
      this.opacity = 1
      this.dop *= -1
    }
    if (this.opacity < 0 || this.y > this.yMax) this.replace()
    if (!(this.x > 0 && this.x < this.xMax))
      this.x = (this.x + this.xMax) % this.xMax
    drawCircle(~~this.x, ~~this.y, this.r, `${this.rgb},${this.opacity})`)
  }
}

const confetti: Confetti[] = []
for (let i = 0; i <= NUM_CONFETTI; i++) {
  confetti.push(new Confetti())
}

let myReq = 0

const step = () => {
  myReq = requestAnimationFrame(step)
  if (context) context.clearRect(0, 0, w, h)
  for (const c of confetti) {
    c.draw()
  }
}

export const startConfetti = () => {
  document.body.append(canvas)
  step()
}

export const stopConfetti = () => {
  cancelAnimationFrame(myReq)
  document.getElementById(confettiId)?.remove()
}
