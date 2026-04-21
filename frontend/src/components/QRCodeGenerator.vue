<script setup>
import { computed, ref } from 'vue'
import QRCode from 'qrcode'
import AppIcon from './AppIcon.vue'

const inputUrl = ref('')
const qrCodeDataUrl = ref('')
const qrCodeSvg = ref('')
const qrSize = ref(190)
const isGenerating = ref(false)
const history = ref([])

const historyItems = computed(() => history.value.slice(0, 4))

async function generateQRCode() {
  if (!inputUrl.value.trim()) return

  isGenerating.value = true
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(inputUrl.value, {
      width: qrSize.value,
      margin: 2,
      color: {
        dark: '#101520',
        light: '#f5f7ff'
      }
    })

    qrCodeSvg.value = await QRCode.toString(inputUrl.value, {
      type: 'svg',
      width: qrSize.value,
      margin: 1
    })

    history.value.unshift({
      value: inputUrl.value,
      size: qrSize.value,
      createdAt: new Date().toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    })
  } catch (error) {
    console.error('生成二维码失败:', error)
    qrCodeDataUrl.value = ''
    qrCodeSvg.value = ''
  } finally {
    isGenerating.value = false
  }
}

function clearInput() {
  inputUrl.value = ''
  qrCodeDataUrl.value = ''
  qrCodeSvg.value = ''
}

function downloadPng() {
  if (!qrCodeDataUrl.value) return
  const link = document.createElement('a')
  link.href = qrCodeDataUrl.value
  link.download = 'devbox-qrcode.png'
  link.click()
}

function downloadSvg() {
  if (!qrCodeSvg.value) return
  const blob = new Blob([qrCodeSvg.value], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'devbox-qrcode.svg'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="tool-page">
    <section class="tool-page__hero">
      <div>
        <p class="page-kicker">媒体工具 / 二维码生成器</p>
        <h1 class="page-title">二维码生成器</h1>
        <p class="page-subtitle">将 URL 或文本变成视觉输出，同时保留导出能力和最近生成记录，让它更像一块连续工作的画布。</p>
      </div>
    </section>

    <section class="qrcode-grid">
      <article class="workspace-card">
        <div class="workspace-card__header">
          <div>
            <h2>输入地址</h2>
            <p>输入链接或任意文本，右侧会生成可以导出的二维码。</p>
          </div>
        </div>

        <textarea
          v-model="inputUrl"
          class="workspace-textarea"
          placeholder="请输入 URL 或文本内容……"
        ></textarea>

        <div class="qrcode-controls">
          <div class="workspace-field">
            <label>尺寸</label>
            <div class="slider-row">
              <span class="meta-pill">{{ qrSize }} px</span>
              <input v-model="qrSize" class="slider" type="range" min="150" max="320" step="10" />
            </div>
          </div>

          <div class="toolbar-actions">
            <button class="ghost-action" type="button" @click="clearInput">清空</button>
            <button class="primary-action" type="button" :disabled="isGenerating" @click="generateQRCode">
              <AppIcon name="sparkles" :size="15" />
              <span>{{ isGenerating ? '生成中…' : '生成二维码' }}</span>
            </button>
          </div>
        </div>
      </article>

      <div class="side-stack">
        <article class="workspace-card qrcode-preview-card">
          <div class="preview-box">
            <img v-if="qrCodeDataUrl" :src="qrCodeDataUrl" alt="二维码" class="qrcode-image" />
            <div v-else class="preview-placeholder">生成后在这里显示二维码。</div>
          </div>
          <div class="export-row">
            <button class="ghost-action export-button" type="button" @click="downloadPng">下载 PNG</button>
            <button class="ghost-action export-button" type="button" @click="downloadSvg">下载 SVG</button>
          </div>
        </article>

        <article class="workspace-card history-card">
          <div class="workspace-card__header">
            <div>
              <h2>最近记录</h2>
              <p>最近生成的地址会留在这里，方便回看。</p>
            </div>
          </div>
          <div class="history-list">
            <div v-for="item in historyItems" :key="`${item.value}-${item.createdAt}`" class="history-item">
              <div class="history-item__icon">
                <AppIcon name="qr" :size="16" />
              </div>
              <div class="history-item__content">
                <strong>{{ item.value }}</strong>
                <span>{{ item.createdAt }} · {{ item.size }}px</span>
              </div>
            </div>
            <div v-if="historyItems.length === 0" class="preview-placeholder">生成后会自动记录最近内容。</div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tool-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.qrcode-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) 340px;
  gap: 1rem;
}

.workspace-field {
  display: grid;
  gap: 0.55rem;
}

.workspace-field label {
  font-size: 0.74rem;
  letter-spacing: 0.12em;
  color: var(--color-text-faint);
  text-transform: uppercase;
}

.qrcode-controls {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.slider {
  width: 180px;
  accent-color: var(--color-primary-strong);
}

.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.side-stack {
  display: grid;
  gap: 1rem;
}

.qrcode-preview-card {
  display: grid;
  gap: 1rem;
}

.preview-box {
  min-height: 320px;
  border-radius: 1rem;
  background: linear-gradient(180deg, rgba(245, 247, 255, 0.94), rgba(220, 224, 255, 0.88));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-placeholder {
  color: var(--color-text-faint);
}

.qrcode-image {
  display: block;
  width: min(280px, 100%);
  height: auto;
}

.export-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.export-button {
  width: 100%;
}

.history-card {
  gap: 1rem;
}

.history-list {
  display: grid;
  gap: 0.8rem;
}

.history-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.85rem;
  border-radius: 0.95rem;
  background: rgba(6, 14, 32, 0.55);
}

.history-item__icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(192, 193, 255, 0.08);
  color: var(--color-primary);
}

.history-item__content {
  min-width: 0;
  display: grid;
  gap: 0.25rem;
}

.history-item__content strong {
  font-size: 0.84rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item__content span {
  color: var(--color-text-faint);
  font-size: 0.75rem;
}

@media (max-width: 1080px) {
  .qrcode-grid {
    grid-template-columns: 1fr;
  }
}
</style>
