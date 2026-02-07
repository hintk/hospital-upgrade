import api from './index'

export const departmentApi = {
  // 获取所有科室
  getList: () => api.get('/department/list'),

  // 根据ID获取科室
  getById: (id) => api.get(`/department/${id}`),
}
