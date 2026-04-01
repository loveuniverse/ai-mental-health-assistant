<!--
  登录页面组件
  提供用户登录功能，包含用户名/邮箱和密码输入
  登录成功后根据用户类型跳转到对应页面
-->
<template>
    <div class="container">
        <!-- 页面标题区域 -->
        <div class="title">
            <div class="back-home">
                <el-icon><Back /></el-icon>
                <span>返回首页</span>
            </div>
            <div class="title-text">
                <h2>登录您的账户</h2>
                <p>请输入您的登录信息</p>
            </div>
        </div>
        <!-- 登录表单区域 -->
        <div class="form-container">
            <el-form
            ref="ruleFormRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            >
                <!-- 用户名输入 -->
                <el-form-item label="用户名或邮箱" prop="username">
                    <el-input v-model="formData.username" size=large placeholder="请输入用户名或邮箱" />
                </el-form-item>
                <!-- 密码输入 -->
                <el-form-item label="密码" prop="password">
                    <el-input v-model="formData.password" size=large placeholder="请输入密码" type="password" show-password />
                </el-form-item>
                <!-- 登录按钮 -->
                <el-button class="btn" size="large" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
            </el-form>
            <!-- 底部链接 -->
            <div class="footer">
                <p>还没有账户？<router-link to="/auth/register">注册</router-link></p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
  /* 登录页面样式 */
  .container {
    width: 384px;
    .title {
      .back-home {
        margin-bottom: 60px;
      }
      .title-text {
        text-align: center;
        h2 {
          font-size: 36px;
          margin-bottom: 10px;
        }
        p {
          font-size: 14px;
          color: #6b7280;
        }
      }
    }
    .form-container {
      margin-top: 30px;
      .btn {
        margin-top: 40px;
        width: 100%;
      }
      .footer {
        margin-top: 20px;
        text-align: center;
      }
    }
  }
  </style>
  
<script setup>
import { ref , reactive } from 'vue'
import { login } from '@/api/admin'
import { useRouter } from 'vue-router'

// 表单引用，用于表单验证
const ruleFormRef = ref()

// 表单数据对象
const formData = reactive({
    username: '',
    password: ''
})

// 表单验证规则
const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
    ]
})

// 路由实例
const router = useRouter()

/**
 * 提交登录表单
 * 验证表单并调用登录API
 * @param {Object} formEl - 表单实例
 */
const submitForm = async(formEl) => {
    if(!formEl){
        return
    }
    await formEl.validate((valid,fields)=>{
        if(valid){
            login(formData).then(data=>{
                if(!data.token){
                    return console.error('登录失败')
                }
                // 保存登录信息到本地存储
                localStorage.setItem('token', data.token)
                localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
                // 根据用户类型跳转（2为管理员）
                if(data.userInfo.userType === 2){
                    router.push('/back/dashboard')
                }else{
                    // 普通用户跳转逻辑（预留）
                }
            }).catch(error => {
                console.error('登录失败:', error)
                // 错误已经在响应拦截器中处理
            })
        }
    })
}


</script>
