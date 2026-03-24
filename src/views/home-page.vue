<template>
  <div class="page">
    <van-nav-bar title="临期预警" />

    <van-tabs v-model:active="tab" sticky>
      <van-tab title="已过期" :badge="expired.length || ''">
        <van-empty v-if="expired.length === 0" description="暂无过期物品" />
        <van-cell-group v-else inset style="margin-top:12px">
          <van-cell
            v-for="p in expired"
            :key="p._id"
            :title="p.name"
            :label="`${p.spec || ''} · ${p.slot_id}`"
            is-link
            @click="$router.push('/detail/' + p._id)"
          >
            <template #value>
              <van-tag type="danger">已过期</van-tag>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>

      <van-tab title="30天内临期" :badge="warning.length || ''">
        <van-empty v-if="warning.length === 0" description="暂无临期物品" />
        <van-cell-group v-else inset style="margin-top:12px">
          <van-cell
            v-for="p in warning"
            :key="p._id"
            :title="p.name"
            :label="`${p.spec || ''} · ${p.slot_id}`"
            is-link
            @click="$router.push('/detail/' + p._id)"
          >
            <template #value>
              <van-tag type="warning">{{ daysUntilExpire(p.expire_date) }}天</van-tag>
            </template>
          </van-cell>
        </van-cell-group>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProducts } from '@/utils/cloudbase.js'
import { filterExpiring, daysUntilExpire } from '@/utils/expire-helper.js'

const tab = ref(0)
const expired = ref([])
const warning = ref([])

onMounted(async () => {
  const products = await getProducts()
  const result = filterExpiring(products)
  expired.value = result.expired
  warning.value = result.warning
})
</script>

<style scoped>
.page { padding-bottom: 60px; }
</style>
