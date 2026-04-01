<!--
  表格搜索组件
  根据配置动态生成搜索表单，支持输入框和下拉选择
  提供查询和重置功能
-->
<template>
  <el-form ref="ruleFormRef" :model="formData">
    <el-row :gutter="24">
      <!-- 动态渲染表单项 -->
      <template v-for="item in formItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
        <!-- 根据组件类型动态渲染 -->
        <component v-model="formData[item.prop]" :is="isComp(item.comp)" :placeholder="item.placeholder">
          <!-- 下拉选择组件的选项 -->
          <template v-if="item.comp === 'select'">
           <el-option label="全部" value="" />
            <el-option 
            v-for="opt in item.options"
            :key="opt.value"
            :label="opt.label"
            :value="opt.value" />
          </template>
        </component>
      </el-form-item>
        </el-col>
    </template>
    </el-row>
    <!-- 操作按钮 -->
    <el-row>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset(ruleFormRef)">重置</el-button>
    </el-row>
  </el-form>
</template>

<script setup>
import { ref, reactive , computed } from 'vue'

// 定义组件属性
const props = defineProps({
  formItem: {
    type: Array,
    default: () => []  // 表单配置数组
  }
})

/**
 * 计算属性：处理表单配置，添加响应式布局配置
 * 为每个表单项添加栅格布局配置，实现自适应
 */
const formItemAttrs = computed(()=>{
  const {formItem}=props
  formItem.forEach(item => {
    // 设置响应式布局：xs手机 sm平板 md小桌面 lg大桌面 xl超大屏
    item.col={xs:24,sm:12,md:8,lg:6,xl:6}
  })

  return formItem
})

// 定义组件事件
const emit = defineEmits(['search'])

// 表单引用，用于调用表单方法
const ruleFormRef = ref()

// 表单数据对象
const formData = reactive({})

/**
 * 根据组件类型返回对应的Element Plus组件名
 * @param {string} comp - 组件类型标识
 * @returns {string} Element Plus组件名
 */
const isComp = (comp) => {
  return {
    input: 'el-input',    // 输入框
    select: 'el-select'   // 下拉选择
  }[comp]
}

/**
 * 查询按钮点击事件
 * 触发search事件，传递表单数据
 */
const handleSearch = () => {
  emit('search', formData)
}

/**
 * 重置按钮点击事件
 * 重置表单并触发查询
 * @param {Object} formEl - 表单实例
 */
const handleReset = (formEl) => {
  if(!formEl) return
  formEl.resetFields()  // 重置表单字段
  emit('search', formData)
}
</script>
