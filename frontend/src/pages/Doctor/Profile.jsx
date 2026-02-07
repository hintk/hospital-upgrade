import { useState } from 'react';
import { Card, Form, Input, Button, message, Avatar, Divider } from 'antd';
import { User, Mail, Phone, Award, Building2, Save } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { doctorApi } from '../../api/doctor';

const Profile = () => {
  const { user, login, userType } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updated = await doctorApi.update(user.doctorId, values);
      login(updated, userType);
      message.success('信息更新成功');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">个人中心</h1>

      {/* 个人信息卡片 */}
      <Card className="border-border">
        <div className="flex items-center gap-6 mb-6">
          <Avatar 
            size={80} 
            className="bg-primary text-white text-3xl"
            style={{ backgroundColor: '#1677ff' }}
          >
            {user?.name?.[0]}
          </Avatar>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name} 医生</h2>
            <p className="text-slate-500">{user?.departmentName || '未设置科室'}</p>
            <p className="text-xs text-slate-400 mt-1">工号: {user?.doctorId}</p>
          </div>
        </div>

        <Divider />

        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: user?.name,
            specialty: user?.specialty,
          }}
          onFinish={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="姓名"
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input prefix={<User size={16} className="text-slate-400" />} />
            </Form.Item>

            <Form.Item
              name="specialty"
              label="专业特长"
            >
              <Input prefix={<Award size={16} className="text-slate-400" />} placeholder="如：心血管疾病、高血压" />
            </Form.Item>
          </div>

          <Form.Item
            name="password"
            label="修改密码"
            extra="留空则不修改密码"
          >
            <Input.Password placeholder="输入新密码" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<Save size={16} />}
              className="bg-primary"
            >
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 工作统计 */}
      <Card title="工作统计" className="border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">--</p>
            <p className="text-slate-500 text-sm">本月接诊</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">--</p>
            <p className="text-slate-500 text-sm">累计患者</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">--</p>
            <p className="text-slate-500 text-sm">好评率</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">--</p>
            <p className="text-slate-500 text-sm">排班天数</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
