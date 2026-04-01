<!--
  后台管理布局组件
  提供后台管理系统的整体布局结构，包含侧边栏、顶部导航栏和内容区域
-->
<template>
  <div class="backend-layout">
    <el-container class="main-container">
      <!-- 左侧侧边栏 -->
      <SideBar></SideBar>
      <el-container>
        <!-- 顶部导航栏 -->
        <el-header>
          <NavBar></NavBar>
        </el-header>
        <!-- 主内容区域 -->
        <el-main class="main-container">
          <router-view class="content-container"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
/* 后台布局样式 */
.backend-layout {
  height: 100vh;  // 占满整个视口高度
  .el-header{
    height: 74px !important;  // 顶部导航栏固定高度
  }
  .main-container{
    height:100%;
    .content-container{
    padding:20px;              // 内容区域内边距
    background-color: #fff;   // 白色背景
    min-height: calc(100% - 74px);  // 减去顶部导航栏高度
    }
  }
}
</style>

<script>
// 导入子组件
import SideBar from './SideBar.vue'
import NavBar from './NavBar.vue'

export default {
  components: {
    SideBar,    // 侧边栏组件
    NavBar      // 导航栏组件
  }
}
</script>
