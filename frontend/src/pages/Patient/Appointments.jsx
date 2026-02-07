import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, Spin, Empty, Modal, Input, message } from 'antd'
import { CalendarOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { appointmentApi } from '../../api/appointment'
import { useUserStore } from '../../store/userStore'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [cancelReason, setCancelReason] = useState('')
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [cancellingId, setCancellingId] = useState(null)
  const navigate = useNavigate()
  const { user } = useUserStore()

  useEffect(() => {
    if (user?.patientId) {
      fetchAppointments()
    }
  }, [user])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const data = await appointmentApi.getByPatient(user.patientId)
      setAppointments(data || [])
    } catch (error) {
      console.error('获取预约列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelClick = (appointmentId) => {
    setCancellingId(appointmentId)
    setCancelReason('')
    setCancelModalVisible(true)
  }

  const handleCancelConfirm = async () => {
    try {
      await appointmentApi.cancel(cancellingId, cancelReason)
      message.success('取消预约成功')
      setCancelModalVisible(false)
      fetchAppointments()
    } catch (error) {
      // 错误已在拦截器处理
    }
  }

  const getStatusTag = (status) => {
    switch (status) {
      case '已预约':
        return <span className="status-tag status-booked">已预约</span>
      case '已完成':
        return <span className="status-tag status-completed">已完成</span>
      case '已取消':
        return <span className="status-tag status-cancelled">已取消</span>
      default:
        return <span className="status-tag">{status}</span>
    }
  }

  const canCancel = (appointment) => {
    if (appointment.status !== '已预约') return false
    // 检查是否距离预约时间超过1小时
    const appointmentTime = dayjs(appointment.appointmentTime)
    return appointmentTime.diff(dayjs(), 'hour') >= 1
  }

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === 'all') return true
    if (activeTab === 'booked') return apt.status === '已预约'
    if (activeTab === 'completed') return apt.status === '已完成'
    if (activeTab === 'cancelled') return apt.status === '已取消'
    return true
  })

  const tabItems = [
    { key: 'all', label: '全部' },
    { key: 'booked', label: '已预约' },
    { key: 'completed', label: '已完成' },
    { key: 'cancelled', label: '已取消' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">我的预约</h1>
        <button
          onClick={() => navigate('/patient/book')}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
        >
          新建预约
        </button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

      {loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <Empty description="暂无预约记录">
          <button
            onClick={() => navigate('/patient/book')}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all"
          >
            去预约
          </button>
        </Empty>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.appointmentId}
              className="bg-white dark:bg-dark-surface rounded-xl p-5 border border-gray-100 dark:border-dark-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-sm text-gray-400">预约号</span>
                  <p className="font-mono text-gray-800 dark:text-white">{apt.appointmentId}</p>
                </div>
                {getStatusTag(apt.status)}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <UserOutlined />
                  <span>{apt.doctorName}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-primary-500">{apt.departmentName}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CalendarOutlined />
                  <span>{dayjs(apt.appointmentTime).format('YYYY-MM-DD')}</span>
                  <ClockCircleOutlined />
                  <span>{dayjs(apt.appointmentTime).format('HH:mm')}</span>
                </div>
                {apt.cancelReason && (
                  <div className="text-sm text-gray-400">
                    取消原因：{apt.cancelReason}
                  </div>
                )}
              </div>

              {canCancel(apt) && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                  <button
                    onClick={() => handleCancelClick(apt.appointmentId)}
                    className="px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    取消预约
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 取消预约弹窗 */}
      <Modal
        title="取消预约"
        open={cancelModalVisible}
        onOk={handleCancelConfirm}
        onCancel={() => setCancelModalVisible(false)}
        okText="确认取消"
        cancelText="返回"
        okButtonProps={{ danger: true }}
      >
        <p className="mb-4 text-gray-600">确定要取消该预约吗？</p>
        <Input.TextArea
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="请输入取消原因（可选）"
          rows={3}
        />
      </Modal>
    </div>
  )
}

export default Appointments
