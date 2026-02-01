<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const mode = ref('login')
const errorMessage = ref('')
const loading = ref(false)

const submit = async () => {
  errorMessage.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(email.value, password.value)
    }
    const redirect = route.query.redirect || '/'
    await router.push(redirect)
  } catch (error) {
    errorMessage.value = error?.message || 'Something went wrong.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth">
    <section class="card">
      <h1>Welcome</h1>
      <p>Log in to see the Valentine puzzles.</p>

      <form class="form" @submit.prevent="submit">
        <label>
          Email
          <input v-model="email" type="email" autocomplete="email" required />
        </label>

        <label>
          Password
          <input v-model="password" type="password" autocomplete="current-password" required />
        </label>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button :disabled="loading" type="submit">
          {{ mode === 'login' ? 'Log in' : 'Create account' }}
        </button>
      </form>

      <button class="link" type="button" @click="mode = mode === 'login' ? 'register' : 'login'">
        {{ mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in' }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.auth {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f9f5ff;
  padding: 2rem;
}

.card {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(74, 33, 137, 0.12);
}

.form {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

label {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
}

input {
  border: 1px solid #e2d9f3;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.75rem 1.5rem;
  background: #3f2b96;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.link {
  margin-top: 1rem;
  background: none;
  color: #3f2b96;
}

.error {
  color: #c3265a;
  font-size: 0.9rem;
}
</style>
