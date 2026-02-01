<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAccessStore } from '../stores/access'

const router = useRouter()
const accessStore = useAccessStore()

const name = ref('')
const errorMessage = ref('')
const loading = ref(false)

const submit = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    const allowed = await accessStore.checkName(name.value)
    if (allowed) {
      await router.push({ name: 'question-1' })
    } else {
      await router.push({ name: 'access-denied' })
    }
  } catch (error) {
    errorMessage.value = error?.message || 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="intro">
    <section class="panel">
      <p class="whisper">A message waits behind the veil.</p>
      <h1 class="title">Who are you?</h1>
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
</style>
