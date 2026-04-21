<script setup>
import { computed, ref } from 'vue'
import { CodeDiff } from 'v-code-diff'
import AppIcon from './AppIcon.vue'

const oldText = ref('')
const newText = ref('')

const stats = computed(() => {
  const oldLines = oldText.value ? oldText.value.split('\n') : []
  const newLines = newText.value ? newText.value.split('\n') : []
  const shared = Math.max(oldLines.length, newLines.length)

  let changed = 0
  for (let i = 0; i < shared; i += 1) {
    if ((oldLines[i] || '') !== (newLines[i] || '')) {
      changed += 1
    }
  }

  const oldChars = oldText.value.length
  const newChars = newText.value.length
  const similarityBase = Math.max(oldChars, newChars, 1)
  const similarity = Math.max(0, 100 - Math.round((Math.abs(oldChars - newChars) / similarityBase) * 100))

  return [
    { label: '差异行', value: `${changed}` },
    { label: '左侧行数', value: `${oldLines.length}` },
    { label: '右侧行数', value: `${newLines.length}` },
    { label: '相似度', value: `${similarity}%` }
  ]
})

function clearAll() {
  oldText.value = ''
  newText.value = ''
}

function swapText() {
  const temp = oldText.value
  oldText.value = newText.value
  newText.value = temp
}
</script>

<template>
  <div class="tool-page">
    <section class="tool-page__hero">
      <div>
        <p class="page-kicker">文本处理 / 文本比对</p>
        <h1 class="page-title">文本比对</h1>
        <p class="page-subtitle">即时比较两段文本或代码，让差异块在同一视野里连续呈现，而不是散落在多个弹层中。</p>
      </div>
      <div class="tool-page__hero-actions">
        <button class="ghost-action" type="button" @click="swapText">交换文本</button>
        <button class="primary-action" type="button" @click="clearAll">
          <AppIcon name="trash" :size="15" />
          <span>清空对比</span>
        </button>
      </div>
    </section>

    <section class="workspace-card">
      <div class="diff-editors">
        <article class="editor-pane">
          <div class="editor-pane__header">
            <div>
              <span class="editor-pane__eyebrow">左侧</span>
              <strong>原始内容</strong>
            </div>
            <span class="meta-pill">输入 A</span>
          </div>
          <textarea
            v-model="oldText"
            class="workspace-textarea diff-textarea"
            placeholder="请输入原始文本或代码……"
          ></textarea>
        </article>

        <article class="editor-pane">
          <div class="editor-pane__header">
            <div>
              <span class="editor-pane__eyebrow">右侧</span>
              <strong>新内容</strong>
            </div>
            <span class="meta-pill">输入 B</span>
          </div>
          <textarea
            v-model="newText"
            class="workspace-textarea diff-textarea"
            placeholder="请输入新的文本或代码……"
          ></textarea>
        </article>
      </div>

      <div class="negative-divider"></div>

      <div class="diff-preview">
        <div class="diff-preview__header">
          <div>
            <h2>差异预览</h2>
            <p>保持原有 diff 逻辑，但换成 Stitch 风格的深色工作区。</p>
          </div>
          <span class="page-chip">Side by side</span>
        </div>

        <div class="diff-preview__body">
          <CodeDiff
            :old-string="oldText"
            :new-string="newText"
            output-format="side-by-side"
            maxHeight="40vh"
            :context="5"
          />
        </div>
      </div>

      <div class="stats-grid">
        <article v-for="item in stats" :key="item.label" class="stat-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
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

.tool-page__hero {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
}

.tool-page__hero-actions {
  display: flex;
  gap: 0.75rem;
}

.diff-editors {
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
}

.editor-pane__eyebrow {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.72rem;
  color: var(--color-text-faint);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.diff-textarea {
  min-height: 260px;
  border-radius: 0;
}

.diff-preview {
  display: grid;
  gap: 1rem;
}

.diff-preview__header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.diff-preview__header h2 {
  margin: 0;
}

.diff-preview__header p {
  margin: 0.35rem 0 0;
  color: var(--color-text-muted);
  font-size: 0.86rem;
}

.diff-preview__body {
  min-height: 320px;
  padding: 0.4rem;
  border-radius: 1rem;
  background: rgba(6, 14, 32, 0.88);
  overflow: auto;
}

.diff-preview__body :deep(.v-code-diff) {
  background: transparent;
  color: var(--color-text);
}

.diff-preview__body :deep(.d2h-wrapper),
.diff-preview__body :deep(.d2h-file-wrapper),
.diff-preview__body :deep(.d2h-diff-table),
.diff-preview__body :deep(.d2h-code-wrapper),
.diff-preview__body :deep(.d2h-code-side-line),
.diff-preview__body :deep(.d2h-file-header) {
  background: transparent !important;
  color: var(--color-text) !important;
  border-color: rgba(144, 143, 160, 0.08) !important;
}

.diff-preview__body :deep(.d2h-ins),
.diff-preview__body :deep(.d2h-ins td) {
  background: rgba(52, 211, 153, 0.1) !important;
}

.diff-preview__body :deep(.d2h-del),
.diff-preview__body :deep(.d2h-del td) {
  background: rgba(255, 180, 171, 0.1) !important;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
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
  font-size: 1.1rem;
}

@media (max-width: 960px) {
  .diff-editors,
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .tool-page__hero,
  .diff-preview__header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
