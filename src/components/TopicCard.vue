<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Topic, Direction, QuestionCount } from '../types'

const props = defineProps<{
  topic: Topic
  isSelected: boolean
  isDimmed: boolean
}>()

const emit = defineEmits<{
  select: [topic: Topic]
  start: [config: { topic: Topic; direction: Direction; questionCount: QuestionCount }]
}>()

const direction = ref<Direction>('en-to-jp')
const questionCount = ref<QuestionCount>(10)

const canStart = computed(() => direction.value && questionCount.value)

function handleCardClick() {
  if (!props.isSelected) {
    emit('select', props.topic)
  }
}

function handleStart() {
  if (direction.value && questionCount.value) {
    emit('start', {
      topic: props.topic,
      direction: direction.value,
      questionCount: questionCount.value,
    })
  }
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
        <div class="flex gap-4">
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
  </div>
</template>
