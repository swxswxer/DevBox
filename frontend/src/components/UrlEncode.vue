<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const inputText = ref('')
const outputText = ref('')
const mode = ref('encode')
const showCopySuccess = ref(false)

const stats = computed(() => [
  { label: '当前模式', value: mode.value === 'encode' ? 'URL 编码' : 'URL 解码' },
  { label: '输入长度', value: `${inputText.value.length}` },
  { label: '输出长度', value: `${outputText.value.length}` }
])

function transform() {
  if (!inputText.value.trim()) {
    outputText.value = ''
    return
  }

  try {
    outputText.value = mode.value === 'encode'
      ? encodeURIComponent(inputText.value)
      : decodeURIComponent(inputText.value)
  } catch (error) {
    outputText.value = mode.value === 'encode'
      ? `编码失败: ${error.message}`
      : '解码失败: 无效的 URL 编码字符串'
  }
}

function clearAll() {
  inputText.value = ''
  outputText.value = ''
}

function exchange() {
  inputText.value = outputText.value
  outputText.value = ''
}

function copyToClipboard() {
  if (!outputText.value) return

  navigator.clipboard.writeText(outputText.value).then(() => {
    showCopySuccess.value = true
    window.setTimeout(() => {
      showCopySuccess.value = false
    }, 1800)
  }).catch((error) => {
    console.error('复制失败:', error)
  })
}
</script>

<template>
  <div class="tool-page">
    <section class="tool-page__hero">
      <div>
        <p class="page-kicker">文本处理 / URL 编解码</p>
        <h1 class="page-title">URL 安全字符串转换</h1>
        <p class="page-subtitle">把输入、结果和模式切换压进一条连续的工作流里，适合快速处理回调地址、查询参数和签名内容。</p>
      </div>
      <div class="tool-page__hero-actions">
        <button class="ghost-action" type="button" @click="copyToClipboard">复制结果</button>
      </div>
    </section>

    <section class="workspace-card">
      <div class="url-grid">
        <article class="editor-pane">
          <div class="editor-pane__header">
            <div>
              <span class="editor-pane__eyebrow">输入</span>
              <strong>原始文本</strong>
            </div>
            <span class="meta-pill">{{ mode === 'encode' ? '原文' : '已编码' }}</span>
          </div>
          <textarea
            v-model="inputText"
            class="workspace-textarea"
            placeholder="请在此输入 URL 或任意文本……"
          ></textarea>
        </article>

        <article class="editor-pane">
          <div class="editor-pane__header">
            <div>
              <span class="editor-pane__eyebrow">输出</span>
              <strong>处理结果</strong>
            </div>
            <button class="ghost-action editor-pane__copy" type="button" @click="copyToClipboard">复制</button>
          </div>
          <div class="output-view">
            <span v-if="outputText">{{ outputText }}</span>
            <span v-else class="output-view__placeholder">转换结果会显示在这里……</span>
          </div>
        </article>
      </div>

      <div class="negative-divider"></div>

      <div class="url-toolbar">
        <div class="toolbar-group">
          <span class="toolbar-label">转换模式</span>
          <div class="toggle-pills">
            <button
              class="toggle-pill"
              :class="{ 'toggle-pill--active': mode === 'encode' }"
              type="button"
              @click="mode = 'encode'"
            >
              地址编码
            </button>
            <button
              class="toggle-pill"
              :class="{ 'toggle-pill--active': mode === 'decode' }"
              type="button"
              @click="mode = 'decode'"
            >
              地址解码
            </button>
          </div>
        </div>

        <div class="toolbar-actions">
          <button class="ghost-action" type="button" @click="exchange">交换内容</button>
          <button class="ghost-action" type="button" @click="clearAll">清空</button>
          <button class="primary-action" type="button" @click="transform">
            <AppIcon name="sparkles" :size="15" />
            <span>{{ mode === 'encode' ? 'URL 编码' : 'URL 解码' }}</span>
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <article v-for="item in stats" :key="item.label" class="stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </div>

      <div v-if="showCopySuccess" class="floating-toast">结果已复制</div>
    </section>
  </div>
</template>

<style scoped>
.tool-page {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

.tool-page__hero {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.url-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.editor-pane {
  overflow: hidden;
  border-radius: 1.1rem;
  background: rgba(6, 14, 32, 0.64);
  border: 1px solid rgba(144, 143, 160, 0.08);
}

.editor-pane__header {
  padding: 1rem 1rem 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.editor-pane__eyebrow {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.72rem;
  color: var(--color-text-faint);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.editor-pane__copy {
  padding: 0.58rem 0.9rem;
}

.output-view {
  min-height: 190px;
  padding: 0.95rem;
  font-family: var(--font-mono);
  line-height: 1.7;
  background: rgba(6, 14, 32, 0.9);
  word-break: break-all;
  white-space: pre-wrap;
}

.output-view__placeholder {
  color: var(--color-text-faint);
}

.url-toolbar {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.toolbar-group {
  display: grid;
  gap: 0.65rem;
}

.toolbar-label {
  font-size: 0.74rem;
  letter-spacing: 0.12em;
  color: var(--color-text-faint);
  text-transform: uppercase;
}

.toggle-pills {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.toggle-pill {
  border: 0;
  border-radius: 0.9rem;
  padding: 0.72rem 1rem;
  background: rgba(45, 52, 73, 0.48);
  color: var(--color-text-muted);
  cursor: pointer;
}

.toggle-pill--active {
  background: rgba(255, 183, 131, 0.18);
  color: var(--color-tertiary);
}

.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.stat-card {
  border-radius: 1rem;
  padding: 1rem 1.1rem;
  background: rgba(23, 31, 51, 0.78);
  border: 1px solid rgba(144, 143, 160, 0.1);
  display: grid;
  gap: 0.35rem;
}

.stat-card span {
  font-size: 0.74rem;
  color: var(--color-text-faint);
}

.stat-card strong {
  font-size: 1rem;
}

@media (max-width: 960px) {
  .url-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-height: 920px) {
  .tool-page {
    gap: 0.7rem;
  }

  .url-grid,
  .stats-grid {
    gap: 0.7rem;
  }

  .output-view {
    min-height: 140px;
  }
}

@media (max-width: 720px) {
  .tool-page__hero {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
