<template>
  <div class="nav-bar">
    <div class="flex-box">
      <el-button @click="handleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">aaaa</p>
    </div>
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

const userAvatar = ref(new URL('@/assets/images/users.png', import.meta.url).href)

const handleCommand = (command) => {
  if(command ==='logout'){
    router.push('/login')
  }
}

const handleCollapse = () => {
  useAdminStore().toggleCollapsed()
}
</script>