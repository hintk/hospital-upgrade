import { useState, useEffect } from 'react';
import { Card, Row, Col, Skeleton } from 'antd';
import { 
  Heart, 
  Brain, 
  Bone, 
  Baby, 
  Eye, 
  Stethoscope,
  Activity,
  Pill
} from 'lucide-react';
import { departmentApi } from '../../api/department';

const departmentIcons = {
  '心内科': Heart,
  '神经内科': Brain,
  '骨科': Bone,
  '儿科': Baby,
  '眼科': Eye,
  '呼吸内科': Activity,
  '消化内科': Pill,
};

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentApi.getList();
      setDepartments(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (name) => {
    const Icon = departmentIcons[name] || Stethoscope;
    return <Icon size={32} />;
  };

  const departmentDescriptions = {
    '心内科': '专注于心血管疾病的诊断与治疗，包括冠心病、高血压、心律失常等。',
    '神经内科': '诊治脑血管病、头痛、癫痫、帕金森病等神经系统疾病。',
    '骨科': '专业治疗骨折、关节疾病、脊柱疾病、运动损伤等。',
    '儿科': '为0-14岁儿童提供全面的医疗保健服务。',
    '眼科': '诊治各类眼部疾病，包括白内障、青光眼、近视等。',
    '呼吸内科': '专注于呼吸系统疾病，如肺炎、哮喘、慢阻肺等。',
    '消化内科': '诊治胃肠道、肝胆胰等消化系统疾病。',
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">科室介绍</h1>
        <p className="text-slate-500">飞马星球医院设有多个专业科室，为您提供全方位的医疗服务</p>
      </div>

      {loading ? (
        <Row gutter={[24, 24]}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Col key={i} xs={24} md={12} lg={8}>
              <Card><Skeleton active /></Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]}>
          {departments.map((dept) => (
            <Col key={dept.id} xs={24} md={12} lg={8}>
              <Card 
                className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border"
                hoverable
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary mb-4">
                    {getIcon(dept.name)}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{dept.name}</h3>
                  <p className="text-slate-500 text-sm">
                    {departmentDescriptions[dept.name] || dept.description || '专业医疗团队，竭诚为您服务'}
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Departments;
