<template>
  <div class="page">
    <van-nav-bar :title="product?.name || '物品详情'" left-arrow @click-left="$router.back()" />

    <van-loading v-if="loading" vertical style="padding:40px 0">加载中...</van-loading>

    <template v-else-if="product">
      <van-cell-group inset style="margin-top:12px">
        <van-cell title="产品编码" :value="product.code" />
        <van-cell title="产品名称" :value="product.name" />
        <van-cell title="规格型号" :value="product.spec || '—'" />
        <van-cell title="数量" :value="product.quantity" />
        <van-cell title="库位" :value="product.slot_id" />
        <van-cell title="保质期" :value="product.expire_date || '—'">
          <template #value>
            <span>{{ product.expire_date || '—' }}</span>
            <van-tag v-if="expireStatus === 'expired'" type="danger" style="margin-left:6px">已过期</van-tag>
            <van-tag v-else-if="expireStatus === 'warning'" type="warning" style="margin-left:6px">临期</van-tag>
          </template>
        </van-cell>
        <van-cell title="备注" :value="product.note || '—'" />
        <van-cell title="入库时间" :value="product.created_at?.slice(0, 10)" />
        <van-cell title="操作人" :value="product.created_by || '—'" />
      </van-cell-group>

      <div style="padding:16px;display:flex;gap:12px">
        <van-button type="danger" block @click="onStockOut">出库</van-button>
      </div>
    </template>

    <van-empty v-else description="未找到该物品" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { showConfirmDialog, showSuccessToast, showFailToast } from 'vant'
import { getProductById } from '@/utils/cloudbase.js'
import { getExpireStatus } from '@/utils/expire-helper.js'
import { stockOut } from '@/utils/stock-out.js'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(true)

onMounted(async () => {
  product.value = await getProductById(route.params.id)
  loading.value = false
})

const expireStatus = computed(() => getExpireStatus(product.value?.expire_date))

async function onStockOut() {
  await showConfirmDialog({ title: '确认出库', message: `确认将「${product.value.name}」出库？` })
  try {
    await stockOut(product.value._id, product.value.slot_id)
    showSuccessToast('出库成功')
    router.replace('/stock')
  } catch (e) {
    showFailToast('出库失败：' + e.message)
  }
}
</script>

<style scoped>
.page { padding-bottom: 20px; }
</style>
