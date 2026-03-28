<template>
  <div class="reports-container">
    <div class="page-header">
      <h2>统计报表</h2>
    </div>
    
    <div class="report-tabs">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="学生统计" name="students">
          <div class="report-content">
            <div class="stats-cards">
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>总学生数</span>
                  </div>
                </template>
                <div class="stats-value">{{ studentStats.total }}</div>
                <div class="stats-desc">全校学生总数</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>男生数</span>
                  </div>
                </template>
                <div class="stats-value">{{ studentStats.male }}</div>
                <div class="stats-desc">男生占比 {{ (studentStats.male / studentStats.total * 100).toFixed(1) }}%</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>女生数</span>
                  </div>
                </template>
                <div class="stats-value">{{ studentStats.female }}</div>
                <div class="stats-desc">女生占比 {{ (studentStats.female / studentStats.total * 100).toFixed(1) }}%</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>专业数</span>
                  </div>
                </template>
                <div class="stats-value">{{ studentStats.majors }}</div>
                <div class="stats-desc">开设专业数量</div>
              </el-card>
            </div>
            <div class="chart-container">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>学生专业分布</span>
                  </div>
                </template>
                <div class="chart" id="majorChart"></div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="成绩统计" name="grades">
          <div class="report-content">
            <div class="stats-cards">
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>平均成绩</span>
                  </div>
                </template>
                <div class="stats-value">{{ gradeStats.average }}</div>
                <div class="stats-desc">所有课程平均成绩</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>优秀率</span>
                  </div>
                </template>
                <div class="stats-value">{{ gradeStats.excellentRate }}%</div>
                <div class="stats-desc">90分以上学生占比</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>及格率</span>
                  </div>
                </template>
                <div class="stats-value">{{ gradeStats.passRate }}%</div>
                <div class="stats-desc">60分以上学生占比</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>课程数</span>
                  </div>
                </template>
                <div class="stats-value">{{ gradeStats.courses }}</div>
                <div class="stats-desc">统计课程数量</div>
              </el-card>
            </div>
            <div class="chart-container">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>成绩分布</span>
                  </div>
                </template>
                <div class="chart" id="gradeChart"></div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="考勤统计" name="attendance">
          <div class="report-content">
            <div class="stats-cards">
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>出勤次数</span>
                  </div>
                </template>
                <div class="stats-value">{{ attendanceStats.present }}</div>
                <div class="stats-desc">出勤占比 {{ (attendanceStats.present / attendanceStats.total * 100).toFixed(1) }}%</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>缺勤次数</span>
                  </div>
                </template>
                <div class="stats-value">{{ attendanceStats.absent }}</div>
                <div class="stats-desc">缺勤占比 {{ (attendanceStats.absent / attendanceStats.total * 100).toFixed(1) }}%</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>迟到次数</span>
                  </div>
                </template>
                <div class="stats-value">{{ attendanceStats.late }}</div>
                <div class="stats-desc">迟到占比 {{ (attendanceStats.late / attendanceStats.total * 100).toFixed(1) }}%</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>考勤总次数</span>
                  </div>
                </template>
                <div class="stats-value">{{ attendanceStats.total }}</div>
                <div class="stats-desc">总考勤记录数</div>
              </el-card>
            </div>
            <div class="chart-container">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>考勤状态分布</span>
                  </div>
                </template>
                <div class="chart" id="attendanceChart"></div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="课程统计" name="courses">
          <div class="report-content">
            <div class="stats-cards">
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>总课程数</span>
                  </div>
                </template>
                <div class="stats-value">{{ courseStats.total }}</div>
                <div class="stats-desc">开设课程总数</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>理论课程</span>
                  </div>
                </template>
                <div class="stats-value">{{ courseStats.theory }}</div>
                <div class="stats-desc">理论课程数量</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>实践课程</span>
                  </div>
                </template>
                <div class="stats-value">{{ courseStats.practical }}</div>
                <div class="stats-desc">实践课程数量</div>
              </el-card>
              <el-card shadow="hover" class="stats-card">
                <template #header>
                  <div class="card-header">
                    <span>总学分</span>
                  </div>
                </template>
                <div class="stats-value">{{ courseStats.credits }}</div>
                <div class="stats-desc">所有课程总学分</div>
              </el-card>
            </div>
            <div class="chart-container">
              <el-card shadow="hover">
                <template #header>
                  <div class="card-header">
                    <span>课程类型分布</span>
                  </div>
                </template>
                <div class="chart" id="courseChart"></div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

const activeTab = ref('students')

// 学生统计数据
const studentStats = reactive({
  total: 1000,
  male: 550,
  female: 450,
  majors: 10
})

// 成绩统计数据
const gradeStats = reactive({
  average: 82.5,
  excellentRate: 35.2,
  passRate: 92.8,
  courses: 20
})

// 考勤统计数据
const attendanceStats = reactive({
  total: 5000,
  present: 4200,
  absent: 400,
  late: 400
})

// 课程统计数据
const courseStats = reactive({
  total: 50,
  theory: 30,
  practical: 20,
  credits: 120
})

onMounted(() => {
  // 模拟图表初始化
  console.log('图表初始化')
})
</script>

<style scoped>
.reports-container {
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

.report-tabs {
  width: 100%;
}

.report-content {
  padding: 20px 0;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stats-card {
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
  margin: 20px 0 10px 0;
}

.stats-desc {
  font-size: 14px;
  color: #666;
}

.chart-container {
  margin-top: 20px;
}

.chart {
  height: 400px;
  width: 100%;
  background-color: #f9f9f9;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 16px;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .chart {
    height: 300px;
  }
}
</style>