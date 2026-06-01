<script setup>
import { computed, ref } from 'vue'
import AppIcon from './AppIcon.vue'

const imagePath = ref('')
const previewMeta = ref({
  width: 0,
  height: 0,
  status: '等待输入路径',
  format: 'WEBP'
})

const palette = ['#d8d6ff', '#9b9cff', '#31394d', '#f5f7ff']

const imageUrl = computed(() => {
  if (!imagePath.value.trim()) return ''
  const normalizedPath = imagePath.value.startsWith('/') ? imagePath.value.slice(1) : imagePath.value
  return `https://pic.leshuazf.com/${normalizedPath}`
})

const infoList = computed(() => [
  { label: '尺寸', value: previewMeta.value.width && previewMeta.value.height ? `${previewMeta.value.width} × ${previewMeta.value.height}` : '--' },
  { label: '状态', value: previewMeta.value.status },
  { label: '文件格式', value: previewMeta.value.format },
  { label: '来源', value: 'Leshua CDN' }
])

function clearInput() {
  imagePath.value = ''
  previewMeta.value = {
    width: 0,
    height: 0,
    status: '等待输入路径',
    format: 'WEBP'
  }
}

function copyUrl() {
  if (!imageUrl.value) return
  navigator.clipboard.writeText(imageUrl.value).catch((error) => {
    console.error('复制失败:', error)
  })
}

function handleLoad(event) {
  const image = event.target
  const extension = imageUrl.value.split('.').pop()?.split('?')[0]

  previewMeta.value = {
    width: image.naturalWidth,
    height: image.naturalHeight,
    status: '预览已加载',
    format: extension ? extension.toUpperCase() : 'WEBP'
  }
}

function handleError() {
  previewMeta.value = {
    width: 0,
    height: 0,
    status: '图片加载失败',
    format: '--'
  }
}
</script>

<template>
  <div class="tool-page">
    <section class="tool-page__hero">
      <div>
        <p class="page-kicker">媒体工具 / 图片预览器</p>
        <h1 class="page-title">图片预览器</h1>
        <p class="page-subtitle">保留原有固定域名逻辑，但把输入、预览和素材信息整理成更像媒体工作台的布局。</p>
      </div>
    </section>

    <section class="workspace-card">
      <div class="image-input-row">
        <div class="workspace-input-wrap">
          <span class="image-input-prefix">https://pic.leshuazf.com/</span>
          <input
            v-model="imagePath"
            class="workspace-input image-input"
            placeholder="请输入图片路径，如 picture3pro/M00/7E/7C/demo.webp"
          />
        </div>
        <button class="ghost-action" type="button" @click="clearInput">清空</button>
        <button class="primary-action" type="button" @click="copyUrl">
          <AppIcon name="copy" :size="15" />
          <span>复制链接</span>
        </button>
      </div>

      <div class="image-grid">
        <article class="preview-card">
          <div class="preview-card__header">
            <h2>即时预览</h2>
            <span class="meta-pill">预览面板</span>
          </div>
          <div class="preview-stage">
            <div v-if="!imageUrl" class="preview-placeholder">输入路径后即可预览远程图片。</div>
            <img
              v-else
              :src="imageUrl"
              alt="预览图片"
              class="preview-image"
              @load="handleLoad"
              @error="handleError"
            />
          </div>
        </article>

        <div class="side-stack">
          <article class="meta-card">
            <div class="meta-card__header">
              <h3>资源信息</h3>
              <span class="status-dot" :class="{ 'status-dot--error': previewMeta.status === '图片加载失败' }"></span>
            </div>
            <ul class="meta-list">
              <li v-for="item in infoList" :key="item.label">
                <span>{{ item.label }}</span>
                <strong>{{ item.value }}</strong>
              </li>
            </ul>
            <button class="ghost-action meta-card__button" type="button" @click="copyUrl">复制图片地址</button>
          </article>

          <article class="meta-card">
            <h3>视觉记忆</h3>
            <div class="palette-row">
              <span v-for="color in palette" :key="color" :style="{ background: color }"></span>
            </div>
          </article>
        </div>
      </div>

      <div class="insight-grid">
        <article class="mini-info-card">
          <div class="mini-info-card__icon">
            <AppIcon name="image" :size="18" />
          </div>
          <h3>图片快检</h3>
          <p>适合验证远程资源路径是否正确，快速确认图片是否可访问。</p>
        </article>
        <article class="mini-info-card">
          <div class="mini-info-card__icon">
            <AppIcon name="link" :size="18" />
          </div>
          <h3>CDN 分析</h3>
          <p>路径保持原有业务前缀，不改变实际生成逻辑，只重构视觉结构。</p>
        </article>
        <article class="mini-info-card">
          <div class="mini-info-card__icon">
            <AppIcon name="code" :size="18" />
          </div>
          <h3>JSON 风格主题</h3>
          <p>与整个新工作台保持一致，避免某个工具页再次退回白底表单风格。</p>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tool-page {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

.image-input-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 0.75rem;
}

