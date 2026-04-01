/**
 * 管理员后台API接口模块
 * 封装所有与后端交互的API请求方法
 */
import service from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名或邮箱
 * @param {string} data.password - 密码
 * @returns {Promise} 返回包含token和用户信息的对象
 */
export function login(data){
    return service.post('/user/login', data)
}

/**
 * 获取知识库分类树
 * @returns {Promise} 返回分类树结构数据
 */
export function categoryTree(){
    return service.get('/knowledge/category/tree')
}

/**
 * 分页获取文章列表
 * @param {Object} params - 查询参数
 * @param {number} params.currentPage - 当前页码
 * @param {number} params.size - 每页条数
 * @param {string} [params.title] - 文章标题（可选，用于搜索）
 * @param {number} [params.categoryId] - 分类ID（可选，用于筛选）
 * @param {number} [params.status] - 文章状态（可选，0草稿 1已发布 2已下线）
 * @returns {Promise} 返回文章列表和总数
 */
export function articlePage(params){
    return service.get('/knowledge/article/page', {params})
}

/**
 * 上传文件
 * @param {File} file - 要上传的文件对象
 * @param {Object} businessInfo - 业务信息
 * @param {string} businessInfo.businessId - 业务ID（用于关联文件）
 * @returns {Promise} 返回上传后的文件路径等信息
 */
export function uploadFile(file, businessInfo){
    const formData = new FormData()
    formData.append('file', file)
    formData.append('businessType', 'ARTICLE')
    formData.append('businessId', businessInfo.businessId)
    formData.append('businessField', 'cover')

    return service.post('/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/**
 * 创建新文章
 * @param {Object} data - 文章数据
 * @param {string} data.title - 文章标题
 * @param {string} data.content - 文章内容
 * @param {string} data.coverImage - 封面图片路径
 * @param {number} data.categoryId - 分类ID
 * @param {string} [data.summary] - 文章摘要
 * @param {string} [data.tags] - 文章标签（逗号分隔）
 * @returns {Promise} 返回创建结果
 */
export function createArticle(data){
    return service.post('/knowledge/article', data)
}

/**
 * 获取文章详情
 * @param {number|string} id - 文章ID
 * @returns {Promise} 返回文章详细信息
 */
export function getArticleDetail(id){
    return service.get(`/knowledge/article/${id}`)
}

/**
 * 更新文章
 * @param {number|string} id - 文章ID
 * @param {Object} data - 更新的文章数据
 * @returns {Promise} 返回更新结果
 */
export function updateArticle(id ,data) {
    return service.put(`/knowledge/article/${id}`, data)
}

/**
 * 修改文章状态（发布/下线）
 * @param {number|string} id - 文章ID
 * @param {Object} data - 状态数据
 * @param {number} data.status - 目标状态（1发布 2下线）
 * @returns {Promise} 返回操作结果
 */
export function changeArticleStatus(id, data){
    return service.put(`/knowledge/article/${id}/status`, data)
}

/**
 * 删除文章
 * @param {number|string} id - 文章ID
 * @returns {Promise} 返回删除结果
 */
export function deleteArticle(id){
    return service.delete(`/knowledge/article/${id}`)
}

/**
 * 分页获取咨询会话列表
 * @param {Object} params - 查询参数
 * @param {number} params.currentPage - 当前页码
 * @param {number} params.size - 每页条数
 * @returns {Promise} 返回会话列表和总数
 */
export function getConsultationPage(params){
    return service.get('/psychological-chat/sessions', {params})
}

/**
 * 获取会话详情和消息记录
 * @param {number|string} sessionId - 会话ID
 * @returns {Promise} 返回会话的详细消息列表
 */
export function getSessionDetail(sessionId){
    return service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}

/**
 * 分页获取情绪日志列表
 * @param {Object} params - 查询参数
 * @param {number} params.currentPage - 当前页码
 * @param {number} params.size - 每页条数
 * @param {string} [params.userId] - 用户ID（可选）
 * @param {string} [params.moodScoreRange] - 情绪评分范围（可选，如"1-3"）
 * @returns {Promise} 返回情绪日志列表和总数
 */
export function getEmotionalPage(params){
    return service.get('/emotion-diary/admin/page', {params})
}

/**
 * 删除情绪日志
 * @param {number|string} id - 日志ID
 * @returns {Promise} 返回删除结果
 */
export function deleteEmotional(id){
    return service.delete(`/emotion-diary/admin/${id}`)
}

/**
 * 获取数据分析概览
 * @returns {Promise} 返回系统统计数据，包括用户总数、情绪日志数、咨询会话数等
 */
export function getAnalyticsOverview(){
    return service.get(`/data-analytics/overview`)
}

/**
 * 用户登出
 * @returns {Promise} 返回登出结果
 */
export function logout(){
    return service.post('/user/logout')
}
