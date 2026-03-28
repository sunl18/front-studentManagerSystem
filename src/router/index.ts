import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue'),
      children: [
        {
          path: 'students',
          name: 'Students',
          component: () => import('../views/Students.vue')
        },
        {
          path: 'courses',
          name: 'Courses',
          component: () => import('../views/Courses.vue')
        },
        {
          path: 'grades',
          name: 'Grades',
          component: () => import('../views/Grades.vue')
        },
        {
          path: 'attendance',
          name: 'Attendance',
          component: () => import('../views/Attendance.vue')
        },
        {
          path: 'reports',
          name: 'Reports',
          component: () => import('../views/Reports.vue')
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('../views/Settings.vue')
        }
      ]
    }
  ]
})

export default router