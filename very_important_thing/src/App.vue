<script setup>
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()
const adminOpen = ref(false)
const adminLinks = [
  { name: 'Intro', route: 'intro' },
  { name: 'Question 1', route: 'question-1' },
  { name: 'Question 2', route: 'question-2' },
  { name: 'Question 3', route: 'question-3' },
  { name: 'Question 4', route: 'question-4' },
  { name: 'Question 5', route: 'question-5' },
  { name: 'Question 6', route: 'question-6' },
  { name: 'Yay Screen', route: 'final-yes' },
  { name: 'Access Denied', route: 'access-denied' },
]

const goTo = (route) => {
  adminOpen.value = false
  sessionStorage.setItem('admin_jump', '1')
  router.push({ name: route })
}
</script>

<template>
  <div class="starfield">
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
    <div class="admin-dot-wrap">
      <button class="admin-dot" type="button" @click="adminOpen = !adminOpen" aria-label="Admin menu"></button>
      <div v-if="adminOpen" class="admin-menu">
        <p class="admin-title">Quick Jump</p>
        <button
          v-for="link in adminLinks"
          :key="link.route"
          class="admin-link"
          type="button"
          @click="goTo(link.route)"
        >
          {{ link.name }}
        </button>
      </div>
    </div>
    <div class="app-shell">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.admin-dot-wrap {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 100;
}

.admin-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
  cursor: pointer;
  opacity: 0.15;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.admin-dot:hover {
  opacity: 0.5;
  transform: scale(1.2);
}

.admin-menu {
  margin-top: 0.6rem;
  padding: 0.75rem;
  border-radius: 12px;
  background: rgba(10, 15, 28, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.35);
  display: grid;
  gap: 0.35rem;
  min-width: 180px;
  box-shadow: 0 16px 30px rgba(2, 6, 23, 0.6);
}

.admin-title {
  margin: 0 0 0.25rem;
  font-size: 0.7rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #94a3b8;
}

.admin-link {
  background: transparent;
  border: none;
  color: #e2e8f0;
  text-align: left;
  padding: 0.35rem 0.25rem;
  cursor: pointer;
  font-size: 0.85rem;
}

.admin-link:hover {
  color: #60a5fa;
}
</style>
