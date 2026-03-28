<template>
  <div class="settings-container">
    <div class="page-header">
      <h2>个人设置</h2>
    </div>
    
    <div class="settings-content">
      <el-card shadow="hover" class="settings-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-form :model="userForm" :rules="userRules" ref="userFormRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username" placeholder="请输入用户名" disabled></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="userForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email" type="email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="userForm.phone" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-input v-model="userForm.role" placeholder="请输入角色" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSaveUser">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <el-card shadow="hover" class="settings-card">
        <template #header>
          <div class="card-header">
            <span>修改密码</span>
          </div>
        </template>
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
          <el-form-item label="原密码" prop="oldPassword">
            <el-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请确认新密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <el-card shadow="hover" class="settings-card">
        <template #header>
          <div class="card-header">
            <span>系统设置</span>
          </div>
        </template>
        <el-form :model="systemForm" ref="systemFormRef" label-width="100px">
          <el-form-item label="主题">
            <el-radio-group v-model="systemForm.theme">
              <el-radio label="light">浅色主题</el-radio>
              <el-radio label="dark">深色主题</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="语言">
            <el-select v-model="systemForm.language" placeholder="请选择语言">
              <el-option label="中文" value="zh-CN"></el-option>
              <el-option label="英文" value="en-US"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通知提醒">
            <el-switch v-model="systemForm.notification"></el-switch>
          </el-form-item>
          <el-form-item label="自动保存">
            <el-switch v-model="systemForm.autoSave"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSaveSystem">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

// 用户信息表单
const userFormRef = ref<FormInstance>()
const userForm = reactive({
  username: 'admin',
  name: '管理员',
  email: 'admin@example.com',
  phone: '13800138000',
  role: '管理员'
})

const userRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' }
  ]
})

// 密码修改表单
const passwordFormRef = ref<FormInstance>()
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = reactive<FormRules>({
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 系统设置表单
const systemFormRef = ref<FormInstance>()
const systemForm = reactive({
  theme: 'light',
  language: 'zh-CN',
  notification: true,
  autoSave: true
})

// 保存用户信息
const handleSaveUser = async () => {
  if (!userFormRef.value) return
  await userFormRef.value.validate(async (valid) => {
    if (valid) {
      // 模拟保存
      console.log('保存用户信息', userForm)
      alert('保存成功')
    }
  })
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      // 模拟修改密码
      console.log('修改密码', passwordForm)
      alert('密码修改成功')
      // 清空表单
      Object.assign(passwordForm, {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    }
  })
}

// 保存系统设置
const handleSaveSystem = () => {
  // 模拟保存
  console.log('保存系统设置', systemForm)
  alert('设置保存成功')
}
</script>

<style scoped>
.settings-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-card {
  transition: all 0.3s ease;
}

.settings-card:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 768px) {
  .settings-card {
    margin-bottom: 20px;
  }
}
</style>