/**
 * 管理员状态管理模块（Pinia Store）
 * 用于管理后台布局相关的全局状态
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 创建admin store
 * 使用Composition API风格定义
 */
export const useAdminStore = defineStore('admin', () => {
  // ==================== State ====================
  /**
   * 侧边栏折叠状态
   * true - 折叠（收起）状态，显示图标
   * false - 展开状态，显示完整菜单
   */
  const isCollapsed = ref(false)

  // ==================== Actions ====================
  /**
   * 切换侧边栏折叠状态
   * 在展开和收起之间切换
   */
  const toggleCollapsed = () => {
    isCollapsed.value = !isCollapsed.value
  }

  // ==================== Return ====================
  // 导出状态和方法，供组件使用
  return {
    isCollapsed,      // 侧边栏折叠状态
    toggleCollapsed   // 切换折叠状态的方法
  }
})
