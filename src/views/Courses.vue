<template>
  <div class="courses-container">
    <div class="page-header">
      <h2>课程管理</h2>
      <el-button type="primary" @click="handleAddCourse">
        <el-icon><Plus /></el-icon>
        新增课程
      </el-button>
    </div>
    
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索课程名称或课程代码" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="courses-table">
      <el-table :data="filteredCourses" style="width: 100%">
        <el-table-column prop="code" label="课程代码" width="120"></el-table-column>
        <el-table-column prop="name" label="课程名称" width="180"></el-table-column>
        <el-table-column prop="credit" label="学分" width="80"></el-table-column>
        <el-table-column prop="hours" label="课时" width="80"></el-table-column>
        <el-table-column prop="teacher" label="教师" width="120"></el-table-column>
        <el-table-column prop="semester" label="学期" width="120"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEditCourse(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteCourse(scope.row.code)">
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
    
    <!-- 新增/编辑课程对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="courseForm" :rules="courseRules" ref="courseFormRef" label-width="80px">
        <el-form-item label="课程代码" prop="code">
          <el-input v-model="courseForm.code" placeholder="请输入课程代码"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="courseForm.name" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="学分" prop="credit">
          <el-input v-model.number="courseForm.credit" type="number" placeholder="请输入学分"></el-input>
        </el-form-item>
        <el-form-item label="课时" prop="hours">
          <el-input v-model.number="courseForm.hours" type="number" placeholder="请输入课时"></el-input>
        </el-form-item>
        <el-form-item label="教师" prop="teacher">
          <el-input v-model="courseForm.teacher" placeholder="请输入教师姓名"></el-input>
        </el-form-item>
        <el-form-item label="学期" prop="semester">
          <el-select v-model="courseForm.semester" placeholder="请选择学期">
            <el-option label="第一学期" value="第一学期"></el-option>
            <el-option label="第二学期" value="第二学期"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveCourse">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 模拟课程数据
const courses = ref([
  { code: 'CS101', name: '计算机基础', credit: 3, hours: 48, teacher: '张老师', semester: '第一学期' },
  { code: 'CS102', name: '数据结构', credit: 4, hours: 64, teacher: '李老师', semester: '第一学期' },
  { code: 'CS103', name: '操作系统', credit: 4, hours: 64, teacher: '王老师', semester: '第二学期' },
  { code: 'CS104', name: '计算机网络', credit: 3, hours: 48, teacher: '赵老师', semester: '第二学期' },
  { code: 'CS105', name: '数据库原理', credit: 4, hours: 64, teacher: '钱老师', semester: '第二学期' }
])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(courses.value.length)

const dialogVisible = ref(false)
const dialogTitle = ref('新增课程')
const courseFormRef = ref<FormInstance>()

const courseForm = reactive({
  code: '',
  name: '',
  credit: 0,
  hours: 0,
  teacher: '',
  semester: ''
})

const courseRules = reactive<FormRules>({
  code: [
    { required: true, message: '请输入课程代码', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  credit: [
    { required: true, message: '请输入学分', trigger: 'blur' }
  ],
  hours: [
    { required: true, message: '请输入课时', trigger: 'blur' }
  ],
  teacher: [
    { required: true, message: '请输入教师姓名', trigger: 'blur' }
  ],
  semester: [
    { required: true, message: '请选择学期', trigger: 'blur' }
  ]
})

const filteredCourses = computed(() => {
  if (!searchQuery.value) {
    return courses.value
  }
  return courses.value.filter(course => 
    course.name.includes(searchQuery.value) || 
    course.code.includes(searchQuery.value)
  )
})

const handleAddCourse = () => {
  dialogTitle.value = '新增课程'
  Object.assign(courseForm, {
    code: '',
    name: '',
    credit: 0,
    hours: 0,
    teacher: '',
    semester: ''
  })
  dialogVisible.value = true
}

const handleEditCourse = (row: any) => {
  dialogTitle.value = '编辑课程'
  Object.assign(courseForm, row)
  dialogVisible.value = true
}

const handleSaveCourse = async () => {
  if (!courseFormRef.value) return
  await courseFormRef.value.validate(async (valid) => {
    if (valid) {
      const index = courses.value.findIndex(c => c.code === courseForm.code)
      if (index > -1) {
        // 编辑
        courses.value[index] = { ...courseForm }
      } else {
        // 新增
        courses.value.push({ ...courseForm })
      }
      dialogVisible.value = false
      total.value = courses.value.length
    }
  })
}

const handleDeleteCourse = (code: string) => {
  const index = courses.value.findIndex(c => c.code === code)
  if (index > -1) {
    courses.value.splice(index, 1)
    total.value = courses.value.length
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
.courses-container {
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

.courses-table {
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