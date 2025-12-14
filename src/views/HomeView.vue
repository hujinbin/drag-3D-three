<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white overflow-hidden relative">
    <!-- 背景装饰元素 -->
    <div class="absolute inset-0 overflow-hidden opacity-20">
      <div v-for="n in 20" :key="n" 
           class="cube absolute rounded-lg bg-white" 
           :style="{
             width: `${Math.random() * 60 + 20}px`,
             height: `${Math.random() * 60 + 20}px`,
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             opacity: Math.random() * 0.5 + 0.1,
             transform: `rotate(${Math.random() * 360}deg) translateZ(${Math.random() * 100}px)`,
             animationDelay: `${Math.random() * 5}s`,
             animationDuration: `${Math.random() * 10 + 10}s`
           }">
      </div>
    </div>
    
    <!-- 主要内容 -->
    <div class="container mx-auto px-4 py-16 relative z-10">
      <!-- 标题部分 -->
      <div class="text-center mb-16 mt-8">
        <h1 class="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 inline-block">
          3D 元素拖拽编辑器
        </h1>
        <p class="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
          轻松创建、编辑和分享令人惊叹的3D场景
        </p>
      </div>
      
      <!-- 特性展示 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="feature-card bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 transform hover:scale-105 transition-all duration-300">
          <div class="text-blue-400 text-4xl mb-4">◆</div>
          <h3 class="text-xl font-bold mb-2">直观拖拽</h3>
          <p class="text-gray-300">通过简单的拖拽操作，轻松放置和调整3D元素的位置、大小和方向。</p>
        </div>
        
        <div class="feature-card bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 transform hover:scale-105 transition-all duration-300">
          <div class="text-purple-400 text-4xl mb-4">●</div>
          <h3 class="text-xl font-bold mb-2">丰富元素</h3>
          <p class="text-gray-300">提供多种3D基础元素，包括立方体、球体、圆柱体和金字塔等。</p>
        </div>
        
        <div class="feature-card bg-gray-800 bg-opacity-50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 transform hover:scale-105 transition-all duration-300">
          <div class="text-green-400 text-4xl mb-4">▲</div>
          <h3 class="text-xl font-bold mb-2">实时预览</h3>
          <p class="text-gray-300">所有编辑操作都能实时预览，让您的创作过程更加流畅高效。</p>
        </div>
      </div>
      
      <!-- 开始使用按钮 -->
      <div class="text-center space-y-4">
        <div>
          <router-link 
            to="/select-screen" 
            class="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold rounded-full hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 inline-flex items-center shadow-lg"
          >
            <span class="mr-2">创建大屏</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
        <div>
          <router-link 
            to="/editor" 
            class="px-6 py-3 bg-gray-700 bg-opacity-50 text-white text-base font-semibold rounded-full hover:bg-opacity-70 transform hover:scale-105 transition-all duration-300 inline-flex items-center shadow-lg border border-gray-600"
          >
            <span class="mr-2">进入编辑器</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// HomeView 组件
</script>

<style lang="less" scoped>
.cube {
  animation: float 15s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(45deg);
  }
}

// Less 示例：变量与嵌套，保持原有视觉不变
@glow-color: rgba(59, 130, 246, 0.5);

.feature-card {
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 0 25px @glow-color;
  }
}
</style>
