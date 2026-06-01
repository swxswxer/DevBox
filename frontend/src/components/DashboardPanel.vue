<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
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

const recentCards = [
  {
    id: 'json-formatter',
    title: 'JSON 格式化',
    subtitle: '上次使用：2 分钟前',
    icon: 'data-object',
    tone: 'primary',
    actionable: true
  },
  {
    id: 'qrcode-generator',
    title: '二维码生成器',
    subtitle: '上次使用：1 小时前',
    icon: 'qr',
    tone: 'warm',
    actionable: true
  },
  {
    id: 'text-diff',
    title: '文本比对工具',
    subtitle: '上次使用：3 小时前',
    icon: 'diff',
    tone: 'primary',
    actionable: true
  }
]

const allTools = [
  {
    id: 'json-formatter',
    title: 'JSON 格式化',
    description: '美化、压缩和验证具有语法高亮显示的 JSON 结构。',
    icon: 'data-object',
    tone: 'primary',
    actionable: true
  },
  {
    id: 'crypto-workbench',
    title: '加密套件',
    description: 'AES、RSA 和用于安全数据转换的各种哈希算法。',
    icon: 'enhanced-encryption',
    tone: 'warm',
    actionable: true
  },
  {
    id: 'url-encode',
    title: 'URL 编码',
    description: '为 Web 地址安全地编码或解码参数。',
    icon: 'link',
    tone: 'primary',
    actionable: true
  },
  {
    id: 'image-preview',
    title: '图片预览',
    description: '即时 Base64 预览和图片的响应式尺寸测试。',
    icon: 'image-search',
    tone: 'primary',
    actionable: true
  },
  {
    id: 'password-generator',
    title: '密码生成器',
    description: '为开发者账户生成安全的高熵密码。',
    icon: 'password',
    tone: 'primary',
    actionable: false
  },
  {
    id: 'cron-parser',
    title: 'Cron 解析器',
    description: '人性化 Cron 表达式并预览下次执行时间。',
    icon: 'terminal',
    tone: 'primary',
    actionable: false
  },
  {
    id: 'regex-tester',
    title: '正则测试器',
    description: '实时正则表达式匹配及捕获组高亮显示。',
    icon: 'integration',
    tone: 'primary',
    actionable: false
  },
  {
    id: 'feedback',
    title: '需求反馈',
    description: '缺了点什么？告诉我们您下一步需要什么工具。',
    icon: 'plus',
    tone: 'promo',
    actionable: false,
    promo: true
  }
]

function openTool(id, actionable) {
  if (!actionable) return
  emit('navigate', id)
}
</script>

