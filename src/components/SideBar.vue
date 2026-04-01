<!--
  侧边栏组件
  显示系统Logo、名称和导航菜单
  支持折叠/展开功能
-->
<template>
  <el-aside :width="isCollapsed ? '64px' : '264px'">
    <el-menu
        :collapse="isCollapsed"
        :collapse-transition="false"
        default-active="2"
        class="menu-style"
      >
      <!-- Logo和品牌信息区域 -->
      <div class="brand">
        <el-image :src="robotLogo" alt="logo" class="robot-logo"/>
        <div v-show="!isCollapsed" class="info-card">
          <h1 class="brand-title">心理健康AI助手</h1>
          <p class="brand-subtitle">管理后台</p>
        </div>
      </div>
      <!-- 动态渲染菜单项，从路由配置中读取 -->
        <el-menu-item @click="selectMenu" v-for="item in router.options.routes[0].children" :key="item.path" :index="item.path">
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
      </el-menu>
  </el-aside>
</template>

<style lang="scss" scoped>
/* 菜单样式 */
.menu-style{
  .brand{
  display: flex;
  align-items: center;
  justify-content: center;
  padding:10px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  .robot-logo{
    width: 50px;
    height: 50px;
    margin-right:10px;
  }
  .info-card{
    .brand-title{
      font-size:20px;
      font-weight:bold;
      margin-bottom:5px;
      color:#1f2937;
    }
    .brand-subtitle{
      font-size:14px;
      color:#6b7280;
    }
  }
}
  height: 100%;
}
</style>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

// 获取路由实例
const router = useRouter()

// 机器人Logo图片路径
const robotLogo = new URL('@/assets/images/机器人.png', import.meta.url).href

// 计算属性：获取侧边栏折叠状态
const isCollapsed = computed(() => useAdminStore().isCollapsed)

/**
 * 菜单选择事件处理
 * 点击菜单项时导航到对应页面
 * @param {Object} key - 点击的菜单项信息
 */
const selectMenu = (key) => {
  const currentRoute=router.options.routes[0]
  router.push(`${currentRoute.path}/${key.index}`)
}
</script>
