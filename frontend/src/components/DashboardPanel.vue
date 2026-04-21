<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'

const props = defineProps({
  tools: {
    type: Array,
    default: () => []
  },
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['navigate'])

const filteredTools = computed(() => {
  const query = props.searchQuery.trim().toLowerCase()
  if (!query) return props.tools

  return props.tools.filter((tool) => {
    const haystack = [tool.name, tool.description, tool.category]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })
})

const recentTools = computed(() => filteredTools.value.slice(0, 3))
const spotlightTools = computed(() => filteredTools.value)

const statCards = computed(() => {
  const toolCount = props.tools.length
  return [
    { label: '可用工具', value: `${toolCount}`, tone: 'primary' },
    { label: '当前主题', value: 'Logical Monolith', tone: 'neutral' },
    { label: '桌面形态', value: 'Wails + Vue', tone: 'warm' }
  ]
})
</script>

<template>
  <div class="dashboard-page">
    <section class="dashboard-hero">
      <div>
        <p class="page-kicker">控制面板</p>
        <h1 class="page-title">开发者工具工作台</h1>
        <p class="page-subtitle">把高频的小工具收拢成一套连续的工作流，而不是一堆分散的弹窗。</p>
      </div>
      <div class="dashboard-stat-row">
        <article
          v-for="card in statCards"
          :key="card.label"
          class="dashboard-stat-card"
          :data-tone="card.tone"
        >
          <span>{{ card.label }}</span>
          <strong>{{ card.value }}</strong>
        </article>
      </div>
    </section>

    <section class="dashboard-section">
      <div class="section-heading">
        <div>
          <h2>最近使用</h2>
          <p>优先展示最贴近开发现场的工具入口。</p>
        </div>
        <button class="ghost-action" type="button">清除历史</button>
      </div>
      <div class="dashboard-grid dashboard-grid--recent">
        <button
          v-for="tool in recentTools"
          :key="tool.id"
          class="recent-card"
          :data-tone="tool.tone"
          type="button"
          @click="emit('navigate', tool.id)"
        >
          <div class="recent-card__icon">
            <AppIcon :name="tool.icon" :size="20" />
          </div>
          <div>
            <h3>{{ tool.name }}</h3>
            <p>{{ tool.description }}</p>
          </div>
          <span class="recent-card__meta">{{ tool.metric }}</span>
        </button>
      </div>
    </section>

    <section class="dashboard-section">
      <div class="section-heading">
        <div>
          <h2>所有工具</h2>
          <p>与 Stitch 原型一致，按“单一工作台”而不是零碎卡片组织。</p>
        </div>
        <span class="page-chip">共 {{ spotlightTools.length }} 项</span>
      </div>
      <div class="dashboard-grid dashboard-grid--tools">
        <button
          v-for="tool in spotlightTools"
          :key="tool.id"
          class="tool-card"
          :data-tone="tool.tone"
          type="button"
          @click="emit('navigate', tool.id)"
        >
          <div class="tool-card__header">
            <div class="tool-card__badge">
              <AppIcon :name="tool.icon" :size="18" />
            </div>
            <span class="tool-card__category">{{ tool.category }}</span>
          </div>
          <div class="tool-card__body">
            <h3>{{ tool.name }}</h3>
            <p>{{ tool.description }}</p>
          </div>
          <span class="tool-card__link">进入工具</span>
        </button>
      </div>
    </section>

    <section class="dashboard-insights">
      <article class="insight-card insight-card--wide">
        <div>
          <p class="page-kicker">效率洞察</p>
          <h2>把“输入、处理、结果”压进同一视觉通道</h2>
          <p>这次重构不再用白底表单堆叠，而是把每个工具都组织成深色工作台，减少切换成本。</p>
          <div class="insight-card__actions">
            <button class="primary-action" type="button" @click="emit('navigate', 'json-formatter')">
              体验新工作台
            </button>
            <button class="ghost-action" type="button" @click="emit('navigate', 'qrcode-generator')">
              查看二维码页
            </button>
          </div>
        </div>
        <div class="bar-visual">
          <span style="height: 38%"></span>
          <span style="height: 62%"></span>
          <span style="height: 81%"></span>
          <span style="height: 48%"></span>
          <span style="height: 71%"></span>
          <span style="height: 90%"></span>
        </div>
      </article>

      <article class="insight-card">
        <div class="insight-card__header">
          <h3>系统摘要</h3>
          <span class="status-dot"></span>
        </div>
        <ul class="system-list">
          <li><span>前端架构</span><strong>Vue 3 + Vite</strong></li>
          <li><span>桌面容器</span><strong>Wails</strong></li>
          <li><span>设计语言</span><strong>Dark Editorial</strong></li>
        </ul>
        <div class="progress-strip">
          <span></span>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(260px, 0.8fr);
  gap: 1.5rem;
  align-items: end;
}

