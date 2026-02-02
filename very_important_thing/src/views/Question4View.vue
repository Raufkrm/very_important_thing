<script setup>
import { useRouter } from 'vue-router'
import { useAccessStore } from '../stores/access'

const router = useRouter()
const accessStore = useAccessStore()

const goNext = () => {
  accessStore.setStep(5)
  router.push({ name: 'question-5' })
}
</script>

<template>
  <main class="question">
    <section class="panel">
      <p class="eyebrow fade-in-title">Question 4</p>
      <h1 class="title fade-in-title">The trail bends again.</h1>
      <p class="subtitle fade-in-body">Template placeholder for question four.</p>

      <div class="placeholder fade-in-body">
        <p class="muted">Add your fourth puzzle here.</p>
      </div>

      <div class="actions fade-in-body">
        <button class="button" @click="goNext">Next</button>
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
