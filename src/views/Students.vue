<template>
  <div class="students-container">
    <div class="page-header">
      <h2>学生管理</h2>
      <el-button type="primary" @click="handleAddStudent">
        <el-icon><Plus /></el-icon>
        新增学生
      </el-button>
    </div>
    
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索学生姓名或学号" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="students-table">
      <el-table :data="filteredStudents" style="width: 100%">
        <el-table-column prop="id" label="学号" width="120"></el-table-column>
        <el-table-column prop="name" label="姓名" width="120"></el-table-column>
        <el-table-column prop="gender" label="性别" width="80"></el-table-column>
        <el-table-column prop="age" label="年龄" width="80"></el-table-column>
        <el-table-column prop="major" label="专业" width="150"></el-table-column>
        <el-table-column prop="class" label="班级" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEditStudent(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteStudent(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 新增/编辑学生对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="studentForm" :rules="studentRules" ref="studentFormRef" label-width="80px">
        <el-form-item label="学号" prop="id">
          <el-input v-model="studentForm.id" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="studentForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="studentForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="studentForm.age" type="number" placeholder="请输入年龄"></el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <el-input v-model="studentForm.major" placeholder="请输入专业"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class">
          <el-input v-model="studentForm.class" placeholder="请输入班级"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="studentForm.email" type="email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveStudent">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 模拟学生数据
const students = ref([
  { id: '2023001', name: '张三', gender: '男', age: 18, major: '计算机科学与技术', class: '计科1班', email: 'zhangsan@example.com' },
  { id: '2023002', name: '李四', gender: '女', age: 19, major: '软件工程', class: '软工2班', email: 'lisi@example.com' },
  { id: '2023003', name: '王五', gender: '男', age: 18, major: '数据科学与大数据技术', class: '数科1班', email: 'wangwu@example.com' },
  { id: '2023004', name: '赵六', gender: '女', age: 19, major: '人工智能', class: 'AI1班', email: 'zhaoliu@example.com' },
  { id: '2023005', name: '孙七', gender: '男', age: 20, major: '物联网工程', class: '物联1班', email: 'sunqi@example.com' }
])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(students.value.length)

const dialogVisible = ref(false)
const dialogTitle = ref('新增学生')
const studentFormRef = ref<FormInstance>()

const studentForm = reactive({
  id: '',
  name: '',
  gender: '男',
  age: 0,
  major: '',
  class: '',
  email: ''
})

const studentRules = reactive<FormRules>({
  id: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  major: [
    { required: true, message: '请输入专业', trigger: 'blur' }
  ],
  class: [
    { required: true, message: '请输入班级', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
})

const filteredStudents = computed(() => {
  if (!searchQuery.value) {
    return students.value
  }
  return students.value.filter(student => 
    student.name.includes(searchQuery.value) || 
    student.id.includes(searchQuery.value)
  )
})

const handleAddStudent = () => {
  dialogTitle.value = '新增学生'
  Object.assign(studentForm, {
    id: '',
    name: '',
    gender: '男',
    age: 0,
    major: '',
    class: '',
    email: ''
  })
  dialogVisible.value = true
}

const handleEditStudent = (row: any) => {
  dialogTitle.value = '编辑学生'
  Object.assign(studentForm, row)
  dialogVisible.value = true
}

const handleSaveStudent = async () => {
  if (!studentFormRef.value) return
  await studentFormRef.value.validate(async (valid) => {
    if (valid) {
      const index = students.value.findIndex(s => s.id === studentForm.id)
      if (index > -1) {
        // 编辑
        students.value[index] = { ...studentForm }
      } else {
        // 新增
        students.value.push({ ...studentForm })
      }
      dialogVisible.value = false
      total.value = students.value.length
    }
  })
}

const handleDeleteStudent = (id: string) => {
  const index = students.value.findIndex(s => s.id === id)
  if (index > -1) {
    students.value.splice(index, 1)
    total.value = students.value.length
  }
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
}
</script>

<style scoped>
.students-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.search-bar {
  margin-bottom: 20px;
  width: 300px;
}

.students-table {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .search-bar {
    width: 100%;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .page-header h2 {
    margin-bottom: 10px;
  }
}
</style>