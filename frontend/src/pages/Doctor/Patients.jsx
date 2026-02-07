import { useState, useEffect } from 'react';
import { Table, Input, Tag, Card, Avatar, Button } from 'antd';
import { Search, User, Phone, Calendar } from 'lucide-react';
import { appointmentApi } from '../../api/appointment';
import { useUserStore } from '../../store/userStore';
import dayjs from 'dayjs';

const Patients = () => {
  const { user } = useUserStore();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      // 获取该医生的所有预约记录，提取患者信息
      const data = await appointmentApi.getByDoctor(user.doctorId);
      // 去重并整理患者列表
      const patientMap = new Map();
      (data || []).forEach(apt => {
        if (!patientMap.has(apt.patientId)) {
          patientMap.set(apt.patientId, {
            patientId: apt.patientId,
            patientName: apt.patientName,
            lastVisit: apt.appointmentTime,
            visitCount: 1,
            status: apt.status
          });
        } else {
          const existing = patientMap.get(apt.patientId);
          existing.visitCount++;
          if (new Date(apt.appointmentTime) > new Date(existing.lastVisit)) {
            existing.lastVisit = apt.appointmentTime;
            existing.status = apt.status;
          }
        }
      });
      setPatients(Array.from(patientMap.values()));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    !searchName || p.patientName?.includes(searchName)
  );

  const columns = [
    {
      title: '患者',
      key: 'patient',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-primary-100 text-primary" style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }}>
            {record.patientName?.[0]}
          </Avatar>
          <div>
            <p className="font-medium text-slate-900">{record.patientName}</p>
            <p className="text-xs text-slate-400">ID: {record.patientId}</p>
          </div>
        </div>
      ),
    },
    {
      title: '就诊次数',
      dataIndex: 'visitCount',
      key: 'visitCount',
      render: (count) => <span className="font-medium">{count} 次</span>,
    },
    {
      title: '最近就诊',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      render: (time) => (
        <span className="text-slate-500">
          {dayjs(time).format('YYYY-MM-DD')}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          '已完成': 'green',
          '已预约': 'blue',
          '已取消': 'default',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">患者管理</h1>
      </div>

      <Card className="border-border">
        <div className="mb-4">
          <Input
            placeholder="搜索患者姓名"
            prefix={<Search size={16} className="text-slate-400" />}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-64"
            allowClear
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredPatients}
          rowKey="patientId"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: '暂无患者记录' }}
        />
      </Card>
    </div>
  );
};

export default Patients;
