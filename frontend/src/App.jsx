import { Routes, Route, Navigate } from 'react-router-dom'
import { useUserStore } from './store/userStore'

// 布局组件
import MainLayout from './components/Layout/MainLayout'
import AdminLayout from './components/Layout/AdminLayout'

// 公共页面
import Home from './pages/Home/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Departments from './pages/Public/Departments'
import Doctors from './pages/Public/Doctors'
import About from './pages/Public/About'
import Contact from './pages/Public/Contact'

// 患者页面
import PatientProfile from './pages/Patient/Profile'
import PatientAppointments from './pages/Patient/Appointments'
import PatientBook from './pages/Patient/Book'

// 医生页面
import DoctorAppointments from './pages/Doctor/Appointments'
import DoctorSchedule from './pages/Doctor/Schedule'
import DoctorPatients from './pages/Doctor/Patients'
import DoctorProfile from './pages/Doctor/Profile'

// 管理员页面
import AdminDoctors from './pages/Admin/Doctors'
import AdminSchedules from './pages/Admin/Schedules'
import AdminImport from './pages/Admin/Import'
import AdminReports from './pages/Admin/Reports'

// 路由守卫组件
const ProtectedRoute = ({ children, allowedTypes }) => {
  const { isLoggedIn, userType } = useUserStore()
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedTypes && !allowedTypes.includes(userType)) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      {/* 公共路由 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* 主布局路由 */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="departments" element={<Departments />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        
        {/* 患者路由 */}
        <Route path="patient">
          <Route 
            path="profile" 
            element={
              <ProtectedRoute allowedTypes={['patient']}>
                <PatientProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="appointments" 
            element={
              <ProtectedRoute allowedTypes={['patient']}>
                <PatientAppointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="book" 
            element={
              <ProtectedRoute allowedTypes={['patient']}>
                <PatientBook />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* 医生路由 */}
        <Route path="doctor">
          <Route 
            path="appointments" 
            element={
              <ProtectedRoute allowedTypes={['doctor']}>
                <DoctorAppointments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="schedule" 
            element={
              <ProtectedRoute allowedTypes={['doctor']}>
                <DoctorSchedule />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="patients" 
            element={
              <ProtectedRoute allowedTypes={['doctor']}>
                <DoctorPatients />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute allowedTypes={['doctor']}>
                <DoctorProfile />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Route>
      
      {/* 管理员路由 */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedTypes={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/doctors" replace />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="schedules" element={<AdminSchedules />} />
        <Route path="import" element={<AdminImport />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
      
      {/* 404重定向 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
