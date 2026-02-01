<script setup>
import { useRouter } from 'vue-router'
import { useAccessStore } from '../stores/access'

const router = useRouter()
const accessStore = useAccessStore()

const goBack = () => {
  accessStore.reset()
  router.push({ name: 'intro' })
}
</script>

<template>
  <main class="denied">
    <section class="panel">
      <p class="badge">Access denied</p>
      <h1 class="title">The door stays shut.</h1>
      <p class="subtitle">This path only opens for the one it was made for.</p>
      <button class="button secondary" @click="goBack">Go back</button>
    </section>
  </main>
</template>

<style scoped>
.denied {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
}

.badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18rem;
  font-size: 0.7rem;
  margin: 0 0 1.5rem;
}
</style>