.dashboard-stat-row {
  display: grid;
  gap: 0.9rem;
}

.dashboard-stat-card {
  padding: 1rem 1.1rem;
  border-radius: 1.1rem;
  background: rgba(34, 42, 61, 0.72);
  border: 1px solid rgba(144, 143, 160, 0.12);
  display: grid;
  gap: 0.3rem;
}

.dashboard-stat-card span {
  font-size: 0.76rem;
  color: var(--color-text-muted);
}

.dashboard-stat-card strong {
  font-size: 1rem;
}

.dashboard-stat-card[data-tone='primary'] strong {
  color: var(--color-primary);
}

.dashboard-stat-card[data-tone='warm'] strong {
  color: var(--color-tertiary);
}

.dashboard-section {
  display: grid;
  gap: 1rem;
}

.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.section-heading h2 {
  margin: 0;
  font-size: 1.35rem;
}

.section-heading p {
  margin: 0.3rem 0 0;
  color: var(--color-text-muted);
  font-size: 0.92rem;
}

.dashboard-grid {
  display: grid;
  gap: 1rem;
}

.dashboard-grid--recent {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.dashboard-grid--tools {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.recent-card,
.tool-card {
  background: linear-gradient(180deg, rgba(23, 31, 51, 0.96), rgba(19, 27, 46, 0.92));
  border: 1px solid rgba(144, 143, 160, 0.14);
  border-radius: 1.2rem;
  text-align: left;
  color: inherit;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.recent-card:hover,
.tool-card:hover {
  transform: translateY(-2px);
  border-color: rgba(192, 193, 255, 0.26);
  background: linear-gradient(180deg, rgba(34, 42, 61, 0.94), rgba(23, 31, 51, 0.98));
}

.recent-card {
  min-height: 12.8rem;
  padding: 1.35rem;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.recent-card__icon,
.tool-card__badge {
  width: 2.8rem;
  height: 2.8rem;
  border-radius: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  background: rgba(192, 193, 255, 0.1);
}

.recent-card[data-tone='warm'] .recent-card__icon,
.tool-card[data-tone='warm'] .tool-card__badge {
  color: var(--color-tertiary);
  background: rgba(255, 183, 131, 0.12);
}

.recent-card h3,
.tool-card h3 {
  margin: 0;
  font-size: 1.02rem;
}

.recent-card p,
.tool-card p {
  margin: 0.45rem 0 0;
  font-size: 0.86rem;
  line-height: 1.55;
  color: var(--color-text-muted);
}

.recent-card__meta {
  font-size: 0.78rem;
  color: var(--color-text-faint);
}

.tool-card {
  padding: 1.15rem;
  display: grid;
  gap: 1rem;
}

.tool-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
}

.tool-card__category {
  font-size: 0.72rem;
  color: var(--color-text-faint);
}

.tool-card__link {
  font-size: 0.83rem;
  color: var(--color-primary);
}

.dashboard-insights {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.8fr);
  gap: 1rem;
}

.insight-card {
  border-radius: 1.3rem;
  padding: 1.4rem;
  background: linear-gradient(180deg, rgba(23, 31, 51, 0.92), rgba(19, 27, 46, 0.98));
  border: 1px solid rgba(144, 143, 160, 0.14);
}

.insight-card--wide {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 1rem;
  align-items: center;
}

.insight-card h2,
.insight-card h3 {
  margin: 0;
}

.insight-card p {
  margin: 0.6rem 0 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.insight-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.3rem;
}

.bar-visual {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 0.7rem;
  padding: 1rem;
  min-height: 180px;
  border-radius: 1.2rem;
  background: rgba(45, 52, 73, 0.65);
}

.bar-visual span {
  width: 16px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(192, 193, 255, 0.95), rgba(128, 131, 255, 0.3));
  box-shadow: 0 0 20px rgba(128, 131, 255, 0.16);
}

.insight-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  background: #34d399;
  box-shadow: 0 0 14px rgba(52, 211, 153, 0.45);
}

.system-list {
  list-style: none;
  margin: 1.1rem 0;
  padding: 0;
  display: grid;
  gap: 0.9rem;
}

.system-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.86rem;
}

.system-list span {
  color: var(--color-text-muted);
}

.progress-strip {
  height: 0.35rem;
  border-radius: 999px;
  background: rgba(128, 131, 255, 0.14);
  overflow: hidden;
}

.progress-strip span {
  display: block;
  width: 72%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, rgba(255, 183, 131, 1), rgba(192, 193, 255, 1));
}

@media (max-width: 1200px) {
  .dashboard-grid--tools {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-hero,
  .dashboard-insights,
  .insight-card--wide {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .dashboard-grid--recent,
  .dashboard-grid--tools {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: start;
    flex-direction: column;
  }
}
</style>
