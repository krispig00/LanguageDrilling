<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Topic, Direction, QuestionCount, Question, TopicData } from '../types'
import WordSelectionModal from './WordSelectionModal.vue'

const props = defineProps<{
  topic: Topic
  isSelected: boolean
  isDimmed: boolean
}>()

const emit = defineEmits<{
  select: [topic: Topic]
  start: [config: { topic: Topic; direction: Direction; questionCount: QuestionCount; selectedIndices?: number[] }]
}>()

const direction = ref<Direction>('en-to-jp')
const questionCount = ref<QuestionCount>(10)

const showModal = ref(false)
const topicQuestions = ref<Question[]>([])
const selectedIndices = ref<number[]>([])
const questionsLoaded = ref(false)

const hasCustomSelection = computed(() => selectedIndices.value.length > 0)
const canStart = computed(() => direction.value && (hasCustomSelection.value || questionCount.value))

async function loadQuestions() {
  if (questionsLoaded.value) return
  const response = await fetch(`./data/${props.topic.file}`)
  const data: TopicData = await response.json()
  topicQuestions.value = data.questions
  questionsLoaded.value = true
}

async function openWordSelection() {
  await loadQuestions()
  showModal.value = true
}

function onModalConfirm(indices: number[]) {
  if (indices.length === topicQuestions.value.length) {
    selectedIndices.value = []
  } else {
    selectedIndices.value = indices
  }
  showModal.value = false
}

function clearSelection() {
  selectedIndices.value = []
}

function handleCardClick() {
  if (!props.isSelected) {
    emit('select', props.topic)
  }
}

function handleStart() {
  emit('start', {
    topic: props.topic,
    direction: direction.value,
    questionCount: questionCount.value,
    ...(hasCustomSelection.value ? { selectedIndices: selectedIndices.value } : {}),
  })
}
</script>

<template>
  <div
    class="rounded-lg border-2 p-6 cursor-pointer transition-all duration-200"
    :class="{
      'border-blue-500 bg-white shadow-lg': isSelected,
      'border-gray-200 bg-white hover:border-gray-300 hover:shadow': !isSelected && !isDimmed,
      'border-gray-200 bg-gray-100 opacity-50': isDimmed,
    }"
    @click="handleCardClick"
  >
    <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ topic.name }}</h3>

    <div v-if="isSelected" class="mt-4 space-y-4" @click.stop>
      <div>
        <p class="text-sm font-medium text-gray-600 mb-2">Direction:</p>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="direction"
              value="jp-to-en"
              class="w-4 h-4 text-blue-500"
            />
            <span class="text-sm">JP &rarr; EN</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="direction"
              value="en-to-jp"
              class="w-4 h-4 text-blue-500"
            />
            <span class="text-sm">EN &rarr; JP</span>
          </label>
        </div>
      </div>

      <div>
        <p class="text-sm font-medium text-gray-600 mb-2">Questions:</p>
        <div v-if="!hasCustomSelection" class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="questionCount"
              :value="10"
              class="w-4 h-4 text-blue-500"
            />
            <span class="text-sm">10</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="questionCount"
              :value="20"
              class="w-4 h-4 text-blue-500"
            />
            <span class="text-sm">20</span>
          </label>
        </div>
        <div v-else class="flex items-center gap-2">
          <span class="text-sm text-blue-600 font-medium">{{ selectedIndices.length }} words selected</span>
          <button
            class="text-gray-400 hover:text-gray-600 text-sm"
            title="Clear selection"
            @click="clearSelection"
          >
            &times;
          </button>
        </div>
      </div>

      <div>
        <button
          class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          @click="openWordSelection"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Choose specific words
        </button>
      </div>

      <button
        class="w-full py-2 px-4 rounded-md font-medium transition-colors"
        :class="{
          'bg-blue-500 text-white hover:bg-blue-600': canStart,
          'bg-gray-200 text-gray-400 cursor-not-allowed': !canStart,
        }"
        :disabled="!canStart"
        @click="handleStart"
      >
        Start Quiz
      </button>
    </div>

    <WordSelectionModal
      :visible="showModal"
      :questions="topicQuestions"
      :selected-indices="selectedIndices"
      @confirm="onModalConfirm"
      @cancel="showModal = false"
    />
  </div>
</template>
