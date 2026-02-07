import api from './index'

export const appointmentApi = {
  // 创建预约
  create: (data) => api.post('/appointment', data),

  // 取消预约
  cancel: (appointmentId, reason = '') =>
    api.put(`/appointment/${appointmentId}/cancel?reason=${encodeURIComponent(reason)}`),

  // 完成预约
  complete: (appointmentId) => api.put(`/appointment/${appointmentId}/complete`),

  // 获取预约详情
  getById: (appointmentId) => api.get(`/appointment/${appointmentId}`),

  // 获取患者的预约列表
  getByPatient: (patientId) => api.get(`/appointment/patient/${patientId}`),

  // 获取医生的预约列表
  getByDoctor: (doctorId) => api.get(`/appointment/doctor/${doctorId}`),
}
