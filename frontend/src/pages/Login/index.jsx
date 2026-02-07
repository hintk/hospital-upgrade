import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Tabs, message, Card } from 'antd'
import { UserOutlined, LockOutlined, SafetyOutlined, TeamOutlined, ClockCircleOutlined, HeartOutlined } from '@ant-design/icons'
import { patientApi } from '../../api/patient'
import { doctorApi } from '../../api/doctor'
import { adminApi } from '../../api/admin'
import { useUserStore } from '../../store/userStore'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState('patient')
  const navigate = useNavigate()
  const login = useUserStore((state) => state.login)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      let userData
      if (userType === 'patient') {
        userData = await patientApi.login(values.userId, values.password)
      } else if (userType === 'doctor') {
        userData = await doctorApi.login(values.userId, values.password)
      } else {
        userData = await adminApi.login(values.userId, values.password)
      }
      
      login(userData, userType)
      message.success('登录成功')
      
      if (userType === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error) {
      // 错误已在拦截器中处理
    } finally {
      setLoading(false)
    }
  }

  const tabItems = [
    { key: 'patient', label: '患者' },
    { key: 'doctor', label: '医生' },
    { key: 'admin', label: '管理员' },
  ]

  const getPlaceholder = () => {
    switch (userType) {
      case 'patient':
        return '手机号 / 患者ID'
      case 'doctor':
        return '请输入医生ID（8位数字）'
      case 'admin':
        return '请输入管理员账号'
      default:
        return '请输入账号'
    }
  }

  const features = [
    { icon: <SafetyOutlined className="text-2xl text-primary-500" />, title: '安全可靠', desc: '数据加密存储' },
    { icon: <TeamOutlined className="text-2xl text-green-500" />, title: '专业团队', desc: '资深医疗专家' },
    { icon: <ClockCircleOutlined className="text-2xl text-orange-500" />, title: '便捷预约', desc: '在线快速挂号' },
    { icon: <HeartOutlined className="text-2xl text-red-500" />, title: '贴心服务', desc: '全程健康管理' },
  ]

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-dark-bg">
      {/* 左侧装饰区域 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">飞马星球医院</h1>
          <p className="text-primary-100 text-lg">智慧医疗，健康未来</p>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="mb-2">{f.icon}</div>
              <h3 className="text-white font-semibold">{f.title}</h3>
              <p className="text-primary-100 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="text-primary-200 text-sm">
          <p>© 2024 飞马星球医院 版权所有</p>
          <p className="mt-1">提供优质医疗服务，守护您的健康</p>
        </div>
      </div>
      
      {/* 右侧登录区域 */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏥</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">飞马星球医院</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">预约挂号系统</p>
        </div>

        {/* 登录卡片 */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
            欢迎回来
          </h2>

          {/* 用户类型切换 */}
          <Tabs
            activeKey={userType}
            onChange={setUserType}
            centered
            items={tabItems}
            className="mb-6"
          />

          {/* 登录表单 */}
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="userId"
              rules={[{ required: true, message: '请输入账号' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder={getPlaceholder()}
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入密码"
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="h-12 rounded-lg bg-primary-500 hover:bg-primary-600 border-none text-base font-medium"
              >
                登 录
              </Button>
            </Form.Item>
          </Form>

          {/* 分隔线 */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200 dark:border-dark-border"></div>
            <span className="px-4 text-sm text-gray-400">或</span>
            <div className="flex-1 border-t border-gray-200 dark:border-dark-border"></div>
          </div>

          {/* 注册链接 */}
          {userType === 'patient' && (
            <div className="text-center">
              <span className="text-gray-500 dark:text-gray-400">还没有账号？</span>
              <Link
                to="/register"
                className="ml-2 text-primary-500 hover:text-primary-600 font-medium"
              >
                立即注册
              </Link>
            </div>
          )}
        </div>

        
        {/* 移动端特性展示 */}
        <div className="lg:hidden mt-8 grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <div className="mb-1">{f.icon}</div>
              <h3 className="text-gray-800 font-medium text-sm">{f.title}</h3>
              <p className="text-gray-400 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default Login
