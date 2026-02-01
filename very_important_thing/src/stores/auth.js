import { defineStore } from 'pinia'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../lib/firebase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    initialized: false,
    initPromise: null,
  }),
  actions: {
    init() {
      if (this.initPromise) return this.initPromise
      this.initPromise = new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          this.user = user
          this.initialized = true
          resolve(user)
        })
      })
      return this.initPromise
    },
    async login(email, password) {
      const result = await signInWithEmailAndPassword(auth, email, password)
      this.user = result.user
      return result.user
    },
    async register(email, password) {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      this.user = result.user
      return result.user
    },
    async logout() {
      await signOut(auth)
      this.user = null
    },
  },
})
