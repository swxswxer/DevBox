<script setup>
import { computed, ref } from 'vue'
import md5 from 'blueimp-md5'
import { XMLParser, XMLValidator } from 'fast-xml-parser'

const callbackContent = ref('')
const merchantKey = ref('')
const errorMessage = ref('')
const warningMessage = ref('')
const result = ref(null)
const copiedField = ref('')

const canVerify = computed(() => callbackContent.value.trim().length > 0)
const excludedFields = new Set(['sign', 'leshua', 'error_code'])

function stringifyParamValue(value) {
  if (value !== null && typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function parseCallback(input) {
  const trimmed = input.trim()

  if (trimmed.startsWith('<')) {
    const validationResult = XMLValidator.validate(trimmed)
    if (validationResult !== true) {
      throw new Error(`XML 解析失败：${validationResult.err.msg}`)
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      ignoreDeclaration: true,
      parseTagValue: false,
      trimValues: true
    })
    const parsed = parser.parse(trimmed)
    const keys = Object.keys(parsed)

    if (keys.length === 1 && keys[0] === 'leshua') {
      return parsed.leshua
    }
    return parsed
  }

  try {
    return JSON.parse(trimmed)
  } catch (error) {
    throw new Error(`JSON 解析失败：${error.message}`)
  }
}

function buildVerification(payload, key) {
  const callbackSign = payload.sign
  const signPayload = Object.keys(payload)
    .filter(field => !excludedFields.has(field))
    .sort()
    .map(field => `${field}=${stringifyParamValue(payload[field])}&`)
    .join('')
  const stringSignTemp = `${signPayload}key=${key}`
  const realSign = md5(stringSignTemp)

  return {
    valid: realSign === callbackSign,
    stringSignTemp,
    callbackSign,
    realSign
  }
}

function verifyCallback() {
  errorMessage.value = ''
  warningMessage.value = ''
  copiedField.value = ''
  result.value = null

  if (!callbackContent.value.trim()) return

  try {
    const parsed = parseCallback(callbackContent.value)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      errorMessage.value = '不支持该回调结构，请输入顶层为对象的 JSON 或以 <leshua> 包裹的 XML。'
      return
    }
    if (!Object.prototype.hasOwnProperty.call(parsed, 'sign')) {
      errorMessage.value = '回调内容中缺少 sign 字段，无法验签。'
      return
    }
    if (typeof parsed.sign === 'object' && parsed.sign !== null) {
      errorMessage.value = '回调内容中的 sign 必须是字符串。'
      return
    }
    if (!merchantKey.value) {
      warningMessage.value = '商户 key 为空，已按 key= 参与验签计算。'
    }

    result.value = buildVerification(parsed, merchantKey.value)
  } catch (error) {
    errorMessage.value = error.message
  }
}

function clearInput() {
  callbackContent.value = ''
  merchantKey.value = ''
  errorMessage.value = ''
  warningMessage.value = ''
  result.value = null
  copiedField.value = ''
}

function copyText(text, field) {
  navigator.clipboard.writeText(String(text)).then(() => {
    copiedField.value = field
    setTimeout(() => {
      if (copiedField.value === field) copiedField.value = ''
    }, 2000)
  }).catch(error => console.error('复制失败:', error))
}
</script>

<template>
  <div class="verify-container">
    <div class="main-content">
      <section class="panel input-section">
        <header class="section-header"><h3>乐刷支付回调验签</h3></header>
        <div class="input-fields">
          <div class="input-group callback-group">
            <label class="input-label">回调内容（JSON / XML）</label>
            <textarea
              v-model="callbackContent"
              class="callback-input"
              placeholder='请输入包含 sign 的 JSON，或以 <leshua> 包裹的 XML 回调'
            ></textarea>
          </div>
          <div class="input-group">
            <label class="input-label">商户 key</label>
            <input v-model="merchantKey" class="key-input" placeholder="请输入商户密钥 key..." type="text" />
          </div>
        </div>
        <div class="button-group">
          <button class="action-button primary-button" :disabled="!canVerify" @click="verifyCallback">开始验签</button>
          <button class="action-button" @click="clearInput">清空</button>
        </div>
      </section>

      <section class="panel output-section">
        <header class="section-header"><h3>验签结果</h3></header>
        <div class="output-content">
          <div v-if="errorMessage" class="message error-message">{{ errorMessage }}</div>
          <div v-if="warningMessage" class="message warning-message">{{ warningMessage }}</div>

          <template v-if="result">
            <div class="verification-status" :class="result.valid ? 'status-success' : 'status-failed'">
              <strong>{{ result.valid ? '验签通过' : '验签失败' }}</strong>
              <span>{{ result.valid ? '回调签名与本地计算结果一致' : '回调签名与本地计算结果不一致' }}</span>
            </div>
            <div class="result-block">
              <div class="result-header">
                <span>待签名字符串</span>
                <button class="copy-button" @click="copyText(result.stringSignTemp, 'payload')">{{ copiedField === 'payload' ? '已复制' : '复制' }}</button>
              </div>
              <pre class="result-text">{{ result.stringSignTemp }}</pre>
            </div>
            <div class="result-block">
              <div class="result-header">
                <span>回调 sign</span>
                <button class="copy-button" @click="copyText(result.callbackSign, 'callbackSign')">{{ copiedField === 'callbackSign' ? '已复制' : '复制' }}</button>
              </div>
              <pre class="result-text sign-text">{{ result.callbackSign }}</pre>
            </div>
            <div class="result-block last-result">
              <div class="result-header">
                <span>本地计算 sign（MD5 小写）</span>
                <button class="copy-button" @click="copyText(result.realSign, 'realSign')">{{ copiedField === 'realSign' ? '已复制' : '复制' }}</button>
              </div>
              <pre class="result-text sign-text">{{ result.realSign }}</pre>
            </div>
          </template>
          <div v-else-if="!errorMessage" class="empty-output">请输入回调内容和商户 key 后点击开始验签</div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.verify-container { display: flex; flex-direction: column; width: 100%; height: 100%; overflow: hidden; }
