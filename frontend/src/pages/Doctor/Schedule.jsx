import { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Descriptions, Tag, Spin, Button, Form, DatePicker, TimePicker, InputNumber, message } from 'antd';
import { doctorApi } from '../../api/doctor';
import { scheduleApi } from '../../api/schedule';
import { useUserStore } from '../../store/userStore';
import dayjs from 'dayjs';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form] = Form.useForm();
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.doctorId) {
      fetchSchedules();
    }
  }, [user]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await doctorApi.getSchedule(user.doctorId);
      setSchedules(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        doctorId: user.doctorId,
        scheduleDate: values.scheduleDate.format('YYYY-MM-DD'),
        startTime: values.timeRange[0].format('HH:mm'),
        endTime: values.timeRange[1].format('HH:mm'),
        maxPatients: values.maxPatients,
      };
      await scheduleApi.create(payload);
      message.success('排班创建成功');
      setIsCreateOpen(false);
      form.resetFields();
      fetchSchedules();
    } catch (error) {
      // 错误由拦截器处理
    }
  };

  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    const daySchedules = schedules.filter(s => s.scheduleDate === dateStr);
    
    return daySchedules.map(item => ({
      type: item.currentPatients >= item.maxPatients ? 'error' : 'success',
      content: `${item.startTime.substring(0, 5)} - ${item.endTime.substring(0, 5)}`,
      data: item
    }));
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events list-none p-0 m-0">
        {listData.map((item, index) => (
          <li key={index} onClick={(e) => {
            e.stopPropagation();
            handleSelect(item.data);
          }} className="mb-1">
            <Badge status={item.type} text={<span className="text-xs text-slate-600">{item.content}</span>} />
          </li>
        ))}
      </ul>
    );
  };

  const handleSelect = (schedule) => {
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">排班日历</h1>
      
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <Spin spinning={loading}>
          <Calendar 
            dateCellRender={dateCellRender} 
          />
        </Spin>
        <div className="mt-4 flex justify-end">
          <Button type="primary" className="bg-primary" onClick={() => setIsCreateOpen(true)}>新增排班</Button>
        </div>
      </div>

      <Modal 
        title="排班详情" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedSchedule && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="日期">{selectedSchedule.scheduleDate}</Descriptions.Item>
            <Descriptions.Item label="时间段">
              {selectedSchedule.startTime} - {selectedSchedule.endTime}
            </Descriptions.Item>
            <Descriptions.Item label="号源状态">
              <Tag color="blue">{selectedSchedule.currentPatients} / {selectedSchedule.maxPatients}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
                {selectedSchedule.status === 1 ? <Tag color="success">正常</Tag> : <Tag color="default">停诊</Tag>}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        title="新增排班"
        open={isCreateOpen}
        onOk={handleCreate}
        okText="确认创建"
        cancelText="取消"
        onCancel={() => setIsCreateOpen(false)}
      >
        <Form form={form} layout="vertical" initialValues={{ maxPatients: 20 }}>
          <Form.Item name="scheduleDate" label="排班日期" rules={[{ required: true, message: '请选择日期' }]}> 
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="timeRange" label="时间段" rules={[{ required: true, message: '请选择时间段' }]}> 
            <TimePicker.RangePicker format="HH:mm" className="w-full" />
          </Form.Item>
          <Form.Item name="maxPatients" label="最大号源数" rules={[{ required: true, message: '请输入号源数' }]}> 
            <InputNumber min={1} max={100} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Schedule;
