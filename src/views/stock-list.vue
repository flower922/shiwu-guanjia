<template>
  <div class="page">
    <van-nav-bar title="库存列表" />

    <van-search v-model="keyword" placeholder="搜索产品名称/编码" @input="onSearch" />

    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-empty v-if="list.length === 0 && !refreshing" description="暂无库存" />
      <van-cell-group inset v-else>
        <van-cell
          v-for="p in list"
          :key="p._id"
          :title="p.name"
          :label="`${p.spec || ''} · 库位 ${p.slot_id} · 数量 ${p.quantity}`"
          is-link
          @click="$router.push('/detail/' + p._id)"
        >
          <template #value>
            <van-tag v-if="getStatus(p) === 'expired'" type="danger">过期</van-tag>
            <van-tag v-else-if="getStatus(p) === 'warning'" type="warning">临期</van-tag>
          </template>
        </van-cell>
      </van-cell-group>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getProducts } from '@/utils/cloudbase.js'
import { getExpireStatus } from '@/utils/expire-helper.js'

const keyword = ref('')
const all = ref([])
const list = ref([])
const refreshing = ref(false)

onMounted(load)

async function load() {
  all.value = await getProducts()
  filter()
}

function filter() {
  const kw = keyword.value.toLowerCase()
  list.value = kw
    ? all.value.filter(p => p.name?.toLowerCase().includes(kw) || p.code?.toLowerCase().includes(kw))
    : [...all.value]
}

function onSearch() { filter() }

async function onRefresh() {
  await load()
  refreshing.value = false
}

function getStatus(p) { return getExpireStatus(p.expire_date) }
</script>

<style scoped>
.page { padding-bottom: 60px; }
</style>
