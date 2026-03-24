<template>
  <div class="page">
    <van-nav-bar title="厂区地图">
      <template #right>
        <van-icon name="setting-o" size="18" @click="$router.push('/zone-manage')" />
      </template>
    </van-nav-bar>
    <div id="map-container" ref="mapEl" style="width:100%;height:calc(100vh - 46px - 50px)" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import { getZones, getSlots } from '@/utils/cloudbase.js'

const mapEl = ref(null)
let map = null

onMounted(async () => {
  // 初始化地图，使用空白背景（厂区平面图可替换 tileLayer 或 imageOverlay）
  map = L.map(mapEl.value, { crs: L.CRS.Simple, minZoom: -2 })

  const bounds = [[0, 0], [1000, 1000]]
  // 如有厂区平面图，替换下行 URL
  // L.imageOverlay('/floor-plan.png', bounds).addTo(map)
  map.fitBounds(bounds)

  const zones = await getZones()
  const slots = await getSlots()

  // 绘制区域
  for (const z of zones) {
    const rect = L.rectangle(
      [[z.y, z.x], [z.y + z.h, z.x + z.w]],
      { color: z.color || '#1989fa', weight: 2, fillOpacity: 0.2 }
    ).addTo(map)
    rect.bindTooltip(z.name, { permanent: true, direction: 'center' })
  }

  // 绘制库位
  for (const s of slots) {
    const color = s.status === 'occupied' ? '#ee0a24' : '#07c160'
    L.circleMarker([s.y, s.x], { radius: 6, color, fillOpacity: 0.9 })
      .addTo(map)
      .bindPopup(`库位 ${s.slot_id}<br>状态：${s.status === 'occupied' ? '已占用' : '空闲'}`)
  }
})

onUnmounted(() => {
  map?.remove()
})
</script>

<style scoped>
.page { padding-bottom: 50px; }
</style>
