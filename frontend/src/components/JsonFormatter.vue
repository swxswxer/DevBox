<script setup>
import { ref, computed, watch, onMounted, onActivated, onDeactivated, onBeforeUnmount, nextTick } from 'vue'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github.css'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

// 注册JSON语言
hljs.registerLanguage('json', json)

// 响应式数据
const inputJson = ref('')
const outputContent = ref('')
const errorMessage = ref('')
const isMinified = ref(false)
const showCopySuccess = ref(false)
const inputType = ref('unknown') // json/xml/unknown
const isSortEnabled = ref(false) // 是否启用ASCII排序
const isSearchVisible = ref(false)
const searchQuery = ref('')
const activeMatchIndex = ref(0)
const searchInputRef = ref(null)
const outputRef = ref(null)

// 计算属性：处理后的输出内容
const processedOutput = computed(() => {
  if (errorMessage.value) return ''
  
  if (isJson(outputContent.value)) {
    // 是JSON格式
    if (isMinified.value) {
      // 压缩模式
      const parsed = JSON.parse(outputContent.value)
      return JSON.stringify(parsed)
    } else {
      // 格式化模式
      return outputContent.value
    }
  } else {
    // 不是JSON格式，视为XML
    return outputContent.value
  }
})

const searchMatches = computed(() => {
  if (!searchQuery.value || !processedOutput.value) return []

  const query = searchQuery.value.toLowerCase()
  const content = processedOutput.value.toLowerCase()
  const matches = []
  let index = content.indexOf(query)

  while (index !== -1) {
    matches.push({
      start: index,
      end: index + query.length
    })
    index = content.indexOf(query, index + query.length)
  }

  return matches
})

const highlightedSearchOutput = computed(() => {
  if (!processedOutput.value) return ''
  if (!searchQuery.value || searchMatches.value.length === 0) {
    return escapeHtml(processedOutput.value)
  }

  let result = ''
  let cursor = 0
  searchMatches.value.forEach((match, index) => {
    result += escapeHtml(processedOutput.value.slice(cursor, match.start))
    const activeClass = index === activeMatchIndex.value ? ' active' : ''
    result += `<mark class="search-match${activeClass}">${escapeHtml(processedOutput.value.slice(match.start, match.end))}</mark>`
    cursor = match.end
  })
  result += escapeHtml(processedOutput.value.slice(cursor))

  return result
})

const searchCounter = computed(() => {
  if (!searchQuery.value) return '0/0'
  if (searchMatches.value.length === 0) return '0/0'
  return `${activeMatchIndex.value + 1}/${searchMatches.value.length}`
})

// 递归排序对象键（ASCII顺序）
function sortObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sortObjectKeys(item))
  }
  
  const sortedKeys = Object.keys(obj).sort()
  const sortedObj = {}
  for (const key of sortedKeys) {
    sortedObj[key] = sortObjectKeys(obj[key])
  }
  return sortedObj
}

// 监听输入变化，实时处理
watch(inputJson, (newValue) => {
  processInput(newValue)
})

// 监听排序开关变化
watch(isSortEnabled, () => {
  if (inputJson.value.trim()) {
    processInput(inputJson.value)
  }
})

watch([searchQuery, processedOutput], () => {
  activeMatchIndex.value = 0
  scrollToActiveMatch()
})

watch(activeMatchIndex, () => {
  scrollToActiveMatch()
})

// 检测输入类型
function detectInputType(input) {
  if (!input.trim()) return 'unknown'
  
  // 尝试检测XML
  const trimmed = input.trim()
  if (trimmed.startsWith('<') && trimmed.endsWith('>')) {
    try {
      const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false })
      parser.parse(input)
      return 'xml'
    } catch {
      // 不是有效的XML
    }
  }
  
  // 尝试检测JSON
  try {
    JSON.parse(input)
    return 'json'
  } catch {
    // 不是有效的JSON
  }
  
  return 'unknown'
}

// 处理输入
function processInput(input) {
  errorMessage.value = ''
  
  if (!input.trim()) {
    outputContent.value = ''
    inputType.value = 'unknown'
    return
  }
  
  // 检测输入类型
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
    } else if (inputType.value === 'json') {
      let parsed = JSON.parse(input)
      if (isSortEnabled.value) {
        parsed = sortObjectKeys(parsed)
      }
      outputContent.value = JSON.stringify(parsed, null, 2)
    } else {
      try {
        let parsed = JSON.parse(input)
        if (isSortEnabled.value) {
          parsed = sortObjectKeys(parsed)
        }
        outputContent.value = JSON.stringify(parsed, null, 2)
      } catch {
        errorMessage.value = '输入格式错误'
        outputContent.value = ''
      }
    }
  } catch (error) {
    errorMessage.value = error.message
    outputContent.value = ''
  }
}

// 切换压缩/格式化
function toggleMinify() {
  isMinified.value = !isMinified.value
  if (!errorMessage.value && inputJson.value.trim()) {
    processInput(inputJson.value)
  }
}

