<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { ListeningQuizQuestion } from '../types'
import AudioPlayButton from './AudioPlayButton.vue'

const router = useRouter()
const route = useRoute()

const exerciseName = computed(() => route.query.exerciseName as string)

const questions = computed<ListeningQuizQuestion[]>(() => {
  try {
    return JSON.parse(route.query.questions as string)
  } catch {
    return []
  }
})

function goHome() {
  router.push({ name: 'home' })
}

function practiceAgain() {
  router.push({
    name: 'listening-quiz',
    query: {
      exercise: route.query.exercise,
      exerciseName: exerciseName.value,
      count: questions.value.length.toString(),
    },
  })
}
</script>

<template>
  <div class="min-h-screen p-8">
    <header class="max-w-2xl mx-auto mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Results</h1>
      <p class="text-gray-600">{{ exerciseName }} (Listening Practice)</p>
    </header>

    <main class="max-w-2xl mx-auto">
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <p class="text-purple-800 text-sm">
          Self-assessment: Compare your answers with the correct translations below.
        </p>
      </div>

      <div class="space-y-4">
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="rounded-lg border-2 border-gray-200 bg-white p-4"
        >
          <div class="flex items-start gap-4">
            <AudioPlayButton :text="question.japanese" />
            <div class="flex-1">
              <p class="font-medium text-gray-800 mb-1">{{ question.japanese }}</p>
              <p class="text-sm text-gray-600">
                Your answer: <span class="font-medium">{{ question.userAnswer }}</span>
              </p>
              <p class="text-sm text-green-700 mt-1">
                Correct: <span class="font-medium">{{ question.english }}</span>
              </p>
              <p v-if="question.notes" class="text-sm text-gray-400 mt-1 italic">
                {{ question.notes }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-4 mt-6">
        <button
          class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
          @click="goHome"
        >
          Return to Home
        </button>
        <button
          class="flex-1 py-3 px-4 bg-purple-500 text-white rounded-md font-medium hover:bg-purple-600 transition-colors"
          @click="practiceAgain"
        >
          Practice Again
        </button>
      </div>
    </main>
  </div>
</template>
