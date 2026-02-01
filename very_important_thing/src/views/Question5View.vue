<script setup>
import { useRouter } from 'vue-router'
import { useAccessStore } from '../stores/access'

const router = useRouter()
const accessStore = useAccessStore()
</script>

<template>
  <main class="question">
    <section class="panel">
      <p class="eyebrow">Final Question</p>
      <h1 class="title">Will you be my Valentine?</h1>
      <p class="subtitle">
        {{ accessStore.name ? `${accessStore.name},` : 'Hey,' }} I made this for you.
      </p>

      <div class="placeholder">
        <p class="muted">Choose your answer below.</p>
      </div>

      <div class="actions">
        <button class="button secondary" @click="router.push({ name: 'question-4' })">Back</button>
        <button class="button" @click="router.push({ name: 'intro' })">Yes 💙</button>
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

.placeholder {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 16px;
  border: 1px dashed var(--border);
  background: rgba(15, 23, 42, 0.6);
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
</style>
