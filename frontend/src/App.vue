<script setup>
import { computed, ref, watch } from 'vue'
import AppIcon from './components/AppIcon.vue'
import DashboardPanel from './components/DashboardPanel.vue'
import JsonFormatter from './components/JsonFormatter.vue'
import TextDiff from './components/TextDiff.vue'
import CryptoWorkbench from './components/CryptoWorkbench.vue'
import UrlEncode from './components/UrlEncode.vue'
import ImagePreview from './components/ImagePreview.vue'
import QRCodeGenerator from './components/QRCodeGenerator.vue'

const STORAGE_KEY = 'devbox-active-tool'

const navItems = [
  {
    id: 'dashboard',
    name: '控制面板',
    category: '概览',
    description: '最近使用与系统状态总览。',
    metric: '系统视图',
    icon: 'dashboard',
    tone: 'primary',
    component: DashboardPanel
  },
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    category: '数据处理',
    description: 'JSON / XML 格式化、压缩与结构转换。',
    metric: '结构化文本',
    icon: 'code',
    tone: 'primary',
    component: JsonFormatter
  },
  {
    id: 'text-diff',
    name: '文本比对',
    category: '文本处理',
    description: '并排比较两段文本，快速找出变更区域。',
    metric: '差异分析',
    icon: 'diff',
    tone: 'neutral',
    component: TextDiff
  },
  {
    id: 'crypto-workbench',
    name: '加密工具',
    category: '安全与编码',
    description: '将 Md5、Base64 与 HmacSm3 收进一个工作台。',
    metric: '哈希 / 编码',
    icon: 'lock',
    tone: 'warm',
    component: CryptoWorkbench
  },
  {
    id: 'url-encode',
    name: 'URL 编解码',
    category: '文本处理',
    description: '在编码和解码之间快速切换，处理常见 URL 字符串。',
    metric: 'URI 转换',
    icon: 'link',
    tone: 'warm',
    component: UrlEncode
  },
  {
    id: 'image-preview',
    name: '图片预览器',
    category: '媒体工具',
    description: '拼接固定域名并即时预览远程图片。',
    metric: '远程资源',
    icon: 'image',
    tone: 'primary',
    component: ImagePreview
  },
  {
    id: 'qrcode-generator',
    name: '二维码生成器',
    category: '媒体工具',
    description: '从链接或文本生成二维码，并导出 PNG / SVG。',
    metric: '视觉输出',
    icon: 'qr',
    tone: 'warm',
    component: QRCodeGenerator
  }
]

const storedNav = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : ''
const currentNav = ref(navItems.some((item) => item.id === storedNav) ? storedNav : 'dashboard')
const searchQuery = ref('')

const utilityTools = computed(() => navItems.filter((item) => item.id !== 'dashboard'))
const filteredTools = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return utilityTools.value

  return utilityTools.value.filter((item) => {
    const haystack = [item.name, item.description, item.category]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return haystack.includes(query)
  })
})

const activeItem = computed(() => navItems.find((item) => item.id === currentNav.value) || navItems[0])

watch(currentNav, (value) => {
  window.localStorage.setItem(STORAGE_KEY, value)
})

function switchNav(id) {
  currentNav.value = id
}

function activateFirstSearchResult() {
  if (filteredTools.value.length > 0) {
    currentNav.value = filteredTools.value[0].id
  }
}

function handleSearchKeydown(event) {
  if (event.key === 'Enter') {
    activateFirstSearchResult()
  }
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar-shell">
      <div class="brand-block">
        <h1>DevBox</h1>
        <p>开发者工具箱</p>
      </div>

      <div class="nav-section">
        <span class="nav-section__label">总览</span>
        <button
          class="nav-item"
          :class="{ 'nav-item--active': currentNav === 'dashboard' }"
          type="button"
          @click="switchNav('dashboard')"
        >
          <AppIcon name="dashboard" :size="18" />
          <span>控制面板</span>
        </button>
      </div>

      <div class="nav-section nav-section--fill">
        <span class="nav-section__label">工具集</span>
        <button
          v-for="item in filteredTools"
          :key="item.id"
          class="nav-item"
          :class="{ 'nav-item--active': currentNav === item.id }"
          type="button"
          @click="switchNav(item.id)"
        >
          <AppIcon :name="item.icon" :size="18" />
          <span>{{ item.name }}</span>
        </button>
      </div>

      <div class="sidebar-footer">
        <button class="nav-item nav-item--subtle" type="button">
          <AppIcon name="docs" :size="17" />
          <span>文档</span>
        </button>
        <button class="nav-item nav-item--subtle" type="button">
          <AppIcon name="logout" :size="17" />
          <span>退出登录</span>
        </button>

        <div class="profile-chip">
          <div class="profile-chip__avatar">D</div>
          <div>
            <strong>Alex Dev</strong>
            <span>专业版计划</span>
          </div>
        </div>
      </div>
    </aside>

    <div class="workspace-shell">
      <header class="topbar-shell">
        <div class="topbar-search">
          <AppIcon name="search" :size="16" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索工具、代码片段或功能模块……"
            @keydown="handleSearchKeydown"
          />
        </div>

        <div class="topbar-actions">
          <button class="icon-button" type="button" title="复制">
            <AppIcon name="copy" :size="16" />
          </button>
          <button class="icon-button" type="button" title="粘贴">
            <AppIcon name="paste" :size="16" />
          </button>
          <button class="icon-button" type="button" title="清空">
            <AppIcon name="trash" :size="16" />
          </button>
          <button class="icon-button" type="button" title="分享">
            <AppIcon name="share" :size="16" />
          </button>
          <button class="icon-button" type="button" title="通知">
            <AppIcon name="bell" :size="16" />
          </button>
          <div class="topbar-avatar">17</div>
        </div>
      </header>

      <main class="workspace-main">
        <keep-alive>
          <component
            :is="activeItem.component"
            :key="activeItem.id"
            :active-tool="activeItem"
            :search-query="searchQuery"
            :tools="utilityTools"
            @navigate="switchNav"
          />
        </keep-alive>
      </main>
    </div>
  </div>
</template>
