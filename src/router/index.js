import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/views/home-page.vue') },
  { path: '/map', component: () => import('@/views/map-view.vue') },
  { path: '/scan', component: () => import('@/views/scan-page.vue') },
  { path: '/stock', component: () => import('@/views/stock-list.vue') },
  { path: '/add', component: () => import('@/views/add-product.vue') },
  { path: '/detail/:id', component: () => import('@/views/product-detail.vue') },
  { path: '/zone-manage', component: () => import('@/views/zone-manage.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
