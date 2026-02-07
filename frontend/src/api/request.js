import axios from 'axios';
import { message } from 'antd';

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // Vite 代理会处理这个前缀
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果有 token，可以在这里添加
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    
    // 根据后端统一响应格式：{ code: 200, message: "...", data: ... }
    if (res.code === 200) {
      return res.data;
    }
    
    // 业务错误处理
    message.error(res.message || '系统繁忙，请稍后重试');
    return Promise.reject(new Error(res.message || 'Error'));
  },
  (error) => {
    console.error('Request Error:', error);
    const msg = error.response?.data?.message || error.message || '网络请求失败';
    message.error(msg);
    return Promise.reject(error);
  }
);

export default request;
