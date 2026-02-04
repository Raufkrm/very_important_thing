<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccessStore } from '../stores/access'

const router = useRouter()
const accessStore = useAccessStore()

const phase = ref('black')
const matrixText = ref('sqcz ipx xm dm fboavkwxf')
const decipherDots = ref('.')
const noButton = ref(null)
const buttonArea = ref(null)
const noPos = ref({ x: 0, y: 0 })
const noIsYes = ref(false)
const hearts = Array.from({ length: 36 }, (_, index) => {
  const colors = ['#ef4444', '#f472b6', '#a855f7']
  return {
    id: index,
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 6 + Math.random() * 6,
    size: 10 + Math.random() * 16,
    color: colors[Math.floor(Math.random() * colors.length)],
    opacity: 0.55 + Math.random() * 0.35,
  }
})

const matrixColumns = Array.from({ length: 60 }, (_, index) => index)
let scrambleTimer = null
let speedTimers = []
let dotsTimer = null

const finishYes = () => {
  router.push({ name: 'final-yes' })
}

const finishNo = () => {
  accessStore.reset()
  router.push({ name: 'intro' })
}

const randomizeCipher = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const base = 'sqcz ipx xm dm fboavkwxf'
  let next = ''
  for (const ch of base) {
    if (ch === ' ') {
      next += ' '
    } else {
      next += chars[Math.floor(Math.random() * chars.length)]
    }
  }
  matrixText.value = next.toLowerCase()
}

const startMatrix = () => {
  phase.value = 'matrix'
  randomizeCipher()
  decipherDots.value = '.'
  let interval = 220
  const tick = () => {
    if (scrambleTimer) clearInterval(scrambleTimer)
    scrambleTimer = setInterval(randomizeCipher, interval)
  }
  tick()
  if (dotsTimer) clearInterval(dotsTimer)
  dotsTimer = setInterval(() => {
    decipherDots.value = decipherDots.value.length >= 3 ? '.' : `${decipherDots.value}.`
  }, 500)
  speedTimers = [
    setTimeout(() => {
      interval = 140
      tick()
    }, 3000),
    setTimeout(() => {
      interval = 90
      tick()
    }, 6000),
    setTimeout(() => {
      if (scrambleTimer) clearInterval(scrambleTimer)
      if (dotsTimer) clearInterval(dotsTimer)
      phase.value = 'white'
      setTimeout(() => {
        phase.value = 'reveal'
        initNoButton()
      }, 1500)
    }, 12000),
  ]
}

const initNoButton = () => {
  const area = buttonArea.value
  const btn = noButton.value
  if (!area || !btn) return
  const bounds = area.getBoundingClientRect()
  const btnBounds = btn.getBoundingClientRect()
  noPos.value = {
    x: Math.max(0, Math.random() * (bounds.width - btnBounds.width)),
    y: Math.max(0, Math.random() * (bounds.height - btnBounds.height)),
  }
}

const moveNoButton = () => {
  if (noIsYes.value) return
  const area = buttonArea.value
  const btn = noButton.value
  if (!area || !btn) return
  const bounds = area.getBoundingClientRect()
  const btnBounds = btn.getBoundingClientRect()
  const x = Math.max(0, Math.random() * (bounds.width - btnBounds.width))
  const y = Math.max(0, Math.random() * (bounds.height - btnBounds.height))
  noPos.value = { x, y }
  const edge = 8
  const rightEdge = bounds.width - btnBounds.width - edge
  const bottomEdge = bounds.height - btnBounds.height - edge
  if (
    (x <= edge && y <= edge) ||
    (x <= edge && y >= bottomEdge) ||
    (x >= rightEdge && y <= edge) ||
    (x >= rightEdge && y >= bottomEdge)
  ) {
    noIsYes.value = true
  }
}

const onAreaMove = (event) => {
  if (noIsYes.value) return
  const area = buttonArea.value
  const btn = noButton.value
  if (!area || !btn) return
  const bounds = area.getBoundingClientRect()
  const btnBounds = btn.getBoundingClientRect()
  const bx = bounds.left + noPos.value.x + btnBounds.width / 2
  const by = bounds.top + noPos.value.y + btnBounds.height / 2
  const dx = event.clientX - bx
  const dy = event.clientY - by
  const dist = Math.hypot(dx, dy)
  if (dist < 90) {
    moveNoButton()
  }
}

