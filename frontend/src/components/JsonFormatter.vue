<script setup>
import { computed, ref, watch } from 'vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github-dark.css'
import { XMLBuilder, XMLParser } from 'fast-xml-parser'
import AppIcon from './AppIcon.vue'

hljs.registerLanguage('json', json)

const inputJson = ref('')
const outputContent = ref('')
const errorMessage = ref('')
const isMinified = ref(false)
const showCopySuccess = ref(false)
const inputType = ref('unknown')
const isSortEnabled = ref(false)

const statusItems = computed(() => [
  { label: '输入类型', value: inputType.value.toUpperCase() || 'UNKNOWN' },
  { label: '行数', value: `${processedOutput.value ? processedOutput.value.split('\n').length : 0}` },
  { label: '字节数', value: `${processedOutput.value.length}` }
])

const processedOutput = computed(() => {
  if (errorMessage.value) return ''

  if (isJson(outputContent.value)) {
    const parsed = JSON.parse(outputContent.value)
    return isMinified.value ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2)
  }

  return outputContent.value
})

watch(inputJson, (value) => {
  processInput(value)
})

watch(isSortEnabled, () => {
  if (inputJson.value.trim()) {
    processInput(inputJson.value)
  }
})

function sortObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map((item) => sortObjectKeys(item))

  const sorted = {}
  Object.keys(obj).sort().forEach((key) => {
    sorted[key] = sortObjectKeys(obj[key])
  })
  return sorted
}

function detectInputType(input) {
  if (!input.trim()) return 'unknown'

  const trimmed = input.trim()
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    try {
      const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false })
      parser.parse(input)
      return 'xml'
    } catch {
      // ignore
    }
  }

  try {
    JSON.parse(input)
    return 'json'
  } catch {
    return 'unknown'
  }
}

function processInput(input) {
  errorMessage.value = ''

  if (!input.trim()) {
    outputContent.value = ''
    inputType.value = 'unknown'
    return
  }

  inputType.value = detectInputType(input)

  try {
    if (inputType.value === 'xml') {
      const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false })
      const jsonObj = parser.parse(input)
      const keys = Object.keys(jsonObj)
      let result = keys.length === 1 ? jsonObj[keys[0]] : jsonObj
      if (isSortEnabled.value) {
        result = sortObjectKeys(result)
      }
      outputContent.value = JSON.stringify(result, null, 2)
      return
    }

    let parsed = JSON.parse(input)
    if (isSortEnabled.value) {
      parsed = sortObjectKeys(parsed)
    }
    outputContent.value = JSON.stringify(parsed, null, 2)
  } catch (error) {
    errorMessage.value = error.message || '输入格式错误'
    outputContent.value = ''
  }
}

function toggleMinify() {
  isMinified.value = !isMinified.value
}

function toggleFormat() {
  isMinified.value = false
  errorMessage.value = ''

  try {
    if (isJson(outputContent.value)) {
      if (inputType.value === 'json') {
        const parsed = JSON.parse(inputJson.value)
        const builder = new XMLBuilder({ format: true, ignoreAttributes: false })
        outputContent.value = builder.build({ root: parsed })
      } else {
        const parser = new XMLParser({ ignoreAttributes: false })
        const jsonObj = parser.parse(inputJson.value)
        const builder = new XMLBuilder({ format: true, ignoreAttributes: false })
        outputContent.value = builder.build(jsonObj)
      }
      return
    }

    if (inputType.value === 'xml') {
      const parser = new XMLParser({ ignoreAttributes: false })
      const jsonObj = parser.parse(inputJson.value)
      const keys = Object.keys(jsonObj)
      outputContent.value = JSON.stringify(keys.length === 1 ? jsonObj[keys[0]] : jsonObj, null, 2)
      return
    }

    const parsed = JSON.parse(inputJson.value)
    outputContent.value = JSON.stringify(parsed, null, 2)
  } catch (error) {
    errorMessage.value = error.message || '格式转换失败'
    outputContent.value = ''
  }
}

function clearAll() {
  inputJson.value = ''
  outputContent.value = ''
  errorMessage.value = ''
  inputType.value = 'unknown'
}

function copyToClipboard() {
  if (!processedOutput.value) return

  navigator.clipboard.writeText(processedOutput.value).then(() => {
    showCopySuccess.value = true
    window.setTimeout(() => {
      showCopySuccess.value = false
    }, 1800)
  }).catch((error) => {
    console.error('复制失败:', error)
  })
}

function isJson(code) {
  if (!code) return false

  try {
    JSON.parse(code)
    return true
  } catch {
    return false
  }
}

function highlightCode(code) {
  if (!code || !isJson(code)) return code
  return hljs.highlight(code, { language: 'json' }).value
}
</script>

