<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { useAccessStore } from '../stores/access'
import { db } from '../lib/firebase'
import { normalizeValue, sha256 } from '../lib/hash'

const router = useRouter()
const accessStore = useAccessStore()

const hexString = '73 71 63 7a 20 69 70 78 20 78 6d 20 64 6d 20 66 62 6f 61 76 6b 77 78 66'

const answer = ref('')
const loading = ref(false)
const status = ref('')
const errorMessage = ref('')
const successScreen = ref(false)
const successMessage = ref('')
const showAscii = ref(false)
const asciiRows = Array.from({ length: 95 }, (_, index) => {
  const code = index + 32
  const hex = code.toString(16).padStart(2, '0')
  const char = String.fromCharCode(code)
  return { code, hex, char: char === ' ' ? 'space' : char }
})

const messages = [
  'good job!',
  'well done!',
  'hopppaaaa!',
  'Sherlock Holmes is on the scene!',
  'ma alee zeg die ook al juist?',
  'howly mowly',
  "you're just making my homework btw",
  "chill down. You're too fast!",
]

const pickMessage = () => messages[Math.floor(Math.random() * messages.length)]

const submit = async () => {
  status.value = ''
  errorMessage.value = ''
  loading.value = true
  try {
    const snapshot = await getDoc(doc(db, 'answers', 'q4'))
    const expected = snapshot.exists() ? String(snapshot.data().hash || '') : ''
    if (!expected) {
      errorMessage.value = 'No answer configured.'
      return
    }
    const hash = await sha256(normalizeValue(answer.value))
    if (hash === expected) {
      status.value = 'Correct.'
      accessStore.setStep(5)
      successMessage.value = pickMessage()
      successScreen.value = true
      setTimeout(() => {
        router.push({ name: 'question-5' })
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
  <main class="question level-4">
    <div class="success-screen" :class="{ active: successScreen }">
      <div class="success-matrix">
        <p class="badge">Access granted</p>
        <div class="smile">:)</div>
        <p class="success-text">{{ successMessage }}</p>
      </div>
    </div>
    <section class="panel">
      <p class="eyebrow fade-in-title">Question 4</p>
      <h1 class="title fade-in-title">Translate the hexadecimal code.</h1>
      <p class="subtitle fade-in-body">
        The grid revealed a hex trail. Convert it into plain text.
      </p>

      <div class="hex-panel fade-in-body">
        <p class="muted">Recovered hex:</p>
        <p class="hex-string">{{ hexString }}</p>
        <div class="hex-guide">
          <p class="guide-title">How to read it</p>
          <ul>
            <li>Split into pairs (each pair is one ASCII character).</li>
            <li>Convert each pair from hex to decimal.</li>
            <li>Map the decimal to its ASCII letter.</li>
            <li>Example: <strong>68 69</strong> → 104 105 → <strong>hi</strong></li>
          </ul>
          <button class="ascii-button" type="button" @click="showAscii = true">
            Open ASCII table
          </button>
        </div>
      </div>

      <div class="placeholder fade-in-body">
        <input v-model="answer" class="input" placeholder="decoded text..." />
        <p v-if="status" class="status">{{ status }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <div class="actions fade-in-body">
        <button class="button" :disabled="loading" @click="submit">
          {{ loading ? 'Checking...' : 'Submit' }}
        </button>
      </div>
    </section>
    <div class="ascii-modal" :class="{ active: showAscii }">
      <div class="ascii-card">
        <div class="ascii-header">
          <h2>ASCII Table (32–126)</h2>
          <button class="ascii-close" type="button" @click="showAscii = false">Close</button>
        </div>
        <div class="ascii-table-wrap">
          <table class="ascii-table">
            <thead>
              <tr>
                <th>Dec</th>
                <th>Hex</th>
                <th>Char</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in asciiRows" :key="row.code">
                <td class="ascii-code">{{ row.code }}</td>
                <td class="ascii-hex">{{ row.hex }}</td>
                <td class="ascii-char">{{ row.char }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
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

.hex-panel {
  width: min(680px, 100%);
  padding: 1rem 1.25rem;
  border-radius: 14px;
  background: rgba(8, 12, 24, 0.7);
  border: 1px solid rgba(59, 130, 246, 0.25);
  box-shadow: 0 16px 30px rgba(2, 6, 23, 0.6);
  margin-top: 1.5rem;
}

.hex-string {
  margin: 0.5rem 0 0;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  letter-spacing: 0.2rem;
  color: #93c5fd;
  word-break: break-all;
}

.hex-guide {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  color: #cbd5f5;
  font-size: 0.95rem;
}

.hex-guide ul {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.4rem;
}

.hex-guide li {
  line-height: 1.5;
}

.guide-title {
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.08rem;
  text-transform: uppercase;
  font-size: 0.75rem;
  color: #a5b4fc;
}

.ascii-button {
  margin-top: 0.75rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.7);
  color: #e2e8f0;
  font-size: 0.85rem;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.ascii-button:hover {
  border-color: rgba(59, 130, 246, 0.6);
  transform: translateY(-1px);
}

.ascii-modal {
  position: fixed;
  inset: 0;
  background: rgba(3, 6, 15, 0.8);
  display: grid;
  place-items: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 70;
}

.ascii-modal.active {
  opacity: 1;
  pointer-events: auto;
}

.ascii-card {
  width: min(760px, 92vw);
  max-height: min(80vh, 720px);
  background: rgba(9, 14, 26, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 18px;
  box-shadow: 0 25px 60px rgba(2, 6, 23, 0.7);
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
}

.ascii-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.ascii-header h2 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0.12rem;
  text-transform: uppercase;
  color: #e2e8f0;
}

.ascii-close {
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.35);
  color: #e2e8f0;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  cursor: pointer;
}

.ascii-table-wrap {
  padding: 0 1.25rem 1.25rem;
  overflow: auto;
}

.ascii-table {
  width: 100%;
  border-collapse: collapse;
  color: #cbd5f5;
  font-size: 0.85rem;
  margin: 0;
}

.ascii-table thead th {
  text-align: left;
  padding: 0.5rem 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.12rem;
  text-transform: uppercase;
  color: #a5b4fc;
  border-bottom: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(15, 23, 42, 0.8);
  position: sticky;
  top: 0;
  z-index: 1;
}

.ascii-table tbody td {
  padding: 0.45rem 0.5rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.ascii-table tbody tr:nth-child(even) td {
  background: rgba(15, 23, 42, 0.45);
}

.ascii-code {
  color: #93c5fd;
}

.ascii-hex {
  color: #a5b4fc;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  width: 60px;
}

.ascii-char {
  font-weight: 600;
  color: #e2e8f0;
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
