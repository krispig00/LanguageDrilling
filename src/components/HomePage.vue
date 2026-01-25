<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Topic, TopicsConfig, Direction, QuestionCount } from '../types'
import TopicCard from './TopicCard.vue'

const router = useRouter()
const topics = ref<Topic[]>([])
const selectedTopic = ref<Topic | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const response = await fetch('./data/topics.json')
    const data: TopicsConfig = await response.json()
    topics.value = data.topics
  } catch (e) {
    error.value = 'Failed to load topics'
    console.error(e)
  } finally {
    loading.value = false
  }
})

function selectTopic(topic: Topic) {
  selectedTopic.value = topic
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    selectedTopic.value = null
  }
}

function startQuiz(config: { topic: Topic; direction: Direction; questionCount: QuestionCount }) {
  router.push({
    name: 'quiz',
    query: {
      topic: config.topic.file,
      topicName: config.topic.name,
      direction: config.direction,
      count: config.questionCount.toString(),
    },
  })
}
</script>

<template>
  <div class="min-h-screen p-8" @click="handleBackdropClick">
    <header class="max-w-4xl mx-auto mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Japanese Practice Drills</h1>
      <p class="text-gray-600 mt-2">Select a topic to practice</p>
    </header>

    <main class="max-w-4xl mx-auto">
      <div v-if="loading" class="text-center text-gray-500">Loading topics...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TopicCard
          v-for="topic in topics"
          :key="topic.file"
          :topic="topic"
          :is-selected="selectedTopic?.file === topic.file"
          :is-dimmed="selectedTopic !== null && selectedTopic.file !== topic.file"
          @select="selectTopic"
          @start="startQuiz"
        />
      </div>
    </main>
  </div>
</template>
