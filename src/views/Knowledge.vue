<!--
  知识文章管理页面
  提供文章的增删改查功能，支持按标题、分类、状态筛选
  包含文章列表展示、分页、发布/下线操作
-->
<template>
  <div>
    <!-- 页面头部 -->
    <PageHead title="知识文章">
      <template #buttons>
        <el-button @click="handleEdit({})" type="primary">新增</el-button>
      </template>
    </PageHead>
    <!-- 搜索表单 -->
    <TableSearch :formItem="formItem" @search="handleSearch" />
    <!-- 文章列表表格 -->
    <el-table :data="tableData" style="width:100%;margin-top:25px">
      <el-table-column width="600" label="文章标题" fixed="left">
        <template #default="scope">
          <div style="display:flex;align-items:center">
            <el-icon><timer /></el-icon>
            <span>{{scope.row.title}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="readCount" label="阅读量" width="150" />
      <el-table-column prop="updatedAt" label="发布时间" width="150" />
      <!-- 操作列 -->
      <el-table-column label="操作" width="240" fixed="right">
        <template #default="scope">
          <el-button @click="handleEdit(scope.row)" text type="primary">编辑</el-button>
          <el-button @click="handlePublish(scope.row)" v-if="scope.row.status==0 || scope.row.status==2" text type="success">发布</el-button>
          <el-button @click="handleUnpublish(scope.row)" v-if="scope.row.status==1" text type="warning">下线</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
    style="margin-top:25px"
    :page-size="pagination.size"
    layout="prev,pager,next"
    :total="pagination.total"
    @change="handleChange"
    />
    <!-- 文章编辑弹窗 -->
    <ArticleDialog v-model:modelValue="dialogVisible" :article="currentArticle" :categories="categories" @success="handleSuccess" />
  </div>
</template>

<script setup>
import {onMounted, ref, reactive} from 'vue'
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import {categoryTree, articlePage, getArticleDetail, changeArticleStatus, deleteArticle} from '@/api/admin'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { ElMessageBox , ElMessage} from 'element-plus'

// ==================== 搜索配置 ====================
const formItem = [
  {
    comp: 'input',
    prop: 'title',
    label: '文章标题',
    placeholder: '请输入文章标题'
  },
  {
    comp: 'select',
    prop: 'categoryId',
    label: '分类',
    placeholder: '请选择分类'
  },
  {
    comp: 'select',
    prop: 'status',
    label: '状态',
    placeholder: '请输入文章内容',
    options: [
      {
        label: '草稿',
        value: 0
      },
      {
        label: '已发布',
        value: 1
      },
      {
        label: '已下线',
        value: 2
      }
    ]
  }
]

// ==================== 分页状态 ====================
const pagination = reactive({
    currentPage: 1,
    size: 10,
    total: 0
})

// ==================== 数据状态 ====================
const categoryMap = reactive({})    // 分类ID到名称的映射
const categories = ref([])          // 分类选项列表
const tableData=ref([])             // 表格数据
const dialogVisible = ref(false)    // 弹窗显示状态
const currentArticle = ref(null)    // 当前编辑的文章

// ==================== 方法 ====================
/**
 * 搜索文章列表
 * @param {Object} formData - 搜索条件
 */
const handleSearch = async (formData) => {
  console.log(formData, '查询参数')

  const params={
    ...pagination,
    ...formData
  }

  const {records,total} = await articlePage(params)
  tableData.value=records
  pagination.total=total
}

/**
 * 分页切换
 * @param {number} page - 页码
 */
const handleChange = (page) => {
  pagination.currentPage = page
  handleSearch()
}

/**
 * 编辑或新增文章
 * @param {Object} row - 文章数据（空对象表示新增）
 */
const handleEdit = (row) => {
  if(!row.id) {
    // 新增文章
    currentArticle.value = null
    dialogVisible.value = true
  } else {
    // 编辑文章，获取详情后打开弹窗
    getArticleDetail(row.id).then(res => {
    currentArticle.value = res
    dialogVisible.value = true
  })
  }
}

/**
 * 发布文章
 * @param {Object} row - 文章数据
 */
const handlePublish = (row) => {
  ElMessageBox.confirm(
    `确认发布文章"${row.title}"吗？`,
    '确认',
    {
      confirmButtonText: '确认发布',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    changeArticleStatus(row.id, {status: 1}).then(res => {
      ElMessage.success('发布成功')
      handleSearch()
    })
  })
}

/**
 * 下线文章
 * @param {Object} row - 文章数据
 */
const handleUnpublish = (row) => {
  ElMessageBox.confirm(
    `确认下线文章"${row.title}"吗？`,
    '确认',
    {
      confirmButtonText: '确认下线',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    changeArticleStatus(row.id, {status: 2}).then(res => {
      ElMessage.success('下线成功')
      handleSearch()
    })
  })
}

/**
 * 删除文章
 * @param {Object} row - 文章数据
 */
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确认删除文章"${row.title}"吗？`,
    '确认',
    {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'danger'
    }
  ).then(() => {
    deleteArticle(row.id).then(res => {
      ElMessage.success('删除成功')
      handleSearch()
    })
  })
}

/**
 * 操作成功回调
 */
const handleSuccess = () => {
  handleSearch()
}

// ==================== 生命周期 ====================
onMounted(async () => {
    // 获取分类列表
    const data = await categoryTree()
    categories.value = data.map(item => {
        categoryMap[item.id] = item.categoryName
        return {
            label: item.categoryName,
            value: item.id
        }
    })
    formItem[1].options = categories.value

    // 初始加载文章列表
    handleSearch({})
})
</script>