.main-content { display: flex; flex: 1; gap: 20px; min-height: 0; align-items: center; overflow: hidden; }
.panel { display: flex; flex: 1; flex-direction: column; height: 82%; min-height: 0; overflow: hidden; border: 1px solid #e0e0e0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, .1); }
.input-section { margin-left: 20px; }
.output-section { margin-right: 20px; }
.section-header { display: flex; flex-shrink: 0; align-items: center; height: 48px; padding: 12px 16px; box-sizing: border-box; background: #f5f5f5; border-bottom: 1px solid #e0e0e0; }
.section-header h3 { margin: 0; color: #333; font-size: 14px; font-weight: 600; }
.input-fields { display: flex; flex: 1; flex-direction: column; min-height: 0; }
.input-group { display: flex; flex-direction: column; padding: 14px 16px; border-bottom: 1px solid #eee; }
.callback-group { flex: 1; min-height: 0; }
.input-label { margin-bottom: 8px; color: #555; font-size: 13px; font-weight: 600; }
.callback-input { flex: 1; width: 100%; min-height: 0; padding: 12px; resize: none; overflow-y: auto; border: 1px solid #d9d9d9; border-radius: 4px; background: #fafafa; font: 13px/1.5 Monaco, Menlo, 'Ubuntu Mono', monospace; }
.key-input { width: 100%; height: 36px; padding: 0 12px; border: 1px solid #d9d9d9; border-radius: 4px; background: #fff; font-size: 14px; }
.callback-input:focus, .key-input:focus { outline: none; border-color: #409eff; background: #fff; }
.button-group { display: flex; flex-shrink: 0; gap: 12px; padding: 12px 16px; background: #f5f5f5; border-top: 1px solid #e0e0e0; }
.action-button { flex: 1; padding: 8px 20px; cursor: pointer; border: 1px solid #d9d9d9; border-radius: 4px; background: #fff; font-size: 14px; transition: .3s; }
.action-button:hover:not(:disabled) { color: #409eff; border-color: #409eff; }
.action-button:disabled { cursor: not-allowed; opacity: .6; }
.primary-button { color: #fff; border-color: #409eff; background: #409eff; }
.primary-button:hover:not(:disabled) { color: #fff; background: #66b1ff; }
.output-content { flex: 1; min-height: 0; padding: 16px; overflow-y: auto; background: #fafafa; }
.message, .verification-status { margin-bottom: 12px; padding: 10px 12px; border-radius: 4px; font-size: 13px; line-height: 1.5; }
.error-message, .status-failed { color: #cf1322; background: #fff1f0; border: 1px solid #ffa39e; }
.warning-message { color: #ad6800; background: #fffbe6; border: 1px solid #ffe58f; }
.status-success { color: #237804; background: #f6ffed; border: 1px solid #b7eb8f; }
.verification-status { display: flex; flex-direction: column; gap: 2px; }
.verification-status strong { font-size: 15px; }
.result-block { margin-bottom: 14px; overflow: hidden; border: 1px solid #e8e8e8; border-radius: 6px; background: #fff; }
.last-result { margin-bottom: 0; }
.result-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 9px 12px; background: #f7f7f7; border-bottom: 1px solid #eee; color: #333; font-size: 13px; font-weight: 600; }
.copy-button { flex-shrink: 0; padding: 4px 12px; cursor: pointer; color: #409eff; border: 1px solid #409eff; border-radius: 4px; background: #fff; font-size: 12px; transition: .3s; }
.copy-button:hover { color: #fff; background: #409eff; }
.result-text { max-height: 160px; margin: 0; padding: 12px; overflow: auto; white-space: pre-wrap; word-break: break-all; color: #333; background: #fff; font: 13px/1.5 Monaco, Menlo, 'Ubuntu Mono', monospace; }
.sign-text { color: #0958d9; font-weight: 600; }
.empty-output { display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 14px; }
@media (max-width: 900px) {
  .main-content { flex-direction: column; align-items: stretch; padding: 16px; overflow-y: auto; }
  .panel { height: auto; min-height: 420px; margin: 0; }
}
</style>
