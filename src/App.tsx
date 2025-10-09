import { useState } from 'react'
import { useAuthStore } from './stores/auth-store'
import LoginPage from './pages/auth/LoginPage'
import Layout from './components/layout/Layout'
import StaffManagement from './pages/staff/StaffManagement'
import StudentManagement from './pages/student/StudentManagement'
import AcademicDataManagement from './pages/academic/AcademicDataManagement'
import ClassListPage from './pages/academic/classes/ClassListPage' // ✅ New Page Import

function App() {
  const { isAuthenticated } = useAuthStore()
  const [currentModule, setCurrentModule] = useState<
    'staff' | 'student' | 'academic' | 'schools' | 'class'
  >('staff')

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setCurrentModule('staff')} />
  }

  const handleModuleChange = (module: string) => {
    setCurrentModule(
      module as 'staff' | 'student' | 'academic' | 'schools' | 'class'
    )
  }

  const renderModuleContent = () => {
    switch (currentModule) {
      case 'staff':
        return <StaffManagement onBack={() => {}} />
      case 'student':
        return <StudentManagement onBack={() => {}} />
      case 'academic':
        return <AcademicDataManagement onBack={() => {}} />
      case 'class':
        //  Newly added route
        return <ClassListPage />
      case 'schools':
        return (
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
        )
      default:
        return <StaffManagement onBack={() => {}} />
    }
  }

  return (
    <Layout activeModule={currentModule} onModuleChange={handleModuleChange}>
      {renderModuleContent()}
    </Layout>
  )
}

export default App
