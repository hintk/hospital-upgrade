import api from './index'

export const patientApi = {
  // 注册
  register: (data) => api.post('/patient/register', data),

  // 登录
  login: (userId, password) =>
    api.post('/patient/login', {
      userId,
      password,
      userType: 'patient',
    }),

  // 获取患者信息
  getInfo: (patientId) => api.get(`/patient/${patientId}`),

  // 修改患者信息
  update: (patientId, data) => api.put(`/patient/${patientId}`, data),

  // 注销账号
  cancel: (patientId) => api.delete(`/patient/${patientId}`),
}
