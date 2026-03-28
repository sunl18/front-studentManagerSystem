<template>
  <div class="grades-container">
    <div class="page-header">
      <h2>成绩管理</h2>
      <el-button type="primary" @click="handleAddGrade">
        <el-icon><Plus /></el-icon>
        新增成绩
      </el-button>
    </div>
    
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索学生姓名或课程名称" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="grades-table">
      <el-table :data="filteredGrades" style="width: 100%">
        <el-table-column prop="studentId" label="学号" width="120"></el-table-column>
        <el-table-column prop="studentName" label="学生姓名" width="120"></el-table-column>
        <el-table-column prop="courseCode" label="课程代码" width="120"></el-table-column>
        <el-table-column prop="courseName" label="课程名称" width="180"></el-table-column>
        <el-table-column prop="score" label="成绩" width="80"></el-table-column>
        <el-table-column prop="semester" label="学期" width="120"></el-table-column>
        <el-table-column prop="year" label="学年" width="100"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEditGrade(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteGrade(scope.row.id)">
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
    
    <!-- 新增/编辑成绩对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="gradeForm" :rules="gradeRules" ref="gradeFormRef" label-width="80px">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="gradeForm.studentId" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" prop="studentName">
          <el-input v-model="gradeForm.studentName" placeholder="请输入学生姓名"></el-input>
        </el-form-item>
        <el-form-item label="课程代码" prop="courseCode">
          <el-input v-model="gradeForm.courseCode" placeholder="请输入课程代码"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="gradeForm.courseName" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="成绩" prop="score">
          <el-input v-model.number="gradeForm.score" type="number" placeholder="请输入成绩" min="0" max="100"></el-input>
        </el-form-item>
        <el-form-item label="学期" prop="semester">
          <el-select v-model="gradeForm.semester" placeholder="请选择学期">
            <el-option label="第一学期" value="第一学期"></el-option>
            <el-option label="第二学期" value="第二学期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学年" prop="year">
          <el-input v-model.number="gradeForm.year" type="number" placeholder="请输入学年"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveGrade">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 模拟成绩数据
const grades = ref([
  { id: 1, studentId: '2023001', studentName: '张三', courseCode: 'CS101', courseName: '计算机基础', score: 90, semester: '第一学期', year: 2023 },
  { id: 2, studentId: '2023001', studentName: '张三', courseCode: 'CS102', courseName: '数据结构', score: 85, semester: '第一学期', year: 2023 },
  { id: 3, studentId: '2023002', studentName: '李四', courseCode: 'CS101', courseName: '计算机基础', score: 95, semester: '第一学期', year: 2023 },
  { id: 4, studentId: '2023002', studentName: '李四', courseCode: 'CS102', courseName: '数据结构', score: 88, semester: '第一学期', year: 2023 },
  { id: 5, studentId: '2023003', studentName: '王五', courseCode: 'CS101', courseName: '计算机基础', score: 82, semester: '第一学期', year: 2023 }
])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(grades.value.length)

const dialogVisible = ref(false)
const dialogTitle = ref('新增成绩')
const gradeFormRef = ref<FormInstance>()

const gradeForm = reactive({
  id: 0,
  studentId: '',
  studentName: '',
  courseCode: '',
  courseName: '',
  score: 0,
  semester: '',
  year: 2023
})

const gradeRules = reactive<FormRules>({
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  studentName: [
    { required: true, message: '请输入学生姓名', trigger: 'blur' }
  ],
  courseCode: [
    { required: true, message: '请输入课程代码', trigger: 'blur' }
  ],
  courseName: [
    { required: true, message: '请输入课程名称', trigger: 'blur' }
  ],
  score: [
    { required: true, message: '请输入成绩', trigger: 'blur' },
    { type: 'number', min: 0, max: 100, message: '成绩必须在0-100之间', trigger: 'blur' }
  ],
  semester: [
    { required: true, message: '请选择学期', trigger: 'blur' }
  ],
  year: [
    { required: true, message: '请输入学年', trigger: 'blur' }
  ]
})

const filteredGrades = computed(() => {
  if (!searchQuery.value) {
    return grades.value
  }
  return grades.value.filter(grade => 
    grade.studentName.includes(searchQuery.value) || 
    grade.courseName.includes(searchQuery.value)
  )
})

const handleAddGrade = () => {
  dialogTitle.value = '新增成绩'
  Object.assign(gradeForm, {
    id: 0,
    studentId: '',
    studentName: '',
    courseCode: '',
    courseName: '',
    score: 0,
    semester: '',
    year: 2023
  })
  dialogVisible.value = true
}

const handleEditGrade = (row: any) => {
  dialogTitle.value = '编辑成绩'
  Object.assign(gradeForm, row)
  dialogVisible.value = true
}

const handleSaveGrade = async () => {
  if (!gradeFormRef.value) return
  await gradeFormRef.value.validate(async (valid) => {
    if (valid) {
      const index = grades.value.findIndex(g => g.id === gradeForm.id)
      if (index > -1) {
        // 编辑
        grades.value[index] = { ...gradeForm }
      } else {
        // 新增
        gradeForm.id = grades.value.length + 1
        grades.value.push({ ...gradeForm })
      }
      dialogVisible.value = false
      total.value = grades.value.length
    }
  })
}

const handleDeleteGrade = (id: number) => {
  const index = grades.value.findIndex(g => g.id === id)
  if (index > -1) {
    grades.value.splice(index, 1)
    total.value = grades.value.length
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
.grades-container {
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

.grades-table {
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