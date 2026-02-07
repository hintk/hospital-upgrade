import { useState, useEffect } from 'react';
import { Table, Tag, Button, message, Popconfirm, Tabs } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { appointmentApi } from '../../api/appointment';
import { useUserStore } from '../../store/userStore';
import dayjs from 'dayjs';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState('todo');

  useEffect(() => {
    if (user?.doctorId) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentApi.getByDoctor(user.doctorId);
      setAppointments(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      await appointmentApi.complete(id);
      message.success('诊疗完成');
      fetchAppointments();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const columns = [
    {
      title: '预约时间',
      dataIndex: 'appointmentTime',
      key: 'appointmentTime',
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm'),
      sorter: (a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime),
    },
    {
      title: '患者姓名',
      dataIndex: 'patientName',
      key: 'patientName',
      render: (text) => <span className="font-medium text-slate-900">{text}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        if (status === '已预约') color = 'processing';
        if (status === '已完成') color = 'success';
        if (status === '已取消') color = 'error';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        record.status === '已预约' && (
          <Popconfirm
            title="确认完成诊疗？"
            onConfirm={() => handleComplete(record.appointmentId)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="primary" size="small" icon={<CheckCircleOutlined />}>
              完成诊疗
            </Button>
          </Popconfirm>
        )
      ),
    },
  ];

  const filteredAppointments = appointments.filter(apt => {
    if (activeTab === 'todo') return apt.status === '已预约';
    if (activeTab === 'done') return apt.status === '已完成';
    return true; // all
  });

  const tabItems = [
    { key: 'todo', label: <span><ClockCircleOutlined /> 待就诊</span> },
    { key: 'done', label: <span><CheckCircleOutlined /> 已完成</span> },
    { key: 'all', label: '全部记录' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">我的门诊</h1>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2">
          <UserOutlined />
          <span>{user?.name} 医生</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          items={tabItems} 
          className="mb-4"
        />
        
        <Table 
          columns={columns} 
          dataSource={filteredAppointments} 
          rowKey="appointmentId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default Appointments;
