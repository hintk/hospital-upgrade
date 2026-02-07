import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { 
  LayoutDashboard, 
  CalendarDays, 
  UserCircle, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Menu,
  X,
  Building2,
  Users,
  Phone,
  Info
} from 'lucide-react';
import { Button, Avatar, Dropdown } from 'antd';

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoggedIn, userType } = useUserStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 菜单配置
  const menus = {
    patient: [
      { path: '/', label: '医院首页', icon: LayoutDashboard },
      { path: '/patient/book', label: '预约挂号', icon: Stethoscope },
      { path: '/patient/appointments', label: '我的预约', icon: CalendarDays },
      { path: '/patient/profile', label: '个人中心', icon: UserCircle },
    ],
    doctor: [
      { path: '/', label: '工作台', icon: LayoutDashboard },
      { path: '/doctor/appointments', label: '今日门诊', icon: CalendarDays },
      { path: '/doctor/schedule', label: '我的排班', icon: Stethoscope },
      { path: '/doctor/patients', label: '患者管理', icon: Users },
      { path: '/doctor/profile', label: '个人中心', icon: UserCircle },
    ],
    guest: [
      { path: '/', label: '医院首页', icon: LayoutDashboard },
      { path: '/departments', label: '科室介绍', icon: Building2 },
      { path: '/doctors', label: '专家团队', icon: Users },
      { path: '/about', label: '关于我们', icon: Info },
      { path: '/contact', label: '联系我们', icon: Phone },
      { path: '/login', label: '登录/注册', icon: UserCircle },
    ]
  };

  const currentMenu = isLoggedIn ? (menus[userType] || menus.guest) : menus.guest;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside 
        className={`hidden md:flex flex-col border-r border-border bg-background-subtle transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-center border-b border-border bg-white">
          <div className="flex items-center gap-2 font-bold text-primary text-xl overflow-hidden whitespace-nowrap px-4">
            <div className="p-1.5 bg-primary rounded-lg text-white shrink-0">
              <Stethoscope size={20} />
            </div>
            {!collapsed && <span className="transition-opacity duration-300">飞马医院</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {currentMenu.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative ${
                  isActive 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900'} />
                {!collapsed && <span className="font-medium">{item.label}</span>}
                
                {/* Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Collapse Button */}
        <div className="p-4 border-t border-border bg-white">
          {isLoggedIn && !collapsed && (
             <div className="flex items-center gap-3 mb-4 px-2">
               <Avatar className="bg-primary-100 text-primary" style={{ backgroundColor: '#e6f4ff', color: '#1677ff' }}>
                 {user?.name?.[0]}
               </Avatar>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                 <p className="text-xs text-slate-500 truncate capitalize">{userType === 'patient' ? '患者' : '医生'}</p>
               </div>
               <Button type="text" icon={<LogOut size={16} />} onClick={handleLogout} className="text-slate-400 hover:text-red-500" />
             </div>
          )}
          
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-200/50 text-slate-500 transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="md:hidden h-16 flex items-center justify-between px-4 border-b border-border bg-white z-20">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Stethoscope size={20} />
            <span>飞马医院</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600">
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute inset-0 z-10 bg-white/95 backdrop-blur-sm pt-20 px-6 space-y-4 md:hidden">
            {currentMenu.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 text-slate-900 font-medium active:bg-slate-100"
              >
                <item.icon size={24} className="text-primary" />
                {item.label}
              </Link>
            ))}
            {isLoggedIn && (
               <Button block danger size="large" onClick={handleLogout} icon={<LogOut size={18} />}>
                 退出登录
               </Button>
            )}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background p-4 md:p-8">
          <div className="max-w-6xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
