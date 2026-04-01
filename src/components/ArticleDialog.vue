<!--
  文章编辑弹窗组件
  用于新增和编辑知识库文章
  包含标题、分类、摘要、标签、封面、内容等字段
-->
<template>
    <el-dialog
    :title="isEdit?'编辑文章':'新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
    >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <!-- 文章标题 -->
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit />
        </el-form-item>
        <!-- 所属分类 -->
        <el-form-item label="所属分类" prop="categoryId">
            <el-select v-model="formData.categoryId" placeholder="请选择分类">
                <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <!-- 文章摘要 -->
        <el-form-item label="文章摘要" prop="summary">
            <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要（可选）" maxlength="400" :rows="4" show-word-limit />
        </el-form-item>
        <!-- 标签选择 -->
        <el-form-item label="标签" prop="tags">
            <el-select v-model="formData.tags" placeholder="请选择文章标签" multiple filterable allow-create style="width: 100%">
                <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
            </el-select>
        </el-form-item>
        <!-- 封面图片上传 -->
        <el-form-item label="封面图片">
            <el-upload
                class="avatar-uploader"
                action="#"
                :before-upload="beforeUpload"
                :http-request="handleUploadRequest"
                :show-file-list="false"
                accept="image/*"
            >
                <div v-if="!imgUrl" class="cover-placeholder">
                    <p>点击上传封面</p>
                </div>
                <img v-else :src="imgUrl" class="cover-image" alt="封面图片" />
            </el-upload>
            <div v-if="imgUrl" class="cover-remove">
                <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
            </div>
        </el-form-item>
        <!-- 富文本编辑器 -->
        <el-form-item label="文章内容" prop="content">
            <RichTextEditor 
            v-model="formData.content"
            placeholder="请输入文章内容，支持富文本格式\n\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容"
            :maxCharCount="5000"
            @change="handleContentChange"
            @created="handleEditorCreated"
            min-height="500px"
            />
        </el-form-item>
    </el-form>
    <!-- 内容预览区域 -->
    <div v-if="btnPreview">
        <h3>内容预览</h3>
        <div v-html="formData.content"></div>
    </div>
    <!-- 底部按钮 -->
    <template #footer>
        <el-button type="primary" @click="btnPreview=!btnPreview">{{ btnPreview?'隐藏预览':'预览效果' }}</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit?'更新文章':'创建文章' }}</el-button>
    </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick, watch} from 'vue'
import {ElMessage} from 'element-plus'
import {uploadFile, createArticle, updateArticle} from '@/api/admin'
import {fileBaseUrl} from '@/config/index.js'
import RichTextEditor from '@/components/RichTextEditor.vue'

// ==================== Props & Emits ====================
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false    // 控制弹窗显示/隐藏
    },
    categories: {
        type: Array,
        default: () => [] // 分类选项列表
    },
    article: {
        type: Object,
        default: () => null // 编辑时的文章数据
    }
})

const emit = defineEmits(['update:modelValue','success'])

// ==================== Computed ====================
/**
 * 计算属性：弹窗显示状态（双向绑定）
 */
const dialogVisible = computed({
    get(){
        return props.modelValue
    },
    set(val){
        emit('update:modelValue', val)
    }
})

/**
 * 计算属性：判断是否为编辑模式
 */
const isEdit = computed(()=>!!props.article?.id)

// ==================== Watch ====================
/**
 * 监听编辑数据变化，填充表单
 */
watch(()=>props.article, (newVal) => {
    if(newVal){
        nextTick(() => {
            Object.assign(formData, newVal)
            // 使用现有ID
        businessId.value = newVal.id
        // 封面Url
        imgUrl.value = fileBaseUrl+newVal.coverImage
        })
    }
})

// ==================== Data ====================
// 表单数据对象
const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": [],
    "id": ""
})

// 表单验证规则
const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { max: 200, message: '文章标题最多200个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择分类', trigger: 'change' }
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' },
        { max:5000,message:'文章内容最多5000个字符',trigger:'blur'}
    ],
})

// 常用标签预设
const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

// 封面图片URL
const imgUrl = ref('')
// 业务ID（用于文件上传关联）
const businessId = ref(null)
// 编辑器实例
const editorInstance = ref(null)
// 是否显示预览
const btnPreview=ref(false)
// 表单引用
const formRef = ref()
// 提交加载状态
const loading=ref(false)

// ==================== Methods ====================
/**
 * 关闭弹窗处理
 * 重置表单和状态
 */
const handleClose = () => {
    formRef.value.resetFields()
    businessId.value = null
    handleRemove()
    emit('update:modelValue', false)
}

/**
 * 上传前验证
 * 检查文件类型和大小
 * @param {File} file - 上传的文件
 * @returns {boolean} 验证结果
 */
const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5
    if(!isImage){
        ElMessage.error('上传封面图片，请选择图片文件')
        return false
    }
    if(!isLt5M){
        ElMessage.error('上传封面图片，图片大小不能超过5MB')
        return false
    }

    return true
}

/**
 * 自定义上传请求
 * @param {Object} params - 上传参数
 * @param {File} params.file - 上传的文件
 */
const handleUploadRequest = async ({file}) => {
    //生成UUID
    try {
        businessId.value = crypto.randomUUID()
        const fileRes = await uploadFile(file, {
            businessId: businessId.value
        })
        imgUrl.value = fileBaseUrl + fileRes.filePath
        formData.coverImage = fileRes.filePath
    } catch (error) {
        ElMessage.error('上传失败，请重试')
    }
}

/**
 * 移除封面图片
 */
const handleRemove = () => {
    imgUrl.value=''
    formData.coverImage=''
}

/**
 * 编辑器内容变化回调
 * @param {Object} data - 编辑器数据
 * @param {string} data.html - HTML内容
 */
const handleContentChange = (data) => {
    formData.content = data.html
}

/**
 * 编辑器创建完成回调
 * @param {Object} editor - 编辑器实例
 */
const handleEditorCreated = (editor) => {
    editorInstance.value = editor
    if(formData.content && editor){
        nextTick(() => {
            editor.setHtml(formData.content)
        })
    }
}

/**
 * 提交表单
 * 验证表单数据并提交到后端
 */
const handleSubmit = async () => { 
  try {
    // 表单验证
    await formRef.value.validate((valid, fields) => {
      if (!valid) {
        throw new Error('表单验证失败')
      }
    })
    
    loading.value = true;
    
    // 提交表单数据，将标签数组转为逗号分隔字符串
    const submitData = {
      ...formData,
      tags: Array.isArray(formData.tags) ? formData.tags.join(',') : ''
    }
    
    // 新增或编辑
    if (!isEdit.value) {
      submitData.id = businessId.value
      await createArticle(submitData)
    } else {
      await updateArticle(submitData.id, submitData)
    }
    
    loading.value = false;
    ElMessage.success(isEdit.value ? '文章更新成功' : '文章创建成功')
    emit('success')
    handleClose()
  } catch (error) {
    loading.value = false;
    if (error.message !== '表单验证失败') {
      ElMessage.error(error.message || (isEdit.value ? '更新失败' : '创建失败'))
    }
  }
}
</script>

<style lang="scss" scoped>
/* 封面占位样式 */
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color : #8b949e ;
  background:  #f6f8fa;
}
/* 封面图片样式 */
.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
