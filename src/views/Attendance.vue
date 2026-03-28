<template>
  <div class="attendance-container">
    <div class="page-header">
      <h2>考勤管理</h2>
      <el-button type="primary" @click="handleAddAttendance">
        <el-icon><Plus /></el-icon>
        新增考勤
      </el-button>
    </div>
    
    <div class="search-bar">
      <el-input v-model="searchQuery" placeholder="搜索学生姓名或课程名称" clearable>
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>
    
    <div class="attendance-table">
      <el-table :data="filteredAttendances" style="width: 100%">
        <el-table-column prop="studentId" label="学号" width="120"></el-table-column>
        <el-table-column prop="studentName" label="学生姓名" width="120"></el-table-column>
        <el-table-column prop="courseCode" label="课程代码" width="120"></el-table-column>
        <el-table-column prop="courseName" label="课程名称" width="180"></el-table-column>
        <el-table-column prop="date" label="日期" width="150"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEditAttendance(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteAttendance(scope.row.id)">
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
    
    <!-- 新增/编辑考勤对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="attendanceForm" :rules="attendanceRules" ref="attendanceFormRef" label-width="80px">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="attendanceForm.studentId" placeholder="请输入学号"></el-input>
        </el-form-item>
        <el-form-item label="学生姓名" prop="studentName">
          <el-input v-model="attendanceForm.studentName" placeholder="请输入学生姓名"></el-input>
        </el-form-item>
        <el-form-item label="课程代码" prop="courseCode">
          <el-input v-model="attendanceForm.courseCode" placeholder="请输入课程代码"></el-input>
        </el-form-item>
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="attendanceForm.courseName" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="attendanceForm.date" type="date" placeholder="请选择日期" style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="attendanceForm.status" placeholder="请选择状态">
            <el-option label="出勤" value="出勤"></el-option>
            <el-option label="缺勤" value="缺勤"></el-option>
            <el-option label="迟到" value="迟到"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="attendanceForm.remark" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveAttendance">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

// 模拟考勤数据
const attendances = ref([
  { id: 1, studentId: '2023001', studentName: '张三', courseCode: 'CS101', courseName: '计算机基础', date: '2023-09-01', status: '出勤', remark: '' },
  { id: 2, studentId: '2023001', studentName: '张三', courseCode: 'CS101', courseName: '计算机基础', date: '2023-09-02', status: '迟到', remark: '迟到10分钟' },
  { id: 3, studentId: '2023002', studentName: '李四', courseCode: 'CS101', courseName: '计算机基础', date: '2023-09-01', status: '出勤', remark: '' },
  { id: 4, studentId: '2023002', studentName: '李四', courseCode: 'CS101', courseName: '计算机基础', date: '2023-09-02', status: '缺勤', remark: '请假' },
  { id: 5, studentId: '2023003', studentName: '王五', courseCode: 'CS101', courseName: '计算机基础', date: '2023-09-01', status: '出勤', remark: '' }
])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(attendances.value.length)

const dialogVisible = ref(false)
const dialogTitle = ref('新增考勤')
const attendanceFormRef = ref<FormInstance>()

const attendanceForm = reactive({
  id: 0,
  studentId: '',
  studentName: '',
  courseCode: '',
  courseName: '',
  date: '',
  status: '',
  remark: ''
})

const attendanceRules = reactive<FormRules>({
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
  date: [
    { required: true, message: '请选择日期', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'blur' }
  ]
})

const filteredAttendances = computed(() => {
  if (!searchQuery.value) {
    return attendances.value
  }
  return attendances.value.filter(attendance => 
    attendance.studentName.includes(searchQuery.value) || 
    attendance.courseName.includes(searchQuery.value)
  )
})

const getStatusType = (status: string) => {
  switch (status) {
    case '出勤':
      return 'success'
    case '缺勤':
      return 'danger'
    case '迟到':
      return 'warning'
    default:
      return 'info'
  }
}

const handleAddAttendance = () => {
  dialogTitle.value = '新增考勤'
  Object.assign(attendanceForm, {
    id: 0,
    studentId: '',
    studentName: '',
    courseCode: '',
    courseName: '',
    date: '',
    status: '',
    remark: ''
  })
  dialogVisible.value = true
}

const handleEditAttendance = (row: any) => {
  dialogTitle.value = '编辑考勤'
  Object.assign(attendanceForm, row)
  dialogVisible.value = true
}

const handleSaveAttendance = async () => {
  if (!attendanceFormRef.value) return
  await attendanceFormRef.value.validate(async (valid) => {
    if (valid) {
      const index = attendances.value.findIndex(a => a.id === attendanceForm.id)
      if (index > -1) {
        // 编辑
        attendances.value[index] = { ...attendanceForm }
      } else {
        // 新增
        attendanceForm.id = attendances.value.length + 1
        attendances.value.push({ ...attendanceForm })
      }
      dialogVisible.value = false
      total.value = attendances.value.length
    }
  })
}

const handleDeleteAttendance = (id: number) => {
  const index = attendances.value.findIndex(a => a.id === id)
  if (index > -1) {
    attendances.value.splice(index, 1)
    total.value = attendances.value.length
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
.attendance-container {
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

.attendance-table {
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