<template>
  <div class="dashboard-page">
    <section class="dashboard-section">
      <div class="dashboard-heading">
        <div>
          <h2>最近使用</h2>
          <p>快速回到您最近的工作流程。</p>
        </div>
        <button class="dashboard-link" type="button">清除历史</button>
      </div>

      <div class="recent-grid">
        <button
          v-for="card in recentCards"
          :key="card.id"
          class="recent-card"
          :data-tone="card.tone"
          type="button"
          @click="openTool(card.id, card.actionable)"
        >
          <div class="recent-card__content">
            <div class="recent-card__icon">
              <AppIcon :name="card.icon" :size="22" />
            </div>
            <div>
              <h3>{{ card.title }}</h3>
              <p>{{ card.subtitle }}</p>
            </div>
          </div>
          <div class="recent-card__ghost">
            <AppIcon :name="card.icon" :size="88" />
          </div>
        </button>
      </div>
    </section>

    <section class="dashboard-section">
      <div class="tools-heading">
        <h2>所有工具</h2>
        <div class="tools-heading__line"></div>
        <div class="view-toggle">
          <button class="view-toggle__button view-toggle__button--active" type="button">网格</button>
          <button class="view-toggle__button" type="button">列表</button>
        </div>
      </div>

      <div class="tools-grid">
        <button
          v-for="tool in allTools"
          :key="tool.id"
          class="tool-card"
          :class="{ 'tool-card--promo': tool.promo, 'tool-card--disabled': !tool.actionable && !tool.promo }"
          :data-tone="tool.tone"
          type="button"
          @click="openTool(tool.id, tool.actionable)"
        >
          <template v-if="!tool.promo">
            <div class="tool-card__icon">
              <AppIcon :name="tool.icon" :size="20" />
            </div>
            <h4>{{ tool.title }}</h4>
            <p>{{ tool.description }}</p>
            <div class="tool-card__footer">
              <span>启动工具</span>
              <AppIcon name="arrow-right" :size="12" />
            </div>
          </template>

          <template v-else>
            <div class="tool-card__promo-icon">
              <AppIcon name="plus" :size="22" />
            </div>
            <h4>{{ tool.title }}</h4>
            <p>{{ tool.description }}</p>
          </template>
        </button>
      </div>
    </section>

    <section class="bottom-grid">
      <article class="insight-panel">
        <div class="insight-panel__copy">
          <h3>效率洞察</h3>
          <p>本周 DevBox 为您节省了约 4.2 小时的手动格式化时间。</p>
          <div class="insight-panel__actions">
            <button class="insight-button insight-button--primary" type="button">查看报告</button>
            <button class="insight-button" type="button">分享进度</button>
          </div>
        </div>
        <div class="insight-chart">
          <div class="insight-chart__glow"></div>
          <div class="insight-chart__bars">
            <span style="height: 32%"></span>
            <span style="height: 56%"></span>
            <span style="height: 40%"></span>
            <span style="height: 68%"></span>
            <span style="height: 48%"></span>
          </div>
        </div>
      </article>

      <article class="health-panel">
        <h3>系统健康</h3>
        <div class="health-panel__status">
          <span class="health-dot"></span>
          <span>所有系统运行正常</span>
        </div>
        <div class="health-metric">
          <div class="health-metric__row">
            <span>API 延迟</span>
            <strong>12ms</strong>
          </div>
          <div class="health-bar">
            <span class="health-bar__fill health-bar__fill--primary"></span>
          </div>
        </div>
        <div class="health-metric">
          <div class="health-metric__row">
            <span>云存储</span>
            <strong>82% 已满</strong>
          </div>
          <div class="health-bar">
            <span class="health-bar__fill health-bar__fill--warm"></span>
          </div>
        </div>
        <div class="health-panel__orb"></div>
      </article>
    </section>

    <footer class="dashboard-footer">
      <span>© 2024 DEVBOX INSTRUMENTS. 保留所有权利。</span>
      <div class="dashboard-footer__links">
        <button type="button">隐私政策</button>
        <button type="button">API 条款</button>
        <button type="button">社区指南</button>
      </div>
    </footer>

    <button class="dashboard-fab" type="button">
      <AppIcon name="bolt" :size="24" />
    </button>
  </div>
</template>

<style scoped>
.dashboard-page {
  position: relative;
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  height: calc(100vh - 58px - 2.2rem);
  gap: 0.8rem;
  padding: 0 0 0.7rem;
  overflow: hidden;
}

.dashboard-section {
  display: grid;
  gap: 0.7rem;
  min-height: 0;
}

.dashboard-heading,
.tools-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.dashboard-heading h2,
.tools-heading h2 {
  margin: 0;
  font-size: 1.55rem;
  line-height: 1;
  letter-spacing: -0.04em;
  font-weight: 900;
}

