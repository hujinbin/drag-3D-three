<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white overflow-hidden relative">
    <!-- 动态背景装饰 -->
    <div class="absolute inset-0 overflow-hidden opacity-15">
      <div v-for="n in 30" :key="n"
           class="absolute rounded-lg bg-gradient-to-br from-blue-400 to-purple-500"
           :style="{
             width: `${Math.random() * 80 + 20}px`,
             height: `${Math.random() * 80 + 20}px`,
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             opacity: Math.random() * 0.4 + 0.05,
             animationDelay: `${Math.random() * 8}s`,
             animationDuration: `${Math.random() * 12 + 10}s`
           }"
           style="animation: floatAnim 18s infinite ease-in-out;"
      ></div>
    </div>

    <!-- 主内容 -->
    <div class="container mx-auto px-6 py-16 relative z-10 max-w-6xl">

      <!-- Hero 区域 -->
      <div class="text-center mb-16 mt-6">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/40 border border-blue-500/30 text-blue-300 text-sm mb-6">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          拖屏工坊 — 让大屏可视化变得简单
        </div>

        <h1 class="text-5xl md:text-7xl font-black mb-6 leading-tight">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400">
            一个通过拖拉拽，
          </span><br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-300">
            自动生成 3D、二维的大屏页面的应用
          </span>
        </h1>
        <p class="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mt-6">
          无需编程经验，通过直观的拖拽操作，轻松创建专业级的 3D 场景与 2D 数据可视化大屏
        </p>

        <!-- CTA 按钮组 -->
        <div class="mt-10 flex items-center justify-center gap-5 flex-wrap">
          <router-link
            to="/select-screen"
            class="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white text-lg font-bold rounded-2xl hover:shadow-[0_0_40px_rgba(99,102,241,0.45)] transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            创建大屏
          </router-link>

          <router-link
            to="/cases"
            class="inline-flex items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm text-white text-base font-semibold rounded-2xl hover:bg-white/20 border border-white/20 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            浏览案例库
          </router-link>
        </div>
      </div>

      <!-- 特性展示卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <!-- 卡片 1: 3D 编辑器 -->
        <div class="group bg-white/5 backdrop-blur-md p-7 rounded-2xl border border-white/10 transform hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-2xl mb-5 shadow-lg shadow-blue-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-3 text-white">3D 大屏编辑器</h3>
          <p class="text-slate-400 leading-relaxed">基于 Three.js 构建，支持立方体、球体、圆柱体等多种 3D 元素拖拽放置，自由视角旋转缩放。</p>
          <ul class="mt-4 space-y-2 text-sm text-slate-500">
            <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> 4 种基础形状</li>
            <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> 9 种预设模型</li>
            <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> 自定义模型上传</li>
          </ul>
        </div>

        <!-- 卡片 2: 2D 图表 -->
        <div class="group bg-white/5 backdrop-blur-md p-7 rounded-2xl border border-white/10 transform hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-2xl mb-5 shadow-lg shadow-purple-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-3 text-white">2D 可视化大屏</h3>
          <p class="text-slate-400 leading-relaxed">集成 ECharts 5 大图表类型，支持柱状图、折线图、饼图、仪表盘及地图可视化。</p>
          <ul class="mt-4 space-y-2 text-sm text-slate-500">
            <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> 5 种图表类型</li>
            <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> 编辑/预览双模式</li>
            <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> 实时数据刷新模拟</li>
          </ul>
        </div>

        <!-- 卡片 3: 模板系统 -->
        <div class="group bg-white/5 backdrop-blur-md p-7 rounded-2xl border border-white/10 transform hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-2xl mb-5 shadow-lg shadow-emerald-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-3 text-white">模板系统</h3>
          <p class="text-slate-400 leading-relaxed">提供 6 套精心设计的内置模板，覆盖建筑展示、数据中心、数据仪表板等典型场景。</p>
          <ul class="mt-4 space-y-2 text-sm text-slate-500">
            <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> 3 个 3D 模板</li>
            <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> 3 个 2D 模板</li>
            <li class="flex items-center gap-2"><span class="text-emerald-400">&#10003;</span> 一键快速创建</li>
          </ul>
        </div>
      </div>

      <!-- 技术栈展示 -->
      <div class="text-center pb-8">
        <p class="text-sm text-slate-500 mb-4 uppercase tracking-widest">技术驱动</p>
        <div class="flex items-center justify-center gap-8 flex-wrap text-slate-400 text-sm">
          <span class="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">Vue 3.5</span>
          <span class="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">TypeScript</span>
          <span class="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">Three.js</span>
          <span class="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">ECharts 6</span>
          <span class="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">Pinia</span>
          <span class="px-3 py-1.5 bg-white/5 rounded-full border border-white/10">Vite 7</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 首页 - 产品展示入口
</script>

<style scoped>
@keyframes floatAnim {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-25px) rotate(12deg);
  }
}
</style>
