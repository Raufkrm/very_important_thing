<script setup>
import { onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccessStore } from '../stores/access'

const router = useRouter()
const accessStore = useAccessStore()

const name = ref('')
const errorMessage = ref('')
const loading = ref(false)
const transitioning = ref(false)
const allowedScreen = ref(false)
const specialScreen = ref(false)
const typedText = ref('')
const twistActive = ref(false)
const gifUrl = `${import.meta.env.BASE_URL}giphy.gif`

const timers = []
const clearTimers = () => {
  while (timers.length) {
    clearTimeout(timers.pop())
  }
}

const runTyping = (text) => {
  typedText.value = ''
  twistActive.value = false
  let index = 0
  const typeNext = () => {
    typedText.value = text.slice(0, index + 1)
    index += 1
    if (index < text.length) {
      timers.push(setTimeout(typeNext, 90))
    }
  }
  timers.push(setTimeout(typeNext, 300))
}

onBeforeUnmount(() => clearTimers())

const submit = async () => {
  errorMessage.value = ''
  loading.value = true
  clearTimers()
  transitioning.value = true
  allowedScreen.value = false
  specialScreen.value = false
  try {
    const normalized = name.value
      .trim()
      .toLowerCase()
      .replace(/[']/g, '')
      .replace(/\s+/g, ' ')
    const specialStarts = ['you', 'your mama', 'idk', 'i dont know', 'admin', 'root', 'god', 'null', 'void', 'error', 'rauf']
    if (specialStarts.some((token) => normalized.startsWith(token))) {
      specialScreen.value = true
      timers.push(
        setTimeout(() => {
          transitionReset()
        }, 5200),
      )
      return
    }
    const allowed = await accessStore.checkName(name.value)
    if (allowed) {
      allowedScreen.value = true
      const revealElement = () => {
        const el = document.querySelector('.allowed-reveal')
        if (el) el.classList.remove('glitch-out')
      }
      revealElement()
      runTyping(`hello ${accessStore.displayName || name.value.trim()}`)
      timers.push(setTimeout(() => (twistActive.value = true), 8650))
      timers.push(
        setTimeout(() => {
          const el = document.querySelector('.allowed-reveal')
          if (el) el.classList.add('glitch-out')
        }, 8600),
      )
      timers.push(setTimeout(() => router.push({ name: 'question-1' }), 8800))
    } else {
      timers.push(
        setTimeout(() => {
          router.push({ name: 'access-denied' })
        }, 2600),
      )
    }
  } catch (error) {
    errorMessage.value = error?.message || 'Something went wrong.'
    transitioning.value = false
  } finally {
    loading.value = false
  }
}

const transitionReset = () => {
  transitionEnd()
  router.push({ name: 'intro' })
}

const transitionEnd = () => {
  transitioning.value = false
  allowedScreen.value = false
  specialScreen.value = false
  twistActive.value = false
  typedText.value = ''
}
</script>

<template>
  <main class="intro">
    <div
      class="transition-screen"
      :class="{ active: transitioning, reveal: allowedScreen, special: specialScreen }"
    >
      <div v-if="specialScreen" class="special-reveal">
        <img :src="gifUrl" alt="Access revoked" />
        <p class="special-caption">huh?</p>
      </div>
      <div v-if="allowedScreen" class="allowed-reveal" :class="{ 'glitch-out': twistActive }">
        <div v-if="twistActive" class="glitch-wall glitch-out">are you ready?</div>
        <div class="smile" :class="{ twist: twistActive }">{{ twistActive ? '>:)': ':)' }}</div>
        <div class="typed">{{ typedText }}</div>
        <div class="ready">ready to play?</div>
      </div>
    </div>
    <section class="panel">
      <p class="whisper">A message waits behind the veil.</p>
      <h1 class="title"><span class="glitch">Who</span> are you?</h1>
      <p class="subtitle">Speak your name and the path will open.</p>

      <form class="form" @submit.prevent="submit">
        <input v-model="name" class="input" placeholder="Enter your name..." required />
        <button class="button" type="submit" :disabled="loading">
          {{ loading ? 'Listening...' : 'Enter' }}
        </button>
      </form>

      <p v-if="loading" class="status">The veil is checking your name...</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </section>
  </main>
</template>

<style scoped>
.intro {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.whisper {
  text-transform: uppercase;
  letter-spacing: 0.3rem;
  font-size: 0.7rem;
  color: var(--muted);
  margin: 0 0 1.5rem;
}

.form {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.error {
  margin-top: 1rem;
  color: var(--danger);
}

.status {
  margin-top: 1rem;
  color: var(--muted);
}

.glitch {
  position: relative;
  display: inline-block;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  letter-spacing: 0.08em;
  animation:
    glitchFlicker 3s infinite steps(1, end),
    glitchFont 4.2s infinite steps(1, end);
  text-shadow:
    0 0 8px rgba(59, 130, 246, 0.35),
    0 0 18px rgba(59, 130, 246, 0.25);
}

.glitch::before,
.glitch::after {
  content: "Who";
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0.8;
}

.glitch::before {
  color: #60a5fa;
  transform: translate(-2px, -1px);
  animation: glitchShift 1.2s infinite steps(2, end);
}

.glitch::after {
  color: #f87171;
  transform: translate(2px, 1px);
  animation: glitchShift 1s infinite steps(2, end) reverse;
}

@keyframes glitchShift {
  0% {
    clip-path: inset(0 0 90% 0);
  }
  10% {
    clip-path: inset(8% 0 70% 0);
  }
  20% {
    clip-path: inset(18% 0 55% 0);
  }
  30% {
    clip-path: inset(35% 0 40% 0);
  }
  40% {
    clip-path: inset(45% 0 30% 0);
  }
  50% {
    clip-path: inset(60% 0 25% 0);
  }
  60% {
    clip-path: inset(70% 0 15% 0);
  }
  70% {
    clip-path: inset(80% 0 8% 0);
  }
  80% {
    clip-path: inset(90% 0 4% 0);
  }
  100% {
    clip-path: inset(0 0 90% 0);
  }
}

@keyframes glitchFlicker {
  0%,
  5%,
  10%,
  100% {
    opacity: 1;
    transform: skewX(0deg);
  }
  6% {
    opacity: 0.6;
    transform: skewX(-8deg);
  }
  7% {
    opacity: 1;
    transform: skewX(6deg);
  }
  12% {
    opacity: 0.8;
    transform: skewX(-4deg);
  }
  45% {
    opacity: 1;
    transform: skewX(0deg);
  }
  46% {
    opacity: 0.7;
    transform: skewX(10deg);
  }
  47% {
    opacity: 1;
    transform: skewX(-6deg);
  }
  70% {
    opacity: 1;
    transform: skewX(0deg);
  }
  71% {
    opacity: 0.75;
    transform: skewX(12deg);
  }
  72% {
    opacity: 1;
    transform: skewX(-8deg);
  }
}

@keyframes glitchFont {
  0%,
  12%,
  100% {
    font-family: "Space Grotesk", "Segoe UI", sans-serif;
  }
  13%,
  22% {
    font-family: "Pacifico", "Brush Script MT", cursive;
  }
  23%,
  34% {
    font-family: "Uncial Antiqua", "Times New Roman", serif;
  }
  35%,
  46% {
    font-family: "Wingdings", "Webdings", "Segoe UI Symbol", sans-serif;
  }
  47%,
  60% {
    font-family: "Courier New", "Consolas", monospace;
  }
  61%,
  72% {
    font-family: "Impact", "Arial Black", sans-serif;
  }
  73%,
  86% {
    font-family: "Times New Roman", "Georgia", serif;
  }
}

.transition-screen {
  position: fixed;
  inset: 0;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 2s ease;
  display: grid;
  place-items: center;
  z-index: 50;
}

.transition-screen.active {
  opacity: 1;
  pointer-events: auto;
}

.transition-screen.reveal .allowed-reveal {
  opacity: 0;
  animation: revealAfterPause 0.8s ease forwards;
  animation-delay: 3s;
}

.transition-screen.special .special-reveal {
  opacity: 0;
  animation: revealAfterPause 0.6s ease forwards;
  animation-delay: 2.2s;
}

.special-reveal img {
  width: min(520px, 70vw);
  height: auto;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.special-caption {
  margin-top: 1rem;
  color: #9ca3af;
  letter-spacing: 0.3rem;
  text-transform: uppercase;
}

.allowed-reveal {
  text-align: center;
  color: #fff;
  position: relative;
}

.smile {
  font-size: clamp(4rem, 12vw, 10rem);
  font-weight: 600;
  letter-spacing: 0.2rem;
  transition: color 0.3s ease, transform 0.3s ease;
}

.smile.twist {
  color: #f87171;
  transform: scale(1.05) skewX(-10deg);
  animation: twistFlash 0.25s steps(2, end) 1;
}

.typed {
  margin-top: 1rem;
  font-size: clamp(1.2rem, 3vw, 2rem);
  color: #9ca3af;
  min-height: 2.2rem;
  text-transform: lowercase;
  letter-spacing: 0.15rem;
}

.ready {
  margin-top: 0.4rem;
  font-size: clamp(0.9rem, 2vw, 1.2rem);
  color: #4b5563;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
}

@keyframes revealAfterPause {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes twistFlash {
  0%,
  100% {
    opacity: 1;
    text-shadow:
      0 0 10px rgba(248, 113, 113, 0.4),
      -2px 0 6px rgba(59, 130, 246, 0.6),
      2px 0 6px rgba(34, 211, 238, 0.6);
  }
  50% {
    opacity: 0.4;
    text-shadow:
      0 0 24px rgba(248, 113, 113, 0.9),
      -3px 0 10px rgba(59, 130, 246, 0.8),
      3px 0 10px rgba(34, 211, 238, 0.8);
    transform: scale(1.12) skewX(14deg);
  }
}

.allowed-reveal.glitch-out {
  animation: revealGlitch 0.25s steps(2, end) 1;
}

.glitch-wall {
  position: absolute;
  inset: 0;
  color: rgba(248, 113, 113, 0.12);
  font-family: "Wingdings", "Webdings", "Segoe UI Symbol", sans-serif;
  font-size: clamp(4rem, 12vw, 10rem);
  letter-spacing: 1rem;
  text-transform: uppercase;
  display: grid;
  place-items: center;
  text-shadow:
    0 0 18px rgba(248, 113, 113, 0.25),
    0 0 30px rgba(248, 113, 113, 0.15);
  opacity: 0.35;
  z-index: 0;
  animation: wallScroll 12s linear infinite;
  pointer-events: none;
}

.glitch-wall::before,
.glitch-wall::after {
  content: "are you ready?  are you ready?  are you ready?";
  position: absolute;
  left: -10%;
  right: -10%;
  opacity: 0.5;
  font-size: clamp(2.5rem, 7vw, 5rem);
  letter-spacing: 0.8rem;
}

.glitch-wall::before {
  top: 15%;
  animation: wallScroll 10s linear infinite;
}

.glitch-wall::after {
  bottom: 12%;
  animation: wallScroll 14s linear infinite reverse;
}

@keyframes revealGlitch {
  0% {
    filter: blur(0);
    transform: translateY(0);
  }
  50% {
    filter: blur(2px) contrast(140%);
    transform: translate(-6px, 2px) skewX(-6deg);
  }
  100% {
    filter: blur(0);
    transform: translateY(0);
  }
}

@keyframes wallScroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-12%);
  }
}
</style>
