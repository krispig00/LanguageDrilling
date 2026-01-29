<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { TopicData, QuizQuestion, Direction } from '../types'

const router = useRouter()
const route = useRoute()

const topicName = computed(() => route.query.topicName as string)
const direction = computed(() => route.query.direction as Direction)
const questionCount = computed(() => parseInt(route.query.count as string) || 10)
const directionLabel = computed(() =>
  direction.value === 'jp-to-en' ? 'JP \u2192 EN' : 'EN \u2192 JP'
)

const questions = ref<QuizQuestion[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const answeredCount = computed(() =>
  questions.value.filter((q) => q.userAnswer && q.userAnswer.trim() !== '').length
)

onMounted(async () => {
  try {
    const topicFile = route.query.topic as string
    const response = await fetch(`./data/${topicFile}`)
    const data: TopicData = await response.json()

    if (direction.value === 'jp-to-en') {
      // Build map of Japanese word -> all English translations
      const jpToEnMap = new Map<string, Set<string>>()
      for (const q of data.questions) {
        const jp = q.answer.toLowerCase()
        if (!jpToEnMap.has(jp)) {
          jpToEnMap.set(jp, new Set())
        }
        jpToEnMap.get(jp)!.add(q.question.toLowerCase())
      }

      // Deduplicate by Japanese word, then shuffle
      const uniqueByJp = new Map<string, typeof data.questions[0]>()
      for (const q of data.questions) {
        const jp = q.answer.toLowerCase()
        if (!uniqueByJp.has(jp)) {
          uniqueByJp.set(jp, q)
        }
      }
      const uniqueQuestions = Array.from(uniqueByJp.values())
      const shuffled = uniqueQuestions.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, questionCount.value)

      questions.value = selected.map((q) => {
        const jp = q.answer.toLowerCase()
        const allEnglish = Array.from(jpToEnMap.get(jp) || [])
        const primary = q.question
        const alternatives = allEnglish.filter((e) => e !== primary.toLowerCase())

        return {
          prompt: q.answer,
          answer: primary,
          alternatives: alternatives.length > 0 ? alternatives : q.alternatives,
          userAnswer: '',
        }
      })
    } else {
      // EN -> JP mode: straightforward
      const shuffled = [...data.questions].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, questionCount.value)

      questions.value = selected.map((q) => ({
        prompt: q.question,
        answer: q.answer,
        alternatives: q.alternatives,
        userAnswer: '',
      }))
    }
  } catch (e) {
    error.value = 'Failed to load questions'
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
    name: 'results',
    query: {
      topic: route.query.topic,
      topicName: topicName.value,
      direction: direction.value,
      questions: JSON.stringify(questions.value),
    },
  })
}
</script>

<template>
  <div class="min-h-screen p-8">
    <header class="max-w-2xl mx-auto mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">{{ topicName }}</h1>
        <p class="text-gray-600">({{ directionLabel }})</p>
      </div>
      <button
        class="text-gray-500 hover:text-gray-700 transition-colors"
        @click="goHome"
      >
        &larr; Back to Home
      </button>
    </header>

    <main class="max-w-2xl mx-auto">
      <div v-if="loading" class="text-center text-gray-500">Loading questions...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-else class="space-y-6">
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="bg-white rounded-lg border border-gray-200 p-6"
        >
          <p class="text-sm text-gray-500 mb-2">Question {{ index + 1 }}</p>
          <p class="text-xl font-medium text-gray-800 mb-4">{{ question.prompt }}</p>
          <input
            v-model="question.userAnswer"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your answer"
          />
        </div>

        <button
          class="w-full py-3 px-4 rounded-md font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600"
          @click="finishQuiz"
        >
          Finish Quiz ({{ answeredCount }}/{{ questions.length }} answered)
        </button>
      </div>
    </main>
  </div>
</template>
