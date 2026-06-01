<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 18
  },
  strokeWidth: {
    type: Number,
    default: 1.8
  }
})

const iconStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`
}))
</script>

<template>
  <svg
    v-if="name === 'data-object'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M9 5H5v4" />
    <path d="M15 5h4v4" />
    <path d="M9 19H5v-4" />
    <path d="M15 19h4v-4" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </svg>
  <svg
    v-else-if="name === 'enhanced-encryption'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M12 3l7 4v5c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V7l7-4Z" />
    <path d="M9.5 12l1.5 1.5 3.5-3.5" />
  </svg>
  <svg
    v-else-if="name === 'dashboard'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="4" rx="1.5" />
    <rect x="14" y="10" width="7" height="11" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
  <svg
    v-else-if="name === 'code'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <polyline points="8 8 4 12 8 16" />
    <polyline points="16 8 20 12 16 16" />
    <line x1="13" y1="5" x2="11" y2="19" />
  </svg>
  <svg
    v-else-if="name === 'diff'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M8 5v14" />
    <path d="M16 5v14" />
    <path d="M5 8h6" />
    <path d="M5 16h6" />
    <path d="M13 12h6" />
  </svg>
  <svg
    v-else-if="name === 'lock'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 1 1 8 0v3" />
  </svg>
  <svg
    v-else-if="name === 'link'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L10.7 5.22" />
    <path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 1 0 7.07 7.07l1.41-1.41" />
  </svg>
  <svg
    v-else-if="name === 'image'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <circle cx="9" cy="10" r="1.5" />
    <path d="M21 16l-5-5-8 8" />
  </svg>
  <svg
    v-else-if="name === 'image-search'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <rect x="3" y="5" width="13" height="13" rx="2" />
    <circle cx="8" cy="10" r="1.5" />
    <path d="M16 16l-4-4-5 5" />
    <path d="M18 18l3 3" />
    <circle cx="18" cy="18" r="3" />
  </svg>
  <svg
    v-else-if="name === 'qr'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <path d="M14 14h3v3h-3z" />
    <path d="M19 14h2v2h-2z" />
    <path d="M17 17h4v4h-4z" />
  </svg>
  <svg
    v-else-if="name === 'password'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <circle cx="8" cy="12" r="3" />
    <path d="M11 12h10" />
    <path d="M18 12v3" />
    <path d="M15 12v2" />
  </svg>
  <svg
    v-else-if="name === 'terminal'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 9l3 3-3 3" />
    <path d="M13 15h4" />
  </svg>
  <svg
    v-else-if="name === 'integration'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <rect x="6" y="7" width="12" height="10" rx="2" />
    <path d="M9 17v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2" />
    <path d="M9 12h6" />
  </svg>
  <svg
    v-else-if="name === 'settings'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .15 1.7 1.7 0 0 0-.95 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-.95-1.55 1.7 1.7 0 0 0-1-.15 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.15-1 1.7 1.7 0 0 0-1.55-.95H2.9a2 2 0 1 1 0-4H3a1.7 1.7 0 0 0 1.55-.95 1.7 1.7 0 0 0 .15-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.15A1.7 1.7 0 0 0 10.95 2.9V2.9a2 2 0 1 1 4 0V3a1.7 1.7 0 0 0 .95 1.55 1.7 1.7 0 0 0 1 .15 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c0 .35.05.69.15 1a1.7 1.7 0 0 0 1.55.95h.09a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55.95c-.1.31-.15.65-.15 1Z" />
  </svg>
  <svg
    v-else-if="name === 'docs'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M7 4h8l4 4v12H7z" />
    <path d="M15 4v5h5" />
    <path d="M10 13h6" />
    <path d="M10 17h6" />
    <path d="M10 9h2" />
  </svg>
  <svg
    v-else-if="name === 'logout'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H4" />
  </svg>
  <svg
    v-else-if="name === 'arrow-right'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M8 6l6 6-6 6" />
  </svg>
  <svg
    v-else-if="name === 'search'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
  <svg
    v-else-if="name === 'copy'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
  <svg
    v-else-if="name === 'paste'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M9 3h6v3H9z" />
    <path d="M8 4H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
    <path d="M9 12h6" />
    <path d="M9 16h4" />
  </svg>
  <svg
    v-else-if="name === 'trash'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v5" />
    <path d="M14 11v5" />
  </svg>
  <svg
    v-else-if="name === 'share'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 10.7l6.8-4.4" />
    <path d="M8.6 13.3l6.8 4.4" />
  </svg>
  <svg
    v-else-if="name === 'bell'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M15 18H5l1.2-1.2A2 2 0 0 0 7 15.4V11a5 5 0 0 1 10 0v4.4a2 2 0 0 0 .8 1.6L19 18h-4" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
  <svg
    v-else-if="name === 'sparkles'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15.5l-1.8-4.7L5.5 9l4.7-1.3z" />
    <path d="M19 15l.7 1.8L21.5 18l-1.8.7L19 20.5l-.7-1.8L16.5 18l1.8-.7z" />
    <path d="M5 15l.6 1.4L7 17l-1.4.6L5 19l-.6-1.4L3 17l1.4-.6z" />
  </svg>
  <svg
    v-else-if="name === 'up'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M6 15l6-6 6 6" />
  </svg>
  <svg
    v-else-if="name === 'down'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
  <svg
    v-else-if="name === 'eye'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
  <svg
    v-else-if="name === 'history'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
    <path d="M12 7v6l4 2" />
  </svg>
  <svg
    v-else-if="name === 'download'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M12 4v10" />
    <path d="M8 10l4 4 4-4" />
    <path d="M5 20h14" />
  </svg>
  <svg
    v-else-if="name === 'bolt'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
  <svg
    v-else-if="name === 'plus'"
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
  <svg
    v-else
    :style="iconStyle"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    stroke-linejoin="round"
    :stroke-width="strokeWidth"
  >
    <circle cx="12" cy="12" r="8" />
  </svg>
</template>
