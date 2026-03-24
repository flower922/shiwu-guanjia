<template>
  <div class="page">
    <van-nav-bar title="区域管理" left-arrow @click-left="$router.back()">
      <template #right>
        <van-icon name="plus" size="18" @click="openAdd" />
      </template>
    </van-nav-bar>

    <van-cell-group inset style="margin-top:12px">
      <van-empty v-if="zones.length === 0" description="暂无区域" />
      <van-swipe-cell v-for="z in zones" :key="z._id">
        <van-cell :title="z.name" :label="`编号 ${z.code}`">
          <template #value>
            <span :style="{ color: z.color }">■</span> {{ z.color }}
          </template>
        </van-cell>
        <template #right>
          <van-button square type="danger" text="删除" @click="onDelete(z)" />
        </template>
      </van-swipe-cell>
    </van-cell-group>

    <!-- 新增区域弹窗 -->
    <van-dialog v-model:show="showDialog" title="新增区域" show-cancel-button @confirm="onAdd">
      <van-form ref="formRef" style="padding:16px">
        <van-field v-model="form.name" label="区域名称" placeholder="如 原料区" required />
        <van-field v-model="form.code" label="区域编号" placeholder="如 A" required />
        <van-field v-model="form.color" label="颜色" placeholder="#00D4AA" />
      </van-form>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showSuccessToast, showFailToast } from 'vant'
import { getZones, addZone, deleteZone } from '@/utils/cloudbase.js'

const zones = ref([])
const showDialog = ref(false)
const form = ref({ name: '', code: '', color: '#1989fa', x: 0, y: 0, w: 100, h: 100 })

onMounted(load)

async function load() {
  zones.value = await getZones()
}

function openAdd() {
  form.value = { name: '', code: '', color: '#1989fa', x: 0, y: 0, w: 100, h: 100 }
  showDialog.value = true
}

async function onAdd() {
  try {
    await addZone(form.value)
    showSuccessToast('添加成功')
    await load()
  } catch (e) {
    showFailToast('添加失败：' + e.message)
  }
}

async function onDelete(z) {
  try {
    await deleteZone(z._id)
    showSuccessToast('删除成功')
    await load()
  } catch (e) {
    showFailToast('删除失败：' + e.message)
  }
}
</script>

<style scoped>
.page { padding-bottom: 20px; }
</style>
