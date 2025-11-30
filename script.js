const canvas = document.getElementById('field')
const ctx = canvas.getContext('2d')

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

resizeCanvas()
window.addEventListener('resize', resizeCanvas)

// Character

const player = {
  x: 200,
  y: 200,
  size: 40,
  speed: 4,
  vx: 0,
  vy: 0,
}

// Keys

const keys = {}

window.addEventListener('keydown', (e) => {
  keys[e.key] = true
})
window.addEventListener('keyup', (e) => {
  keys[e.key] = false
})

function updatePlayer() {
  player.vx = 0
  player.vy = 0

  if (keys['ArrowUp']) player.vy = -1
  if (keys['ArrowDown']) player.vy = 1
  if (keys['ArrowLeft']) player.vx = -1
  if (keys['ArrowRight']) player.vx = 1

  if (player.vx !== 0 && player.vy !== 0) {
    player.vx *= Math.sqrt(0.5)
    player.vy *= Math.sqrt(0.5)
  }

  player.x += player.vx * player.speed
  player.y += player.vy * player.speed
}

function getPlayerStyle() {
  const vx = player.vx
  const vy = player.vy

  // Static
  if (vx === 0 && vy === 0) {
    return {
      color: '#cccccc',
      radius: [0, 0, 0, 0],
    }
  }

  // Directions & styles
  if (vy === -1 && vx === 0) return { color: 'blue', radius: [15, 15, 0, 0] }
  if (vy === 1 && vx === 0) return { color: 'yellow', radius: [0, 0, 15, 15] }
  if (vx === -1 && vy === 0) return { color: 'green', radius: [15, 0, 0, 15] }
  if (vx === 1 && vy === 0) return { color: 'red', radius: [0, 15, 15, 0] }

  // Diagonals
  if (vy === -Math.sqrt(0.5) && vx === Math.sqrt(0.5))
    return { color: 'purple', radius: [0, 15, 0, 0] } // NE

  if (vy === -Math.sqrt(0.5) && vx === -Math.sqrt(0.5))
    return { color: 'teal', radius: [15, 0, 0, 0] } // NW

  if (vy === Math.sqrt(0.5) && vx === Math.sqrt(0.5))
    return { color: 'orange', radius: [0, 0, 15, 0] } // SE

  if (vy === Math.sqrt(0.5) && vx === -Math.sqrt(0.5))
    return { color: 'lightgreen', radius: [0, 0, 0, 15] } // SW
}

// ----- Draw rounded square -------------
function drawRoundedRect(x, y, w, h, r, color) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x + r[0], y)

  ctx.lineTo(x + w - r[1], y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r[1])

  ctx.lineTo(x + w, y + h - r[2])
  ctx.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h)

  ctx.lineTo(x + r[3], y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r[3])

  ctx.lineTo(x, y + r[0])
  ctx.quadraticCurveTo(x, y, x + r[0], y)

  ctx.fill()
}

// --------- Main cycle -------
function loop() {
  // 1. Field colour
  ctx.fillStyle = '#1b2229'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // 2. Update player
  updatePlayer()

  // 3. Get style and draw
  const style = getPlayerStyle()
  drawRoundedRect(
    player.x,
    player.y,
    player.size,
    player.size,
    style.radius,
    style.color
  )

  requestAnimationFrame(loop)
}

loop()

// --- LERP ---

function lerp(a, b, t) {
  return a + (b - a) * t
}

function lerpColor(c1, c2, t) {
  return {
    r: lerp(c1.r, c2.r, t),
    g: lerp(c1.g, c2.g, t),
    b: lerp(c1.b, c2.b, t),
  }
}

function rgbToString(c) {
  return `rgb(${c.r | 0}, ${c.g | 0}, ${c.b | 0})`
}
