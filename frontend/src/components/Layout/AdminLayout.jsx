import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { 
  Users, 
  Calendar, 
  Upload, 
  FileBarChart, 
  LogOut,
  LayoutDashboard,
  Stethoscope
} from 'lucide-react';
import { Button, Avatar } from 'antd';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUserStore();

  const menuItems = [
    { path: '/admin/doctors', label: '医生管理', icon: Users },
    { path: '/admin/schedules', label: '排班管理', icon: Calendar },
    { path: '/admin/import', label: '数据导入', icon: Upload },
    { path: '/admin/reports', label: '报表统计', icon: FileBarChart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin Header */}
      <header className="bg-slate-900 text-white shadow-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-blue-400" />
            <span className="text-lg font-bold tracking-wide">飞马医院管理后台</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">管理员: {user?.name || 'Admin'}</span>
            <Button 
              type="text" 
              className="text-white hover:text-red-400" 
              icon={<LogOut size={16} />} 
              onClick={handleLogout}
            >
              退出
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-border">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Menu</span>
            </div>
            <nav className="p-2 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 font-medium' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-white rounded-xl shadow-sm border border-border p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
