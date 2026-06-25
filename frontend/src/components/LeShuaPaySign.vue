<script setup>
import { computed, ref } from 'vue'
import md5 from 'blueimp-md5'

const inputJson = ref('')
const merchantKey = ref('')
const errorMessage = ref('')
const warningMessage = ref('')
const result = ref(null)
const copiedField = ref('')

const canGenerate = computed(() => inputJson.value.trim().length > 0)

function stringifyParamValue(value) {
  if (value !== null && typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

function buildSignPayload(payload, key) {
  const sortedKeys = Object.keys(payload)
    .filter(itemKey => itemKey !== 'sign')
    .sort()

  const stringA = sortedKeys
    .map(itemKey => `${itemKey}=${stringifyParamValue(payload[itemKey])}`)
    .join('&')
  const stringSignTemp = `${stringA}&key=${key}`
  const sign = md5(stringSignTemp).toUpperCase()
  const signedJson = {
    ...payload,
    sign
  }

  return {
    stringSignTemp,
    sign,
    signedJson: JSON.stringify(signedJson, null, 2)
  }
}

function generateSign() {
  errorMessage.value = ''
  warningMessage.value = ''
  copiedField.value = ''
  result.value = null

  if (!inputJson.value.trim()) {
    return
  }

  try {
    const parsed = JSON.parse(inputJson.value)

    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      errorMessage.value = '不支持该 JSON 类型，请输入顶层为对象的 JSON。'
      return
    }

    if (!merchantKey.value) {
      warningMessage.value = '商户 key 为空，已按 &key= 参与签名计算。'
    }

    result.value = buildSignPayload(parsed, merchantKey.value)
  } catch (error) {
    errorMessage.value = `JSON 解析失败：${error.message}`
  }
}

function clearInput() {
  inputJson.value = ''
  merchantKey.value = ''
  errorMessage.value = ''
  warningMessage.value = ''
  result.value = null
  copiedField.value = ''
}

function copyText(text, field) {
  if (text === null || text === undefined) return
  navigator.clipboard.writeText(text).then(() => {
    copiedField.value = field
    setTimeout(() => {
      if (copiedField.value === field) {
        copiedField.value = ''
      }
    }, 2000)
  }).catch(err => {
    console.error('复制失败:', err)
  })
}
</script>

<template>
  <div class="leshua-sign-container">
    <div class="main-content">
      <div class="input-section">
        <div class="section-header">
          <h3>乐刷支付接口加签</h3>
        </div>
        <div class="input-fields">
          <div class="input-group json-group">
            <label class="input-label">请求 JSON（不带 sign）</label>
            <textarea
              v-model="inputJson"
              class="json-input"
              placeholder='请输入顶层为对象的 JSON，例如：&#10;{&#10;  "server": "query_status",&#10;  "merchant_id": "1234567890"&#10;}'
            ></textarea>
          </div>
          <div class="input-group">
            <label class="input-label">商户 key</label>
            <input
              v-model="merchantKey"
              class="key-input"
              placeholder="请输入商户密钥 key..."
              type="text"
            />
          </div>
        </div>
        <div class="button-group">
          <button
            class="action-button primary-button"
            @click="generateSign"
            :disabled="!canGenerate"
          >
            生成签名
          </button>
          <button
            class="action-button"
            @click="clearInput"
          >
            清空
          </button>
        </div>
      </div>

      <div class="output-section">
        <div class="section-header">
          <h3>签名结果</h3>
        </div>
        <div class="output-content">
          <div v-if="errorMessage" class="message error-message">
            {{ errorMessage }}
          </div>
          <div v-if="warningMessage" class="message warning-message">
            {{ warningMessage }}
          </div>

          <template v-if="result">
            <div class="result-block">
              <div class="result-header">
                <span>stringSignTemp（待加密字符串）</span>
                <button class="copy-button" @click="copyText(result.stringSignTemp, 'stringSignTemp')">
                  {{ copiedField === 'stringSignTemp' ? '已复制' : '复制' }}
                </button>
              </div>
              <pre class="result-text">{{ result.stringSignTemp }}</pre>
            </div>

            <div class="result-block">
              <div class="result-header">
                <span>sign（MD5 大写）</span>
                <button class="copy-button" @click="copyText(result.sign, 'sign')">
                  {{ copiedField === 'sign' ? '已复制' : '复制' }}
                </button>
              </div>
              <pre class="result-text sign-text">{{ result.sign }}</pre>
            </div>

            <div class="result-block json-result">
              <div class="result-header">
                <span>组装 sign 后的 JSON</span>
                <button class="copy-button" @click="copyText(result.signedJson, 'signedJson')">
                  {{ copiedField === 'signedJson' ? '已复制' : '复制' }}
                </button>
              </div>
              <pre class="result-text">{{ result.signedJson }}</pre>
            </div>
          </template>

          <div v-else-if="!errorMessage" class="empty-output">
            请在左侧输入 JSON 和商户 key 后点击生成签名
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leshua-sign-container {
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
  align-items: center;
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
  height: 82%;
}

.input-section {
  margin-left: 20px;
}

.output-section {
  margin-right: 20px;
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

.input-fields {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  border-bottom: 1px solid #eeeeee;
}

.input-group.json-group {
  flex: 1;
  min-height: 0;
}

.input-label {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.json-input {
  flex: 1;
  width: 100%;
  min-height: 0;
  padding: 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  resize: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  background-color: #fafafa;
  overflow-y: auto;
}

.key-input {
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;
}

.json-input:focus,
.key-input:focus {
  outline: none;
  border-color: #409eff;
  background-color: #fff;
}

.button-group {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.action-button {
  flex: 1;
  padding: 8px 20px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.action-button:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
}

.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.primary-button {
  color: #fff;
  border-color: #409eff;
  background-color: #409eff;
}

.primary-button:hover:not(:disabled) {
  color: #fff;
  background-color: #66b1ff;
}

.output-content {
  flex: 1;
  min-height: 0;
  padding: 16px;
  background-color: #fafafa;
  overflow-y: auto;
}

.message {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.5;
}

.error-message {
  color: #cf1322;
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
}

.warning-message {
  color: #ad6800;
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
}

.result-block {
  margin-bottom: 14px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  background-color: #fff;
}

.json-result {
  margin-bottom: 0;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 9px 12px;
  border-bottom: 1px solid #eeeeee;
  background-color: #f7f7f7;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.copy-button {
  flex-shrink: 0;
  padding: 4px 12px;
  font-size: 12px;
  color: #409eff;
  border: 1px solid #409eff;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.copy-button:hover {
  color: #fff;
  background-color: #409eff;
}

.result-text {
  margin: 0;
  max-height: 160px;
  padding: 12px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
}

.sign-text {
  color: #0958d9;
  font-weight: 600;
}

.empty-output {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 14px;
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
    align-items: stretch;
    padding: 16px;
    overflow-y: auto;
  }

  .input-section,
  .output-section {
    height: auto;
    min-height: 420px;
    margin: 0;
  }
}
</style>