// 切换JSON/XML格式
function toggleFormat() {
  isMinified.value = false // 切换格式时重置压缩状态
  
  try {
    if (isJson(outputContent.value)) {
      // 是JSON格式，转换为XML
      if (inputType.value === 'json') {
        // JSON转XML
        const parsed = JSON.parse(inputJson.value)
        const builder = new XMLBuilder({ format: true, ignoreAttributes: false })
        outputContent.value = builder.build({ root: parsed })
      } else if (inputType.value === 'xml') {
        // XML转XML
        const parser = new XMLParser({ ignoreAttributes: false })
        const jsonObj = parser.parse(inputJson.value)
        const builder = new XMLBuilder({ format: true, ignoreAttributes: false })
        outputContent.value = builder.build(jsonObj)
      }
    } else {
      // 不是JSON格式，视为XML，转换为JSON
      if (inputType.value === 'json') {
        // JSON转JSON
        const parsed = JSON.parse(inputJson.value)
        outputContent.value = JSON.stringify(parsed, null, 2)
      } else if (inputType.value === 'xml') {
        // XML转JSON
        const parser = new XMLParser({ ignoreAttributes: false })
        const jsonObj = parser.parse(inputJson.value)
        // 移除根节点，直接返回根节点内部的内容
        const keys = Object.keys(jsonObj)
        if (keys.length === 1) {
          outputContent.value = JSON.stringify(jsonObj[keys[0]], null, 2)
        } else {
          outputContent.value = JSON.stringify(jsonObj, null, 2)
        }
      }
    }
  } catch (error) {
    errorMessage.value = error.message
    outputContent.value = ''
  }
}

// 清空所有内容
function clearAll() {
  inputJson.value = ''
  outputContent.value = ''
  errorMessage.value = ''
}

// 复制到剪贴板
function copyToClipboard() {
  if (processedOutput.value) {
    navigator.clipboard.writeText(processedOutput.value).then(() => {
      showCopySuccess.value = true
      setTimeout(() => {
        showCopySuccess.value = false
      }, 2000)
    }).catch(err => {
      console.error('复制失败:', err)
    })
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function openSearch() {
  isSearchVisible.value = true
  nextTick(() => {
    searchInputRef.value?.focus()
    searchInputRef.value?.select()
  })
}

function closeSearch() {
  isSearchVisible.value = false
  searchQuery.value = ''
  activeMatchIndex.value = 0
}

function goToNextMatch() {
  if (searchMatches.value.length === 0) return
  activeMatchIndex.value = (activeMatchIndex.value + 1) % searchMatches.value.length
}

function goToPreviousMatch() {
  if (searchMatches.value.length === 0) return
  activeMatchIndex.value = (activeMatchIndex.value - 1 + searchMatches.value.length) % searchMatches.value.length
}

function handleSearchKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    if (event.shiftKey) {
      goToPreviousMatch()
    } else {
      goToNextMatch()
    }
  } else if (event.key === 'Escape') {
    event.preventDefault()
    closeSearch()
  }
}

function handleGlobalKeydown(event) {
  const isFindShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'f'
  if (!isFindShortcut) return

  event.preventDefault()
  openSearch()
}

async function scrollToActiveMatch() {
  await nextTick()
  const activeMatch = outputRef.value?.querySelector('.search-match.active')
  activeMatch?.scrollIntoView({
    block: 'center',
    inline: 'nearest'
  })
}

// 判断是否为JSON格式
function isJson(code) {
  if (!code) return false
  try {
    JSON.parse(code)
    return true
  } catch {
    return false
  }
}

// 高亮处理
function highlightCode(code) {
  if (!code) return ''
  if (isJson(code)) {
    // 是JSON格式，使用JSON高亮
    return hljs.highlight(code, { language: 'json' }).value
  } else {
    // 不是JSON格式，视为XML，返回原始内容
    return code
  }
}

// 初始化
onMounted(() => {
  // 示例JSON
  inputJson.value = ``
})