onMounted(() => {
  setTimeout(() => {
    phase.value = 'matrix'
    startMatrix()
  }, 1200)
})

onBeforeUnmount(() => {
  if (scrambleTimer) clearInterval(scrambleTimer)
  if (dotsTimer) clearInterval(dotsTimer)
  speedTimers.forEach((timer) => clearTimeout(timer))
  speedTimers = []
})
</script>

<template>
  <main class="question level-6">
    <div
      class="transition-overlay"
      :class="{ active: phase === 'black', white: phase === 'white', reveal: phase === 'reveal' }"
    ></div>

    <section v-if="phase === 'matrix'" class="matrix-container">
      <div class="matrix-pattern">
        <div v-for="col in matrixColumns" :key="`l-${col}`" class="matrix-column"></div>
      </div>
      <div class="matrix-pattern">
        <div v-for="col in matrixColumns" :key="`m-${col}`" class="matrix-column"></div>
      </div>
      <div class="matrix-pattern">
        <div v-for="col in matrixColumns" :key="`r-${col}`" class="matrix-column"></div>
      </div>
      <div class="matrix-cipher">
        {{ matrixText }}
        <span class="deciphering">deciphering{{ decipherDots }}</span>
      </div>
    </section>

    <section v-if="phase === 'reveal'" class="reveal">
      <div class="hearts">
        <span
          v-for="heart in hearts"
          :key="heart.id"
          class="heart"
          :style="{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
            fontSize: `${heart.size}px`,
            color: heart.color,
            opacity: heart.opacity,
          }"
        >
          ♥
        </span>
      </div>
      <div class="reveal-card">
        <h1 class="fancy-title">Do you want to be my valentine?</h1>
        <div ref="buttonArea" class="button-area" @mousemove="onAreaMove">
          <button
            ref="noButton"
            class="button secondary no-button"
            :class="{ yes: noIsYes }"
            :style="{ transform: `translate(${noPos.x}px, ${noPos.y}px)` }"
            @mouseenter="moveNoButton"
            @click="noIsYes ? finishYes() : finishNo()"
          >
            {{ noIsYes ? 'Yes 💙' : 'No' }}
          </button>
          <button class="button yes-button" @click="finishYes">Yes 💙</button>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.question {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  position: relative;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  font-size: 0.7rem;
  color: var(--muted);
  margin: 0 0 1rem;
}

.placeholder {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px dashed var(--border);
  background: rgba(15, 23, 42, 0.6);
  display: grid;
  gap: 0.75rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.final-actions {
  margin-top: 1.5rem;
  display: grid;
  gap: 1rem;
}

.cipher {
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  letter-spacing: 0.2rem;
  color: #93c5fd;
  font-weight: 600;
  margin: 0;
}


.transition-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 2.4s ease;
  z-index: 55;
}

.transition-overlay.active {
  opacity: 1;
}

.transition-overlay.white {
  background: #fff;
  opacity: 1;
}

.transition-overlay.reveal {
  background: #fff;
  opacity: 1;
  animation: whiteFadeOut 2.4s ease forwards;
}

.success-screen {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
  display: grid;
  place-items: center;
  z-index: 60;
}

.success-screen.active {
  opacity: 1;
  pointer-events: auto;
}

.success-matrix {
  padding: 2.5rem 3rem;
  border-radius: 20px;
  background: rgba(6, 20, 10, 0.85);
  border: 1px solid rgba(34, 197, 94, 0.4);
  box-shadow:
    inset 0 0 40px rgba(34, 197, 94, 0.18),
    0 0 60px rgba(34, 197, 94, 0.2);
  text-align: center;
  min-width: min(420px, 90vw);
}

.success-matrix .badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18rem;
  font-size: 0.7rem;
  margin: 0 0 1.5rem;
}

.success-matrix .smile {
  font-size: clamp(3rem, 10vw, 7rem);
  letter-spacing: 0.2rem;
  color: #4ade80;
  text-shadow: 0 0 18px rgba(34, 197, 94, 0.5);
}

.success-text {
  margin-top: 1rem;
  color: #bbf7d0;
  font-size: 1.05rem;
}

