import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from './stores/auth-store'
import LoginPage from './pages/auth/LoginPage'
import Layout from './components/layout/Layout'
import RouteProtection from './components/auth/RouteProtection'
import StaffManagement from './pages/staff/StaffManagement'
import StudentManagement from './pages/student/StudentManagement'
import AcademicDataManagement from './pages/academic/AcademicDataManagement'
import ClassManagement from './pages/class/ClassManagement'
import SubjectManagement from './pages/subject/SubjectManagement'
import ResourceTypeManagement from './pages/resource-type/ResourceTypeManagement'
import TimetableTypeManagement from './pages/timetable-type/TimetableTypeManagement'
import TimetableManagement from './pages/timetable/TimetableManagement'
import PaymentPage from './pages/payment'
import PaymentSettings from './pages/payment/PaymentSettings'
import PaymentTypeManagement from './pages/payment-type'
import PaymentVerification from './pages/payment-verification'
import SystemConfigManagement from './pages/system-config'
import ResultManagement from './pages/result'
import ReportCardsPage from './pages/report-cards/ReportCardsPage'
import PerformancePage from './pages/performance/PerformancePage'
import RemarkTemplateManagement from './pages/remark-templates/RemarkTemplateManagement'
import { Toaster } from 'sonner'
import { ThemeBootstrap } from './components/ThemeBootstrap.tsx'
import { FileBaseUrl } from './lib/axios'

const isSchoolAdminRole = (role?: string) => role?.trim().toLowerCase() === 'admin'

function AppContent() {
  const { isAuthenticated, user, schoolInfo, isAdmin, error } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!schoolInfo?.name && !schoolInfo?.logo) return

    if (schoolInfo.name) document.title = schoolInfo.name

    let icon = document.querySelector<HTMLLinkElement>('link[rel~="icon"]')
    if (!icon) {
      icon = document.createElement('link')
      icon.rel = 'icon'
      document.head.appendChild(icon)
    }

    if (!schoolInfo.logo) {
      icon.href = '/logo.png'
    } else if (/^https?:\/\//i.test(schoolInfo.logo)) {
      icon.href = schoolInfo.logo
    } else {
      const normalizedPath = schoolInfo.logo.startsWith('/') ? schoolInfo.logo : `/${schoolInfo.logo}`
      icon.href = `${FileBaseUrl}${normalizedPath}`
    }
  }, [schoolInfo?.name, schoolInfo?.logo])

  useEffect(() => {
    if (isAuthenticated && user && !isAdmin()) {
      useAuthStore.getState().logout();
    }
  }, [isAuthenticated, user, isAdmin]);

  if (!isAuthenticated || (error && error.includes('Access denied'))) {
    return <LoginPage onLoginSuccess={() => navigate('/academic')} />
  }

  if (isAuthenticated && user && !isSchoolAdminRole(user.role)) {
    useAuthStore.getState().logout();
    return <LoginPage onLoginSuccess={() => navigate('/academic')} />
  }


  return (
    <div className="h-screen bg-background-secondary overflow-hidden">
      <RouteProtection>
        <Layout>
          <Routes>
            <Route path="/academic" element={<AcademicDataManagement onBack={() => {}} />} />
            <Route path="/staff" element={<StaffManagement onBack={() => {}} />} />
            <Route path="/student" element={<StudentManagement onBack={() => {}} />} />
            <Route path="/class" element={<ClassManagement onBack={() => {}} />} />
            <Route path="/subject" element={<SubjectManagement onBack={() => {}} />} />
            <Route path="/result" element={<ResultManagement />} />
            <Route path="/report-cards" element={<ReportCardsPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/remark-templates" element={<RemarkTemplateManagement />} />
            <Route path="/resource-type" element={<ResourceTypeManagement />} />
            <Route path="/timetable-type" element={<TimetableTypeManagement />} />
            <Route path="/timetable" element={<TimetableManagement />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-settings" element={<PaymentSettings />} />
            <Route path="/payment-type" element={<PaymentTypeManagement />} />
            <Route path="/payment-verification" element={<PaymentVerification />} />
            <Route path="/system-config" element={<SystemConfigManagement />} />
            <Route path="/" element={<Navigate to="/academic" replace />} />
            <Route path="*" element={<Navigate to="/academic" replace />} />
          </Routes>
        </Layout>
      </RouteProtection>
    </div>
  )
}

function App() {
  return (
    <Router>
      <ThemeBootstrap />
      <AppContent />
      <Toaster position="top-right" richColors closeButton duration={3500} />
    </Router>
  )
}

export default App