.dashboard-heading p {
  margin: 0.2rem 0 0;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.dashboard-link {
  border: 0;
  background: transparent;
  color: var(--color-primary);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.65rem;
}

.recent-card {
  position: relative;
  overflow: hidden;
  min-height: 7.15rem;
  padding: 0.82rem;
  border: 1px solid rgba(70, 69, 84, 0.15);
  border-radius: 1.15rem;
  background: rgba(23, 31, 51, 0.96);
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}

.recent-card:hover {
  background: rgba(49, 57, 77, 0.92);
  transform: translateY(-1px);
  border-color: rgba(192, 193, 255, 0.18);
}

.recent-card__content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recent-card__icon {
  width: 2.15rem;
  height: 2.15rem;
  border-radius: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  background: rgba(128, 131, 255, 0.18);
}

.recent-card[data-tone='warm'] .recent-card__icon {
  color: var(--color-tertiary);
  background: rgba(255, 183, 131, 0.16);
}

.recent-card h3 {
  margin: 0 0 0.3rem;
  font-size: 0.86rem;
  font-weight: 800;
}

.recent-card p {
  margin: 0;
  font-size: 0.68rem;
  color: var(--color-text-muted);
}

.recent-card__ghost {
  position: absolute;
  right: -0.6rem;
  bottom: -0.6rem;
  opacity: 0.06;
  color: var(--color-text);
}

.tools-heading {
  align-items: center;
}

.tools-heading__line {
  height: 1px;
  flex: 1;
  background: rgba(70, 69, 84, 0.24);
}

.view-toggle {
  display: inline-flex;
  padding: 0.2rem;
  border-radius: 0.8rem;
  background: rgba(23, 31, 51, 0.96);
}

.view-toggle__button {
  border: 0;
  background: transparent;
  color: var(--color-text-faint);
  font-size: 0.76rem;
  font-weight: 800;
  padding: 0.34rem 0.72rem;
  border-radius: 0.55rem;
  cursor: pointer;
}

.view-toggle__button--active {
  background: rgba(45, 52, 73, 0.92);
  color: var(--color-primary);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  min-height: 0;
}

.tool-card {
  min-height: 0;
  height: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(70, 69, 84, 0.15);
  border-radius: 1.15rem;
  background: rgba(19, 27, 46, 0.95);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  color: inherit;
  cursor: pointer;
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}

.tool-card:hover {
  transform: scale(1.02);
  background: rgba(49, 57, 77, 0.92);
  border-color: rgba(192, 193, 255, 0.18);
}

.tool-card--disabled {
  cursor: default;
}

.tool-card--promo {
  align-items: center;
  justify-content: center;
  text-align: center;
  background: rgba(192, 193, 255, 0.05);
  border: 2px dashed rgba(192, 193, 255, 0.2);
}

.tool-card--promo:hover {
  background: rgba(192, 193, 255, 0.09);
  border-color: rgba(192, 193, 255, 0.36);
}

.tool-card__icon,
.tool-card__promo-icon {
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.65rem;
  background: rgba(45, 52, 73, 0.96);
  color: var(--color-primary);
}

.tool-card[data-tone='warm'] .tool-card__icon {
  color: var(--color-tertiary);
}

.tool-card__promo-icon {
  width: 2.2rem;
  height: 2.2rem;
  margin-bottom: 0.55rem;
  background: var(--color-primary);
  color: #1000a9;
}

.tool-card h4 {
  margin: 0 0 0.45rem;
  font-size: 0.84rem;
  font-weight: 800;
}

.tool-card p {
  margin: 0;
  font-size: 0.71rem;
  line-height: 1.35;
  color: var(--color-text-muted);
}

.tool-card__footer {
  margin-top: auto;
  padding-top: 0.45rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  letter-spacing: 0.02em;
  font-weight: 800;
  color: var(--color-text-faint);
}

.tool-card[data-tone='warm']:hover .tool-card__footer {
  color: var(--color-tertiary);
}

.tool-card:not([data-tone='warm']):hover .tool-card__footer {
  color: var(--color-primary);
}

.bottom-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 0.65rem;
}

.insight-panel,
.health-panel {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(70, 69, 84, 0.15);
  border-radius: 1.35rem;
  background: rgba(45, 52, 73, 0.32);
}

