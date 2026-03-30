import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  Home,
  BookOpen,
  LayoutDashboard,
  FileText,
  Users,
  Music,
  Sparkles
} from 'lucide-react';

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'Courses', icon: BookOpen, id: 'courses' },
    { name: 'Music Notes', icon: FileText, id: 'notes' },
    { name: 'Students', icon: Users, id: 'students' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-amber-50/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-amber-400/10 to-amber-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-50 md:hidden">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md transition-opacity animate-fadeIn" onClick={() => setSidebarOpen(false)}></div>
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl animate-slideInLeft">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white transition-all hover:bg-white/20 hover:rotate-90 duration-300"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              {/* Logo with animation */}
              <div className="flex-shrink-0 flex items-center px-4 mb-6 animate-fadeInDown">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl blur-md opacity-50 animate-pulse"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                    <Music className="h-6 w-6 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                  </div>
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-600 bg-clip-text text-transparent animate-shimmer" style={{ backgroundSize: '200% auto' }}>Raadhyam</span>
                  <p className="text-xs text-gray-500 font-medium flex items-center">
                    <Sparkles size={10} className="mr-1 text-amber-500" />
                    Admin Portal
                  </p>
                </div>
              </div>
              
              {/* Back to Home Button */}
              <div className="px-4 mb-4 animate-fadeInDown" style={{ animationDelay: '0.1s' }}>
                <button
                  onClick={handleGoHome}
                  className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-amber-600 bg-gradient-to-r from-gray-50 to-amber-50/30 hover:from-amber-50 hover:to-amber-100 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
                >
                  <Home size={18} className="mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                  Back to Home
                </button>
              </div>

              {/* Navigation */}
              <nav className="mt-2 px-3 space-y-2">
                {navigation.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/40 scale-105'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-amber-50'
                    } group flex items-center px-4 py-3 text-base font-medium rounded-xl w-full text-left transition-all duration-300 animate-fadeInDown`}
                    style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                  >
                    <item.icon
                      className={`${
                        activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-amber-600'
                      } mr-3 flex-shrink-0 h-5 w-5 transition-all duration-300 group-hover:scale-110 ${activeTab === item.id ? 'animate-pulse' : ''}`}
                    />
                    {item.name}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* User Profile */}
            <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-amber-50/30 animate-fadeInUp">
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full blur-sm opacity-50 animate-pulse"></div>
                    <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold text-gray-900">Admin User</p>
                    <p className="text-xs font-medium text-gray-500">admin@raadhyam.com</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-amber-600 ml-2 p-2 hover:bg-amber-50 rounded-lg transition-all duration-300 hover:rotate-12 hover:scale-110"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-40">
        <div className="flex-1 flex flex-col min-h-0 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-gray-200/50">
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            {/* Logo with animation */}
            <div className="flex items-center flex-shrink-0 px-6 mb-8 animate-fadeInDown">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl blur-md opacity-50 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Music className="h-7 w-7 text-white animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-600 bg-clip-text text-transparent animate-shimmer" style={{ backgroundSize: '200% auto' }}>Raadhyam</span>
                <p className="text-xs text-gray-500 font-medium flex items-center">
                  <Sparkles size={10} className="mr-1 text-amber-500 animate-pulse" />
                  Admin Portal
                </p>
              </div>
            </div>

            {/* Back to Home Button */}
            <div className="px-4 mb-6 animate-fadeInDown" style={{ animationDelay: '0.1s' }}>
              <button
                onClick={handleGoHome}
                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-amber-600 bg-gradient-to-r from-gray-50 to-amber-50/30 hover:from-amber-50 hover:to-amber-100 rounded-xl transition-all duration-300 group shadow-sm hover:shadow-md"
              >
                <Home size={18} className="mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                Back to Home
              </button>
            </div>

            {/* Navigation */}
            <nav className="mt-2 flex-1 px-4 space-y-2">
              {navigation.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/40 scale-105'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-amber-50'
                  } group flex items-center px-4 py-3 text-sm font-medium rounded-xl w-full text-left transition-all duration-300 animate-fadeInDown`}
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <item.icon
                    className={`${
                      activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-amber-600'
                    } mr-3 flex-shrink-0 h-5 w-5 transition-all duration-300 group-hover:scale-110 ${activeTab === item.id ? 'animate-pulse' : ''}`}
                  />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
          
          {/* User Profile */}
          <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-gradient-to-r from-gray-50 to-amber-50/30 animate-fadeInUp">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full blur-sm opacity-50 animate-pulse"></div>
                <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">Admin User</p>
                <p className="text-xs font-medium text-gray-500">admin@raadhyam.com</p>
              </div>
              <button 
                onClick={handleLogout}
                className="ml-2 text-gray-400 hover:text-amber-600 p-2 hover:bg-amber-50 rounded-lg transition-all duration-300 hover:rotate-12 hover:scale-110"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-72 flex flex-col flex-1 relative z-10">
        {/* Mobile Header */}
        <div className={`sticky top-0 z-30 md:hidden transition-all duration-300 ${
          scrolled 
            ? 'bg-white/90 backdrop-blur-xl shadow-lg' 
            : 'bg-white/80 backdrop-blur-lg'
        } border-b border-gray-200/50`}>
          <div className="flex items-center justify-between px-4 py-3">
            <button
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-100 hover:to-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300 hover:scale-110"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center animate-fadeIn">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg blur-sm opacity-50 animate-pulse"></div>
                <div className="relative w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center">
                  <Music className="h-5 w-5 text-white" />
                </div>
              </div>
              <span className="ml-2 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">Raadhyam</span>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <main className="flex-1">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-fadeInDown { animation: fadeInDown 0.6s ease-out both; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out both; }
        .animate-slideInLeft { animation: slideInLeft 0.3s ease-out; }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
      `}</style>
    </div>
  );
};

export default DashboardLayout;