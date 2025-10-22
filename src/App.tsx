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
    <div className="min-h-screen bg-gray-50">
      <RouteProtection>
        <Layout>
          <Routes>
            <Route path="/academic" element={<AcademicDataManagement onBack={() => {}} />} />
            <Route path="/staff" element={<StaffManagement onBack={() => {}} />} />
            <Route path="/student" element={<StudentManagement onBack={() => {}} />} />
            <Route path="/class" element={<ClassManagement onBack={() => {}} />} />
            <Route path="/schools" element={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    School Management
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Coming soon - Manage multiple schools
                  </p>
                </div>
              </div>
            } />
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