.insight-panel {
  padding: 0.85rem 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.insight-panel__copy {
  flex: 1;
}

.insight-panel h3,
.health-panel h3 {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 800;
}

.insight-panel p {
  margin: 0.25rem 0 0.7rem;
  max-width: 28rem;
  color: var(--color-text-muted);
  font-size: 0.74rem;
  line-height: 1.4;
}

.insight-panel__actions {
  display: flex;
  gap: 0.6rem;
}

.insight-button {
  border: 0;
  border-radius: 0.7rem;
  padding: 0.46rem 0.72rem;
  background: rgba(23, 31, 51, 0.96);
  color: var(--color-text);
  font-size: 0.68rem;
  font-weight: 800;
  cursor: pointer;
}

.insight-button--primary {
  background: var(--color-primary);
  color: #1000a9;
}

.insight-chart {
  position: relative;
  width: 8.3rem;
  height: 5.2rem;
  border-radius: 1rem;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(192, 193, 255, 0.12), rgba(255, 183, 131, 0.12));
}

.insight-chart__glow {
  position: absolute;
  inset: auto 0 0 0;
  height: 50%;
  background: rgba(192, 193, 255, 0.35);
  filter: blur(36px);
}

.insight-chart__bars {
  position: absolute;
  inset: 0.65rem;
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding: 0 0.45rem;
  border-left: 1px solid rgba(144, 143, 160, 0.22);
  border-bottom: 1px solid rgba(144, 143, 160, 0.22);
}

.insight-chart__bars span {
  width: 0.34rem;
  border-radius: 999px 999px 0 0;
  background: var(--color-primary);
}

.health-panel {
  padding: 0.9rem 0.95rem;
}

.health-panel__status {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0.25rem 0 0.75rem;
  color: #34d399;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.health-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: #34d399;
  box-shadow: 0 0 12px rgba(52, 211, 153, 0.45);
}

.health-metric + .health-metric {
  margin-top: 0.65rem;
}

.health-metric__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.3rem;
  font-size: 0.66rem;
}

.health-metric__row span {
  color: var(--color-text-faint);
}

.health-metric__row strong {
  font-family: var(--font-mono);
  font-size: 0.68rem;
}

.health-bar {
  width: 100%;
  height: 0.25rem;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(23, 31, 51, 0.95);
}

.health-bar__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
}

.health-bar__fill--primary {
  width: 25%;
  background: var(--color-primary);
}

.health-bar__fill--warm {
  width: 82%;
  background: var(--color-tertiary);
}

.health-panel__orb {
  position: absolute;
  right: -2rem;
  bottom: -2rem;
  width: 6rem;
  height: 6rem;
  border-radius: 999px;
  background: rgba(192, 193, 255, 0.1);
  filter: blur(30px);
}

.dashboard-footer {
  margin-top: auto;
  padding-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid rgba(70, 69, 84, 0.12);
  color: var(--color-text-faint);
  font-size: 0.52rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.dashboard-footer__links {
  display: flex;
  gap: 1.2rem;
}

.dashboard-footer__links button {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.dashboard-fab {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  width: 3.1rem;
  height: 3.1rem;
  border: 0;
  border-radius: 1.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: #1000a9;
  box-shadow: 0 8px 24px rgba(192, 193, 255, 0.4);
  cursor: pointer;
  z-index: 60;
  transition: transform 0.18s ease;
}

.dashboard-fab:hover {
  transform: scale(1.08);
}

@media (max-width: 1320px) {
  .tools-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 1080px) {
  .recent-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }

  .insight-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .insight-chart {
    width: 100%;
  }
}

@media (max-width: 760px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-heading,
  .tools-heading,
  .dashboard-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .tools-heading__line {
    display: none;
  }

  .dashboard-footer__links {
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
}

@media (max-height: 920px) {
  .dashboard-page {
    height: calc(100vh - 54px - 1.6rem);
    gap: 0.55rem;
    padding-bottom: 0.45rem;
  }

  .dashboard-heading h2,
  .tools-heading h2 {
    font-size: 1.35rem;
  }

  .recent-card {
    min-height: 6.3rem;
    padding: 0.72rem;
  }

  .tool-card {
    padding: 0.7rem;
  }

  .insight-panel,
  .health-panel {
    padding: 0.72rem 0.78rem;
  }

  .insight-chart {
    width: 7rem;
    height: 4.35rem;
  }

  .tool-card p {
    font-size: 0.64rem;
  }

  .dashboard-footer {
    padding-top: 0.35rem;
    font-size: 0.48rem;
  }
}
</style>
