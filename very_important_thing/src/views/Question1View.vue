<script setup>
import { useRouter } from 'vue-router'
import { useAccessStore } from '../stores/access'

const router = useRouter()
const accessStore = useAccessStore()
</script>

<template>
  <main class="question">
    <section class="panel">
      <p class="eyebrow">Question 1</p>
      <h1 class="title">The first riddle awaits.</h1>
      <p class="subtitle">Hello {{ accessStore.name || 'stranger' }}, the puzzle begins soon.</p>

      <div class="placeholder">
        <p class="muted">Template placeholder. Add your first puzzle here.</p>
      </div>

      <div class="actions">
        <button class="button" @click="router.push({ name: 'question-2' })">Next</button>
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
  justify-content: flex-end;
}
</style>
