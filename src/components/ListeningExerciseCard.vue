<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ListeningExercise, QuestionCount } from '../types'

const props = defineProps<{
  exercise: ListeningExercise
  isSelected: boolean
  isDimmed: boolean
}>()

const emit = defineEmits<{
  select: [exercise: ListeningExercise]
  start: [config: { exercise: ListeningExercise; questionCount: QuestionCount }]
}>()

const questionCount = ref<QuestionCount>(10)

const canStart = computed(() => questionCount.value)

function handleCardClick() {
  if (!props.isSelected) {
    emit('select', props.exercise)
  }
}

function handleStart() {
  if (questionCount.value) {
    emit('start', {
      exercise: props.exercise,
      questionCount: questionCount.value,
    })
  }
}
</script>

<template>
  <div
    class="rounded-lg border-2 p-6 cursor-pointer transition-all duration-200"
    :class="{
      'border-purple-500 bg-white shadow-lg': isSelected,
      'border-gray-200 bg-white hover:border-purple-300 hover:shadow': !isSelected && !isDimmed,
      'border-gray-200 bg-gray-100 opacity-50': isDimmed,
    }"
    @click="handleCardClick"
  >
    <div class="flex items-center gap-2 mb-2">
      <svg class="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
      </svg>
      <h3 class="text-lg font-semibold text-gray-800">{{ exercise.name }}</h3>
    </div>
    <p v-if="exercise.description" class="text-sm text-gray-500">{{ exercise.description }}</p>

    <div v-if="isSelected" class="mt-4 space-y-4" @click.stop>
      <div>
        <p class="text-sm font-medium text-gray-600 mb-2">Questions:</p>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="questionCount"
              :value="10"
              class="w-4 h-4 text-purple-500"
            />
            <span class="text-sm">10</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="questionCount"
              :value="20"
              class="w-4 h-4 text-purple-500"
            />
            <span class="text-sm">20</span>
          </label>
        </div>
      </div>

      <button
        class="w-full py-2 px-4 rounded-md font-medium transition-colors"
        :class="{
          'bg-purple-500 text-white hover:bg-purple-600': canStart,
          'bg-gray-200 text-gray-400 cursor-not-allowed': !canStart,
        }"
        :disabled="!canStart"
        @click="handleStart"
      >
        Start Listening Practice
      </button>
    </div>
  </div>
</template>
