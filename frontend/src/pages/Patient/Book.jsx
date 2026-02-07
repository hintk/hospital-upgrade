import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Steps, Spin, Empty, Button, Modal, message } from 'antd'
import { ArrowLeftOutlined, CheckCircleFilled } from '@ant-design/icons'
import dayjs from 'dayjs'
import { departmentApi } from '../../api/department'
import { doctorApi } from '../../api/doctor'
import { appointmentApi } from '../../api/appointment'
import { useUserStore } from '../../store/userStore'

const Book = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useUserStore()

  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // 数据
  const [departments, setDepartments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [schedules, setSchedules] = useState([])

  // 选择项
  const [selectedDept, setSelectedDept] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  // 预约结果
  const [bookingResult, setBookingResult] = useState(null)

  useEffect(() => {
    // 如果从首页带过来科室信息
    if (location.state?.departmentId) {
      setSelectedDept({
        id: location.state.departmentId,
        name: location.state.departmentName,
      })
      setCurrentStep(1)
      fetchDoctors(location.state.departmentId)
    } else {
      fetchDepartments()
    }
  }, [location.state])

  const fetchDepartments = async () => {
    setLoading(true)
    try {
      const data = await departmentApi.getList()
      setDepartments(data || [])
    } catch (error) {
      console.error('获取科室失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDoctors = async (deptId) => {
    setLoading(true)
    try {
      const data = await doctorApi.getByDepartment(deptId)
      setDoctors(data || [])
    } catch (error) {
      console.error('获取医生失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSchedules = async (doctorId) => {
    setLoading(true)
    try {
      const data = await doctorApi.getSchedule(doctorId)
      // 只显示未来的排班且有剩余号源的
      const futureSchedules = (data || []).filter((s) => {
        const scheduleTime = dayjs(`${s.scheduleDate} ${s.startTime}`)
        return scheduleTime.isAfter(dayjs()) && s.currentPatients < s.maxPatients && s.status === 1
      })
      setSchedules(futureSchedules)
    } catch (error) {
      console.error('获取排班失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectDept = (dept) => {
    setSelectedDept(dept)
    setSelectedDoctor(null)
    setSelectedSchedule(null)
    setCurrentStep(1)
    fetchDoctors(dept.id)
  }

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor)
    setSelectedSchedule(null)
    setCurrentStep(2)
    fetchSchedules(doctor.doctorId)
  }

  const handleSelectSchedule = (schedule) => {
    setSelectedSchedule(schedule)
    setCurrentStep(3)
  }

  const handleBack = () => {
    if (currentStep === 1) {
      setSelectedDept(null)
      setCurrentStep(0)
      fetchDepartments()
    } else if (currentStep === 2) {
      setSelectedDoctor(null)
      setCurrentStep(1)
    } else if (currentStep === 3) {
      setSelectedSchedule(null)
      setCurrentStep(2)
    }
  }

  const handleSubmit = async () => {
    if (!user?.patientId) {
      message.error('用户信息异常，请重新登录')
      return
    }

    setSubmitting(true)
    try {
      const result = await appointmentApi.create({
        patientId: user.patientId,
        doctorId: selectedDoctor.doctorId,
        scheduleId: selectedSchedule.id,
      })
      setBookingResult(result)
      setCurrentStep(4)
      message.success('预约成功！')
    } catch (error) {
      Modal.warning({
        title: '预约失败',
        content: error.message || '号源可能已被他人预约，请刷新后重试',
        okText: '重新选择',
        onOk: () => {
          setSelectedSchedule(null)
          setCurrentStep(2)
          fetchSchedules(selectedDoctor.doctorId)
        },
      })
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    { title: '选择科室' },
    { title: '选择医生' },
    { title: '选择时间' },
    { title: '确认预约' },
  ]

  // 渲染科室选择
  const renderDepartments = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {departments.map((dept) => (
        <div
          key={dept.id}
          onClick={() => handleSelectDept(dept)}
          className="bg-white dark:bg-dark-surface rounded-xl p-5 cursor-pointer card-hover border border-gray-100 dark:border-dark-border"
        >
          <h3 className="font-semibold text-gray-800 dark:text-white">{dept.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {dept.description || '点击选择'}
          </p>
        </div>
      ))}
    </div>
  )

  // 渲染医生选择
  const renderDoctors = () => (
    <div className="space-y-4">
      {doctors.length === 0 ? (
        <Empty description="该科室暂无医生" />
      ) : (
        doctors.map((doctor) => (
          <div
            key={doctor.doctorId}
            onClick={() => handleSelectDoctor(doctor)}
            className="bg-white dark:bg-dark-surface rounded-xl p-5 cursor-pointer card-hover border border-gray-100 dark:border-dark-border"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-2xl">
                👨‍⚕️
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white text-lg">{doctor.name}</h3>
                <p className="text-sm text-primary-500 mb-2">{doctor.departmentName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {doctor.specialty || '暂无专长描述'}
                </p>
              </div>
              <Button type="primary" className="bg-primary-500">
                选择
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  )

  // 渲染排班选择
  const renderSchedules = () => (
    <div className="space-y-4">
      {schedules.length === 0 ? (
        <Empty description="暂无可预约的时间段" />
      ) : (
        schedules.map((schedule) => {
          const remaining = schedule.maxPatients - schedule.currentPatients
          return (
            <div
              key={schedule.id}
              onClick={() => handleSelectSchedule(schedule)}
              className="bg-white dark:bg-dark-surface rounded-xl p-5 cursor-pointer card-hover border border-gray-100 dark:border-dark-border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {schedule.scheduleDate}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {schedule.startTime?.substring(0, 5)} - {schedule.endTime?.substring(0, 5)}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-semibold ${remaining <= 5 ? 'text-orange-500' : 'text-primary-500'}`}>
                    剩余 {remaining} 号
                  </span>
                  <p className="text-xs text-gray-400 mt-1">共 {schedule.maxPatients} 号</p>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )

  // 渲染确认页面
  const renderConfirm = () => (
    <div className="bg-white dark:bg-dark-surface rounded-xl p-6 border border-gray-100 dark:border-dark-border">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">预约信息确认</h3>
      <div className="space-y-4">
        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-dark-border">
          <span className="text-gray-500 dark:text-gray-400">科室</span>
          <span className="font-medium text-gray-800 dark:text-white">{selectedDept?.name}</span>
        </div>
        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-dark-border">
          <span className="text-gray-500 dark:text-gray-400">医生</span>
          <span className="font-medium text-gray-800 dark:text-white">{selectedDoctor?.name}</span>
        </div>
        <div className="flex justify-between py-3 border-b border-gray-100 dark:border-dark-border">
          <span className="text-gray-500 dark:text-gray-400">就诊时间</span>
          <span className="font-medium text-gray-800 dark:text-white">
            {selectedSchedule?.scheduleDate} {selectedSchedule?.startTime?.substring(0, 5)}
          </span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-gray-500 dark:text-gray-400">患者</span>
          <span className="font-medium text-gray-800 dark:text-white">{user?.name}</span>
        </div>
      </div>
      <Button
        type="primary"
        size="large"
        block
        loading={submitting}
        onClick={handleSubmit}
        className="mt-6 h-12 bg-primary-500 hover:bg-primary-600"
      >
        确认预约
      </Button>
    </div>
  )

  // 渲染成功页面
  const renderSuccess = () => (
    <div className="text-center py-8">
      <CheckCircleFilled className="text-6xl text-primary-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">预约成功！</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">您的预约号：{bookingResult?.appointmentId}</p>
      <div className="bg-gray-50 dark:bg-dark-surface rounded-xl p-6 text-left max-w-md mx-auto">
        <div className="space-y-3 text-sm">
          <p><span className="text-gray-500">科室：</span>{selectedDept?.name}</p>
          <p><span className="text-gray-500">医生：</span>{selectedDoctor?.name}</p>
          <p><span className="text-gray-500">时间：</span>{selectedSchedule?.scheduleDate} {selectedSchedule?.startTime?.substring(0, 5)}</p>
        </div>
      </div>
      <div className="mt-8 space-x-4">
        <Button onClick={() => navigate('/patient/appointments')}>查看我的预约</Button>
        <Button type="primary" onClick={() => navigate('/')} className="bg-primary-500">
          返回首页
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center gap-4">
        {currentStep > 0 && currentStep < 4 && (
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-surface transition-all"
          >
            <ArrowLeftOutlined />
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">预约挂号</h1>
      </div>

      {/* 步骤指示器 */}
      {currentStep < 4 && (
        <Steps current={currentStep} items={steps} className="mb-8" />
      )}

      {/* 内容区域 */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {currentStep === 0 && renderDepartments()}
          {currentStep === 1 && renderDoctors()}
          {currentStep === 2 && renderSchedules()}
          {currentStep === 3 && renderConfirm()}
          {currentStep === 4 && renderSuccess()}
        </>
      )}
    </div>
  )
}

export default Book
