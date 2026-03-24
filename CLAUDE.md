# 实物管家 — 工厂仓库管理 H5 应用

## 项目简介
Vue 3 + Vant 4 + 腾讯云 CloudBase 的移动端优先 H5 网页应用。
功能：厂区地图定位、扫码入库、库存管理、临期预警。

## 技术栈
- 前端：Vue 3 + Vite + Vue Router 4 + Pinia
- UI：Vant 4（移动端组件库）
- 地图：Leaflet.js（加载厂区 PNG 平面图）
- 扫码：html5-qrcode
- 后端：腾讯云 CloudBase（@cloudbase/js-sdk）
- 部署：腾讯云静态网站托管（自带 HTTPS）

## CloudBase 环境
- 环境ID：从 .env 文件读取 VITE_CB_ENV_ID
- 初始化：import { db } from '@/utils/cloudbase.js'

## 数据库集合与字段（严格使用以下字段名，一个字母都不能改）

### zones（区域）
| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| name | string | 区域名称，如"原料区" |
| code | string | 区域编号，如 A、B、C |
| x | number | 地图横向位置 |
| y | number | 地图纵向位置 |
| w | number | 区域宽度 |
| h | number | 区域高度 |
| color | string | 显示颜色，如 #00D4AA |

### slots（库位）
| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| slot_id | string | 库位编号，如 A-01 |
| zone_code | string | 所属区域编号 |
| x | number | 地图横向位置 |
| y | number | 地图纵向位置 |
| status | string | empty 或 occupied |

### products（产品）
| 字段 | 类型 | 说明 |
|------|------|------|
| _id | string | 自动生成 |
| code | string | 产品编码（扫码得到） |
| name | string | 产品名称 |
| spec | string | 规格型号 |
| quantity | number | 数量 |
| slot_id | string | 存放库位，如 A-01 |
| expire_date | string | 保质期日期，格式 YYYY-MM-DD |
| note | string | 备注 |
| created_at | string | 入库时间 ISO 格式 |
| created_by | string | 操作人 |

## 目录结构
```
src/
├── views/          # 页面
│   ├── home-page.vue       # 首页临期预警（成员C）
│   ├── map-view.vue        # 厂区地图（成员A）
│   ├── scan-page.vue       # 扫码页面（成员B）
│   ├── add-product.vue     # 入库表单（成员B）
│   ├── stock-list.vue      # 库存列表（成员C）
│   ├── product-detail.vue  # 物品详情（成员C）
│   └── zone-manage.vue     # 区域管理（成员A）
├── router/
│   └── index.js            # 路由配置（成员A）
├── utils/
│   ├── cloudbase.js        # CloudBase 封装（成员C）
│   ├── expire-helper.js    # 临期工具函数（成员C）
│   └── stock-out.js        # 出库函数（成员B）
├── App.vue                 # Tabbar 布局
└── main.js                 # 入口
```

## 命名规范
- 文件名：小写 + 横线，如 scan-page.vue
- 变量名：小驼峰，如 slotId、zoneCode
- 集合名：全小写，zones / slots / products
- 主题色：#1989fa（Vant 默认蓝）

## 代码风格
- 这是小型项目，保持简洁，不要过度设计
- 不要加用不到的功能
- 不要过度封装，直接写清楚即可
- 每个 .vue 文件用 <script setup> 语法
- 数据操作统一调用 cloudbase.js 的函数，不要在页面里直接写数据库操作

## 路由配置（7条）
| 路径 | 页面 | 说明 |
|------|------|------|
| / | home-page | 首页预警看板 |
| /map | map-view | 厂区地图 |
| /scan | scan-page | 扫码页面 |
| /stock | stock-list | 库存列表 |
| /add | add-product | 入库表单 |
| /detail/:id | product-detail | 物品详情 |
| /zone-manage | zone-manage | 区域管理 |

## Tabbar（底部4个Tab）
首页(/) | 地图(/map) | 扫码(/scan) | 库存(/stock)
详情页、入库页、管理页隐藏 Tabbar
