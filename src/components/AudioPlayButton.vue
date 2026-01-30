<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    lang?: string
  }>(),
  {
    lang: 'ja-JP',
  }
)

const isPlaying = ref(false)
const isSupported = ref(true)

let currentUtterance: SpeechSynthesisUtterance | null = null

onMounted(() => {
  isSupported.value = 'speechSynthesis' in window
})

onUnmounted(() => {
  if (currentUtterance) {
    window.speechSynthesis.cancel()
  }
})

function play() {
  if (!isSupported.value || isPlaying.value) return

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(props.text)
  utterance.lang = props.lang
  utterance.rate = 0.8

  // Try to find a Japanese voice
  const voices = window.speechSynthesis.getVoices()
  const japaneseVoice = voices.find((v) => v.lang.startsWith('ja'))
  if (japaneseVoice) {
    utterance.voice = japaneseVoice
  }

  utterance.onstart = () => {
    isPlaying.value = true
  }

  utterance.onend = () => {
    isPlaying.value = false
    currentUtterance = null
  }

  utterance.onerror = () => {
    isPlaying.value = false
    currentUtterance = null
  }

  currentUtterance = utterance
  window.speechSynthesis.speak(utterance)
}
</script>

<template>
  <button
    v-if="isSupported"
    type="button"
    class="inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors"
    :class="{
      'bg-purple-500 text-white hover:bg-purple-600': !isPlaying,
      'bg-purple-300 text-white cursor-not-allowed': isPlaying,
    }"
    :disabled="isPlaying"
    @click="play"
    :title="isPlaying ? 'Playing...' : 'Click to listen'"
  >
    <svg
      v-if="!isPlaying"
      class="w-6 h-6"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
    <svg
      v-else
      class="w-6 h-6 animate-pulse"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15V7l6 5-6 5z" />
    </svg>
  </button>
  <span v-else class="text-sm text-gray-400">Audio not supported</span>
</template>
