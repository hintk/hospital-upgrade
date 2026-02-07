import axios from 'axios'
import { message } from 'antd'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const { code, message: msg, data } = response.data
    if (code === 200) {
      return data
    }
    // 业务错误
    message.error(msg || '操作失败')
    return Promise.reject(new Error(msg))
  },
  (error) => {
    // 网络错误
    if (error.response) {
      const { status, data } = error.response
      if (status === 400) {
        message.error(data.message || '请求参数错误')
      } else if (status === 500) {
        message.error(data.message || '服务器错误')
      } else {
        message.error('网络请求失败')
      }
    } else {
      message.error('网络连接失败，请检查网络')
    }
    return Promise.reject(error)
  }
)

export default api
