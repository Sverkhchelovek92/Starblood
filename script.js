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

  // check borders
  if (player.x < 0) player.x = 0
  if (player.x + player.size > canvas.width)
    player.x = canvas.width - player.size

  if (player.y < 0) player.y = 0
  if (player.y + player.size > canvas.height)
    player.y = canvas.height - player.size
}

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

let currentStyle = {
  color: { r: 200, g: 200, b: 200 },
  radius: [0, 0, 0, 0],
}

let targetStyle = {
  color: { r: 200, g: 200, b: 200 },
  radius: [0, 0, 0, 0],
}

function setTargetStyle() {
  const vx = player.vx
  const vy = player.vy

  let color
  let radius

  if (vx === 0 && vy === 0) {
    color = { r: 200, g: 200, b: 200 }
    radius = [0, 0, 0, 0]
  } else if (vy === -1 && vx === 0) {
    color = { r: 0, g: 120, b: 255 } // blue
    radius = [20, 20, 0, 0]
  } else if (vy === 1 && vx === 0) {
    color = { r: 255, g: 255, b: 0 } // yellow
    radius = [0, 0, 20, 20]
  } else if (vx === -1 && vy === 0) {
    color = { r: 0, g: 255, b: 0 } // green
    radius = [20, 0, 0, 20]
  } else if (vx === 1 && vy === 0) {
    color = { r: 255, g: 0, b: 0 } // red
    radius = [0, 20, 20, 0]
  } else if (vx > 0 && vy < 0) {
    // NE
    color = { r: 180, g: 0, b: 255 } // purple
    radius = [0, 20, 0, 0]
  } else if (vx < 0 && vy < 0) {
    // NW
    color = { r: 0, g: 170, b: 170 } // teal
    radius = [20, 0, 0, 0]
  } else if (vx > 0 && vy > 0) {
    // SE
    color = { r: 255, g: 165, b: 0 } // orange
    radius = [0, 0, 20, 0]
  } else if (vx < 0 && vy > 0) {
    // SW
    color = { r: 120, g: 255, b: 120 } // lightgreen
    radius = [0, 0, 0, 20]
  }

  targetStyle.color = color
  targetStyle.radius = radius
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

  currentStyle.color = lerpColor(currentStyle.color, targetStyle.color, 0.1)
  for (let i = 0; i < 4; i++) {
    currentStyle.radius[i] = lerp(
      currentStyle.radius[i],
      targetStyle.radius[i],
      0.15
    )
  }

  // 2. Update player
  updatePlayer()

  setTargetStyle()

  // 3. Get style and draw
  drawRoundedRect(
    player.x,
    player.y,
    player.size,
    player.size,
    currentStyle.radius,
    rgbToString(currentStyle.color)
  )

  requestAnimationFrame(loop)
}

loop()
