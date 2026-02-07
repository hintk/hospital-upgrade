import api from './index'

export const adminApi = {
  // 管理员登录
  login: (userId, password) =>
    api.post('/admin/login', {
      userId,
      password,
      userType: 'admin',
    }),

  // 批量导入医生
  importDoctors: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/admin/import/doctor', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // 批量导入排班
  importSchedules: (file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/admin/import/schedule', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // 导出预约记录（返回下载URL）
  exportAppointments: () => '/api/admin/export/appointments',

  // 生成月度报告（返回下载URL）
  getMonthlyReport: (year, month) => `/api/admin/report/monthly?year=${year}&month=${month}`,

  // 下载医生导入模板
  getDoctorTemplate: () => '/api/admin/template/doctor',

  // 下载排班导入模板
  getScheduleTemplate: () => '/api/admin/template/schedule',

  // 获取报表统计数据
  getReportStatistics: () => api.get('/statistics/report'),
}
