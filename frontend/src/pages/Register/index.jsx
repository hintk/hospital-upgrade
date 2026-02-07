import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Radio, message, Modal, Result } from 'antd'
import { UserOutlined, LockOutlined, IdcardOutlined, PhoneOutlined, CopyOutlined } from '@ant-design/icons'
import { patientApi } from '../../api/patient'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [registeredPatientId, setRegisteredPatientId] = useState('')
  const [registeredPhone, setRegisteredPhone] = useState('')
  const [form] = Form.useForm()
  const navigate = useNavigate()

  // 从身份证号解析年龄
  const getAgeFromIdCard = (idCard) => {
    if (!idCard || idCard.length !== 18) return null
    const birthYear = parseInt(idCard.substring(6, 10))
    const currentYear = new Date().getFullYear()
    return currentYear - birthYear
  }

  // 身份证验证
  const validateIdCard = (_, value) => {
    if (!value) {
      return Promise.reject('请输入身份证号')
    }
    if (!/^\d{18}$/.test(value)) {
      return Promise.reject('身份证号必须为18位数字')
    }
    const age = getAgeFromIdCard(value)
    if (age < 10) {
      return Promise.reject('年龄必须满10岁才能注册')
    }
    return Promise.resolve()
  }

  // 手机号验证
  const validatePhone = (_, value) => {
    if (!value) {
      return Promise.reject('请输入手机号')
    }
    if (!/^1[3-9]\d{9}$/.test(value)) {
      return Promise.reject('请输入正确的11位手机号')
    }
    return Promise.resolve()
  }

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...registerData } = values
      const result = await patientApi.register(registerData)
      setRegisteredPatientId(result.patientId)
      setRegisteredPhone(values.phone)
      setShowSuccess(true)
    } catch (error) {
      // 错误已在拦截器中处理
    } finally {
      setLoading(false)
    }
  }

  const copyPatientId = () => {
    navigator.clipboard.writeText(registeredPatientId)
    message.success('患者ID已复制到剪贴板')
  }

  const handleGoLogin = () => {
    setShowSuccess(false)
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏥</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">飞马星球医院</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">患者注册</p>
        </div>

        {/* 注册卡片 */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
            创建账号
          </h2>

          <Form
            form={form}
            name="register"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            size="large"
            initialValues={{ gender: 'M' }}
          >
            <Form.Item
              name="name"
              rules={[
                { required: true, message: '请输入姓名' },
                { max: 20, message: '姓名最多20个字符' },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="请输入姓名"
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="idCard"
              rules={[{ validator: validateIdCard }]}
            >
              <Input
                prefix={<IdcardOutlined className="text-gray-400" />}
                placeholder="请输入18位身份证号"
                maxLength={18}
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[{ validator: validatePhone }]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="请输入手机号"
                maxLength={11}
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="gender"
              label={<span className="text-gray-600 dark:text-gray-300">性别</span>}
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Radio.Group>
                <Radio value="M">男</Radio>
                <Radio value="F">女</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 4, message: '密码不少于4位' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请输入密码（不少于4位）"
                className="h-12 rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject('两次输入的密码不一致')
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="请再次输入密码"
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
                注 册
              </Button>
            </Form.Item>
          </Form>

          {/* 登录链接 */}
          <div className="text-center mt-4">
            <span className="text-gray-500 dark:text-gray-400">已有账号？</span>
            <Link
              to="/login"
              className="ml-2 text-primary-500 hover:text-primary-600 font-medium"
            >
              立即登录
            </Link>
          </div>
        </div>

        {/* 提示 */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>注册须知：年满10岁的飞马人方可注册</p>
        </div>
      </div>

      {/* 注册成功弹窗 */}
      <Modal
        open={showSuccess}
        footer={null}
        closable={false}
        centered
        width={420}
      >
        <Result
          status="success"
          title="注册成功！"
          subTitle="请牢记您的患者ID，可用于登录系统"
          extra={[
            <div key="info" className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-500">患者ID：</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-primary-600">{registeredPatientId}</span>
                  <Button 
                    type="text" 
                    icon={<CopyOutlined />} 
                    onClick={copyPatientId}
                    size="small"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">手机号：</span>
                <span className="text-gray-800">{registeredPhone}</span>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                提示：您可以使用患者ID或手机号登录
              </div>
            </div>,
            <Button type="primary" key="login" onClick={handleGoLogin} block size="large">
              前往登录
            </Button>,
          ]}
        />
      </Modal>
    </div>
  )
}

export default Register
