<template>
  <div class="page">
    <van-nav-bar title="入库" left-arrow @click-left="$router.back()" />

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="form.code" name="code" label="产品编码" placeholder="扫码自动填入" required :rules="[{ required: true }]" />
        <van-field v-model="form.name" name="name" label="产品名称" placeholder="请输入" required :rules="[{ required: true }]" />
        <van-field v-model="form.spec" name="spec" label="规格型号" placeholder="请输入" />
        <van-field v-model="form.quantity" name="quantity" label="数量" type="number" placeholder="请输入" required :rules="[{ required: true }]" />
        <van-field v-model="form.slot_id" name="slot_id" label="库位编号" placeholder="如 A-01" required :rules="[{ required: true }]" />
        <van-field v-model="form.expire_date" name="expire_date" label="保质期" placeholder="YYYY-MM-DD" />
        <van-field v-model="form.note" name="note" label="备注" type="textarea" rows="2" autosize />
      </van-cell-group>

      <div style="padding:16px">
        <van-button round block type="primary" native-type="submit" :loading="loading">确认入库</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showSuccessToast, showFailToast } from 'vant'
import { addProduct, updateSlotStatus } from '@/utils/cloudbase.js'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const form = ref({
  code: route.query.code || '',
  name: '',
  spec: '',
  quantity: '',
  slot_id: '',
  expire_date: '',
  note: ''
})

async function onSubmit() {
  loading.value = true
  try {
    await addProduct({
      ...form.value,
      quantity: Number(form.value.quantity),
      created_at: new Date().toISOString(),
      created_by: 'user'
    })
    await updateSlotStatus(form.value.slot_id, 'occupied')
    showSuccessToast('入库成功')
    router.replace('/stock')
  } catch (e) {
    showFailToast('入库失败：' + e.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page { padding-bottom: 20px; }
</style>
