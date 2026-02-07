import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Radio, Button, Modal, message, Descriptions } from 'antd'
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { patientApi } from '../../api/patient'
import { useUserStore } from '../../store/userStore'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { user, updateUser, logout } = useUserStore()

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        password: '',
      })
    }
  }, [user, form])

  const handleSave = async (values) => {
    setLoading(true)
    try {
      // 只发送有变化的字段
      const updateData = {}
      if (values.name !== user.name) updateData.name = values.name
      if (values.phone !== user.phone) updateData.phone = values.phone
      if (values.gender !== user.gender) updateData.gender = values.gender
      if (values.password) updateData.password = values.password

      if (Object.keys(updateData).length === 0) {
        message.info('没有需要修改的内容')
        setIsEditing(false)
        return
      }

      await patientApi.update(user.patientId, updateData)
      updateUser(updateData)
      message.success('修改成功')
      setIsEditing(false)
    } catch (error) {
      // 错误已在拦截器处理
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.setFieldsValue({
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      password: '',
    })
    setIsEditing(false)
  }

  const handleDeactivate = () => {
    Modal.confirm({
      title: '确认注销账号？',
      icon: <ExclamationCircleOutlined />,
      content: '注销后将无法恢复，您的所有预约记录将被清除。确定要注销吗？',
      okText: '确认注销',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await patientApi.cancel(user.patientId)
          message.success('账号已注销')
          logout()
          navigate('/')
        } catch (error) {
          // 错误已在拦截器处理
        }
      },
    })
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">个人中心</h1>
        {!isEditing && (
          <Button icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
            编辑资料
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-dark-surface rounded-xl p-6 border border-gray-100 dark:border-dark-border">
        {/* 头像区域 */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-dark-border">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-3xl">
            {user.gender === 'M' ? '👨' : '👩'}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">患者ID: {user.patientId}</p>
          </div>
        </div>

        {isEditing ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item
              name="name"
              label="姓名"
              rules={[
                { required: true, message: '请输入姓名' },
                { max: 20, message: '姓名最多20个字符' },
              ]}
            >
              <Input placeholder="请输入姓名" />
            </Form.Item>

            <Form.Item label="身份证号">
              <Input value={user.idCard} disabled />
              <p className="text-xs text-gray-400 mt-1">身份证号不可修改</p>
            </Form.Item>

            <Form.Item
              name="phone"
              label="手机号"
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
              ]}
            >
              <Input placeholder="请输入手机号" maxLength={11} />
            </Form.Item>

            <Form.Item name="gender" label="性别">
              <Radio.Group>
                <Radio value="M">男</Radio>
                <Radio value="F">女</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="password"
              label="新密码"
              rules={[
                { min: 4, message: '密码不少于4位' },
              ]}
            >
              <Input.Password placeholder="如需修改密码请输入新密码" />
            </Form.Item>

            <div className="flex gap-4 mt-6">
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit" loading={loading} className="bg-primary-500">
                保存修改
              </Button>
            </div>
          </Form>
        ) : (
          <Descriptions column={1} labelStyle={{ color: '#666' }}>
            <Descriptions.Item label="姓名">{user.name}</Descriptions.Item>
            <Descriptions.Item label="患者ID">{user.patientId}</Descriptions.Item>
            <Descriptions.Item label="身份证号">{user.idCard}</Descriptions.Item>
            <Descriptions.Item label="手机号">{user.phone}</Descriptions.Item>
            <Descriptions.Item label="性别">{user.gender === 'M' ? '男' : '女'}</Descriptions.Item>
            <Descriptions.Item label="出生日期">{user.birthDate}</Descriptions.Item>
          </Descriptions>
        )}
      </div>

      {/* 注销账号 */}
      <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 border border-red-100 dark:border-red-900/30">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">危险区域</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          注销账号后，您的所有信息和预约记录将被永久删除，此操作不可逆。
        </p>
        <Button danger onClick={handleDeactivate}>
          注销账号
        </Button>
      </div>
    </div>
  )
}

export default Profile
