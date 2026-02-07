import { Card, Row, Col, Timeline } from 'antd';
import { 
  Award, 
  Users, 
  Building2, 
  Heart,
  Target,
  Eye,
  Shield
} from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Building2, label: '建院年份', value: '1998年' },
    { icon: Users, label: '医护人员', value: '500+' },
    { icon: Award, label: '三甲医院', value: '国家认证' },
    { icon: Heart, label: '年服务患者', value: '50万+' },
  ];

  const values = [
    { icon: Target, title: '使命', desc: '以患者为中心，提供优质、高效、安全的医疗服务' },
    { icon: Eye, title: '愿景', desc: '成为飞马星球最受信赖的医疗健康服务机构' },
    { icon: Shield, title: '价值观', desc: '仁爱、精诚、创新、卓越' },
  ];

  const history = [
    { year: '1998', event: '飞马星球医院正式成立' },
    { year: '2005', event: '通过三级甲等医院评审' },
    { year: '2010', event: '建成现代化门诊大楼' },
    { year: '2015', event: '引进国际先进医疗设备' },
    { year: '2020', event: '启动智慧医院建设项目' },
    { year: '2024', event: '上线全新预约挂号系统' },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* 医院简介 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white p-8 rounded-2xl mb-8">
        <h1 className="text-3xl font-bold mb-4">关于飞马星球医院</h1>
        <p className="text-primary-100 text-lg leading-relaxed">
          飞马星球医院成立于1998年，是一所集医疗、教学、科研、预防保健于一体的大型综合性三级甲等医院。
          医院占地面积10万平方米，开放床位1200张，设有30余个临床科室和10余个医技科室。
          我们拥有一支技术精湛、医德高尚的医疗团队，始终秉承"以患者为中心"的服务理念，
          为广大患者提供优质、高效、安全的医疗服务。
        </p>
      </div>

      {/* 数据统计 */}
      <Row gutter={[24, 24]} className="mb-8">
        {stats.map((stat, index) => (
          <Col key={index} xs={12} md={6}>
            <Card className="text-center border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-50 flex items-center justify-center text-primary">
                <stat.icon size={24} />
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-slate-500">{stat.label}</p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 使命愿景 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">使命与愿景</h2>
        <Row gutter={[24, 24]}>
          {values.map((item, index) => (
            <Col key={index} xs={24} md={8}>
              <Card className="h-full border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-slate-500">{item.desc}</p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 发展历程 */}
      <div className="bg-white p-8 rounded-xl border border-border">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">发展历程</h2>
        <Timeline
          mode="left"
          items={history.map(item => ({
            label: <span className="font-bold text-primary">{item.year}</span>,
            children: <span className="text-slate-600">{item.event}</span>,
          }))}
        />
      </div>
    </div>
  );
};

export default About;
