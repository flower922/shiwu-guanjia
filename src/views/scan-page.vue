<template>
  <div class="page">
    <van-nav-bar title="扫码入库" />

    <div v-if="!scanned">
      <div id="qr-reader" style="width:100%" />
      <p class="hint">将条码/二维码对准扫描框</p>
    </div>

    <div v-else class="result">
      <van-icon name="success" size="48" color="#07c160" />
      <p>扫码成功：{{ scannedCode }}</p>
      <van-button type="primary" block @click="goAdd">填写入库信息</van-button>
      <van-button plain block style="margin-top:8px" @click="reset">重新扫码</van-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import { useRouter } from 'vue-router'

const router = useRouter()
const scanned = ref(false)
const scannedCode = ref('')
let scanner = null

onMounted(() => {
  scanner = new Html5Qrcode('qr-reader')
  scanner.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (text) => {
      scannedCode.value = text
      scanned.value = true
      scanner.stop()
    },
    () => {}
  ).catch(() => {})
})

onUnmounted(() => {
  scanner?.stop().catch(() => {})
})

function goAdd() {
  router.push({ path: '/add', query: { code: scannedCode.value } })
}

function reset() {
  scanned.value = false
  scannedCode.value = ''
  scanner.start(
    { facingMode: 'environment' },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (text) => {
      scannedCode.value = text
      scanned.value = true
      scanner.stop()
    },
    () => {}
  ).catch(() => {})
}
</script>

<style scoped>
.page { padding-bottom: 50px; }
.hint { text-align: center; color: #888; margin-top: 12px; }
.result { display: flex; flex-direction: column; align-items: center; padding: 40px 24px; gap: 16px; }
</style>
