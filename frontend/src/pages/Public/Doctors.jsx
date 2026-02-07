import { useState, useEffect } from 'react';
import { Card, Row, Col, Avatar, Tag, Skeleton, Input, Select } from 'antd';
import { Search, Award, GraduationCap } from 'lucide-react';
import { doctorApi } from '../../api/doctor';
import { departmentApi } from '../../api/department';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorData, deptData] = await Promise.all([
        doctorApi.getList(),
        departmentApi.getList()
      ]);
      setDoctors(doctorData || []);
      setDepartments(deptData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchName = !searchName || doc.name.includes(searchName);
    const matchDept = !selectedDept || doc.departmentId === selectedDept;
    return matchName && matchDept;
  });

  const getTitleColor = (specialty) => {
    if (specialty?.includes('主任')) return 'red';
    if (specialty?.includes('副主任')) return 'orange';
    return 'blue';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">专家团队</h1>
        <p className="text-slate-500">汇聚业内顶尖专家，为您的健康保驾护航</p>
      </div>

      {/* 搜索筛选 */}
      <div className="bg-white p-4 rounded-xl border border-border shadow-sm mb-6 flex flex-wrap gap-4">
        <Input
          placeholder="搜索医生姓名"
          prefix={<Search size={16} className="text-slate-400" />}
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="w-48"
          allowClear
        />
        <Select
          placeholder="选择科室"
          value={selectedDept}
          onChange={setSelectedDept}
          allowClear
          className="w-40"
        >
          {departments.map(d => (
            <Select.Option key={d.id} value={d.id}>{d.name}</Select.Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4].map(i => (
            <Col key={i} xs={24} md={12}>
              <Card><Skeleton active avatar /></Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredDoctors.map((doctor) => (
            <Col key={doctor.doctorId} xs={24} md={12}>
              <Card 
                className="h-full hover:shadow-lg transition-shadow border-border"
                hoverable
              >
                <div className="flex gap-4">
                  <Avatar 
                    size={80} 
                    className="bg-primary-100 text-primary text-2xl shrink-0"
                    style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }}
                  >
                    {doctor.name?.[0]}
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{doctor.name}</h3>
                      <Tag color={getTitleColor(doctor.specialty)}>
                        {doctor.specialty?.split('、')[0] || '主治医师'}
                      </Tag>
                    </div>
                    <p className="text-primary font-medium mb-2">{doctor.departmentName}</p>
                    <p className="text-slate-500 text-sm line-clamp-2">
                      <span className="flex items-center gap-1">
                        <Award size={14} />
                        擅长：{doctor.specialty || '常见病诊治'}
                      </span>
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!loading && filteredDoctors.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          暂无符合条件的医生
        </div>
      )}
    </div>
  );
};

export default Doctors;
