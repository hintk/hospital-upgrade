import { Card, Row, Col } from 'antd';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Mail,
  Bus,
  Car
} from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    { icon: MapPin, title: '医院地址', content: '飞马星球中央区健康大道888号' },
    { icon: Phone, title: '咨询电话', content: '400-888-8888（24小时服务热线）' },
    { icon: Mail, title: '电子邮箱', content: 'service@pegasus-hospital.com' },
    { icon: Clock, title: '门诊时间', content: '周一至周日 8:00-17:30' },
  ];

  const trafficInfo = [
    { 
      icon: Bus, 
      title: '公交路线', 
      lines: [
        '1路、5路、12路、28路 → 飞马医院站下车',
        '33路、56路 → 健康大道站下车，步行5分钟',
      ]
    },
    { 
      icon: Car, 
      title: '自驾路线', 
      lines: [
        '导航搜索"飞马星球医院"即可到达',
        '医院设有地下停车场，可容纳500辆车',
      ]
    },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">联系我们</h1>
        <p className="text-slate-500">如有任何问题，欢迎随时与我们联系</p>
      </div>

      {/* 联系方式 */}
      <Row gutter={[24, 24]} className="mb-8">
        {contactInfo.map((item, index) => (
          <Col key={index} xs={24} md={12} lg={6}>
            <Card className="h-full border-border hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center text-primary mb-4">
                  <item.icon size={28} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.content}</p>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 交通指南 */}
      <div className="bg-white p-8 rounded-xl border border-border mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">交通指南</h2>
        <Row gutter={[48, 24]}>
          {trafficInfo.map((item, index) => (
            <Col key={index} xs={24} md={12}>
              <div className="flex gap-4">
                <div className="w-12 h-12 shrink-0 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <ul className="space-y-1">
                    {item.lines.map((line, i) => (
                      <li key={i} className="text-slate-500 text-sm">• {line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 地图占位 */}
      <div className="bg-slate-100 rounded-xl border border-border overflow-hidden">
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="text-center">
            <MapPin size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500">飞马星球中央区健康大道888号</p>
            <p className="text-slate-400 text-sm mt-2">（地图功能开发中）</p>
          </div>
        </div>
      </div>

      {/* 温馨提示 */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-800 mb-2">温馨提示</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• 就诊请携带有效身份证件</li>
          <li>• 建议提前通过本系统预约挂号，减少等待时间</li>
          <li>• 急诊24小时开放，位于门诊大楼一层</li>
          <li>• 如需帮助，可拨打服务热线或咨询导诊台</li>
        </ul>
      </div>
    </div>
  );
};

export default Contact;
