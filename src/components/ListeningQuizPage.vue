<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ListeningExerciseData, ListeningQuizQuestion } from '../types'
import AudioPlayButton from './AudioPlayButton.vue'

const router = useRouter()
const route = useRoute()

const exerciseName = computed(() => route.query.exerciseName as string)
const questionCount = computed(() => parseInt(route.query.count as string) || 10)

const questions = ref<ListeningQuizQuestion[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const allAnswered = computed(() =>
  questions.value.every((q) => q.userAnswer && q.userAnswer.trim() !== '')
)

onMounted(async () => {
  try {
    const exerciseFile = route.query.exercise as string
    const response = await fetch(`./data/${exerciseFile}`)
    const data: ListeningExerciseData = await response.json()

    const shuffled = [...data.sentences].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, questionCount.value)

    questions.value = selected.map((s) => ({
      japanese: s.japanese,
      english: s.english,
      notes: s.notes,
      userAnswer: '',
    }))
  } catch (e) {
    error.value = 'Failed to load listening exercise'
    console.error(e)
  } finally {
    loading.value = false
  }
})

function goHome() {
  router.push({ name: 'home' })
}

function finishQuiz() {
  router.push({
    name: 'listening-results',
    query: {
      exercise: route.query.exercise,
      exerciseName: exerciseName.value,
      questions: JSON.stringify(questions.value),
    },
  })
}
</script>

<template>
  <div class="min-h-screen p-8">
    <header class="max-w-2xl mx-auto mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">{{ exerciseName }}</h1>
        <p class="text-gray-600">(Listening Practice)</p>
      </div>
      <button
        class="text-gray-500 hover:text-gray-700 transition-colors"
        @click="goHome"
      >
        &larr; Back to Home
      </button>
    </header>

    <main class="max-w-2xl mx-auto">
      <div v-if="loading" class="text-center text-gray-500">Loading exercise...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-else class="space-y-6">
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="bg-white rounded-lg border border-gray-200 p-6"
        >
          <p class="text-sm text-gray-500 mb-2">Question {{ index + 1 }}</p>
          <div class="flex items-center gap-4 mb-4">
            <AudioPlayButton :text="question.japanese" />
            <p class="text-sm text-gray-400">Click to listen</p>
          </div>
          <input
            v-model="question.userAnswer"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Type English translation"
          />
        </div>

        <button
          class="w-full py-3 px-4 rounded-md font-medium transition-colors"
          :class="{
            'bg-purple-500 text-white hover:bg-purple-600': allAnswered,
            'bg-gray-200 text-gray-400 cursor-not-allowed': !allAnswered,
          }"
          :disabled="!allAnswered"
          @click="finishQuiz"
        >
          Finish Quiz
        </button>
      </div>
    </main>
  </div>
</template>