.workspace-input-wrap {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0 1rem;
  border-radius: 1rem;
  background: rgba(6, 14, 32, 0.74);
}

.image-input-prefix {
  white-space: nowrap;
  color: var(--color-text-faint);
  font-family: var(--font-mono);
  font-size: 0.82rem;
}

.image-input {
  box-shadow: none;
  background: transparent;
  padding-left: 0;
}

.image-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) 280px;
  gap: 1rem;
}

.preview-card,
.meta-card,
.mini-info-card {
  border-radius: 1.15rem;
  background: rgba(6, 14, 32, 0.66);
  border: 1px solid rgba(144, 143, 160, 0.1);
}

.preview-card {
  padding: 1rem;
}

.preview-card__header,
.meta-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.preview-card__header h2,
.meta-card h3 {
  margin: 0;
}

.preview-stage {
  margin-top: 0.8rem;
  min-height: 280px;
  border-radius: 1rem;
  background:
    radial-gradient(circle at top right, rgba(155, 156, 255, 0.18), transparent 26%),
    rgba(11, 19, 38, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-placeholder {
  color: var(--color-text-faint);
}

.preview-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.side-stack {
  display: grid;
  gap: 1rem;
}

.meta-card {
  padding: 1rem;
}

.meta-list {
  list-style: none;
  margin: 1rem 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.meta-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  font-size: 0.86rem;
}

.meta-list span {
  color: var(--color-text-muted);
}

.meta-card__button {
  width: 100%;
}

.status-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  background: #34d399;
  box-shadow: 0 0 14px rgba(52, 211, 153, 0.4);
}

.status-dot--error {
  background: #ffb4ab;
  box-shadow: 0 0 14px rgba(255, 180, 171, 0.4);
}

.palette-row {
  display: flex;
  gap: 0.55rem;
  margin-top: 1rem;
}

.palette-row span {
  width: 2rem;
  height: 2rem;
  border-radius: 0.65rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.insight-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
}

.mini-info-card {
  padding: 0.95rem;
}

.mini-info-card__icon {
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.85rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  background: rgba(192, 193, 255, 0.08);
}

.mini-info-card h3 {
  margin: 1rem 0 0;
}

.mini-info-card p {
  margin: 0.55rem 0 0;
  color: var(--color-text-muted);
  line-height: 1.6;
  font-size: 0.86rem;
}

@media (max-width: 1080px) {
  .image-grid,
  .insight-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-height: 920px) {
  .tool-page {
    gap: 0.7rem;
  }

  .preview-stage {
    min-height: 210px;
  }

  .meta-list {
    margin: 0.75rem 0;
    gap: 0.65rem;
  }
}

@media (max-width: 780px) {
  .image-input-row {
    grid-template-columns: 1fr;
  }

  .workspace-input-wrap {
    flex-direction: column;
    align-items: stretch;
    padding: 0.8rem 1rem;
  }
}
</style>
