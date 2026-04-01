<!--
  页面头部组件
  显示页面标题和操作按钮区域
  支持通过插槽自定义右侧按钮
-->
<template>
  <div class="page-head">
    <!-- 页面标题 -->
    <p class="page-title">{{ props.title }}</p>
    <!-- 操作按钮插槽区域 -->
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 页面头部样式 */
.page-head{
  display: flex;
  margin-bottom:20px;
  align-items: center;
  justify-content: space-between;
  .page-title{
    font-size:24px;
    color:#2d3748;
  }
}
</style>

<script setup>
// 定义组件属性
const props = defineProps({
  title: {
    type: String,
    default: '页面标题'  // 默认标题
  }
})
</script>
