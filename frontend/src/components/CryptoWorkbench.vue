<script setup>
import { computed, ref } from 'vue'
import md5 from 'blueimp-md5'
import { SM3 } from 'gm-crypto'
import AppIcon from './AppIcon.vue'

const modes = [
  { key: 'md5', label: 'Md5', subtitle: '稳定快速的单向哈希。' },
  { key: 'base64', label: 'Base64', subtitle: '适合轻量编码转换。' },
  { key: 'hmac-sm3', label: 'HmacSm3', subtitle: '适合带密钥的摘要签名。' },
  { key: 'md5+base64', label: 'MD5+Base64', subtitle: '兼容旧链路的组合输出。' }
]

const activeMode = ref('md5')
const inputText = ref('')
const secretKey = ref('')
const outputText = ref('')
const isUppercase = ref(false)
const autoCopy = ref(false)
const showSecret = ref(false)
const showCopySuccess = ref(false)

const activeModeInfo = computed(() => modes.find((item) => item.key === activeMode.value))
const needsSecret = computed(() => activeMode.value === 'hmac-sm3')

const stats = computed(() => [
  { label: '字符数', value: `${inputText.value.length}` },
  { label: '模式', value: activeModeInfo.value?.label || '-' },
  { label: '输出长度', value: `${outputText.value.length}` }
])

function stringToBytes(str) {
  return new TextEncoder().encode(str)
}

function hexToBytes(hex) {
  const bytes = []
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.slice(i, i + 2), 16))
  }
  return new Uint8Array(bytes)
}

function xorBytes(a, b) {
  const result = new Uint8Array(a.length)
  for (let i = 0; i < a.length; i += 1) {
    result[i] = a[i] ^ b[i]
  }
  return result
}

function concatBytes(a, b) {
  const result = new Uint8Array(a.length + b.length)
  result.set(a)
  result.set(b, a.length)
  return result
}

function sm3Hash(data) {
  if (typeof data === 'string') {
    return hexToBytes(SM3.digest(data, 'utf8', 'hex'))
  }

  return hexToBytes(SM3.digest(data.buffer, undefined, 'hex'))
}

function hmacSm3(message, key) {
  const blockSize = 64
  const keyBytes = stringToBytes(key)
  const messageBytes = stringToBytes(message)

  let processedKey = keyBytes
  if (keyBytes.length > blockSize) {
    processedKey = sm3Hash(key)
  }

  const paddedKey = new Uint8Array(blockSize)
  paddedKey.set(processedKey)

  const ipad = new Uint8Array(blockSize).fill(0x36)
  const opad = new Uint8Array(blockSize).fill(0x5c)

  const innerHash = sm3Hash(concatBytes(xorBytes(paddedKey, ipad), messageBytes))
  const outerHash = sm3Hash(concatBytes(xorBytes(paddedKey, opad), innerHash))

  return btoa(String.fromCharCode(...outerHash))
}

function base64Encode(value) {
  return btoa(unescape(encodeURIComponent(value)))
}

function buildOutput() {
  if (!inputText.value.trim()) {
    outputText.value = ''
    return
  }

  let result = ''
  switch (activeMode.value) {
    case 'md5':
      result = md5(inputText.value)
      result = isUppercase.value ? result.toUpperCase() : result.toLowerCase()
      break
    case 'base64':
      result = base64Encode(inputText.value)
      break
    case 'md5+base64':
      result = base64Encode(md5(inputText.value))
      break
    case 'hmac-sm3':
      result = hmacSm3(inputText.value, secretKey.value)
      break
    default:
      result = ''
  }

  outputText.value = result

  if (autoCopy.value && result) {
    copyOutput()
  }
}

