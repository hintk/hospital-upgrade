import api from './index'

export const doctorApi = {
  // 获取所有医生
  getList: () => api.get('/doctor/list'),

  // 按科室查询医生
  getByDepartment: (departmentId) => api.get(`/doctor/department/${departmentId}`),

  // 获取医生详情
  getById: (doctorId) => api.get(`/doctor/${doctorId}`),

  // 获取医生排班
  getSchedule: (doctorId) => api.get(`/doctor/${doctorId}/schedule`),

  // 医生登录
  login: (userId, password) =>
    api.post('/doctor/login', {
      userId,
      password,
      userType: 'doctor',
    }),

  // 添加医生
  create: (data) => api.post('/doctor', data),

  // 更新医生
  update: (doctorId, data) => api.put(`/doctor/${doctorId}`, data),

  // 删除医生
  delete: (doctorId) => api.delete(`/doctor/${doctorId}`),
}