onActivated(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onDeactivated(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div class="json-formatter-container">
    <!-- 主要内容区 -->
    <div class="main-content">
      <!-- 左侧输入区 -->
      <div class="input-section">
        <div class="section-header">
          <h3>JSON/XML 输入</h3>
        </div>
        <textarea
          v-model="inputJson"
          class="json-input"
          placeholder="请输入 JSON 或 XML 内容..."
          :class="{ 'has-error': errorMessage }"
        ></textarea>
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
      
      <!-- 右侧输出区 -->
      <div class="output-section">
        <div class="section-header">
          <h3>格式化输出</h3>
          <div class="header-actions">
            <button
              class="copy-button"
              @click="openSearch"
              :disabled="!processedOutput"
              title="Ctrl/Command + F"
            >
              查找
            </button>
            <button
                class="copy-button"
                @click="copyToClipboard"
                :disabled="!processedOutput"
            >
              复制
            </button>
          </div>
        </div>
        <div v-if="isSearchVisible" class="search-bar">
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            class="search-input"
            placeholder="查找格式化结果..."
            @keydown="handleSearchKeydown"
          />
          <span class="search-counter">{{ searchCounter }}</span>
          <button class="search-button" @click="goToPreviousMatch" :disabled="searchMatches.length === 0">上一个</button>
          <button class="search-button" @click="goToNextMatch" :disabled="searchMatches.length === 0">下一个</button>
          <button class="search-close" @click="closeSearch">×</button>
        </div>
        <div ref="outputRef" class="json-output">
          <pre v-if="processedOutput"><code v-if="searchQuery" v-html="highlightedSearchOutput"></code><code v-else-if="isJson(processedOutput)" v-html="highlightCode(processedOutput)"></code><code v-else>{{ processedOutput }}</code></pre>
          <div v-else class="empty-output">
            {{ errorMessage ? '输入格式错误' : '请在左侧输入内容' }}
          </div>
        </div>
        <div v-if="showCopySuccess" class="copy-success">
          复制成功！
        </div>
      </div>
    </div>
    
    <!-- 底部按钮区 -->
    <div class="button-section">
      <button 
        class="action-button"
        @click="toggleMinify"
        :disabled="errorMessage || !inputJson.trim()"
      >
        {{ isMinified ? '格式化' : '压缩' }}
      </button>
      <button 
            class="action-button"
            @click="toggleFormat"
            :disabled="errorMessage || !inputJson.trim()"
          >
            转json/xml
          </button>
      <button 
        class="action-button"
        :class="{ 'active': isSortEnabled }"
        @click="isSortEnabled = !isSortEnabled"
        :disabled="errorMessage || !inputJson.trim()"
      >
        {{ isSortEnabled ? '排序: 开' : '排序: 关' }}
      </button>
      <button 
        class="action-button clear-button"
        @click="clearAll"
      >
        清空
      </button>
    </div>
  </div>
</template>

<style scoped>
.json-formatter-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.main-content {
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
  min-height: 0;
}

.input-section,
.output-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  height: 48px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.section-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.copy-button {
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-button:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.copy-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 30px;
  padding: 4px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 12px;
  outline: none;
}

.search-input:focus {
  border-color: #1890ff;
}

.search-counter {
  min-width: 44px;
  color: #666;
  font-size: 12px;
  text-align: center;
}

.search-button,
.search-close {
  height: 30px;
  padding: 0 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  font-size: 12px;
}

.search-button:hover:not(:disabled),
.search-close:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.search-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.json-input {
  flex: 1;
  width: 100%;
  padding: 16px;
  border: none;
  resize: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  background-color: #fafafa;
  overflow-y: auto;
  min-height: 0;
}

.json-input:focus {
  outline: none;
  background-color: #fff;
}

.json-input.has-error {
  border-left: 3px solid #ff4d4f;
}

.error-message {
  padding: 8px 16px;
  background-color: #fff1f0;
  color: #ff4d4f;
  font-size: 12px;
  border-top: 1px solid #ffccc7;
  flex-shrink: 0;
}

.json-output {
  flex: 1;
  padding: 16px;
  background-color: #fafafa;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  text-align: left;
  min-height: 0;
}

.json-output pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  text-align: left;
}



/* 自定义 JSON 高亮样式 */
:deep(.json-output code) {
  color: #333 !important;
}
:deep(.json-output code .hljs-string) {
  color: #3ab54a !important;
}
:deep(.json-output code .hljs-number) {
  color: #25aae2 !important;
}
:deep(.json-output code .hljs-literal) {
  color: #d73a49 !important;
}
:deep(.json-output code .hljs-keyword) {
  color: #d73a49 !important;
}
:deep(.json-output code .hljs-attr) {
  color: #92278f !important;
}
:deep(.json-output code .hljs-punctuation) {
  color: #333 !important;
}

:deep(.json-output code .search-match) {
  padding: 1px 0;
  border-radius: 2px;
  background-color: #ffe58f;
  color: #333;
}

:deep(.json-output code .search-match.active) {
  background-color: #ff9c6e;
  box-shadow: 0 0 0 1px #fa541c;
}

.empty-output {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  color: #999;
  font-style: italic;
  padding-top: 16px;
}

.copy-success {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  background-color: #52c41a;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  20% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
}

.button-section {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 16px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  border-radius: 0 0 8px 8px;
  flex-shrink: 0;
}

.action-button {
  padding: 8px 20px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.action-button:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.active {
  background-color: #1890ff;
  color: white;
  border-color: #1890ff;
}

.action-button.active:hover:not(:disabled) {
  background-color: #40a9ff;
  border-color: #40a9ff;
  color: white;
}

.clear-button {
  background-color: #fafafa;
}

.clear-button:hover {
  background-color: #f0f0f0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
  }
  
  .input-section,
  .output-section {
    min-height: 200px;
  }
  
  .button-section {
    flex-wrap: wrap;
  }
  
  .action-button {
    flex: 1;
    min-width: 120px;
  }
}
</style>