.matrix-container {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  overflow: hidden;
  z-index: 58;
}

.matrix-pattern {
  position: relative;
  width: 1000px;
  height: 100%;
  flex-shrink: 0;
}

.matrix-column {
  position: absolute;
  top: -100%;
  width: 18px;
  height: 100%;
  font-size: 16px;
  line-height: 18px;
  font-weight: bold;
  animation: fall linear infinite;
  white-space: nowrap;
}

.matrix-column::before {
  content: "0101010101010101010101010101010101010101010101010101010101010101";
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(
    to bottom,
    #ffffff 0%,
    #ffffff 5%,
    #00ff41 12%,
    #00dd33 30%,
    #00bb22 45%,
    #009911 60%,
    #007700 70%,
    #005500 80%,
    rgba(0, 255, 65, 0.5) 90%,
    transparent 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  writing-mode: vertical-lr;
  letter-spacing: 1px;
}

.matrix-column:nth-child(odd)::before {
  content: "1010101010101010101010101010101010101010101010101010101010101010";
}

@keyframes fall {
  0% {
    transform: translateY(-10%);
    opacity: 1;
  }
  100% {
    transform: translateY(200%);
    opacity: 0;
  }
}

.matrix-column:nth-child(1) { left: 0px; animation-delay: -2.5s; animation-duration: 3s; }
.matrix-column:nth-child(2) { left: 24px; animation-delay: -3.2s; animation-duration: 4s; }
.matrix-column:nth-child(3) { left: 48px; animation-delay: -1.8s; animation-duration: 2.5s; }
.matrix-column:nth-child(4) { left: 72px; animation-delay: -2.9s; animation-duration: 3.5s; }
.matrix-column:nth-child(5) { left: 96px; animation-delay: -1.5s; animation-duration: 3s; }
.matrix-column:nth-child(6) { left: 120px; animation-delay: -3.8s; animation-duration: 4.5s; }
.matrix-column:nth-child(7) { left: 144px; animation-delay: -2.1s; animation-duration: 2.8s; }
.matrix-column:nth-child(8) { left: 168px; animation-delay: -2.7s; animation-duration: 3.2s; }
.matrix-column:nth-child(9) { left: 192px; animation-delay: -3.4s; animation-duration: 3.8s; }
.matrix-column:nth-child(10) { left: 216px; animation-delay: -1.9s; animation-duration: 2.7s; }
.matrix-column:nth-child(11) { left: 240px; animation-delay: -3.6s; animation-duration: 4.2s; }
.matrix-column:nth-child(12) { left: 264px; animation-delay: -2.3s; animation-duration: 3.1s; }
.matrix-column:nth-child(13) { left: 288px; animation-delay: -3.1s; animation-duration: 3.6s; }
.matrix-column:nth-child(14) { left: 312px; animation-delay: -2.6s; animation-duration: 2.9s; }
.matrix-column:nth-child(15) { left: 336px; animation-delay: -3.7s; animation-duration: 4.1s; }
.matrix-column:nth-child(16) { left: 360px; animation-delay: -2.8s; animation-duration: 3.3s; }
.matrix-column:nth-child(17) { left: 384px; animation-delay: -3.3s; animation-duration: 3.7s; }
.matrix-column:nth-child(18) { left: 408px; animation-delay: -2.2s; animation-duration: 2.6s; }
.matrix-column:nth-child(19) { left: 432px; animation-delay: -3.9s; animation-duration: 4.3s; }
.matrix-column:nth-child(20) { left: 456px; animation-delay: -2.4s; animation-duration: 3.4s; }
.matrix-column:nth-child(21) { left: 480px; animation-delay: -1.7s; animation-duration: 2.4s; }
.matrix-column:nth-child(22) { left: 504px; animation-delay: -3.5s; animation-duration: 3.9s; }
.matrix-column:nth-child(23) { left: 528px; animation-delay: -2s; animation-duration: 3s; }
.matrix-column:nth-child(24) { left: 552px; animation-delay: -4s; animation-duration: 4.4s; }
.matrix-column:nth-child(25) { left: 576px; animation-delay: -1.6s; animation-duration: 2.3s; }
.matrix-column:nth-child(26) { left: 600px; animation-delay: -3s; animation-duration: 3.5s; }
.matrix-column:nth-child(27) { left: 624px; animation-delay: -3.8s; animation-duration: 4s; }
.matrix-column:nth-child(28) { left: 648px; animation-delay: -2.5s; animation-duration: 2.8s; }
.matrix-column:nth-child(29) { left: 672px; animation-delay: -3.2s; animation-duration: 3.6s; }
.matrix-column:nth-child(30) { left: 696px; animation-delay: -2.7s; animation-duration: 3.2s; }
.matrix-column:nth-child(31) { left: 720px; animation-delay: -1.8s; animation-duration: 2.7s; }
.matrix-column:nth-child(32) { left: 744px; animation-delay: -3.6s; animation-duration: 4.1s; }
.matrix-column:nth-child(33) { left: 768px; animation-delay: -2.1s; animation-duration: 3.1s; }
.matrix-column:nth-child(34) { left: 792px; animation-delay: -3.4s; animation-duration: 3.7s; }
.matrix-column:nth-child(35) { left: 816px; animation-delay: -2.8s; animation-duration: 2.9s; }
.matrix-column:nth-child(36) { left: 840px; animation-delay: -3.7s; animation-duration: 4.2s; }
.matrix-column:nth-child(37) { left: 864px; animation-delay: -2.3s; animation-duration: 3.3s; }
.matrix-column:nth-child(38) { left: 888px; animation-delay: -1.9s; animation-duration: 2.5s; }
.matrix-column:nth-child(39) { left: 912px; animation-delay: -3.5s; animation-duration: 3.8s; }
.matrix-column:nth-child(40) { left: 936px; animation-delay: -2.6s; animation-duration: 3.4s; }

.matrix-cipher {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  font-size: clamp(1.4rem, 4.5vw, 5rem);
  color: #00ff88;
  letter-spacing: 0.4rem;
  text-shadow: 0 0 30px rgba(0, 255, 136, 0.7);
  animation: cipherScale 12s ease-in forwards;
  z-index: 2;
}

@keyframes cipherScale {
  0% {
    transform: scale(0.6);
    color: #00ff88;
  }
  70% {
    transform: scale(1.2);
    color: #7dffca;
  }
  100% {
    transform: scale(1.45);
    color: #ffffff;
  }
}

.reveal {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: radial-gradient(circle at top, #0f172a 0%, #020617 70%);
  z-index: 58;
  opacity: 0;
  animation: revealFadeIn 3s ease forwards;
}

.reveal-card {
  position: relative;
  padding: 2.5rem 3rem;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.4);
  box-shadow: 0 30px 80px rgba(2, 6, 23, 0.7);
  text-align: center;
  max-width: min(520px, 90vw);
  z-index: 2;
}

.reveal-card h1 {
  margin: 0 0 1.8rem;
  font-size: clamp(1.8rem, 4vw, 2.6rem);
  color: #f8fafc;
}

.fancy-title {
  font-family: "Playfair Display", "Georgia", serif;
  letter-spacing: 0.05rem;
}

.deciphering {
  display: block;
  margin-top: 0.45rem;
  font-size: 1rem;
  letter-spacing: 0.15rem;
  color: #00ff88;
  text-transform: lowercase;
}

.button-area {
  position: relative;
  height: 120px;
  width: min(420px, 85vw);
  margin: 0 auto;
}

.no-button {
  position: absolute;
  left: 40px;
  top: 20px;
  transition: transform 0.2s ease;
}

.no-button.yes {
  background: #2563eb;
  border-color: transparent;
  color: #fff;
}

.yes-button {
  position: absolute;
  right: 40px;
  top: 20px;
}

.hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.heart {
  position: absolute;
  top: -10%;
  animation-name: heartFall;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes heartFall {
  0% {
    transform: translateY(-10vh);
  }
  100% {
    transform: translateY(110vh);
  }
}

@keyframes revealFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes whiteFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .matrix-column {
    font-size: 14px;
    line-height: 16px;
    width: 16px;
  }
  .button-area {
    height: 160px;
  }
}

@media (max-width: 480px) {
  .matrix-column {
    font-size: 12px;
    line-height: 14px;
    width: 14px;
  }
}
</style>
