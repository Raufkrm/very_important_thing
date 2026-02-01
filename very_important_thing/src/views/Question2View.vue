<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="question">
    <section class="panel">
      <p class="eyebrow">Question 2</p>
      <h1 class="title">The next clue hides in shadows.</h1>
      <p class="subtitle">Template placeholder for question two.</p>

      <div class="placeholder">
        <p class="muted">Add your second puzzle here.</p>
      </div>

      <div class="actions">
        <button class="button" @click="router.push({ name: 'question-3' })">Next</button>
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
