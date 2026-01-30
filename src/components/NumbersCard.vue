<script setup lang="ts">
import { ref } from 'vue'
import type { NumberDirection } from '../types'

const props = defineProps<{
  isSelected: boolean
  isDimmed: boolean
}>()

const emit = defineEmits<{
  select: []
  start: [config: { direction: NumberDirection }]
}>()

const direction = ref<NumberDirection>('num-to-jp')

function handleCardClick() {
  if (!props.isSelected) {
    emit('select')
  }
}

function handleStart() {
  emit('start', { direction: direction.value })
}
</script>

<template>
  <div
    class="rounded-lg border-2 p-6 cursor-pointer transition-all duration-200"
    :class="{
      'border-amber-500 bg-white shadow-lg': isSelected,
      'border-gray-200 bg-white hover:border-amber-300 hover:shadow': !isSelected && !isDimmed,
      'border-gray-200 bg-gray-100 opacity-50': isDimmed,
    }"
    @click="handleCardClick"
  >
    <div class="flex items-center gap-2 mb-2">
      <svg class="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M5 5h2v14H5V5zm4 0h2v14H9V5zm4 0h2v14h-2V5zm4 0h2v14h-2V5z" />
      </svg>
      <h3 class="text-lg font-semibold text-gray-800">Numbers Speed Drill</h3>
    </div>
    <p class="text-sm text-gray-500">90-second challenge: numbers 1-99,999</p>

    <div v-if="isSelected" class="mt-4 space-y-4" @click.stop>
      <div>
        <p class="text-sm font-medium text-gray-600 mb-2">Direction:</p>
        <div class="flex gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="direction"
              value="num-to-jp"
              class="w-4 h-4 text-amber-500"
            />
            <span class="text-sm">Number &rarr; JP</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              v-model="direction"
              value="jp-to-num"
              class="w-4 h-4 text-amber-500"
            />
            <span class="text-sm">JP &rarr; Number</span>
          </label>
        </div>
      </div>

      <button
        class="w-full py-2 px-4 rounded-md font-medium transition-colors bg-amber-500 text-white hover:bg-amber-600"
        @click="handleStart"
      >
        Start Speed Drill
      </button>
    </div>
  </div>
</template>
