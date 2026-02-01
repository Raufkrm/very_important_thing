import { defineStore } from 'pinia'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const normalize = (value) => value.trim().toLowerCase()

export const useAccessStore = defineStore('access', {
  state: () => ({
    name: '',
    allowedNames: [],
    isAllowed: false,
    checked: false,
  }),
  actions: {
    async loadAllowedNames() {
      try {
        const snapshot = await getDoc(doc(db, 'config', 'access'))
        if (snapshot.exists()) {
          const data = snapshot.data()
          if (Array.isArray(data.allowedNames) && data.allowedNames.length > 0) {
            this.allowedNames = data.allowedNames
          }
        }
      } catch (error) {
        this.allowedNames = []
      }
    },
    async checkName(name) {
      this.name = name
      await this.loadAllowedNames()
      const normalizedInput = normalize(name)
      this.isAllowed = this.allowedNames.map(normalize).includes(normalizedInput)
      this.checked = true
      return this.isAllowed
    },
    reset() {
      this.name = ''
      this.isAllowed = false
      this.checked = false
    },
  },
})
