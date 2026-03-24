<template>
  <router-view />
  <van-tabbar v-if="showTabbar" v-model="active" route>
    <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
    <van-tabbar-item icon="map-marked" to="/map">地图</van-tabbar-item>
    <van-tabbar-item icon="scan" to="/scan">扫码</van-tabbar-item>
    <van-tabbar-item icon="list-switch" to="/stock">库存</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Tabbar, TabbarItem } from 'vant'

const route = useRoute()
const active = ref(0)

// 详情页、入库页、管理页隐藏 Tabbar
const hiddenRoutes = ['/add', '/zone-manage']
const showTabbar = computed(() => {
  return !hiddenRoutes.includes(route.path) && !route.path.startsWith('/detail/')
})
</script>
