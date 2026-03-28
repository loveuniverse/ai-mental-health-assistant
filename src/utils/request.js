import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
    baseURL: '/api',
    timeout: 5000
})

service.interceptors.request.use(
    config => {
        // 在发送请求之前做什么
        const token = localStorage.getItem('token')
        if(token){
            config.headers['token'] = token
        }
        return config
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
        // 对响应数据做点什么
        const {data, config} = response
        if(data.code === '200'){
            return data.data
        }else{
            if(data.code==='-1'){
                if(!config.url?.includes('/login')){
                    ElMessage.error(data.msg || '登录过期，请重新登录')
                    localStorage.removeItem('token')
                    localStorage.removeItem('userInfo')
                    window.location.href='/auth/login'
                } else{
                    ElMessage.error(data.msg || '登录过期，请重新登录')
                }
            } else {
                // 处理其他错误码，包括 500
                ElMessage.error(data.msg || '系统错误')
            }
            // 所有非 200 的响应都返回 Promise.reject
            return Promise.reject(data.msg || '网络请求失败')
        }
    },
    error => {
        // 对响应错误做点什么
        ElMessage.error('网络请求失败')
        return Promise.reject(error)
    }
)

export default service