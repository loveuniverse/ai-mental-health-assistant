<!--
  顶部导航栏组件
  显示页面标题、折叠按钮和用户信息下拉菜单
-->
<template>
  <div class="nav-bar">
    <!-- 左侧区域：折叠按钮和页面标题 -->
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">{{route.meta.title}}</p>
    </div>
    <!-- 右侧区域：用户信息和下拉菜单 -->
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar :src="userAvatar"/>
          <p class="user-name">admin</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 导航栏样式 */
.nav-bar{
  height: 100%;
  display:flex;
  align-items: center;
  justify-content: space-between;
  padding:0 15px;
  background:white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;
  .flex-box{
    display:flex;
    align-items: center;
    justify-content: center;
  }
  .page-title{
    margin-left:20px;
    font-size:26px;
    font-weight:bold;
    margin:#1f2937;
  }
}
</style>

<script setup>
import{ref} from 'vue'
import { useAdminStore } from '@/stores/admin'
import {useRouter, useRoute} from 'vue-router'
import {ElMessageBox} from 'element-plus'
import {logout} from '@/api/admin'

// 路由实例
const router = useRouter()
// 当前路由信息
const route = useRoute()

// 用户头像图片路径
const userAvatar = ref(new URL('@/assets/images/users.png', import.meta.url).href)

/**
 * 下拉菜单命令处理
 * @param {string} command - 菜单命令
 */
const handleCommand = (command) => {
  if(command ==='logout'){
    // 显示确认对话框
    ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // 调用登出API
      logout().then(() => {
        // 清除本地存储的登录信息
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        // 跳转到登录页
        router.push('/auth/login')
      })
    })
  }
}

/**
 * 切换侧边栏折叠状态
 */
const handleCollapse = () => {
  useAdminStore().toggleCollapsed()
}
</script>
