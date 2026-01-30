<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Topic, TopicsConfig, Direction, QuestionCount, ListeningExercise, ListeningExercisesConfig, NumberDirection } from '../types'
import TopicCard from './TopicCard.vue'
import ListeningExerciseCard from './ListeningExerciseCard.vue'
import NumbersCard from './NumbersCard.vue'

const router = useRouter()
const topics = ref<Topic[]>([])
const listeningExercises = ref<ListeningExercise[]>([])
const selectedTopic = ref<Topic | null>(null)
const selectedListeningExercise = ref<ListeningExercise | null>(null)
const selectedMiscExercise = ref<string | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const [topicsResponse, listeningResponse] = await Promise.all([
      fetch('./data/topics.json'),
      fetch('./data/listening-exercises.json'),
    ])
    const topicsData: TopicsConfig = await topicsResponse.json()
    const listeningData: ListeningExercisesConfig = await listeningResponse.json()
    topics.value = topicsData.topics
    listeningExercises.value = listeningData.exercises
  } catch (e) {
    error.value = 'Failed to load data'
    console.error(e)
  } finally {
    loading.value = false
  }
})

function selectTopic(topic: Topic) {
  selectedTopic.value = topic
  selectedListeningExercise.value = null
  selectedMiscExercise.value = null
}

function selectListeningExercise(exercise: ListeningExercise) {
  selectedListeningExercise.value = exercise
  selectedTopic.value = null
  selectedMiscExercise.value = null
}

function selectMiscExercise(exercise: string) {
  selectedMiscExercise.value = exercise
  selectedTopic.value = null
  selectedListeningExercise.value = null
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    selectedTopic.value = null
    selectedListeningExercise.value = null
    selectedMiscExercise.value = null
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

function startListeningQuiz(config: { exercise: ListeningExercise; questionCount: QuestionCount }) {
  router.push({
    name: 'listening-quiz',
    query: {
      exercise: config.exercise.file,
      exerciseName: config.exercise.name,
      count: config.questionCount.toString(),
    },
  })
}

function startNumbersDrill(config: { direction: NumberDirection }) {
  router.push({
    name: 'numbers-speed-drill',
    query: {
      direction: config.direction,
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
      <div v-if="loading" class="text-center text-gray-500">Loading...</div>
      <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
      <div v-else>
        <!-- Vocabulary Section -->
        <section class="mb-12">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-1 h-6 bg-blue-500 rounded"></div>
            <h2 class="text-xl font-semibold text-gray-700">Vocabulary Drills</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TopicCard
              v-for="topic in topics"
              :key="topic.file"
              :topic="topic"
              :is-selected="selectedTopic?.file === topic.file"
              :is-dimmed="(selectedTopic !== null || selectedListeningExercise !== null || selectedMiscExercise !== null) && selectedTopic?.file !== topic.file"
              @select="selectTopic"
              @start="startQuiz"
            />
          </div>
        </section>

        <!-- Listening Section -->
        <section class="mb-12">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-1 h-6 bg-purple-500 rounded"></div>
            <h2 class="text-xl font-semibold text-gray-700">Listening Practice</h2>
          </div>
          <p class="text-sm text-gray-500 mb-4">Listen to Japanese audio and type the English translation</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ListeningExerciseCard
              v-for="exercise in listeningExercises"
              :key="exercise.file"
              :exercise="exercise"
              :is-selected="selectedListeningExercise?.file === exercise.file"
              :is-dimmed="(selectedTopic !== null || selectedListeningExercise !== null || selectedMiscExercise !== null) && selectedListeningExercise?.file !== exercise.file"
              @select="selectListeningExercise"
              @start="startListeningQuiz"
            />
          </div>
        </section>

        <!-- Misc Section -->
        <section>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-1 h-6 bg-amber-500 rounded"></div>
            <h2 class="text-xl font-semibold text-gray-700">Misc</h2>
          </div>
          <p class="text-sm text-gray-500 mb-4">Timed challenges and special exercises</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NumbersCard
              :is-selected="selectedMiscExercise === 'numbers'"
              :is-dimmed="(selectedTopic !== null || selectedListeningExercise !== null || selectedMiscExercise !== null) && selectedMiscExercise !== 'numbers'"
              @select="selectMiscExercise('numbers')"
              @start="startNumbersDrill"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
