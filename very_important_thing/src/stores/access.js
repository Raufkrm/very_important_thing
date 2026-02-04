import { defineStore } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { normalizeValue, sha256 } from '../lib/hash'

const normalize = (value) => value.trim().toLowerCase()

export const useAccessStore = defineStore('access', {
  state: () => ({
    name: '',
    allowedHashes: [],
    isAllowed: false,
    checked: false,
    maxStep: Number(sessionStorage.getItem('maxStep') || 0),
  }),
  getters: {
    displayName: (state) => {
      const trimmed = state.name.trim()
      if (!trimmed) return ''
      return /^your\s+/i.test(trimmed) ? trimmed.replace(/^your\s+/i, 'my ') : trimmed
    },
    terminalName: (state) => {
      const trimmed = state.name.trim()
      if (!trimmed) return ''
      const normalized = /^your\s+/i.test(trimmed)
        ? trimmed.replace(/^your\s+/i, 'my ')
        : trimmed
      return normalized.replace(/\s+/g, '_')
    },
  },
  actions: {
    async loadAllowedNames() {
      try {
        const snapshot = await getDoc(doc(db, 'config', 'access'))
        if (snapshot.exists()) {
          const data = snapshot.data()
          if (Array.isArray(data.allowedHashes) && data.allowedHashes.length > 0) {
            this.allowedHashes = data.allowedHashes
          }
        }
      } catch (error) {
        this.allowedHashes = []
      }
    },
    async checkName(name) {
      this.name = name
      await this.loadAllowedNames()
      const normalizedInput = normalizeValue(name)
      const hash = await sha256(normalizedInput)
      this.isAllowed = this.allowedHashes.includes(hash)
      this.checked = true
      if (this.isAllowed && this.maxStep < 1) {
        this.maxStep = 1
        sessionStorage.setItem('maxStep', String(this.maxStep))
      }
      return this.isAllowed
    },
    setStep(step) {
      if (step > this.maxStep) {
        this.maxStep = step
        sessionStorage.setItem('maxStep', String(this.maxStep))
      }
    },
    reset() {
      this.name = ''
      this.isAllowed = false
      this.checked = false
      this.maxStep = 0
      sessionStorage.removeItem('maxStep')
    },
  },
})
