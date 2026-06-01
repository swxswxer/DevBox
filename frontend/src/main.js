import {createApp} from 'vue'
import App from './App.vue'
import './style.css';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const textInputSelector = 'input, textarea, [contenteditable="true"]'

function disableNativeTextAssistance(root = document) {
  const applyAttributes = (element) => {
    element.setAttribute('spellcheck', 'false')
    element.setAttribute('autocomplete', 'off')
    element.setAttribute('autocorrect', 'off')
    element.setAttribute('autocapitalize', 'off')
  }

  if (root instanceof Element && root.matches(textInputSelector)) {
    applyAttributes(root)
  }

  root.querySelectorAll?.(textInputSelector).forEach(applyAttributes)
}

disableNativeTextAssistance()

const textInputObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        disableNativeTextAssistance(node)
      }
    })
  })
})

textInputObserver.observe(document.documentElement, {
  childList: true,
  subtree: true,
})

createApp(App).use(ElementPlus).mount('#app')
disableNativeTextAssistance()
