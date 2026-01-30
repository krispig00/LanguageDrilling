<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Question } from '../types'

const props = defineProps<{
  visible: boolean
  questions: Question[]
  selectedIndices: number[]
}>()

const emit = defineEmits<{
  confirm: [indices: number[]]
  cancel: []
}>()

const checkedIndices = ref<Set<number>>(new Set())

watch(
  () => props.visible,
  (isVisible) => {
    if (isVisible) {
      checkedIndices.value = new Set(
        props.selectedIndices.length > 0
          ? props.selectedIndices
          : props.questions.map((_, i) => i)
      )
    }
  }
)

const checkedCount = computed(() => checkedIndices.value.size)
function toggle(index: number) {
  const next = new Set(checkedIndices.value)
  if (next.has(index)) {
    next.delete(index)
  } else {
    next.add(index)
  }
  checkedIndices.value = next
}

function selectAll() {
  checkedIndices.value = new Set(props.questions.map((_, i) => i))
}

function deselectAll() {
  checkedIndices.value = new Set()
}

function confirm() {
  const indices = Array.from(checkedIndices.value).sort((a, b) => a - b)
  emit('confirm', indices)
}

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('cancel')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      @click="handleBackdropClick"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[80vh]">
        <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-800">Select Words</h2>
          <div class="flex gap-2">
            <button
              class="text-sm text-blue-500 hover:text-blue-700"
              @click="selectAll"
            >
              Select All
            </button>
            <span class="text-gray-300">|</span>
            <button
              class="text-sm text-blue-500 hover:text-blue-700"
              @click="deselectAll"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div class="overflow-y-auto flex-1 px-5 py-3">
          <label
            v-for="(q, index) in questions"
            :key="index"
            class="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
          >
            <input
              type="checkbox"
              :checked="checkedIndices.has(index)"
              class="w-4 h-4 text-blue-500 rounded"
              @change="toggle(index)"
            />
            <span class="text-sm text-gray-800">
              <span class="font-medium">{{ q.question }}</span>
              <span class="text-gray-400 mx-1">&mdash;</span>
              <span class="text-gray-500">{{ q.answer }}</span>
            </span>
          </label>
        </div>

        <div class="flex gap-3 px-5 py-4 border-t border-gray-200">
          <button
            class="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300 transition-colors"
            @click="$emit('cancel')"
          >
            Cancel
          </button>
          <button
            class="flex-1 py-2 px-4 rounded-md font-medium transition-colors"
            :class="{
              'bg-blue-500 text-white hover:bg-blue-600': checkedCount > 0,
              'bg-gray-200 text-gray-400 cursor-not-allowed': checkedCount === 0,
            }"
            :disabled="checkedCount === 0"
            @click="confirm"
          >
            Confirm ({{ checkedCount }})
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
