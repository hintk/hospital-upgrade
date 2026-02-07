import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Skeleton, Empty, Statistic, Row, Col } from 'antd';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Activity, 
  ChevronRight,
  User,
  Shield,
  Award,
  HeartPulse,
  Stethoscope,
  Building2,
  Phone
} from 'lucide-react';
import { appointmentApi } from '../../api/appointment';
import { statisticsApi } from '../../api/statistics';
import { useUserStore } from '../../store/userStore';
import dayjs from 'dayjs';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, userType } = useUserStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ todayVisits: 0, onlineDoctors: 0, remainingSlots: 0 });

  useEffect(() => {
    fetchHomeStats();
    if (isLoggedIn && userType === 'patient') {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const fetchHomeStats = async () => {
    try {
      const data = await statisticsApi.getHomeStats();
      setStats(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await appointmentApi.getByPatient(user.patientId);
      // 筛选出未来的预约
      const upcoming = data.filter(item => 
        item.status === '已预约' || item.status === '已支付'
      ).sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
      setAppointments(upcoming);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '上午好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const getWelcomeContent = () => {
    if (!isLoggedIn) {
      return {
        title: '欢迎来到飞马星球医院',
        subtitle: '专业的医疗团队，贴心的就诊体验。'
      };
    }
    if (userType === 'doctor') {
      return {
        title: `${getGreeting()}，${(user?.name || '').replace(/医生$/, '')}医生`,
        subtitle: '今日门诊已就绪，守护患者健康。'
      };
    }
    return {
      title: `${getGreeting()}，${user?.name}`,
      subtitle: '我们随时为您提供专业的医疗服务。'
    };
  };

  const welcomeContent = getWelcomeContent();

  const WelcomeCard = () => (
    <div className="bg-white p-8 rounded-xl border border-border shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {welcomeContent.title}
        </h1>
        <p className="text-slate-500">
          {welcomeContent.subtitle}
        </p>
      </div>
      <div className="flex gap-4">
        {isLoggedIn && userType === 'patient' ? (
          <Button 
            type="primary" 
            size="large" 
            icon={<Plus size={18} />}
            onClick={() => navigate('/patient/book')}
            className="bg-primary hover:bg-primary-hover h-12 px-8 rounded-lg flex items-center gap-2"
          >
            立即预约
          </Button>
        ) : isLoggedIn && userType === 'doctor' ? (
          <Button 
            type="primary" 
            size="large" 
            icon={<Stethoscope size={18} />}
            onClick={() => navigate('/doctor/appointments')}
            className="bg-primary hover:bg-primary-hover h-12 px-8 rounded-lg flex items-center gap-2"
          >
            开始门诊
          </Button>
        ) : !isLoggedIn ? (
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/login')}
            className="bg-primary hover:bg-primary-hover h-12 px-8 rounded-lg"
          >
            登录 / 注册
          </Button>
        ) : null}
      </div>
    </div>
  );

  // 医生专属统计卡片
  const DoctorStatCards = () => {
    if (!isLoggedIn || userType !== 'doctor') return null;
    
    return (
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} md={6}>
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">今日预约</p>
                <p className="text-2xl font-bold text-slate-900">--</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={6}>
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">待接诊</p>
                <p className="text-2xl font-bold text-slate-900">--</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={6}>
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <User size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">已完成</p>
                <p className="text-2xl font-bold text-slate-900">--</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={6}>
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">本月接诊</p>
                <p className="text-2xl font-bold text-slate-900">--</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  };

  // 通用统计卡片（未登录和患者）
  const StatCards = () => {
    if (isLoggedIn && userType === 'doctor') return null;
    
    return (
      <Row gutter={[24, 24]} className="mb-8">
        <Col xs={24} md={8}>
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">今日就诊人数</p>
                <p className="text-2xl font-bold text-slate-900">{stats.todayVisits}</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <User size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">今日出诊专家</p>
                <p className="text-2xl font-bold text-slate-900">{stats.onlineDoctors}</p>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-slate-500 text-sm">剩余号源</p>
                <p className="text-2xl font-bold text-slate-900">{stats.remainingSlots}</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  };

  // 医生今日门诊列表
  const DoctorTodayAppointments = () => {
    if (!isLoggedIn || userType !== 'doctor') return null;

    return (
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope size={20} className="text-primary" />
            今日门诊患者
          </h2>
          <Button type="link" onClick={() => navigate('/doctor/appointments')}>
            查看全部 <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="text-center py-8 text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 text-slate-300" />
            <p>点击"开始门诊"查看今日预约患者</p>
            <Button 
              type="primary" 
              className="mt-4 bg-primary"
              onClick={() => navigate('/doctor/appointments')}
            >
              进入门诊
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // 医生快捷操作
  const DoctorQuickActions = () => {
    if (!isLoggedIn || userType !== 'doctor') return null;

    const actions = [
      { icon: Calendar, title: '今日门诊', desc: '查看今日预约患者', path: '/doctor/appointments', color: 'bg-blue-50 text-blue-600' },
      { icon: Stethoscope, title: '我的排班', desc: '查看和管理排班', path: '/doctor/schedule', color: 'bg-green-50 text-green-600' },
      { icon: User, title: '患者管理', desc: '查看历史患者', path: '/doctor/patients', color: 'bg-purple-50 text-purple-600' },
      { icon: Award, title: '个人中心', desc: '修改个人信息', path: '/doctor/profile', color: 'bg-orange-50 text-orange-600' },
    ];

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">快捷操作</h2>
        <Row gutter={[16, 16]}>
          {actions.map((action, i) => (
            <Col key={i} xs={12} md={6}>
              <div 
                onClick={() => navigate(action.path)}
                className="bg-white p-5 rounded-xl border border-border cursor-pointer hover:shadow-md hover:border-primary transition-all h-full"
              >
                <div className={`w-10 h-10 mb-3 rounded-lg ${action.color} flex items-center justify-center`}>
                  <action.icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-slate-400 text-xs">{action.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  const UpcomingAppointments = () => {
    if (!isLoggedIn || userType !== 'patient') return null;

    return (
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            近期预约
          </h2>
          <Button type="link" onClick={() => navigate('/patient/appointments')}>
            查看全部 <ChevronRight size={16} />
          </Button>
        </div>
        
        <div className="p-6">
          {loading ? (
            <Skeleton active />
          ) : appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(0, 3).map((apt) => (
                <div key={apt.appointmentId} className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Badge status="processing" />
                      <span className="font-semibold text-slate-900">{apt.doctorName} 医生</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{apt.departmentName}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {dayjs(apt.appointmentTime).format('YYYY-MM-DD')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {dayjs(apt.appointmentTime).format('HH:mm')}
                      </span>
                    </div>
                  </div>
                  <Button onClick={() => navigate(`/patient/appointments`)}>详情</Button>
                </div>
              ))}
            </div>
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description="暂无待就诊预约" 
            >
              <Button type="dashed" onClick={() => navigate('/patient/book')}>去挂号</Button>
            </Empty>
          )}
        </div>
      </div>
    );
  };

  // 未登录用户的特色服务展示
  const FeaturesSection = () => {
    if (isLoggedIn) return null;
    
    const features = [
      { icon: Shield, title: '安全可靠', desc: '严格保护患者隐私，数据加密存储', color: 'blue' },
      { icon: Award, title: '专业团队', desc: '汇聚业内顶尖专家，经验丰富', color: 'green' },
      { icon: HeartPulse, title: '贴心服务', desc: '全程健康管理，用心呵护', color: 'red' },
      { icon: Clock, title: '便捷预约', desc: '在线快速挂号，减少等待时间', color: 'orange' },
    ];

    const colorMap = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      red: 'bg-red-50 text-red-600',
      orange: 'bg-orange-50 text-orange-600',
    };

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">为什么选择我们</h2>
        <Row gutter={[16, 16]}>
          {features.map((f, i) => (
            <Col key={i} xs={12} md={6}>
              <div className="bg-white p-5 rounded-xl border border-border text-center hover:shadow-md transition-shadow h-full">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${colorMap[f.color]} flex items-center justify-center`}>
                  <f.icon size={24} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{f.title}</h3>
                <p className="text-slate-500 text-sm">{f.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // 未登录用户的快捷入口
  const QuickLinks = () => {
    if (isLoggedIn) return null;

    const links = [
      { icon: Building2, title: '科室介绍', desc: '了解各科室专业特色', path: '/departments', color: 'bg-purple-50 text-purple-600' },
      { icon: User, title: '专家团队', desc: '查看医生资质信息', path: '/doctors', color: 'bg-cyan-50 text-cyan-600' },
      { icon: Stethoscope, title: '预约挂号', desc: '登录后即可预约', path: '/login', color: 'bg-primary-50 text-primary' },
      { icon: Phone, title: '联系我们', desc: '获取医院联系方式', path: '/contact', color: 'bg-amber-50 text-amber-600' },
    ];

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">快捷服务</h2>
        <Row gutter={[16, 16]}>
          {links.map((link, i) => (
            <Col key={i} xs={12} md={6}>
              <div 
                onClick={() => navigate(link.path)}
                className="bg-white p-5 rounded-xl border border-border cursor-pointer hover:shadow-md hover:border-primary transition-all h-full"
              >
                <div className={`w-10 h-10 mb-3 rounded-lg ${link.color} flex items-center justify-center`}>
                  <link.icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{link.title}</h3>
                <p className="text-slate-400 text-xs">{link.desc}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // 医院公告
  const Announcements = () => {
    if (isLoggedIn) return null;

    const notices = [
      { date: '12-12', title: '关于2024年元旦假期门诊安排的通知' },
      { date: '12-10', title: '我院成功开展首例微创心脏手术' },
      { date: '12-08', title: '冬季流感高发期，请注意防护' },
      { date: '12-05', title: '新增夜间急诊服务，24小时守护健康' },
    ];

    return (
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">医院公告</h2>
          <Button type="link" size="small">更多 <ChevronRight size={14} /></Button>
        </div>
        <div className="divide-y divide-border">
          {notices.map((n, i) => (
            <div key={i} className="px-5 py-3 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors">
              <span className="text-xs text-slate-400 shrink-0">{n.date}</span>
              <span className="text-slate-700 truncate">{n.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto">
      <WelcomeCard />
      <DoctorStatCards />
      <StatCards />
      <DoctorQuickActions />
      <DoctorTodayAppointments />
      <FeaturesSection />
      <QuickLinks />
      <UpcomingAppointments />
      <Announcements />
    </div>
  );
};

export default Dashboard;
