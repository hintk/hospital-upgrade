import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, Skeleton, Empty, Statistic, Row, Col } from 'antd';
import { 
  Plus, 
  Calendar, 
  Clock, 
  Activity, 
  ChevronRight,
  User 
} from 'lucide-react';
import { appointmentApi } from '../../api/appointment';
import { useUserStore } from '../../store/userStore';
import dayjs from 'dayjs';

const Home = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, userType } = useUserStore();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && userType === 'patient') {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

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

  const WelcomeCard = () => (
    <div className="bg-white p-8 rounded-xl border border-border shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {isLoggedIn ? `早安，${user?.name}` : '欢迎来到飞马星球医院'}
        </h1>
        <p className="text-slate-500">
          {isLoggedIn 
            ? '今天身体感觉如何？我们随时为您提供专业的医疗服务。' 
            : '专业的医疗团队，贴心的就诊体验。'}
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

  const StatCards = () => (
    <Row gutter={[24, 24]} className="mb-8">
      <Col xs={24} md={8}>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">今日就诊人数</p>
              <p className="text-2xl font-bold text-slate-900">1,284</p>
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
              <p className="text-slate-500 text-sm">在线专家</p>
              <p className="text-2xl font-bold text-slate-900">156</p>
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
              <p className="text-2xl font-bold text-slate-900">432</p>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );

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

  return (
    <div className="max-w-5xl mx-auto">
      <WelcomeCard />
      <StatCards />
      <UpcomingAppointments />
    </div>
  );
};

export default Home;