function copyOutput() {
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

function clearAll() {
  inputText.value = ''
  secretKey.value = ''
  outputText.value = ''
}

function switchMode(mode) {
  activeMode.value = mode
  outputText.value = ''
}
</script>

<template>
  <div class="tool-page crypto-page">
    <section class="tool-page__hero">
      <div>
        <p class="page-kicker">工具 / 加密工具集</p>
        <h1 class="page-title">加密工具集</h1>
        <p class="page-subtitle">把 MD5、Base64 与 HmacSm3 收进同一工作流里，减少在多个页面之间切换的摩擦。</p>
      </div>
      <div class="tool-page__hero-actions">
        <button class="icon-button" type="button" title="复制结果" @click="copyOutput">
          <AppIcon name="copy" :size="16" />
        </button>
        <button class="icon-button" type="button" title="清空内容" @click="clearAll">
          <AppIcon name="trash" :size="16" />
        </button>
      </div>
    </section>

    <section class="crypto-modes">
      <button
        v-for="mode in modes"
        :key="mode.key"
        class="mode-pill"
        :class="{ 'mode-pill--active': activeMode === mode.key }"
        type="button"
        @click="switchMode(mode.key)"
      >
        {{ mode.label }}
      </button>
    </section>

    <section class="workspace-card crypto-workspace">
      <div class="workspace-card__header">
        <div>
          <h2>源输入</h2>
          <p>{{ activeModeInfo?.subtitle }}</p>
        </div>
        <div class="meta-pills">
          <span class="meta-pill">UTF-8</span>
          <span class="meta-pill">{{ activeModeInfo?.label }}</span>
        </div>
      </div>

      <textarea
        v-model="inputText"
        class="workspace-textarea"
        placeholder="在此粘贴您需要处理的文本……"
      ></textarea>

      <div class="negative-divider"></div>

      <div class="crypto-controls">
        <div class="workspace-field crypto-secret">
          <label>密钥 / 盐值</label>
          <div class="workspace-input-wrap">
            <input
              v-model="secretKey"
              class="workspace-input"
              :disabled="!needsSecret"
              :type="showSecret ? 'text' : 'password'"
              :placeholder="needsSecret ? '请输入签名密钥' : '当前模式不需要密钥'"
            />
            <button class="field-action" type="button" @click="showSecret = !showSecret">
              <AppIcon name="eye" :size="15" />
            </button>
          </div>
        </div>

        <div class="workspace-field crypto-options">
          <label>配置</label>
          <div class="option-row">
            <label class="toggle-option">
              <input v-model="isUppercase" type="checkbox" :disabled="activeMode !== 'md5'" />
              <span>大写哈希</span>
            </label>
            <label class="toggle-option">
              <input v-model="autoCopy" type="checkbox" />
              <span>自动执行</span>
            </label>
          </div>
        </div>

        <div class="crypto-submit">
          <button class="primary-action primary-action--wide" type="button" @click="buildOutput">
            <AppIcon name="bolt" :size="15" />
            <span>生成内容</span>
          </button>
        </div>
      </div>
    </section>

    <section class="workspace-card">
      <div class="workspace-card__header">
        <div>
          <h2>输出结果</h2>
          <p>适用于快速校验、调试链路或复制给其他系统使用。</p>
        </div>
        <button class="ghost-action" type="button" @click="copyOutput">复制到剪贴板</button>
      </div>
      <div class="result-box">
        <span v-if="outputText">{{ outputText }}</span>
        <span v-else class="result-box__placeholder">生成后将在这里显示结果。</span>
      </div>
      <div class="status-row">
        <span v-for="stat in stats" :key="stat.label">{{ stat.label }}: {{ stat.value }}</span>
      </div>
      <div v-if="showCopySuccess" class="floating-toast">结果已复制</div>
    </section>

    <section class="insight-grid">
      <article class="mini-info-card">
        <div class="mini-info-card__icon">
          <AppIcon name="lock" :size="18" />
        </div>
        <h3>安全本地处理</h3>
        <p>所有加密逻辑都留在当前桌面应用里，不依赖外部服务。</p>
      </article>
      <article class="mini-info-card">
        <div class="mini-info-card__icon">
          <AppIcon name="sparkles" :size="18" />
        </div>
        <h3>多算法快速切换</h3>
        <p>同一段输入可以在哈希、编码与签名之间快速切换验证。</p>
      </article>
      <article class="mini-info-card">
        <div class="mini-info-card__icon">
          <AppIcon name="history" :size="18" />
        </div>
        <h3>连续操作更顺手</h3>
        <p>布局按“输入、配置、输出”组织，减少多窗口来回复制的中断感。</p>
      </article>
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

.tool-page__hero-actions {
  display: flex;
  gap: 0.65rem;
}

.crypto-modes {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  padding: 0.32rem;
  width: fit-content;
  border-radius: 1rem;
  background: rgba(6, 14, 32, 0.84);
  border: 1px solid rgba(144, 143, 160, 0.12);
}

.mode-pill {
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  padding: 0.78rem 1.05rem;
  border-radius: 0.8rem;
  cursor: pointer;
  font-size: 0.92rem;
  transition: all 0.18s ease;
}

.mode-pill--active {
  background: rgba(34, 42, 61, 0.94);
  color: var(--color-primary);
  box-shadow: inset 0 0 0 1px rgba(192, 193, 255, 0.18);
}

.crypto-workspace {
  gap: 1rem;
}

.crypto-controls {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr) 210px;
  gap: 0.8rem;
  align-items: end;
}

.workspace-field {
  display: grid;
  gap: 0.55rem;
}

.workspace-field label {
  font-size: 0.74rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-faint);
}

.workspace-input-wrap {
  position: relative;
}

.workspace-input {
  width: 100%;
  padding-right: 2.7rem;
}

.field-action {
  position: absolute;
  top: 50%;
  right: 0.85rem;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: var(--color-text-faint);
  cursor: pointer;
}

.option-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  min-height: 44px;
  align-items: center;
}

.toggle-option {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.toggle-option input {
  accent-color: var(--color-primary);
}

.crypto-submit {
  display: flex;
  justify-content: flex-end;
}

.result-box {
  min-height: 120px;
  border-radius: 1rem;
  background: rgba(6, 14, 32, 0.88);
  padding: 1.4rem;
  font-family: var(--font-mono);
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  word-break: break-all;
}

.result-box__placeholder {
  color: var(--color-text-faint);
}

.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.78rem;
  color: var(--color-text-faint);
}

.insight-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

.mini-info-card {
  border-radius: 1.15rem;
  padding: 0.95rem;
  background: linear-gradient(180deg, rgba(23, 31, 51, 0.92), rgba(19, 27, 46, 0.98));
  border: 1px solid rgba(144, 143, 160, 0.14);
}

.mini-info-card__icon {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(192, 193, 255, 0.08);
  color: var(--color-primary);
}

.mini-info-card h3 {
  margin: 1rem 0 0;
  font-size: 0.98rem;
}

.mini-info-card p {
  margin: 0.55rem 0 0;
  color: var(--color-text-muted);
  line-height: 1.6;
  font-size: 0.86rem;
}

@media (max-width: 1080px) {
  .crypto-controls,
  .insight-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-height: 920px) {
  .tool-page {
    gap: 0.7rem;
  }

  .mode-pill {
    padding: 0.62rem 0.9rem;
  }

  .result-box {
    min-height: 96px;
    padding: 1rem;
  }

  .mini-info-card p {
    font-size: 0.8rem;
    line-height: 1.45;
  }
}
</style>
