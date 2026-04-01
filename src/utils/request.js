/**
 * HTTP请求工具模块
 * 基于axios封装，提供统一的请求拦截、响应处理和错误处理
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例，配置基础URL和超时时间
const service = axios.create({
    baseURL: '/api',    // API基础路径，所有请求都会自动加上此前缀
    timeout: 5000       // 请求超时时间，5秒后无响应则取消请求
})

/**
 * 请求拦截器
 * 在每次发送请求前自动执行，用于添加认证token等通用处理
 */
service.interceptors.request.use(
    config => {
        // 从本地存储获取用户登录令牌
        const token = localStorage.getItem('token')
        // 如果存在token，添加到请求头中用于身份验证
        if(token){
            config.headers['token'] = token
        }
        return config
    },
    error => {
        // 请求发送失败时的处理
        return Promise.reject(error)
    }
)

/**
 * 响应拦截器
 * 在每次收到响应后自动执行，用于统一处理响应数据和错误
 */
service.interceptors.response.use(
    response => {
        // 解构响应数据，data是服务器返回的数据，config是请求配置
        const {data, config} = response
        // 业务状态码200表示请求成功，直接返回数据内容
        if(data.code === '200'){
            return data.data
        }else{
            // 业务状态码-1表示登录过期或认证失败
            if(data.code==='-1'){
                // 如果不是登录接口本身报错，则提示用户重新登录
                if(!config.url?.includes('/login')){
                    ElMessage.error(data.msg || '登录过期，请重新登录')
                    // 清除本地存储的登录信息
                    localStorage.removeItem('token')
                    localStorage.removeItem('userInfo')
                    // 跳转到登录页面
                    window.location.href='/auth/login'
                } else{
                    // 登录接口本身的错误，只显示错误信息
                    ElMessage.error(data.msg || '登录过期，请重新登录')
                }
            } else {
                // 其他业务错误码（如500等），显示错误提示
                ElMessage.error(data.msg || '系统错误')
            }
            // 所有非200的响应都返回Promise.reject，让调用方可以catch到错误
            return Promise.reject(data.msg || '网络请求失败')
        }
    },
    error => {
        // HTTP层面的错误处理（如网络断开、404、500等）
        ElMessage.error('网络请求失败')
        return Promise.reject(error)
    }
)

// 导出配置好的axios实例，供其他模块使用
export default service
