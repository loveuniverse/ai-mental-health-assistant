/**
 * 路由配置模块
 * 定义应用的所有路由规则和导航守卫
 */
import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'
import AuthLayout from '@/components/AuthLayout.vue'

/**
 * 后台管理路由配置
 * 包含后台布局路由和认证路由两大分支
 */
const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',  // 访问/back时自动重定向到仪表盘
    component: BackendLayout,      // 使用后台布局组件
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/DashBoard.vue'),
        meta: {
          title: '数据分析',       // 页面标题
          icon: 'PieChart'         // 菜单图标
        }
      }
      ,
      {
        path: 'knowledge',
        component: () => import('@/views/Knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare'
        }
      }
      ,
      {
        path: 'consultations',
        component: () => import('@/views/Consultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message'
        }
      }
      ,
      {
        path: 'emotional',
        component: () => import('@/views/Emotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User'
        }
      }
    ]
  },
  {
    'path':'/auth',
    component: AuthLayout,         // 使用认证布局组件
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录'
        }
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册'
        }
      }
    ]
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),     // 使用HTML5 History模式
  routes: backendRoutes
})

/**
 * 全局前置守卫
 * 在每次路由跳转前执行，用于权限验证和页面跳转控制
 * @param {Object} to - 目标路由对象
 * @param {Object} from - 来源路由对象
 * @param {Function} next - 放行函数
 */
router.beforeEach((to, from, next)=>{
  // 从本地存储获取用户登录令牌
  const token = localStorage.getItem('token')
  if(token){
    // 已登录状态，解析用户信息
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // userType为2表示管理员用户
    if(userInfo.userType == 2){
      // 管理员访问后台页面，允许通过
      if(to.path.startsWith('/back')){
        next()
      }else{
        // 管理员访问非后台页面，重定向到仪表盘
        next('/back/dashboard')
      }
    } else if(userInfo.userType == 1){
      // 普通用户（userType为1），这里预留跳转至前台首页的逻辑
      // 由于前台首页未实现，暂时不做处理
    }
  }else{
    // 未登录状态
    if(to.path === '/back'){
      // 访问后台根路径，重定向到登录页
      next('/auth/login')
    }else{
      // 其他页面允许访问（登录页、注册页等）
      next()
    }
  }
})

// 导出路由实例
export default router
