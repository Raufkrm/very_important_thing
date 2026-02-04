<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { useAccessStore } from '../stores/access'
import { db } from '../lib/firebase'
import { normalizeValue, sha256 } from '../lib/hash'

const router = useRouter()
const accessStore = useAccessStore()

const cipherText = ref('')
const key = ref('')
const alphabet = ref('')
const loading = ref(false)
const status = ref('')
const errorMessage = ref('')
const successScreen = ref(false)
const transitionBlack = ref(false)
const successMessage = ref('')

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
    const snapshot = await getDoc(doc(db, 'answers', 'q5'))
    const data = snapshot.exists() ? snapshot.data() : null
    const expectedCipher = String(data?.hashCipher || '')
    const expectedKey = String(data?.hashKey || '')
    const expectedAlphabet = String(data?.hashAlphabet || '')

    if (!expectedCipher || !expectedKey || !expectedAlphabet) {
      errorMessage.value = 'No answer configured.'
      return
    }

    const [cipherHash, keyHash, alphabetHash] = await Promise.all([
      sha256(normalizeValue(cipherText.value)),
      sha256(normalizeValue(key.value)),
      sha256(normalizeValue(alphabet.value)),
    ])

    if (cipherHash === expectedCipher && keyHash === expectedKey && alphabetHash === expectedAlphabet) {
      status.value = 'Correct.'
      accessStore.setStep(6)
      successMessage.value = pickMessage()
      successScreen.value = true
      setTimeout(() => {
        successScreen.value = false
        transitionBlack.value = true
        setTimeout(() => {
          router.push({ name: 'question-6' })
        }, 1200)
      }, 2200)
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
  <main class="question level-5">
    <div class="success-screen" :class="{ active: successScreen }">
      <div class="success-matrix">
        <p class="badge">Access granted</p>
        <div class="smile">:)</div>
        <p class="success-text">{{ successMessage }}</p>
      </div>
    </div>
    <section class="panel">
      <p class="eyebrow fade-in-title">Question 5</p>
      <h1 class="title fade-in-title">Assemble the cipher.</h1>
      <p class="subtitle fade-in-body">
        Bring the three pieces together to unlock the final question.
      </p>

      <div class="form fade-in-body">
        <label class="field">
          <span>Vigenère ciphertext(from last question)</span>
          <input v-model="cipherText" class="input" placeholder="" />
        </label>
        <label class="field">
          <span>Key</span>
          <input v-model="key" class="input" placeholder="" />
        </label>
        <label class="field">
          <span>Alphabet</span>
          <input v-model="alphabet" class="input" placeholder="" />
        </label>
        <p v-if="status" class="status">{{ status }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>

      <div class="actions fade-in-body">
        <button class="button secondary" @click="router.push({ name: 'question-4' })">Back</button>
        <button class="button" :disabled="loading" @click="submit">
          {{ loading ? 'Checking...' : 'Submit' }}
        </button>
      </div>
  </section>
    <div class="transition-overlay" :class="{ active: transitionBlack }"></div>
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

.form {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px dashed var(--border);
  background: rgba(15, 23, 42, 0.6);
  display: grid;
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.4rem;
  color: #cbd5f5;
  font-size: 0.9rem;
}

.field span {
  color: var(--muted);
  letter-spacing: 0.12rem;
  text-transform: uppercase;
  font-size: 0.7rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
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

.transition-overlay {
  position: fixed;
  inset: 0;
  background: #000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1.2s ease;
  z-index: 70;
}

.transition-overlay.active {
  opacity: 1;
}
</style>
