<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { useAccessStore } from '../stores/access'
import { db } from '../lib/firebase'
import { normalizeValue, sha256 } from '../lib/hash'

const router = useRouter()
const accessStore = useAccessStore()

const answer = ref('')
const loading = ref(false)
const status = ref('')
const errorMessage = ref('')
const successScreen = ref(false)
const successMessage = ref('')
const audioUrl = `${import.meta.env.BASE_URL}morse.wav`

const messages = [
  'good job!',
  'well done!',
  'hopppaaaa!',
  'Sherlock Holmes is on the scene!',
  'ma alee zeg die ook al juist?',
  'howly mowly',
  "you're just making my homework btw",
  "chill down. You're too fast!",
  "WOOP WOOP",
  "KACHOW!",
]

const pickMessage = () => messages[Math.floor(Math.random() * messages.length)]

const submit = async () => {
  status.value = ''
  errorMessage.value = ''
  loading.value = true
  try {
    const snapshot = await getDoc(doc(db, 'answers', 'q2'))
    const expected = snapshot.exists() ? String(snapshot.data().hash || '') : ''
    if (!expected) {
      errorMessage.value = 'No answer configured.'
      return
    }
    const hash = await sha256(normalizeValue(answer.value))
    if (hash === expected) {
      status.value = 'Correct.'
      accessStore.setStep(3)
      successMessage.value = pickMessage()
      successScreen.value = true
      setTimeout(() => {
        router.push({ name: 'question-3' })
      }, 4000)
      return
    }
    errorMessage.value = 'Incorrect.'
  } catch (error) {
    errorMessage.value = error?.message || 'Could not validate.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="question level-2">
    <div class="success-screen" :class="{ active: successScreen }">
      <div class="success-matrix">
        <p class="badge">Access granted</p>
        <div class="smile">:)</div>
        <p class="success-text">{{ successMessage }}</p>
      </div>
    </div>
    <section class="panel">
      <p class="eyebrow fade-in-title">Question 2</p>
      <h1 class="title fade-in-title">Decode the Morse alphabet.</h1>
      <p class="subtitle fade-in-body">
        An audio fragment hides the alphabet. Use it to decode the next clue.
      </p>

      <div class="player fade-in-body">
        <audio class="audio" :src="audioUrl" controls preload="metadata"></audio>
      </div>

      <div class="placeholder fade-in-body">
        <input v-model="answer" class="input" placeholder="full alphabet..." />
        <p v-if="status" class="status">{{ status }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <div class="actions fade-in-body">
        <button class="button" :disabled="loading" @click="submit">
          {{ loading ? 'Checking...' : 'Submit' }}
        </button>
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

.cipher {
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  letter-spacing: 0.2rem;
  color: #93c5fd;
  font-weight: 600;
  margin: 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.status {
  color: #6ee7b7;
}

.error {
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

</style>
