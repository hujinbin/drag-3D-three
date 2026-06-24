# drag-3D-three

一个强大的 3D/2D 大屏可视化拖拽编辑器,支持 Three.js 3D 场景和 ECharts 2D 图表。

## ✨ 特性

- 🎨 **双模式支持**: 支持 Three.js 3D 大屏和 ECharts 2D 大屏
- 🎲 **3D 场景编辑**: 
  - 拖拽放置立方体、球体、圆柱体、金字塔等 3D 元素
  - 实时预览和交互式场景操作
  - 自由视角旋转和缩放
- 📊 **2D 图表可视化**:
  - 支持柱状图、折线图、饼图、仪表盘等多种图表类型
  - 响应式布局自适应
  - 支持静态 JSON 数据和 API 接口数据源
  - 支持 API 调试、响应路径提取和手动刷新
- 📦 **模板系统**: 内置多个精美模板,快速开始创作
- 💾 **案例库**: 保存和管理你的作品
- 🔗 **全屏分享**: 分享链接可公开查看，仅展示大屏画布
- 🎯 **直观操作**: 简单易用的拖拽界面

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 📖 使用指南

### 创建新大屏

1. 从主页点击 **"创建大屏"** 按钮
2. 选择大屏类型:
   - **Three.js 3D 大屏**: 用于创建立体可视化场景
   - **ECharts 2D 大屏**: 用于创建数据图表展示
3. 选择一个模板开始创作

### 内置模板

#### 3D 模板
- 🎲 **基础3D场景**: 包含基本的立方体、球体和圆柱体
- 🏢 **建筑展示**: 模拟建筑物和城市场景
- 💾 **数据中心**: 服务器机架可视化

#### 2D 模板
- 📊 **基础图表**: 包含柱状图、折线图和饼图
- 📈 **数据仪表板**: 综合数据展示看板
- 🗺️ **地图可视化**: 地理数据分布展示

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **3D 引擎**: Three.js
- **图表库**: ECharts + vue-echarts
- **状态管理**: Pinia
- **路由**: Vue Router
- **样式**: Tailwind CSS

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── ThreeDWorkspace.vue    # 3D 工作区
│   ├── ElementToolbar.vue     # 元素工具栏
│   └── ElementProperties.vue  # 属性面板
├── views/              # 页面组件
│   ├── HomeView.vue           # 主页
│   ├── SelectScreenType.vue   # 选择大屏类型
│   ├── ThreeDScreen.vue       # 3D 大屏
│   ├── EChartsScreen.vue      # 2D 大屏
│   └── EditorView.vue         # 编辑器
├── stores/             # 状态管理
│   ├── templates.ts           # 模板数据
│   ├── cases.ts              # 案例管理
│   └── auth.ts               # 认证状态
└── router/             # 路由配置
    └── index.ts
```

## 🎯 功能特点

### 3D 大屏功能
- ✅ 拖拽放置 3D 元素
- ✅ 元素信息面板显示
- ✅ 实时统计元素数量
- ✅ 重置视角功能
- ✅ 全屏展示模式

### 2D 大屏功能
- ✅ 多种图表类型支持
- ✅ 灵活的网格布局系统
- ✅ 静态数据写入与保存
- ✅ API 接口数据源调试、写入与刷新
- ✅ 分享页全屏只读展示
- ✅ 响应式设计
- ✅ 全屏展示模式

## 📝 开发说明

本项目使用 Vue 3 的 `<script setup>` 语法,详细信息请参考 [Vue 3 文档](https://vuejs.org/)。

## 📄 License

MIT

# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).
