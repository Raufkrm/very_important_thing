<script setup>
import { ref } from 'vue'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '../stores/auth'
import { db } from '../lib/firebase'

const authStore = useAuthStore()
const answer = ref('')
const status = ref('')
const loading = ref(false)

const submitAnswer = async () => {
  if (!answer.value.trim()) return
  loading.value = true
  status.value = ''
  try {
    await addDoc(collection(db, 'responses'), {
      uid: authStore.user?.uid || null,
      answer: answer.value.trim(),
      createdAt: serverTimestamp(),
    })
    answer.value = ''
    status.value = 'Saved!'
  } catch (error) {
    status.value = error?.message || 'Could not save.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="home">
    <header class="hero">
      <h1>Valentine Quest</h1>
      <p>Solve each riddle to unlock the next clue.</p>
      <button class="logout" @click="authStore.logout()">Log out</button>
    </header>

    <section class="puzzle">
      <h2>Puzzle 1</h2>
      <p>
        I’m not a flower, but I bloom once a year.
        I’m not a song, but I can still make you smile.
        What am I?
      </p>

      <form class="answer" @submit.prevent="submitAnswer">
        <input v-model="answer" placeholder="Your answer..." />
        <button type="submit" :disabled="loading">Submit</button>
      </form>

      <p v-if="status" class="status">{{ status }}</p>
    </section>
  </main>
</template>

<style scoped>
.home {
  min-height: 100vh;
  padding: 2.5rem;
  background: linear-gradient(135deg, #fde2e4 0%, #f9dede 50%, #fce7f3 100%);
  display: grid;
  gap: 2rem;
}

.hero {
  background: #ffffff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 16px 30px rgba(165, 94, 105, 0.15);
}

.logout {
  margin-top: 1rem;
  border: none;
  background: #f472b6;
  color: #ffffff;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  font-weight: 600;
}

.puzzle {
  background: #ffffff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 16px 30px rgba(165, 94, 105, 0.12);
}

.answer {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

input {
  flex: 1;
  border: 1px solid #f3c4d9;
  border-radius: 12px;
  padding: 0.75rem 1rem;
}

button {
  border: none;
  background: #ec4899;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
}

.status {
  margin-top: 0.5rem;
  font-weight: 600;
  color: #be185d;
}
</style>
