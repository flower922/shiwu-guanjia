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

---

## 团队成员与 GitHub 账号

| 角色 | GitHub 用户名 | 负责领域 |
|------|--------------|---------|
| 成员A（仓库 owner） | flower922 | 前端架构 & 地图模块 |
| 成员B | happiness-11 | 扫码 & 物品操作模块 |
| 成员C | wxr888-999 | 数据层 & 部署模块 |

**识别当前操作者**：通过 `git config user.name` 或 `gh auth status` 判断当前是谁在操作，据此决定可以修改哪些文件。

---

## 工具链配置（重要！）

### Git 连接方式
- **使用 SSH 连接 GitHub**，密钥已配置完毕
- 仓库地址：`git@github.com:flower922/warehouse-manager.git`
- **禁止使用 HTTPS 地址**（不要用 https://github.com/... 格式）
- clone 仓库时用：`git clone git@github.com:flower922/warehouse-manager.git`

### GitHub CLI（gh）
- 已安装并完成认证（`gh auth status` 可验证）
- **创建 PR、查看 PR、合并 PR 全部通过 `gh` 命令完成**
- **不需要打开 GitHub 网页做任何操作**

### Node.js & npm
- Node.js LTS 版本已安装
- 使用 npm 管理依赖（不用 yarn 或 pnpm）

---

## Git 分支策略

| 分支 | 用途 | 规则 |
|------|------|------|
| main | 正式发布分支 | **禁止直接推送**，只能通过 PR 从 dev 合并 |
| dev | 开发汇总分支 | 所有功能分支合并到此 |
| feature/map-xxx | 成员A 的功能分支 | 前缀 map 表示地图相关 |
| feature/scan-xxx | 成员B 的功能分支 | 前缀 scan 表示扫码相关 |
| feature/stock-xxx | 成员C 的功能分支 | 前缀 stock 表示库存相关 |
| fix/xxx | 修 bug 专用分支 | 谁的模块谁修 |

### 分支操作流程
1. 开始新任务前：切到 dev → 拉取最新 → 创建 feature/ 分支
2. 开发完成后：提交 → 推送 → 用 `gh pr create` 创建 PR → 目标分支为 dev
3. **合并 PR 由成员A（flower922）在 Claude Code CLI 中执行**

---

## PR 工作流（核心流程）

### 谁在 VSCode Claude Code 插件中操作（成员A/B/C 各自操作）：
```
# 提交并推送代码
git add .
git commit -m "feat: 功能描述"
git push origin feature/分支名

# 创建 PR（目标分支为 dev）
gh pr create --base dev --title "feat: 功能描述" --body "完成了xxx功能"
```

### 谁在 Claude Code CLI 中操作（仅成员A flower922）：
```
# 查看待合并的 PR 列表
gh pr list

# 合并指定 PR（使用 squash merge 压缩合并）
gh pr merge <PR编号> --squash --delete-branch
```

### 规则
- **创建 PR**：三人各自创建自己的 PR，用 `gh pr create`
- **合并 PR**：统一由成员A（flower922）在 Claude Code CLI 中执行 `gh pr merge --squash --delete-branch`
- **合并顺序**：有依赖关系时，先合并被依赖方（通常是 C 的数据层 → A 的地图 → B 的扫码）
- **合并方式**：squash merge（把功能分支的多次提交压缩为一条干净记录）
- **合并后自动删除远程功能分支**（--delete-branch）
- **不要打开 GitHub 网页操作 PR**，全部用 `gh` 命令

---

## Commit 消息规范

| 前缀 | 用途 | 示例 |
|------|------|------|
| feat: | 新功能 | feat: 完成扫码入库页面 |
| fix: | 修复 bug | fix: 修复库位点击无响应 |
| style: | 样式调整 | style: 调整地图页间距 |
| docs: | 文档修改 | docs: 更新 CLAUDE.md |
| chore: | 杂项 | chore: 更新 CloudBase 配置 |

- **提交信息用中文**
- 前缀后加英文冒号和空格，再写中文描述
- 每次提交只做一件事，不要把多个功能混在一个提交里

---

## 文件归属（严格遵守！）

**每人只能修改自己负责的文件。如果需要改别人的文件，先跟对方沟通。**

### 成员A（flower922）的文件
- src/views/map-view.vue
- src/views/zone-manage.vue
- src/router/index.js
- App.vue（Tabbar 部分）
- README.md
- CLAUDE.md

### 成员B（happiness-11）的文件
- src/views/scan-page.vue
- src/views/add-product.vue
- src/utils/stock-out.js

### 成员C（wxr888-999）的文件
- src/utils/cloudbase.js
- src/utils/expire-helper.js
- src/views/stock-list.vue
- src/views/product-detail.vue
- src/views/home-page.vue
- .env / .env.example
- 部署相关配置

### 共同文件（修改需沟通）
- package.json（安装新依赖时会变动，谁装谁提交）
- vite.config.js（一般不动）

---

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
│   ├── home-page.vue       # 首页临期预警（成员C wxr888-999）
│   ├── map-view.vue        # 厂区地图（成员A flower922）
│   ├── scan-page.vue       # 扫码页面（成员B happiness-11）
│   ├── add-product.vue     # 入库表单（成员B happiness-11）
│   ├── stock-list.vue      # 库存列表（成员C wxr888-999）
│   ├── product-detail.vue  # 物品详情（成员C wxr888-999）
│   └── zone-manage.vue     # 区域管理（成员A flower922）
├── router/
│   └── index.js            # 路由配置（成员A flower922）
├── utils/
│   ├── cloudbase.js        # CloudBase 封装（成员C wxr888-999）
│   ├── expire-helper.js    # 临期工具函数（成员C wxr888-999）
│   └── stock-out.js        # 出库函数（成员B happiness-11）
├── App.vue                 # Tabbar 布局（成员A flower922）
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
- **代码注释用中文**，写在关键逻辑处，不要每行都写
- **不要随意升级或更换依赖版本**，用 package.json 里已有的版本

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

---

## 部署配置
- 打包命令：`npm run build`
- 腾讯云 CLI：`@cloudbase/cli`（全局安装）
- 部署命令：`tcb hosting deploy ./dist -e 环境ID`
- 登录方式：`tcb login`（微信扫码）
- 线上地址格式：`https://环境ID.tcloudbaseapp.com`

---

## 安全规则
- `.env` 文件**绝对不能提交到 Git**（已在 .gitignore 中）
- `.env.example` 可以提交（不含真实 ID）
- 不要在代码中硬编码环境ID，统一从 `import.meta.env.VITE_CB_ENV_ID` 读取

---

## 行为约束（Claude Code 必须遵守）

1. **先确认身份再动手**：通过 git config 判断当前操作者，只修改该成员负责的文件
2. **不确定就问，不要自作主张**：遇到模糊需求先向操作者确认，不要猜测着做
3. **不要动别人的文件**：如果任务涉及非当前成员的文件，提醒操作者让对应成员处理
4. **不要随意装新依赖**：如果觉得需要装新的 npm 包，先告诉操作者，确认后再装
5. **不要改 CLAUDE.md**：除非成员A（flower922）明确要求修改
6. **不要改 .gitignore 中的规则**：特别是 .env 的忽略规则
7. **提交前检查**：确保没有修改不该改的文件（用 `git diff --name-only` 检查）
8. **保持简洁**：这是小型项目，不要引入复杂架构、设计模式或不必要的抽象层
