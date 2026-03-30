import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Users, 
  FileText, 
  TrendingUp,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Clock,
  Star,
  Zap,
  Award,
  Activity
} from 'lucide-react';

const StatCard = ({ title, value, icon, color, bgColor, change, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    // Animate counter
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div 
      className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 ${bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      <div className={`absolute top-0 right-0 w-40 h-40 ${bgColor} opacity-5 rounded-full blur-3xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-700`}></div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">{title}</p>
            <p className="text-4xl font-bold text-gray-900 tabular-nums">{count}</p>
          </div>
          <div className={`relative p-4 rounded-2xl ${bgColor} ${color} shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
            {React.cloneElement(icon, { size: 28, className: 'relative z-10' })}
            <div className={`absolute inset-0 ${bgColor} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}></div>
          </div>
        </div>
        
        {change && (
          <div className="flex items-center space-x-2">
            <div className={`flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${
              change > 0 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                : 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
            } shadow-lg`}>
              {change > 0 ? <ArrowUp size={16} className="mr-1 animate-bounce" /> : <ArrowDown size={16} className="mr-1 animate-bounce" />}
              {Math.abs(change)}%
            </div>
            <span className="text-sm text-gray-500 font-medium">vs last month</span>
          </div>
        )}
      </div>

      {/* Corner decoration */}
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-gray-100/50 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

const DashboardPage = ({ dashboardStats, loading }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-amber-200 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-t-4 border-amber-500 rounded-full animate-spin absolute top-0 left-0"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Zap className="w-6 h-6 text-amber-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Animated Header */}
      <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-600/20 to-amber-500/20 rounded-3xl blur-3xl animate-pulse"></div>
        
        <div className="relative bg-gradient-to-r from-amber-500 via-amber-600 to-amber-600 rounded-2xl p-8 shadow-2xl overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <Activity className="w-8 h-8 text-white animate-pulse" />
                <h2 className="text-4xl font-bold text-white">Dashboard Overview</h2>
              </div>
              <p className="text-amber-100 flex items-center text-lg">
                <Clock size={18} className="mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                Welcome back! Here's your performance today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30 shadow-xl hover:scale-105 transition-transform duration-300">
                <p className="text-amber-100 text-sm font-semibold mb-1 flex items-center">
                  <Calendar size={14} className="mr-2" />
                  Today
                </p>
                <p className="text-white text-xl font-bold">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with staggered animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Courses"
          value={dashboardStats.totalCourses || 0}
          icon={<BookOpen />}
          color="text-blue-600"
          bgColor="bg-blue-500"
          change={12}
          index={0}
        />
        <StatCard
          title="Published Courses"
          value={dashboardStats.publishedCourses || 0}
          icon={<BookOpen />}
          color="text-green-600"
          bgColor="bg-green-500"
          change={8}
          index={1}
        />
        <StatCard
          title="Total Enrollments"
          value={dashboardStats.totalEnrollments || 0}
          icon={<Users />}
          color="text-orange-600"
          bgColor="bg-orange-500"
          change={15}
          index={2}
        />
        <StatCard
          title="Music Notes"
          value={dashboardStats.totalNotes || 0}
          icon={<FileText />}
          color="text-purple-600"
          bgColor="bg-purple-500"
          change={5}
          index={3}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enrollments */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`} style={{ transitionDelay: '400ms' }}>
          <div className="relative px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 via-white to-blue-50/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent"></div>
            <h3 className="relative text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-3 shadow-lg">
                <Users size={22} className="text-white" />
              </div>
              Recent Enrollments
              <Award className="ml-auto text-blue-500 animate-pulse" size={20} />
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {dashboardStats.recentEnrollments?.slice(0, 5).map((enrollment, index) => (
                <div 
                  key={enrollment._id} 
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300 group cursor-pointer border border-transparent hover:border-blue-200 hover:shadow-md hover:-translate-x-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">{(enrollment.user?.name || 'U')[0]}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{enrollment.user?.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <BookOpen size={14} className="mr-1.5 text-blue-500" />
                        {enrollment.course?.title || 'Unknown Course'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-xs font-semibold text-gray-500 bg-gray-100 group-hover:bg-blue-100 group-hover:text-blue-600 px-3 py-2 rounded-full transition-colors">
                      <Calendar size={14} className="mr-1.5" />
                      {new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Courses */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`} style={{ transitionDelay: '500ms' }}>
          <div className="relative px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-green-50 via-white to-green-50/50 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent"></div>
            <h3 className="relative text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2.5 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mr-3 shadow-lg">
                <TrendingUp size={22} className="text-white" />
              </div>
              Popular Courses
              <Zap className="ml-auto text-green-500 animate-pulse" size={20} />
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {dashboardStats.popularCourses?.slice(0, 5).map((course, index) => (
                <div 
                  key={course._id} 
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent transition-all duration-300 group cursor-pointer border border-transparent hover:border-green-200 hover:shadow-md hover:translate-x-1"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <span className="text-white font-bold text-lg">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate group-hover:text-green-600 transition-colors">{course.title}</p>
                      <div className="flex items-center space-x-2 text-xs mt-2">
                        <span className="flex items-center bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
                          <Users size={12} className="mr-1" />
                          {course.stats?.enrolledStudents || 0}
                        </span>
                        <span className="flex items-center bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-semibold">
                          <Star size={12} className="mr-1 fill-current" />
                          {course.stats?.rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-24 bg-gray-200 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 h-2.5 rounded-full transition-all duration-1000 animate-shimmer" 
                        style={{ 
                          width: `${Math.min(100, (course.stats?.enrolledStudents || 0) * 10)}%`,
                          backgroundSize: '200% 100%'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;