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

function AppContent() {
  const { isAuthenticated, user, isAdmin, error } = useAuthStore()
  const navigate = useNavigate()

  // Check if user is Admin on component mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user && !isAdmin()) {
      // Force logout if user is not Admin
      useAuthStore.getState().logout();
    }
  }, [isAuthenticated, user, isAdmin]);

  // Show login page if not authenticated or if there's an access error
  if (!isAuthenticated || (error && error.includes('Access denied'))) {
    return <LoginPage onLoginSuccess={() => navigate('/academic')} />
  }

  // Additional safety check - if somehow user is authenticated but not Admin
  if (isAuthenticated && user && user.role !== 'Admin') {
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
      <AppContent />
    </Router>
  )
}

export default App
