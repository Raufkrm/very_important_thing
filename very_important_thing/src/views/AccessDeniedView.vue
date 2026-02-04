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
    <div class="matrix-container">
      <div class="matrix-grid"></div>
    </div>
    <section class="panel denied-card">
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
  position: relative;
  overflow: hidden;
}

.badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18rem;
  font-size: 0.7rem;
  margin: 0 0 1.5rem;
}

.denied-card {
  background: rgba(5, 5, 10, 0.9);
  border-color: rgba(239, 68, 68, 0.35);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
  z-index: 2;
}

.denied :deep(.button.secondary) {
  border-color: rgba(239, 68, 68, 0.5);
  color: #f87171;
}

.matrix-container {
  width: 100%;
  height: 100%;
  perspective: 1500px;
  position: absolute;
  inset: 0;
  background-color: #0a0a12;
  overflow: hidden;
  z-index: 1;
}

.matrix-grid {
  width: 100%;
  height: 100%;
  background: linear-gradient(#331317 1px, transparent 1px),
    linear-gradient(90deg, #331317 1px, transparent 1px),
    repeating-linear-gradient(45deg, rgba(239, 68, 68, 0.06) 0px 1px, transparent 1px 12px),
    repeating-linear-gradient(-45deg, rgba(239, 68, 68, 0.06) 0px 1px, transparent 1px 12px),
    radial-gradient(circle at center, #0a0a1a 0%, #000 100%);
  background-size:
    28px 28px,
    28px 28px,
    50px 50px,
    50px 50px,
    cover;
  border: 1px solid rgba(239, 68, 68, 0.15);
  box-shadow:
    inset 0 0 40px rgba(239, 68, 68, 0.1),
    0 0 60px rgba(239, 68, 68, 0.2);
  transform-style: preserve-3d;
  transition: all 0.6s ease-in-out;
  position: relative;
}

.matrix-grid::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.4), transparent);
  animation: borderFlow 6s linear infinite;
  pointer-events: none;
  mask:
    linear-gradient(#fff 0 0) padding-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.matrix-grid::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: pulse 3.5s ease-in-out infinite alternate;
  z-index: 1;
}

@keyframes borderFlow {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.85);
    opacity: 0.2;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.5;
  }
}
</style>
