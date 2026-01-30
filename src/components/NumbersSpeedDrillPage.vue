<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { NumberDirection } from '../types'
import {
  generateRandomNumber,
  numberToJapanese,
  checkNumberAnswer,
} from '../utils/japaneseNumbers'

const router = useRouter()
const route = useRoute()

const direction = computed<NumberDirection>(
  () => (route.query.direction as NumberDirection) || 'num-to-jp'
)

const DRILL_DURATION = 90 // seconds
const timeRemaining = ref(DRILL_DURATION)
const score = ref(0)
const currentNumber = ref(0)
const userAnswer = ref('')
const isFinished = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

let timerInterval: ReturnType<typeof setInterval> | null = null

const currentPrompt = computed(() => {
  if (direction.value === 'num-to-jp') {
    return currentNumber.value.toLocaleString()
  } else {
    return numberToJapanese(currentNumber.value)
  }
})

const directionLabel = computed(() => {
  return direction.value === 'num-to-jp' ? 'Number → JP' : 'JP → Number'
})

function generateNewQuestion() {
  currentNumber.value = generateRandomNumber()
  userAnswer.value = ''
}

function handleSubmit() {
  if (!userAnswer.value.trim() || isFinished.value) return

  const isCorrect = checkNumberAnswer(
    userAnswer.value,
    currentNumber.value,
    direction.value
  )

  if (isCorrect) {
    score.value++
    generateNewQuestion()
  } else {
    // Wrong answer: just clear the input
    userAnswer.value = ''
  }

  // Re-focus input
  inputRef.value?.focus()
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      endDrill()
    }
  }, 1000)
}

function endDrill() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  isFinished.value = true
}

function goHome() {
  router.push({ name: 'home' })
}

function tryAgain() {
  timeRemaining.value = DRILL_DURATION
  score.value = 0
  isFinished.value = false
  generateNewQuestion()
  startTimer()
  // Focus input after Vue re-renders
  setTimeout(() => inputRef.value?.focus(), 0)
}

onMounted(() => {
  generateNewQuestion()
  startTimer()
  // Focus input on mount
  setTimeout(() => inputRef.value?.focus(), 0)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<template>
  <div class="min-h-screen p-8 bg-gray-50">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <button
          @click="goHome"
          class="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <span>&larr;</span>
          <span>Back to Home</span>
        </button>
        <div class="text-gray-600">
          Numbers Speed Drill ({{ directionLabel }})
        </div>
      </div>

      <!-- Drill Active State -->
      <div v-if="!isFinished" class="space-y-8">
        <!-- Timer and Score -->
        <div class="flex justify-between items-center">
          <div
            class="text-4xl font-bold"
            :class="{
              'text-red-500': timeRemaining <= 10,
              'text-amber-500': timeRemaining > 10 && timeRemaining <= 30,
              'text-gray-800': timeRemaining > 30,
            }"
          >
            {{ timeRemaining }}s
          </div>
          <div class="text-2xl font-semibold text-gray-700">
            Score: {{ score }}
          </div>
        </div>

        <!-- Question -->
        <div class="bg-white rounded-lg shadow-lg p-8 text-center">
          <div class="text-5xl font-bold text-gray-800 mb-8">
            {{ currentPrompt }}
          </div>

          <form @submit.prevent="handleSubmit">
            <input
              ref="inputRef"
              v-model="userAnswer"
              type="text"
              :placeholder="
                direction === 'num-to-jp'
                  ? 'Type in Japanese (romaji)...'
                  : 'Type the number...'
              "
              class="w-full px-4 py-3 text-xl border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-center"
              autocomplete="off"
              autocapitalize="off"
              spellcheck="false"
            />
            <button
              type="submit"
              class="mt-4 w-full py-3 px-4 bg-amber-500 text-white text-lg font-medium rounded-lg hover:bg-amber-600 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>

        <p class="text-center text-gray-500 text-sm">
          Press Enter to submit. Wrong answers clear the input - no penalty, keep trying!
        </p>
      </div>

      <!-- Results State -->
      <div v-else class="space-y-8">
        <div class="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Time's Up!</h2>
          <div class="text-6xl font-bold text-amber-500 mb-4">
            {{ score }}
          </div>
          <p class="text-gray-600 text-lg">correct answers in 90 seconds</p>
        </div>

        <div class="flex gap-4">
          <button
            @click="goHome"
            class="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
          >
            Return to Home
          </button>
          <button
            @click="tryAgain"
            class="flex-1 py-3 px-4 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
