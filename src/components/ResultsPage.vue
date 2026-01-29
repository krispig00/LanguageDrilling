<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { QuizQuestion, Direction } from '../types'

const router = useRouter()
const route = useRoute()

const topicName = computed(() => route.query.topicName as string)
const direction = computed(() => route.query.direction as Direction)
const directionLabel = computed(() =>
  direction.value === 'jp-to-en' ? 'JP \u2192 EN' : 'EN \u2192 JP'
)

const questions = computed<QuizQuestion[]>(() => {
  try {
    return JSON.parse(route.query.questions as string)
  } catch {
    return []
  }
})

function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(/\s*\(\s*/g, '(')  // Remove spaces around opening paren
    .replace(/\s*\)\s*/g, ')')  // Remove spaces around closing paren
    .replace(/\s+/g, ' ')       // Collapse multiple spaces to one
}

function checkAnswer(question: QuizQuestion): boolean {
  const userAnswer = normalizeAnswer(question.userAnswer || '')
  const correctAnswer = normalizeAnswer(question.answer)

  if (userAnswer === correctAnswer) return true

  if (question.alternatives) {
    return question.alternatives.some((alt) => normalizeAnswer(alt) === userAnswer)
  }

  return false
}

function isSkipped(question: QuizQuestion): boolean {
  return !question.userAnswer || question.userAnswer.trim() === ''
}

const results = computed(() =>
  questions.value.map((q) => ({
    question: q,
    isCorrect: checkAnswer(q),
    skipped: isSkipped(q),
  }))
)

const correctCount = computed(() => results.value.filter((r) => r.isCorrect).length)
const totalCount = computed(() => results.value.length)

function goHome() {
  router.push({ name: 'home' })
}

function quizAgain() {
  router.push({
    name: 'quiz',
    query: {
      topic: route.query.topic,
      topicName: topicName.value,
      direction: direction.value,
      count: totalCount.value.toString(),
    },
  })
}
</script>

<template>
  <div class="min-h-screen p-8">
    <header class="max-w-2xl mx-auto mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Results</h1>
      <p class="text-gray-600">{{ topicName }} ({{ directionLabel }})</p>
    </header>

    <main class="max-w-2xl mx-auto">
      <div class="space-y-4">
        <div
          v-for="(result, index) in results"
          :key="index"
          class="rounded-lg border-2 p-4"
          :class="{
            'border-green-300 bg-green-50': result.isCorrect,
            'border-gray-300 bg-gray-50': result.skipped,
            'border-red-300 bg-red-50': !result.isCorrect && !result.skipped,
          }"
        >
          <div class="flex items-start gap-3">
            <span
              class="text-xl"
              :class="{
                'text-green-600': result.isCorrect,
                'text-gray-400': result.skipped,
                'text-red-600': !result.isCorrect && !result.skipped,
              }"
            >
              {{ result.isCorrect ? '\u2713' : result.skipped ? '\u2014' : '\u2717' }}
            </span>
            <div class="flex-1">
              <p class="font-medium text-gray-800">{{ result.question.prompt }}</p>
              <p v-if="result.skipped" class="text-sm text-gray-500 mt-1 italic">
                Skipped
              </p>
              <p v-else class="text-sm text-gray-600 mt-1">
                Your answer: <span class="font-medium">{{ result.question.userAnswer }}</span>
              </p>
              <p v-if="!result.isCorrect" class="text-sm text-green-700 mt-1">
                Correct answer: <span class="font-medium">{{ result.question.answer }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6 mt-6 text-center">
        <p class="text-4xl font-bold text-gray-800">
          {{ correctCount }}/{{ totalCount }}
        </p>
        <p class="text-gray-600">correct answers</p>
      </div>

      <div class="flex gap-4 mt-6">
        <button
          class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
          @click="goHome"
        >
          Return to Home
        </button>
        <button
          class="flex-1 py-3 px-4 bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors"
          @click="quizAgain"
        >
          Quiz Again
        </button>
      </div>
    </main>
  </div>
</template>
