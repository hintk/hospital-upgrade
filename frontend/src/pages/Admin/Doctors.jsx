import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, Tag, Space, Popconfirm } from 'antd';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { doctorApi } from '../../api/doctor';
import { departmentApi } from '../../api/department';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorApi.getList();
      setDoctors(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await departmentApi.getList();
      setDepartments(data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.doctorId);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await doctorApi.delete(id);
      message.success('删除成功');
      fetchDoctors();
    } catch (error) {
      // Error handled by interceptor
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await doctorApi.update(editingId, values);
        message.success('更新成功');
      } else {
        await doctorApi.create(values);
        message.success('创建成功');
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchDoctors();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const columns = [
    {
      title: '医生ID',
      dataIndex: 'doctorId',
      key: 'doctorId',
      render: (text) => <span className="font-mono text-slate-500">{text}</span>,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-medium text-slate-900">{text}</span>,
    },
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '专长',
      dataIndex: 'specialty',
      key: 'specialty',
      ellipsis: true,
      render: (text) => <span className="text-slate-500">{text || '-'}</span>,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<Edit size={16} />} 
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="确定要删除这位医生吗？"
            onConfirm={() => handleDelete(record.doctorId)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="text" 
              icon={<Trash2 size={16} />} 
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredDoctors = doctors.filter(d => 
    d.name.includes(searchText) || d.doctorId.includes(searchText)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">医生管理</h1>
        <Button 
          type="primary" 
          icon={<Plus size={16} />} 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary-hover"
        >
          添加医生
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-border shadow-sm mb-6">
        <Input 
          prefix={<Search size={18} className="text-slate-400" />}
          placeholder="搜索医生姓名或ID..." 
          className="max-w-md h-10"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={filteredDoctors} 
          rowKey="doctorId"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={editingId ? "编辑医生信息" : "添加新医生"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          layout="vertical"
          name="doctorForm"
        >
          {!editingId && (
            <Form.Item
              name="doctorId"
              label="医生ID"
              tooltip="8位数字，不填则自动生成"
              rules={[{ pattern: /^\d{8}$/, message: '必须是8位数字' }]}
            >
              <Input placeholder="自动生成" maxLength={8} />
            </Form.Item>
          )}
          
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="departmentId"
            label="所属科室"
            rules={[{ required: true, message: '请选择科室' }]}
          >
            <Select placeholder="选择科室">
              {departments.map(dept => (
                <Select.Option key={dept.id} value={dept.id}>{dept.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="specialty"
            label="专长描述"
          >
            <Input.TextArea rows={3} maxLength={200} showCount />
          </Form.Item>

          {!editingId && (
            <Form.Item
              name="password"
              label="初始密码"
              initialValue="123456"
            >
              <Input.Password placeholder="默认123456" />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Doctors;
