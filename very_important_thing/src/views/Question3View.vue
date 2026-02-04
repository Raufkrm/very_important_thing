<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAccessStore } from '../stores/access'

const router = useRouter()
const accessStore = useAccessStore()

const solution = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
]

const puzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
]

const grid = reactive(puzzle.map((row) => row.map((value) => (value ? String(value) : ''))))
const solved = ref(false)
const solvedFlash = ref(false)
const lives = ref(3)
const failed = ref(false)

const hexString = '7371637a2069707820786d20646d2066626f61766b777866'
const hexBytes = Array.from({ length: 24 }, (_, i) => hexString.slice(i * 2, i * 2 + 2))

const correctCount = computed(() => {
  let count = 0
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (isLocked(r, c)) continue
      if (Number(grid[r][c]) === solution[r][c]) count += 1
    }
  }
  return count
})

const revealCount = computed(() => Math.min(correctCount.value, hexBytes.length))

const hexDisplay = computed(() =>
  hexBytes
    .map((value, index) => (index < revealCount.value ? value : '??'))
    .reduce((acc, value, index) => {
      const spacer = index % 4 === 3 ? '  ' : ' '
      return acc + value + (index < hexBytes.length - 1 ? spacer : '')
    }, ''),
)

const allRevealed = computed(() => revealCount.value === hexBytes.length)
const decodedText = computed(() =>
  allRevealed.value
    ? hexString
        .match(/.{2}/g)
        .map((h) => String.fromCharCode(parseInt(h, 16)))
        .join('')
    : '',
)

const isLocked = (row, col) => puzzle[row][col] !== 0

const isIncorrect = (row, col) => {
  const value = grid[row][col]
  if (!value) return false
  return Number(value) !== solution[row][col]
}

const checkSolved = () => {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      if (Number(grid[r][c]) !== solution[r][c]) {
        return false
      }
    }
  }
  return true
}

watch(
  grid,
  () => {
    if (solved.value) return
    if (checkSolved()) {
      solved.value = true
      solvedFlash.value = true
      setTimeout(() => {
        solvedFlash.value = false
      }, 1200)
    }
  },
  { deep: true },
)

const onInput = (row, col, event) => {
  if (failed.value) return
  const value = event.target.value.replace(/[^1-9]/g, '')
  grid[row][col] = value.slice(-1)
  if (!grid[row][col]) return
  if (Number(grid[row][col]) !== solution[row][col]) {
    const nextLives = Math.max(0, lives.value - 1)
    lives.value = nextLives
    grid[row][col] = ''
    if (nextLives === 0) {
      failed.value = true
    }
    return
  }
}

const successScreen = ref(false)
const successMessage = ref('')
const messages = [
  'good job!',
  'well done!',
  'hopppaaaa',
  'Sherlock Holmes is on the scene!',
  'ma alee zeg die ook al juist?',
  'howly mowly',
  "you're just making my homework btw",
  "chill down. You're too fast!",
]

const pickMessage = () => messages[Math.floor(Math.random() * messages.length)]

const goNext = () => {
  successMessage.value = pickMessage()
  successScreen.value = true
  setTimeout(() => {
    accessStore.setStep(4)
    router.push({ name: 'question-4' })
  }, 4000)
}

const retry = () => {
  for (let r = 0; r < 9; r += 1) {
    for (let c = 0; c < 9; c += 1) {
      grid[r][c] = puzzle[r][c] ? String(puzzle[r][c]) : ''
    }
  }
  lives.value = 3
  failed.value = false
  solved.value = false
  solvedFlash.value = false
}
</script>

<template>
  <main class="question level-3">
    <div class="success-screen" :class="{ active: successScreen }">
      <div class="success-matrix">
        <p class="badge">Access granted</p>
        <div class="smile">:)</div>
        <p class="success-text">{{ successMessage }}</p>
      </div>
    </div>
    <section class="panel">
      <p class="eyebrow fade-in-title">Question 3</p>
      <h1 class="title fade-in-title">Solve the grid.</h1>
      <p class="subtitle fade-in-body">
        Be aware that you have room for 3 mistakes.
      </p>

      <div class="hearts fade-in-body">
        <span v-for="n in 3" :key="n" class="heart" :class="{ empty: n > lives }">♥</span>
      </div>

      <div class="sudoku-wrap fade-in-body" :class="{ solved, flash: solvedFlash }">
        <div v-for="(row, r) in grid" :key="`r-${r}`" class="sudoku-row">
          <div
            v-for="(cell, c) in row"
            :key="`c-${c}`"
            class="sudoku-cell"
            :class="{
              locked: isLocked(r, c),
              wrong: isIncorrect(r, c),
              solved: Number(grid[r][c]) === solution[r][c] && !isLocked(r, c),
            }"
          >
            <input
              v-if="!isLocked(r, c)"
              class="sudoku-input"
              :value="grid[r][c]"
              :disabled="solved || failed"
              @input="onInput(r, c, $event)"
            />
            <span v-else class="sudoku-value">{{ solution[r][c] }}</span>
          </div>
        </div>
      </div>
      <div v-if="failed" class="sudoku-failed fade-in-body">
        <span>No lives left.</span>
        <button class="button secondary retry" @click="retry">Retry</button>
      </div>

      <div class="hex-panel fade-in-body">
        <p class="muted">Recovered hex:</p>
        <p class="hex-string">{{ hexDisplay }}</p>
      </div>

      <div v-if="allRevealed" class="actions fade-in-body">
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

