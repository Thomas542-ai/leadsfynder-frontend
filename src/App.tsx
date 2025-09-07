import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import LeadManager from './pages/LeadManager'
import LeadSources from './pages/LeadSources'
import EmailCampaigns from './pages/EmailCampaigns'
import WhatsAppOutreach from './pages/WhatsAppOutreach'
import AdminPanel from './pages/AdminPanel'
import Pricing from './pages/Pricing'

function App() {
  const { isAuthenticated, isLoading, logout, user } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Force re-render when authentication state changes
  const authKey = `${isAuthenticated}-${user?.id || 'no-user'}`

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return (
    <div key={authKey} className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-indigo-600">LeadsFynder</h1>
              </div>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/dashboard' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/leads" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/leads' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  Lead Manager
                </Link>
                <Link 
                  to="/lead-sources" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/lead-sources' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  Lead Sources
                </Link>
                <Link 
                  to="/campaigns" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/campaigns' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  Email Campaigns
                </Link>
                <Link 
                  to="/whatsapp" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/whatsapp' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  WhatsApp
                </Link>
                <Link 
                  to="/pricing" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/pricing' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  Pricing
                </Link>
                {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === '/admin' 
                        ? 'text-indigo-600 bg-indigo-50' 
                        : 'text-gray-500 hover:text-indigo-600'
                    }`}
                  >
                    Admin Panel
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <span className="hidden md:block text-sm text-gray-700">
                  Welcome, {user?.firstName || user?.email}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>
              {/* Mobile menu button */}
              <div className="md:hidden ml-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <Link 
                to="/dashboard" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/dashboard' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/leads" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/leads' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Lead Manager
              </Link>
              <Link 
                to="/lead-sources" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/lead-sources' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Lead Sources
              </Link>
              <Link 
                to="/campaigns" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/campaigns' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Email Campaigns
              </Link>
              <Link 
                to="/whatsapp" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/whatsapp' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                WhatsApp
              </Link>
              <Link 
                to="/pricing" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/pricing' 
                    ? 'text-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-indigo-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? (
                <Link 
                  to="/admin" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/admin' 
                      ? 'text-indigo-600 bg-indigo-50' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              ) : null}
              <div className="px-3 py-2 text-sm text-gray-700 md:hidden">
                Welcome, {user?.firstName || user?.email}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<LeadManager />} />
        <Route path="/lead-sources" element={<LeadSources />} />
        <Route path="/campaigns" element={<EmailCampaigns />} />
        <Route path="/whatsapp" element={<WhatsAppOutreach />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
