import api from './index'

export const scheduleApi = {
  // 按日期查询排班
  getByDate: (date) => api.get(`/schedule/date/${date}`),

  // 按医生查询排班
  getByDoctor: (doctorId) => api.get(`/schedule/doctor/${doctorId}`),

  // 获取排班详情
  getById: (id) => api.get(`/schedule/${id}`),

  // 添加排班
  create: (data) => api.post('/schedule', data),

  // 更新排班
  update: (id, data) => api.put(`/schedule/${id}`, data),

  // 删除排班
  delete: (id) => api.delete(`/schedule/${id}`),
}
