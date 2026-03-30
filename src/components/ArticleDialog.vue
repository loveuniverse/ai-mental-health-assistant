<template>
    <el-dialog
    :title="isEdit?'编辑文章':'新增文章'"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
    >
    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="文章标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
            <el-select v-model="formData.categoryId" placeholder="请选择分类">
                <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-form-item label="文章摘要" prop="summary">
            <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要（可选）" maxlength="400" :rows="4" show-word-limit />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
            <el-select v-model="formData.tags" placeholder="请选择文章标签" multiple filterable allow-create style="width: 100%">
                <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag" />
            </el-select>
        </el-form-item>
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
    <div v-if="btnPreview">
        <h3>内容预览</h3>
        <div v-html="formData.content"></div>
    </div>
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

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    categories: {
        type: Array,
        default: () => []
    },
    article: {
        type: Object,
        default: () => null
    }
})

const emit = defineEmits(['update:modelValue','success'])

const dialogVisible = computed({
    get(){
        return props.modelValue
    },
    set(val){
        emit('update:modelValue', val)
    }
})

const isEdit = computed(()=>!!props.article?.id)

// 监听编辑数据
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

const handleClose = () => {
    formRef.value.resetFields()
    businessId.value = null
    handleRemove()
    emit('update:modelValue', false)
}

const formData = reactive({
    "title": "",
    "content": "",
    "coverImage": "",
    "categoryId": 1,
    "summary": "",
    "tags": [],
    "id": ""
})

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

const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

const imgUrl = ref('')

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

const businessId = ref(null)

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

const handleRemove = () => {
    imgUrl.value=''
    formData.coverImage=''
}

const handleContentChange = (data) => {
    formData.content = data.html
}

const editorInstance = ref(null)

const handleEditorCreated = (editor) => {
    editorInstance.value = editor
    if(formData.content && editor){
        nextTick(() => {
            editor.setHtml(formData.content)
        })
    }
}

const btnPreview=ref(false)

const formRef = ref()

const loading=ref(false)
const handleSubmit = async () => { 
  try {
    await formRef.value.validate((valid, fields) => {
      if (!valid) {
        throw new Error('表单验证失败')
      }
    })
    
    loading.value = true;
    
    // 提交表单数据
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
.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>