<template>
  <div class="tool-page">
    <section class="tool-page__hero">
      <div>
        <p class="page-kicker">数据处理 / JSON 格式化</p>
        <h1 class="page-title">JSON 工作台</h1>
        <p class="page-subtitle">把格式化、压缩、排序和 XML 转换合并进同一画布里，让输入和结果始终保持并排可见。</p>
      </div>
      <div class="tool-page__hero-actions">
        <span class="page-chip">实时模式</span>
        <button class="icon-button" type="button" @click="copyToClipboard">
          <AppIcon name="copy" :size="16" />
        </button>
      </div>
    </section>

    <section class="workspace-card">
      <div class="workspace-card__header">
        <div>
          <h2>操作带</h2>
          <p>按 Stitch 原型重构为工作台式控制条，弱化表单感。</p>
        </div>
        <div class="json-actions">
          <button class="ghost-action" type="button" @click="clearAll">清空</button>
          <button class="ghost-action" type="button" @click="toggleMinify">
            {{ isMinified ? '格式化' : '压缩' }}
          </button>
          <button
            class="ghost-action"
            :class="{ 'json-actions__button--active': isSortEnabled }"
            type="button"
            @click="isSortEnabled = !isSortEnabled"
          >
            {{ isSortEnabled ? '排序已开' : 'ASCII 排序' }}
          </button>
          <button class="ghost-action" type="button" @click="toggleFormat">转 JSON / XML</button>
          <button class="primary-action" type="button" @click="processInput(inputJson)">
            <AppIcon name="sparkles" :size="15" />
            <span>格式化 JSON</span>
          </button>
        </div>
      </div>

      <div class="json-workbench">
        <article class="editor-pane">
          <div class="editor-pane__header">
            <div>
              <span class="editor-pane__eyebrow">输入</span>
              <strong>源内容</strong>
            </div>
            <span class="meta-pill">{{ inputType === 'unknown' ? '等待识别' : inputType.toUpperCase() }}</span>
          </div>
          <textarea
            v-model="inputJson"
            class="workspace-textarea editor-pane__textarea"
            :class="{ 'editor-pane__textarea--error': errorMessage }"
            placeholder="请输入 JSON 或 XML 内容……"
          ></textarea>
          <div v-if="errorMessage" class="editor-error">{{ errorMessage }}</div>
        </article>

        <article class="editor-pane">
          <div class="editor-pane__header">
            <div>
              <span class="editor-pane__eyebrow">输出</span>
              <strong>格式化结果</strong>
            </div>
            <button class="ghost-action editor-pane__copy" type="button" @click="copyToClipboard">复制</button>
          </div>
          <div class="code-view">
            <pre v-if="processedOutput"><code v-if="isJson(processedOutput)" v-html="highlightCode(processedOutput)"></code><code v-else>{{ processedOutput }}</code></pre>
            <div v-else class="code-view__placeholder">{{ errorMessage ? '当前输入存在错误。' : '结果会显示在这里。' }}</div>
          </div>
        </article>
      </div>

      <div class="status-row">
        <span v-for="item in statusItems" :key="item.label">{{ item.label }}: {{ item.value }}</span>
      </div>

      <div v-if="showCopySuccess" class="floating-toast">格式化结果已复制</div>
    </section>
  </div>
</template>

<style scoped>
.tool-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.tool-page__hero {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.tool-page__hero-actions {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.json-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.7rem;
}

.json-actions__button--active {
  background: rgba(128, 131, 255, 0.15);
}

.json-workbench {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1rem;
}

.editor-pane {
  min-width: 0;
  border-radius: 1.1rem;
  background: rgba(6, 14, 32, 0.6);
  overflow: hidden;
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

.editor-pane__textarea {
  min-height: 420px;
  border-radius: 0;
  box-shadow: inset 0 -2px 0 rgba(144, 143, 160, 0.2);
  border-top: 1px solid rgba(144, 143, 160, 0.04);
}

.editor-pane__textarea--error {
  box-shadow: inset 0 -2px 0 rgba(255, 180, 171, 0.9);
}

.editor-error {
  padding: 0.9rem 1rem 1rem;
  color: #ffb4ab;
  font-size: 0.84rem;
}

.editor-pane__copy {
  padding: 0.58rem 0.9rem;
}

.code-view {
  min-height: 420px;
  padding: 1.15rem;
  font-family: var(--font-mono);
  background: rgba(6, 14, 32, 0.92);
  overflow: auto;
}

.code-view pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.code-view :deep(code) {
  color: var(--color-text);
  font-family: var(--font-mono);
}

.code-view :deep(.hljs-string) {
  color: #86efac;
}

.code-view :deep(.hljs-number) {
  color: #7dd3fc;
}

.code-view :deep(.hljs-attr),
.code-view :deep(.hljs-keyword),
.code-view :deep(.hljs-literal) {
  color: #f9a8d4;
}

.code-view__placeholder {
  color: var(--color-text-faint);
}

.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.78rem;
  color: var(--color-text-faint);
}

@media (max-width: 960px) {
  .json-workbench {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .tool-page__hero,
  .workspace-card__header {
    flex-direction: column;
    align-items: stretch;
  }

  .json-actions {
    justify-content: flex-start;
  }
}
</style>
