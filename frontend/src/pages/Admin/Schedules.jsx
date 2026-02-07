import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Select, DatePicker, TimePicker, InputNumber, message, Tag, Space, Popconfirm } from 'antd';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { scheduleApi } from '../../api/schedule';
import { doctorApi } from '../../api/doctor';
import dayjs from 'dayjs';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchSchedules(selectedDate);
    }
  }, [selectedDate]);

  const fetchSchedules = async (date) => {
    setLoading(true);
    try {
      const data = await scheduleApi.getByDate(date);
      setSchedules(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await doctorApi.getList();
      setDoctors(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await scheduleApi.delete(id);
      message.success('删除成功');
      fetchSchedules(selectedDate);
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const scheduleData = {
        doctorId: values.doctorId,
        scheduleDate: values.scheduleDate.format('YYYY-MM-DD'),
        startTime: values.timeRange[0].format('HH:mm'),
        endTime: values.timeRange[1].format('HH:mm'),
        maxPatients: values.maxPatients,
      };
      
      await scheduleApi.create(scheduleData);
      message.success('排班创建成功');
      setIsModalOpen(false);
      form.resetFields();
      fetchSchedules(selectedDate);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: '排班日期',
      dataIndex: 'scheduleDate',
      key: 'scheduleDate',
    },
    {
      title: '医生',
      dataIndex: 'doctorName',
      key: 'doctorName',
      render: (text) => <span className="font-medium text-slate-900">{text}</span>,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: '时间段',
      key: 'time',
      render: (_, record) => (
        <span>{record.startTime?.substring(0, 5)} - {record.endTime?.substring(0, 5)}</span>
      ),
    },
    {
      title: '号源情况',
      key: 'status',
      render: (_, record) => {
        const remaining = record.maxPatients - record.currentPatients;
        return (
          <Space>
            <Tag color={remaining > 0 ? 'green' : 'red'}>
              剩余 {remaining}
            </Tag>
            <span className="text-slate-400 text-xs">/ 共 {record.maxPatients}</span>
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Popconfirm
          title="确定要删除该排班吗？"
          description="如果已有患者预约，将无法删除。"
          onConfirm={() => handleDelete(record.id)}
          okText="确定"
          cancelText="取消"
        >
          <Button 
            type="text" 
            icon={<Trash2 size={16} />} 
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">排班管理</h1>
        <Button 
          type="primary" 
          icon={<Plus size={16} />} 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover"
        >
          添加排班
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-border shadow-sm mb-6 flex items-center gap-4">
        <span className="text-slate-600 font-medium">选择日期：</span>
        <DatePicker 
          value={dayjs(selectedDate)} 
          onChange={(date) => setSelectedDate(date ? date.format('YYYY-MM-DD') : '')}
          allowClear={false}
          className="w-48"
        />
        <Button onClick={() => fetchSchedules(selectedDate)} icon={<Calendar size={16} />}>
          查询
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={schedules} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title="添加排班"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ maxPatients: 20 }}
        >
          <Form.Item
            name="doctorId"
            label="医生"
            rules={[{ required: true, message: '请选择医生' }]}
          >
            <Select 
              showSearch
              placeholder="搜索选择医生"
              optionFilterProp="children"
            >
              {doctors.map(d => (
                <Select.Option key={d.doctorId} value={d.doctorId}>
                  {d.name} ({d.departmentName})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="scheduleDate"
            label="排班日期"
            rules={[{ required: true, message: '请选择日期' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="时间段"
            rules={[{ required: true, message: '请选择时间段' }]}
          >
            <TimePicker.RangePicker format="HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item
            name="maxPatients"
            label="最大号源数"
            rules={[{ required: true, message: '请输入号源数' }]}
          >
            <InputNumber min={1} max={100} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Schedules;
