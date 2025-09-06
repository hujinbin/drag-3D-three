<template>
  <div class="w-full h-full relative" ref="workspaceContainer">
    <canvas ref="canvas" class="w-full h-full"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'
import { STLLoader } from 'three/addons/loaders/STLLoader.js'

// 定义元素类型
type ElementType = 'cube' | 'sphere' | 'cylinder' | 'pyramid'

// 定义元素接口
interface Element {
  id: string
  name: string
  type: ElementType | 'custom'
  position: { x: number; y: number; z: number }
  size: { width: number; height: number; depth: number; radius: number }
  color: string
  number: string
  modelUrl?: string
}

const props = defineProps<{
  elements: Element[]
  readonly?: boolean
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
let font: any = null
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
        (loadedFont: any) => {
          font = loadedFont
          resolve()
        },
        undefined,
        (error: any) => {
          console.error('Error loading font:', error)
          reject(error)
        }
      )
    } else {
      resolve()
    }
  })
}

// 渲染场景中的元素
const renderElements = (elements: Element[]) => {
  if (!scene) return
  
  // 清除现有的元素
  elementMeshes.forEach((mesh) => {
    if (scene) {
      scene.remove(mesh)
    }
  })
  elementMeshes.clear()
  
  numberMeshes.forEach((mesh) => {
    if (scene) {
      scene.remove(mesh)
    }
  })
  numberMeshes.clear()
  
  // 渲染新元素
  elements.forEach((element) => {
    createElement(element)
  })
}

// 加载自定义3D模型
const loadCustomModel = (element: Element) => {
  if (!scene || !element.modelUrl) return
  
  const fileExtension = element.modelUrl.split('.').pop()?.toLowerCase()
  let loader: any
  
  // 根据文件扩展名选择合适的加载器
  switch (fileExtension) {
    case 'glb':
    case 'gltf':
      loader = new GLTFLoader()
      loader.load(
        element.modelUrl,
        (gltf: any) => {
          const model = gltf.scene
          setupModel(model, element)
        },
        undefined,
        (error: any) => console.error('Error loading GLTF/GLB model:', error)
      )
      break
    case 'obj':
      loader = new OBJLoader()
      loader.load(
        element.modelUrl,
        (obj: any) => {
          setupModel(obj, element)
        },
        undefined,
        (error: any) => console.error('Error loading OBJ model:', error)
      )
      break
    case 'fbx':
      loader = new FBXLoader()
      loader.load(
        element.modelUrl,
        (fbx: any) => {
          setupModel(fbx, element)
        },
        undefined,
        (error: any) => console.error('Error loading FBX model:', error)
      )
      break
    case 'stl':
      loader = new STLLoader()
      loader.load(
        element.modelUrl,
        (geometry: any) => {
          const material = new THREE.MeshStandardMaterial({ 
            color: element.color || '#ffffff',
            roughness: 0.7,
            metalness: 0.2
          })
          const mesh = new THREE.Mesh(geometry, material)
          setupModel(mesh, element)
        },
        undefined,
        (error: any) => console.error('Error loading STL model:', error)
      )
      break
    default:
      console.error('Unsupported model format:', fileExtension)
      return
  }
}

// 设置模型的通用属性
const setupModel = (model: THREE.Object3D, element: Element) => {
  if (!scene) return
  
  // 设置模型位置
  model.position.set(element.position.x, element.position.y, element.position.z)
  
  // 调整模型大小 - 使用包围盒计算合适的缩放比例
  const box = new THREE.Box3().setFromObject(model)
  const size = box.getSize(new THREE.Vector3())
  
  // 计算缩放比例，使模型适应指定的尺寸
  const targetSize = Math.max(element.size.width, element.size.height, element.size.depth)
  const maxDimension = Math.max(size.x, size.y, size.z)
  const scale = targetSize / maxDimension
  
  model.scale.set(scale, scale, scale)
  
  // 为模型添加唯一标识
  model.userData.elementId = element.id
  
  // 添加到场景
  scene.add(model)
  elementMeshes.set(element.id, model as THREE.Mesh)
  
  // 添加编号标签
  createNumberLabel(element)
}