.hearts {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.heart {
  font-size: 1.2rem;
  color: #f87171;
  text-shadow: 0 0 8px rgba(248, 113, 113, 0.45);
  transition: opacity 0.2s ease;
}

.heart.empty {
  opacity: 0.25;
}

.sudoku-wrap {
  margin: 2rem auto 1.5rem;
  display: grid;
  gap: 2px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(7, 12, 24, 0.85);
  border: 1px solid var(--border);
  outline: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 20px 40px rgba(2, 6, 23, 0.5);
  width: min(420px, 100%);
}

.sudoku-wrap.flash {
  box-shadow:
    0 0 35px rgba(59, 130, 246, 0.55),
    0 0 80px rgba(59, 130, 246, 0.25);
}


.sudoku-failed {
  margin: 2rem auto 1.5rem;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  border: 1px solid rgba(248, 113, 113, 0.6);
  color: #fecaca;
  background: rgba(127, 29, 29, 0.2);
  text-align: center;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.retry {
  padding: 0.5rem 1.2rem;
  font-weight: 600;
}

.sudoku-row {
  display: grid;
  grid-template-columns: repeat(9, 42px);
  gap: 2px;
  justify-content: center;
}

.sudoku-cell {
  width: 42px;
  height: 42px;
  background: rgba(17, 24, 39, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.35);
  display: grid;
  place-items: center;
  position: relative;
}

.sudoku-cell:nth-child(3n) {
  border-right: 2px solid rgba(148, 163, 184, 0.6);
}

.sudoku-row:nth-child(3n) .sudoku-cell {
  border-bottom: 2px solid rgba(148, 163, 184, 0.6);
}

.sudoku-value {
  color: #cbd5f5;
  font-weight: 600;
}

.sudoku-input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  color: #e2e8f0;
  text-align: center;
  font-size: 1rem;
  outline: none;
}

.locked {
  background: rgba(30, 41, 59, 0.85);
}

.wrong {
  border-color: rgba(248, 113, 113, 0.7);
}

.sudoku-cell.solved:not(.locked) {
  box-shadow: inset 0 0 12px rgba(59, 130, 246, 0.35);
  border-color: rgba(59, 130, 246, 0.45);
}

.hex-panel {
  width: min(680px, 100%);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  background: rgba(8, 12, 24, 0.7);
  border: 1px solid rgba(59, 130, 246, 0.25);
  margin-bottom: 1.5rem;
}

.hex-string {
  margin: 0.5rem 0 0;
  font-family: "Space Grotesk", "Segoe UI", sans-serif;
  letter-spacing: 0.2rem;
  color: #93c5fd;
  word-break: break-all;
}

.decoded {
  margin-top: 0.75rem;
  color: #e2e8f0;
  font-weight: 600;
  letter-spacing: 0.08rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
}

.success-screen {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
  display: grid;
  place-items: center;
  z-index: 60;
}

.success-screen.active {
  opacity: 1;
  pointer-events: auto;
}

.success-matrix {
  padding: 2.5rem 3rem;
  border-radius: 20px;
  background: rgba(6, 20, 10, 0.85);
  border: 1px solid rgba(34, 197, 94, 0.4);
  box-shadow:
    inset 0 0 40px rgba(34, 197, 94, 0.18),
    0 0 60px rgba(34, 197, 94, 0.2);
  text-align: center;
  min-width: min(420px, 90vw);
}

.success-matrix .badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18rem;
  font-size: 0.7rem;
  margin: 0 0 1.5rem;
}

.success-matrix .smile {
  font-size: clamp(3rem, 10vw, 7rem);
  letter-spacing: 0.2rem;
  color: #4ade80;
  text-shadow: 0 0 18px rgba(34, 197, 94, 0.5);
}

.success-text {
  margin-top: 1rem;
  color: #bbf7d0;
  font-size: 1.05rem;
}

</style>
