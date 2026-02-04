<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccessStore } from '../stores/access'
import { db } from '../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

const router = useRouter()
const accessStore = useAccessStore()

const inputs = ref(Array.from({ length: 7 }, () => ''))
const errorMessage = ref('')
const loading = ref(false)
const status = ref('')
const audioUrl = `${import.meta.env.BASE_URL}fragment.mp3`
const successScreen = ref(false)
const successMessage = ref('')
const hintOpen = ref(false)

const messages = [
  'good job!',
  'well done!',
  'hopppaaaa',
  'Sherlock Holmes is on the scene!',
  'ma alee zeg die ook al juist?',
  'howly mowly',
  "you're just making my homework btw",
  "chill down. You're too fast!",
]

const pickMessage = () => messages[Math.floor(Math.random() * messages.length)]

const key = computed(() =>
  inputs.value
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => value[0]?.toUpperCase() || '')
    .join(''),
)

const submit = async () => {
  errorMessage.value = ''
  status.value = ''
  loading.value = true
  try {
    const snapshot = await getDoc(doc(db, 'config', 'question1'))
    const expectedKey = snapshot.exists() ? snapshot.data().key : ''
    if (!expectedKey || key.value !== expectedKey) {
      errorMessage.value = 'Access denied. The key is incorrect.'
      return
    }
    status.value = 'Key accepted.'
    accessStore.setStep(2)
    successMessage.value = pickMessage()
    successScreen.value = true
    setTimeout(() => {
      router.push({ name: 'question-2' })
    }, 4000)
  } catch (error) {
    errorMessage.value = error?.message || 'Could not validate the key.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="question level-1">
    <button class="hint-toast" type="button" @click="hintOpen = !hintOpen">
      <span class="sparkle">◆</span> Hint
    </button>
    <div v-if="hintOpen" class="hint-panel">
      please take notes as the information could be useful in future questions ;)
    </div>
    <div class="success-screen" :class="{ active: successScreen }">
      <div class="success-matrix">
        <p class="badge">Access granted</p>
        <div class="smile">:)</div>
        <p class="success-text">{{ successMessage }}</p>
      </div>
    </div>
    <section class="panel">
      <p class="eyebrow fade-in-title">Question 1</p>
      <h1 class="title fade-in-title">Find the key in the static.</h1>
      <p class="subtitle fade-in-body">
        {{ accessStore.displayName || 'Stranger' }}, the static masks seven songs. Type each title
        in order. The first letters form the key.
      </p>

      <div class="player fade-in-body">
        <p class="player-label">Fragment.mp3</p>
        <audio class="audio" :src="audioUrl" controls preload="metadata"></audio>
      </div>

      <div class="terminal fade-in-body">
        <div class="terminal_toolbar">
          <div class="butt">
            <button class="btn btn-color" type="button"></button>
            <button class="btn" type="button"></button>
            <button class="btn" type="button"></button>
          </div>
          <p class="user">{{ accessStore.terminalName || 'user' }}@admin: ~</p>

        </div>
        <div class="terminal_body">
          <div class="terminal_output">
            <div class="inputs">
              <div v-for="(value, index) in inputs" :key="index" class="terminal_prompt">
                <span class="prompt">
                  <span class="terminal_user">{{ accessStore.terminalName || 'user' }}@admin:</span>
                  <span class="terminal_location">~/songs</span>
                  <span class="terminal_bling">$</span>
                </span>
                <input
                  v-model="inputs[index]"
                  class="input_text"
                  :placeholder="`song ${index + 1}`"
                  type="text"
                />
              </div>
            </div>
            <p class="hint">Key so far: <span class="key">{{ key || '—' }}</span></p>
            <p v-if="status" class="status">{{ status }}</p>
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
          </div>
          <div class="terminal_input">
            <button class="button" :disabled="loading" @click="submit">
              {{ loading ? 'Checking...' : 'Send' }}
            </button>
          </div>
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
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  font-size: 0.7rem;
  color: var(--muted);
  margin: 0 0 1rem;
}

.terminal {
  width: min(680px, 100%);
  margin: 2rem 0 0;
  background: #1e1e1e;
  font-family: Menlo, Consolas, monospace;
  font-size: 14px;
  color: #e6e6e6;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #2b2b2b;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
}

