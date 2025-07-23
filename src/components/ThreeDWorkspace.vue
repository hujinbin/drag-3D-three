<template>
  <div class="w-full h-full relative" ref="workspaceContainer">
    <canvas ref="canvas" class="w-full h-full"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

// 定义元素类型
type ElementType = 'cube' | 'sphere' | 'cylinder' | 'pyramid'

// 定义元素接口
interface Element {
  id: string
  name: string
  type: ElementType
  position: { x: number; y: number; z: number }
  size: { width: number; height: number; depth: number; radius: number }
  color: string
  number: string
}

const props = defineProps<{
  elements: Element[]
}>()

const emits = defineEmits<{
  (event: 'element-selected', elementId: string): void
  (event: 'element-created', element: Element): void
}>()

const workspaceContainer = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)

// Three.js 相关对象
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let raycaster: THREE.Raycaster | null = null
let mouse: THREE.Vector2 | null = null
let font: THREE.Font | null = null
let elementMeshes = new Map<string, THREE.Mesh>()
let numberMeshes = new Map<string, THREE.Mesh>()

// 初始化 Three.js
const initThreeJS = async () => {
  if (!workspaceContainer.value || !canvas.value) return
  
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)
  
  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75, 
    workspaceContainer.value.clientWidth / workspaceContainer.value.clientHeight, 
    0.1, 
    1000
  )
  camera.position.z = 50
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
    antialias: true
  })
  renderer.setSize(
    workspaceContainer.value.clientWidth, 
    workspaceContainer.value.clientHeight
  )
  renderer.setPixelRatio(window.devicePixelRatio)
  
  // 添加轨道控制器
  if (camera && renderer.domElement) {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
  }
  
  // 添加光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(1, 1, 1)
  scene.add(directionalLight)
  
  // 添加网格辅助线
  const gridHelper = new THREE.GridHelper(100, 20, 0xcccccc, 0xcccccc)
  scene.add(gridHelper)
  
  // 初始化射线检测
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()
  
  // 加载字体
  await loadFont()
  
  // 添加事件监听
  window.addEventListener('resize', handleWindowResize)
  if (canvas.value) {
    canvas.value.addEventListener('click', handleCanvasClick)
    canvas.value.addEventListener('mousemove', handleMouseMove)
    canvas.value.addEventListener('dragover', handleDragOver)
    canvas.value.addEventListener('drop', handleDrop)
  }
  
  // 初始渲染
  animate()
}

// 加载字体
const loadFont = () => {
  return new Promise<void>((resolve, reject) => {
    if (!font) {
      const fontLoader = new FontLoader()
      fontLoader.load(
        'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        (loadedFont) => {
          font = loadedFont
          resolve()
        },
        undefined,
        (error) => {
          console.error('Error loading font:', error)
          reject(error)
        }
      )
    } else {
      resolve()
    }
  })
}

// 其他方法（createElement, updateElement, deleteElement 等）保持与之前版本相同...

// 生命周期钩子
onMounted(async () => {
  await nextTick()
  initThreeJS()
})

onUnmounted(() => {
  // 清理Three.js资源
  if (renderer) {
    renderer.dispose()
  }
  
  // 移除事件监听
  window.removeEventListener('resize', handleWindowResize)
  if (canvas.value) {
    canvas.value.removeEventListener('click', handleCanvasClick)
    canvas.value.removeEventListener('mousemove', handleMouseMove)
    canvas.value.removeEventListener('dragover', handleDragOver)
    canvas.value.removeEventListener('drop', handleDrop)
  }
})

// 监听元素变化
watch(() => props.elements, (newElements) => {
  // 更新逻辑保持与之前版本相同...
}, { deep: true })
</script>