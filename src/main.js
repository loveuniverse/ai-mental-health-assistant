/**
 * 应用入口文件
 * 负责初始化Vue应用实例并挂载全局插件
 */
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'

// 创建Vue应用实例
const app=createApp(App)

// 创建Pinia状态管理实例
const pinia=createPinia()

/**
 * 注册所有Element Plus图标组件
 * 遍历图标库，将每个图标注册为全局组件
 */
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

/**
 * 挂载全局插件
 * ElementPlus - UI组件库
 * router - 路由管理
 * pinia - 状态管理
 */
app.use(ElementPlus).use(router).use(pinia).mount('#app')