.player {
  width: min(680px, 100%);
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  background: rgba(8, 12, 24, 0.7);
  border: 1px solid rgba(59, 130, 246, 0.25);
  box-shadow: 0 16px 30px rgba(2, 6, 23, 0.6);
}

.player-label {
  margin: 0 0 0.75rem;
  color: var(--muted);
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  font-size: 0.75rem;
}

.audio {
  width: 100%;
  height: 36px;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.6));
}

.audio::-webkit-media-controls-panel {
  background: #0b1220;
  border-radius: 10px;
}

.audio::-webkit-media-controls-play-button,
.audio::-webkit-media-controls-mute-button {
  filter: invert(1);
}

.audio::-webkit-media-controls-current-time-display,
.audio::-webkit-media-controls-time-remaining-display {
  color: #e2e8f0;
}

.audio::-webkit-media-controls-timeline {
  filter: hue-rotate(190deg) saturate(180%);
}

.terminal_toolbar {
  display: flex;
  height: 30px;
  align-items: center;
  padding: 0 8px;
  box-sizing: border-box;
  background: #212121;
  justify-content: space-between;
}

.butt {
  display: flex;
  align-items: center;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin-right: 5px;
  font-size: 8px;
  height: 12px;
  width: 12px;
  box-sizing: border-box;
  border: none;
  border-radius: 100%;
  background: linear-gradient(#7d7871 0%, #595953 100%);
  text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px 1px 0px #41403a, 0px 1px 1px 0px #474642;
}

.btn-color {
  background: #ee411a;
}

.add_tab {
  border: 1px solid #fff;
  color: #fff;
  padding: 0 6px;
  border-radius: 4px 4px 0 0;
  border-bottom: none;
}

.user {
  color: #d5d0ce;
  margin: 0 auto;
  font-size: 14px;
  line-height: 15px;
}

.terminal_body {
  background: rgba(0, 0, 0, 0.6);
  padding: 6px 8px 10px;
  font-size: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.terminal_prompt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 3px 0;
  flex-wrap: nowrap;
}

.prompt {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

.terminal_user {
  color: #1eff8e;
}

.terminal_location {
  color: #4878c0;
}

.terminal_bling {
  color: #dddddd;
}

.terminal_output {
  flex-grow: 1;
}

.output_text {
  margin: 0 0 0.5rem;
}

.terminal_input {
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.input_text {
  width: min(420px, 60vw);
  padding: 2px 6px;
  background: transparent;
  border: none;
  color: #e6e6e6;
  caret-color: #1eff8e;
  outline: none;
  font-family: inherit;
  font-size: 12px;
}

.hint {
  margin-top: 0.75rem;
  color: #9ca3af;
  font-size: 0.9rem;
}

.key {
  color: #60a5fa;
  letter-spacing: 0.3rem;
  font-weight: 700;
}

.status {
  margin-top: 0.5rem;
  color: #6ee7b7;
}

.error {
  margin-top: 0.5rem;
  color: #f87171;
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

.hint-toast {
  position: fixed;
  bottom: 28px;
  right: 24px;
  background: linear-gradient(135deg, #facc15, #fde68a);
  color: #1f2937;
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.2rem;
  font-weight: 700;
  letter-spacing: 0.08rem;
  text-transform: uppercase;
  box-shadow:
    0 0 25px rgba(250, 204, 21, 0.4),
    0 12px 24px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 55;
}

.hint-toast:hover {
  transform: translateY(6px);
  box-shadow:
    0 0 30px rgba(250, 204, 21, 0.55),
    0 16px 28px rgba(0, 0, 0, 0.4);
}

.sparkle {
  margin-right: 0.4rem;
}

.hint-panel {
  position: fixed;
  bottom: 84px;
  right: 24px;
  background: rgba(17, 24, 39, 0.95);
  color: #fef08a;
  padding: 0.9rem 1.1rem;
  border-radius: 12px;
  border: 1px solid rgba(250, 204, 21, 0.5);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  z-index: 54;
  max-width: 280px;
}
</style>