// 创建编号标签
const createNumberLabel = (element: Element) => {
  if (!scene || !font || !element.number) return
  
  const textGeometry = new TextGeometry(element.number, {
    font,
    size: 2,
    depth: 0.2
  })
  
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
  const textMesh = new THREE.Mesh(textGeometry, textMaterial)
  
  textMesh.position.set(
    element.position.x,
    element.position.y + element.size.height / 2 + 2,
    element.position.z
  )
  
  scene.add(textMesh)
  numberMeshes.set(element.id, textMesh)
}

// 创建元素
const createElement = (element: Element) => {
  if (!scene || !font) return
  
  if (element.type === 'custom' && element.modelUrl) {
    loadCustomModel(element)
    return
  }
  
  let geometry: THREE.BufferGeometry
  
  switch (element.type) {
    case 'cube':
      geometry = new THREE.BoxGeometry(
        element.size.width,
        element.size.height,
        element.size.depth
      )
      break
    case 'sphere':
      geometry = new THREE.SphereGeometry(element.size.radius, 32, 32)
      break
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(
        element.size.radius,
        element.size.radius,
        element.size.height,
        32
      )
      break
    case 'pyramid':
      geometry = new THREE.ConeGeometry(
        element.size.radius,
        element.size.height,
        4
      )
      break
    default:
      return
  }
  
  // 材质创建
  
  const material = new THREE.MeshStandardMaterial({
    color: element.color,
    metalness: 0.1,
    roughness: 0.8
  })
  
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(element.position.x, element.position.y, element.position.z)
  mesh.userData.elementId = element.id
  
  scene.add(mesh)
  elementMeshes.set(element.id, mesh)
  
  // 添加编号
  if (element.number && font) {
    const textGeometry = new TextGeometry(element.number, {
      font,
      size: 2,
      // height: 0.2
    })
    
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    
    textMesh.position.set(
      element.position.x,
      element.position.y + element.size.height / 2 + 2,
      element.position.z
    )
    
    scene.add(textMesh)
    numberMeshes.set(element.id, textMesh)
  }
}

// 窗口大小调整处理
const handleWindowResize = () => {
  if (!camera || !renderer || !workspaceContainer.value) return

  camera.aspect = workspaceContainer.value.clientWidth / workspaceContainer.value.clientHeight
  camera.updateProjectionMatrix()
  
  renderer.setSize(
    workspaceContainer.value.clientWidth,
    workspaceContainer.value.clientHeight
  )
}

// 画布点击处理
const handleCanvasClick = (event: MouseEvent) => {
  if (!raycaster || !camera || !scene || !mouse) return

  // 计算鼠标位置
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  // 更新射线
  raycaster.setFromCamera(mouse, camera)

  // 检测相交的对象
  const intersects = raycaster.intersectObjects(scene.children)
  
  if (intersects.length > 0) {
    const selectedObject = intersects[0].object
    if (selectedObject.userData.elementId && !props.readonly) {
      emits('element-selected', selectedObject.userData.elementId)
    }
  }
}

// 鼠标移动处理
const handleMouseMove = (event: MouseEvent) => {
  if (!mouse) return

  const rect = (event.target as HTMLElement).getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
}

// 拖拽悬停处理
const handleDragOver = (event: DragEvent) => {
  if (props.readonly) return
  
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
}

// 拖拽放置处理
const handleDrop = (event: DragEvent) => {
  if (props.readonly) return
  
  event.preventDefault()
  
  if (!event.dataTransfer) return
  
  const elementType = event.dataTransfer.getData('elementType') as ElementType
  if (!elementType) return

  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  // 创建新元素
  const newElement: Element = {
    id: `element-${Date.now()}`,
    name: `New ${elementType}`,
    type: elementType,
    position: { x: x * 25, y: y * 25, z: 0 },
    size: { width: 5, height: 5, depth: 5, radius: 2.5 },
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    number: '1'
  }

  emits('element-created', newElement)
}

// 动画循环
const animate = () => {
  if (!scene || !camera || !renderer || !controls) return

  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

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
  renderElements(newElements)
}, { deep: true })
</script>